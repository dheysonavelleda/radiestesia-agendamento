import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/availability";
import { addMinutes, startOfDay } from "date-fns";

const rescheduleSchema = z.object({
  appointmentId: z.string(),
  newDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  newStartTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const MAX_RESCHEDULES = 2;

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = rescheduleSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { appointmentId, newDate, newStartTime } = result.data;

    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { service: true },
    });

    if (!appointment) {
      return NextResponse.json(
        { error: "Agendamento não encontrado" },
        { status: 404 }
      );
    }

    if (session.user.role !== "ADMIN" && appointment.userId !== session.user.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
    }

    if (appointment.status === "CANCELLED" || appointment.status === "COMPLETED") {
      return NextResponse.json(
        { error: "Não é possível remarcar este agendamento" },
        { status: 400 }
      );
    }

    if (appointment.rescheduleCount >= MAX_RESCHEDULES) {
      return NextResponse.json(
        { error: `Limite de ${MAX_RESCHEDULES} remarcações atingido` },
        { status: 400 }
      );
    }

    // Validate new slot
    const dateObj = new Date(newDate + "T00:00:00");
    const slots = await getAvailableSlots(dateObj);
    const selectedSlot = slots.find(
      (s) => s.startTime === newStartTime && s.available
    );

    if (!selectedSlot) {
      return NextResponse.json(
        { error: "Novo horário não disponível" },
        { status: 409 }
      );
    }

    // Build new start/end DateTime
    const [startH, startM] = newStartTime.split(":").map(Number);
    const newStartDateTime = new Date(dateObj);
    newStartDateTime.setHours(startH, startM, 0, 0);
    const newEndDateTime = addMinutes(newStartDateTime, appointment.service.duration);

    const updated = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        date: startOfDay(dateObj),
        startTime: newStartDateTime,
        endTime: newEndDateTime,
        rescheduleCount: { increment: 1 },
      },
      include: { service: true, payment: true },
    });

    // Update second payment deadline if PIX
    if (updated.payment && updated.paymentMethod === "PIX") {
      await prisma.payment.update({
        where: { id: updated.payment.id },
        data: {
          secondPaymentDue: new Date(newStartDateTime.getTime() - 60 * 60 * 1000),
        },
      });
    }

    return NextResponse.json({
      message: "Agendamento remarcado com sucesso",
      appointment: updated,
      remainingReschedules: MAX_RESCHEDULES - updated.rescheduleCount,
    });
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    return NextResponse.json(
      { error: "Erro ao remarcar agendamento" },
      { status: 500 }
    );
  }
}
