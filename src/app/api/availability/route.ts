import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { startOfDay } from "date-fns";

const createAvailabilitySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/),
  endTime: z.string().regex(/^\d{2}:\d{2}$/),
});

const deleteAvailabilitySchema = z.object({
  id: z.string(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const availabilities = await prisma.availability.findMany({
      orderBy: { date: "asc" },
    });

    return NextResponse.json(availabilities);
  } catch (error) {
    console.error("Error fetching availabilities:", error);
    return NextResponse.json(
      { error: "Erro ao buscar disponibilidades" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = createAvailabilitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { date, startTime, endTime } = result.data;

    // Validate startTime < endTime
    if (startTime >= endTime) {
      return NextResponse.json(
        { error: "Horário de início deve ser anterior ao horário de fim" },
        { status: 400 }
      );
    }

    const availability = await prisma.availability.create({
      data: {
        date: startOfDay(new Date(date + "T00:00:00")),
        startTime,
        endTime,
        isActive: true,
      },
    });

    return NextResponse.json(availability, { status: 201 });
  } catch (error) {
    console.error("Error creating availability:", error);
    return NextResponse.json(
      { error: "Erro ao criar disponibilidade" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = deleteAvailabilitySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    await prisma.availability.delete({
      where: { id: result.data.id },
    });

    return NextResponse.json({ message: "Disponibilidade removida" });
  } catch (error) {
    console.error("Error deleting availability:", error);
    return NextResponse.json(
      { error: "Erro ao remover disponibilidade" },
      { status: 500 }
    );
  }
}
