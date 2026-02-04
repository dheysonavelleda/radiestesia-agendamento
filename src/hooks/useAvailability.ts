"use client";

import { useQuery } from "@tanstack/react-query";

interface AvailableDate {
  date: string; // YYYY-MM-DD
  slotsCount: number;
}

interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  available: boolean;
}

export function useAvailableDates(month: number, year: number) {
  return useQuery<AvailableDate[]>({
    queryKey: ["available-dates", month, year],
    queryFn: async () => {
      const res = await fetch(
        `/api/appointments/available-dates?month=${month}&year=${year}`
      );
      if (!res.ok) throw new Error("Erro ao buscar datas disponíveis");
      const data = await res.json();
      return data.dates ?? [];
    },
    enabled: !!month && !!year,
  });
}

export function useAvailableSlots(date: string | null) {
  return useQuery<TimeSlot[]>({
    queryKey: ["available-slots", date],
    queryFn: async () => {
      const res = await fetch(
        `/api/appointments/available-slots?date=${date}`
      );
      if (!res.ok) throw new Error("Erro ao buscar horários disponíveis");
      const data = await res.json();
      return data.slots ?? [];
    },
    enabled: !!date,
  });
}
