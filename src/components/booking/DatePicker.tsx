"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { useAvailableDates } from "@/hooks/useAvailability";
import { format, isSameDay, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2 } from "lucide-react";
export default function DatePicker() {
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const month = currentMonth.getMonth() + 1;
  const year = currentMonth.getFullYear();

  const { data: availableDates, isLoading } = useAvailableDates(month, year);

  const availableDateObjects = useMemo(() => {
    if (!availableDates) return [];
    return availableDates.map((d) => new Date(d.date + "T12:00:00"));
  }, [availableDates]);

  const isDateAvailable = (date: Date) => {
    return availableDateObjects.some((d) => isSameDay(d, date));
  };

  const handleSelect = (date: Date | undefined) => {
    if (!date) return;
    if (!isDateAvailable(date)) return;
    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    router.push(`/booking/${formattedDate}`);
  };

  const today = startOfDay(new Date());

  return (
    <div className="flex flex-col items-center">
      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Carregando datas disponíveis...</span>
        </div>
      )}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={handleSelect}
        locale={ptBR}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={(date) => {
          if (date < today) return true;
          if (!availableDates || availableDates.length === 0) return true;
          return !isDateAvailable(date);
        }}
        modifiers={{
          available: availableDateObjects,
        }}
        modifiersClassNames={{
          available: "!bg-copper-100 !text-copper-700 hover:!bg-copper-200 font-semibold",
        }}
        classNames={{
          month_caption: "flex items-center justify-center h-10 w-full px-10 text-teal-800 font-semibold",
        }}
        className="rounded-xl border border-copper-200 bg-white p-4 shadow-sm"
      />
      <p className="mt-4 text-sm text-muted-foreground text-center">
        🧡 Selecione uma data disponível para agendar sua sessão
      </p>
    </div>
  );
}
