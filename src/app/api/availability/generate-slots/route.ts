import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { eachDayOfInterval, startOfDay, format, getDay } from "date-fns";

const generateSlotsSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  startTime: z.string().regex(/^\d{2}:\d{2}$/).default("09:00"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/).default("17:00"),
  weekdays: z.array(z.number().min(0).max(6)).default([1, 2, 3, 4, 5]), // Mon-Fri by default
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const result = generateSlotsSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const { startDate, endDate, startTime, endTime, weekdays } = result.data;

    const start = new Date(startDate + "T00:00:00");
    const end = new Date(endDate + "T00:00:00");

    if (start > end) {
      return NextResponse.json(
        { error: "Data de início deve ser anterior à data de fim" },
        { status: 400 }
      );
    }

    const days = eachDayOfInterval({ start, end });
    const filteredDays = days.filter((day) => weekdays.includes(getDay(day)));

    let created = 0;
    let skipped = 0;

    for (const day of filteredDays) {
      const dayStart = startOfDay(day);

      // Check if availability already exists for this date
      const existing = await prisma.availability.findFirst({
        where: {
          date: dayStart,
          startTime,
          endTime,
        },
      });

      if (existing) {
        skipped++;
        continue;
      }

      await prisma.availability.create({
        data: {
          date: dayStart,
          startTime,
          endTime,
          isActive: true,
        },
      });
      created++;
    }

    return NextResponse.json({
      message: `Disponibilidades geradas com sucesso`,
      created,
      skipped,
      total: filteredDays.length,
    });
  } catch (error) {
    console.error("Error generating slots:", error);
    return NextResponse.json(
      { error: "Erro ao gerar disponibilidades" },
      { status: 500 }
    );
  }
}
