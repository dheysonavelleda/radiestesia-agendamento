import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableSlots } from "@/lib/availability";

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato: YYYY-MM-DD"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = querySchema.safeParse({
      date: searchParams.get("date"),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Informe a data no formato YYYY-MM-DD" },
        { status: 400 }
      );
    }

    const dateObj = new Date(result.data.date + "T00:00:00");
    const slots = await getAvailableSlots(dateObj);

    return NextResponse.json({ slots });
  } catch (error) {
    console.error("Error fetching available slots:", error);
    return NextResponse.json(
      { error: "Erro ao buscar horários disponíveis" },
      { status: 500 }
    );
  }
}
