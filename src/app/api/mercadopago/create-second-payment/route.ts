import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createPixPayment } from "@/lib/mercadopago";
import { PIX_SECOND_PAYMENT } from "@/lib/payment-logic";

const schema = z.object({
  appointmentId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id: result.data.appointmentId },
      include: { payment: true, user: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    if (appointment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    if (!appointment.payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    if (appointment.payment.firstPaymentStatus !== "approved") {
      return NextResponse.json(
        { error: "Primeiro pagamento ainda não foi confirmado" },
        { status: 400 }
      );
    }

    if (appointment.payment.secondPaymentStatus === "approved") {
      return NextResponse.json(
        { error: "Segundo pagamento já realizado" },
        { status: 400 }
      );
    }

    const pixResult = await createPixPayment(
      PIX_SECOND_PAYMENT,
      "Restante - Sessão de Radiestesia Terapêutica",
      `appt_${appointment.id}_second`,
      appointment.user.email
    );

    await prisma.payment.update({
      where: { id: appointment.payment.id },
      data: {
        secondPaymentMPId: String(pixResult.id),
        secondPaymentStatus: pixResult.status,
        pixQrCode: pixResult.qrCode,
        pixQrCodeBase64: pixResult.qrCodeBase64,
      },
    });

    return NextResponse.json({
      paymentId: pixResult.id,
      qrCode: pixResult.qrCode,
      qrCodeBase64: pixResult.qrCodeBase64,
      status: pixResult.status,
      amount: PIX_SECOND_PAYMENT,
    });
  } catch (error) {
    console.error("Error creating second payment:", error);
    return NextResponse.json(
      { error: "Erro ao criar segundo pagamento PIX" },
      { status: 500 }
    );
  }
}
