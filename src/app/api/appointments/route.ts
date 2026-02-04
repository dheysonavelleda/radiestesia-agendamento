import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/availability";
import { calculatePaymentAmounts } from "@/lib/payment-logic";
import { startOfDay, parse, addMinutes } from "date-fns";

const createAppointmentSchema = z.object({
  serviceId: z.string(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  paymentMethod: z.enum(["PIX", "CARD"]),
  notes: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const isAdmin = session.user.role === "ADMIN";

    const where: Record<string, unknown> = {};
    if (!isAdmin) {
      where.userId = session.user.id;
    }
    if (status) {
      where.status = status;
    }

    const appointments = await prisma.appointment.findMany({
      where,
      include: {
        service: true,
        payment: true,
        user: {
          select: { id: true, name: true, email: true, phone: true },
        },
      },
      orderBy: { startTime: "asc" },
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Error fetching appointments:", error);
    return NextResponse.json(
      { error: "Erro ao buscar agendamentos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = createAppointmentSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { serviceId, date, startTime, paymentMethod, notes } = result.data;

    // Validate service exists
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service || !service.active) {
      return NextResponse.json(
        { error: "Serviço não encontrado ou inativo" },
        { status: 404 }
      );
    }

    // Check slot availability
    const dateObj = new Date(date + "T00:00:00");
    const slots = await getAvailableSlots(dateObj);
    const selectedSlot = slots.find(
      (s) => s.startTime === startTime && s.available
    );

    if (!selectedSlot) {
      return NextResponse.json(
        { error: "Horário não disponível" },
        { status: 409 }
      );
    }

    // Build start/end DateTime
    const [startH, startM] = startTime.split(":").map(Number);
    const startDateTime = new Date(dateObj);
    startDateTime.setHours(startH, startM, 0, 0);
    const endDateTime = addMinutes(startDateTime, service.duration);

    // Calculate payment
    const paymentAmounts = calculatePaymentAmounts(paymentMethod);

    // Create appointment + payment in transaction
    const appointment = await prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.create({
        data: {
          userId: session.user.id,
          serviceId,
          date: startOfDay(dateObj),
          startTime: startDateTime,
          endTime: endDateTime,
          status: "PENDING",
          paymentMethod,
          notes,
        },
      });

      await tx.payment.create({
        data: {
          appointmentId: appt.id,
          userId: session.user.id,
          totalAmount: paymentAmounts.total,
          paidAmount: 0,
          remainingAmount: paymentAmounts.total,
          paymentMethod,
          status: "PENDING",
          installments: paymentMethod === "CARD" ? 1 : 1,
          firstPaymentAmount: paymentAmounts.firstPayment,
          secondPaymentAmount: paymentAmounts.secondPayment || null,
          secondPaymentDue: paymentMethod === "PIX"
            ? new Date(startDateTime.getTime() - 60 * 60 * 1000)
            : null,
        },
      });

      return appt;
    });

    const fullAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: { service: true, payment: true },
    });

    return NextResponse.json(fullAppointment, { status: 201 });
  } catch (error) {
    console.error("Error creating appointment:", error);
    return NextResponse.json(
      { error: "Erro ao criar agendamento" },
      { status: 500 }
    );
  }
}
