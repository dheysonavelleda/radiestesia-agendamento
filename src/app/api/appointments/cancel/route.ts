import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { canCancelWithRefund, getRefundAmount } from "@/lib/payment-logic";
import { createRefund } from "@/lib/mercadopago";

const cancelSchema = z.object({
  appointmentId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = cancelSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { appointmentId } = result.data;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { payment: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    // Check ownership (unless admin)
    if (session.user.role !== "ADMIN" && appointment.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    if (appointment.status === "CANCELLED") {
      return NextResponse.json(
        { error: "Agendamento já cancelado" },
        { status: 400 }
      );
    }

    if (appointment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Não é possível cancelar sessão já realizada" },
        { status: 400 }
      );
    }

    const eligibleForRefund = canCancelWithRefund(appointment.startTime);
    let refundAmount = 0;

    if (appointment.payment && appointment.payment.paidAmount > 0) {
      refundAmount = eligibleForRefund ? appointment.payment.paidAmount : 0;

      // Process refund via MercadoPago if eligible
      if (refundAmount > 0) {
        try {
          // Refund first payment if it exists
          if (appointment.payment.firstPaymentMPId) {
            await createRefund(
              parseInt(appointment.payment.firstPaymentMPId),
              appointment.payment.firstPaymentAmount || undefined
            );
          }
          // Refund second payment if it exists
          if (appointment.payment.secondPaymentMPId) {
            await createRefund(
              parseInt(appointment.payment.secondPaymentMPId),
              appointment.payment.secondPaymentAmount || undefined
            );
          }
        } catch (refundError) {
          console.error("Error processing refund via MP:", refundError);
          // Continue with cancellation even if MP refund fails
        }
      }
    }

    // Update appointment and payment
    await prisma.$transaction(async (tx) => {
      await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "CANCELLED",
          cancelledAt: new Date(),
        },
      });

      if (appointment.payment) {
        await tx.payment.update({
          where: { id: appointment.payment.id },
          data: {
            status: refundAmount > 0 ? "REFUNDED" : "FORFEITED",
            refundedAmount: refundAmount,
            refundedAt: refundAmount > 0 ? new Date() : null,
            refundReason: eligibleForRefund
              ? "Cancelamento com mais de 12h de antecedência"
              : "Cancelamento com menos de 12h - sem reembolso",
          },
        });
      }
    });

    return NextResponse.json({
      message: "Agendamento cancelado com sucesso",
      refundAmount,
      refundEligible: eligibleForRefund,
    });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return NextResponse.json(
      { error: "Erro ao cancelar agendamento" },
      { status: 500 }
    );
  }
}
