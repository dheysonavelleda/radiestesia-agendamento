import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { createCardPreference } from "@/lib/mercadopago";
import { CARD_TOTAL, MAX_INSTALLMENTS } from "@/lib/payment-logic";

const schema = z.object({
  appointmentId: z.string(),
  installments: z.number().min(1).max(MAX_INSTALLMENTS).default(1),
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

    const { appointmentId, installments } = result.data;

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

    if (appointment.userId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    if (!appointment.payment) {
      return NextResponse.json(
        { error: "Pagamento não encontrado" },
        { status: 404 }
      );
    }

    if (appointment.payment.status === "PAID") {
      return NextResponse.json(
        { error: "Pagamento já realizado" },
        { status: 400 }
      );
    }

    const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const preference = await createCardPreference(
      CARD_TOTAL,
      "Sessão de Radiestesia Terapêutica",
      `appt_${appointment.id}_card`,
      installments,
      {
        success: `${APP_URL}/pagamento/sucesso?appointmentId=${appointment.id}`,
        failure: `${APP_URL}/pagamento/falha?appointmentId=${appointment.id}`,
        pending: `${APP_URL}/pagamento/pendente?appointmentId=${appointment.id}`,
      }
    );

    await prisma.payment.update({
      where: { id: appointment.payment.id },
      data: {
        mercadoPagoPreferenceId: preference.id,
        installments,
      },
    });

    return NextResponse.json({
      preferenceId: preference.id,
      initPoint: preference.initPoint,
      sandboxInitPoint: preference.sandboxInitPoint,
      amount: CARD_TOTAL,
      installments,
    });
  } catch (error) {
    console.error("Error creating card payment:", error);
    return NextResponse.json(
      { error: "Erro ao criar pagamento por cartão" },
      { status: 500 }
    );
  }
}
