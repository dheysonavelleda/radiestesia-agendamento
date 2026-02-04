import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAvailableDates } from "@/lib/availability";

const querySchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2024).max(2030),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const result = querySchema.safeParse({
      month: searchParams.get("month"),
      year: searchParams.get("year"),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Parâmetros inválidos. Informe month (1-12) e year." },
        { status: 400 }
      );
    }

    const dates = await getAvailableDates(result.data.month, result.data.year);

    return NextResponse.json({ dates });
  } catch (error) {
    console.error("Error fetching available dates:", error);
    return NextResponse.json(
      { error: "Erro ao buscar datas disponíveis" },
      { status: 500 }
    );
  }
}
