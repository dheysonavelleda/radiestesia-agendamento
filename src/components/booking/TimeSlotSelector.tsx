"use client";

import { useAvailableSlots } from "@/hooks/useAvailability";
import { cn } from "@/lib/utils";
import { Clock, Loader2 } from "lucide-react";

interface TimeSlotSelectorProps {
  date: string;
  selectedSlot: { startTime: string; endTime: string } | null;
  onSelect: (startTime: string, endTime: string) => void;
}

export default function TimeSlotSelector({
  date,
  selectedSlot,
  onSelect,
}: TimeSlotSelectorProps) {
  const { data: slots, isLoading, error } = useAvailableSlots(date);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="w-6 h-6 animate-spin mb-2" />
        <span>Carregando horários disponíveis...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-destructive">
        <p>Erro ao carregar horários. Tente novamente.</p>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-12 h-12 mx-auto text-copper-300 mb-4" />
        <p className="text-lg font-medium text-teal-800">
          Nenhum horário disponível
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          Por favor, selecione outra data.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {slots
        .filter((slot) => slot.available)
        .map((slot) => {
          const isSelected =
            selectedSlot?.startTime === slot.startTime &&
            selectedSlot?.endTime === slot.endTime;

          return (
            <button
              key={slot.id}
              onClick={() => onSelect(slot.startTime, slot.endTime)}
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left",
                isSelected
                  ? "border-copper-600 bg-copper-50 ring-2 ring-copper-200 shadow-md"
                  : "border-copper-200 bg-white hover:border-copper-400 hover:bg-copper-50/50"
              )}
            >
              <div
                className={cn(
                  "flex items-center justify-center w-10 h-10 rounded-full",
                  isSelected
                    ? "bg-copper-600 text-white"
                    : "bg-copper-100 text-copper-600"
                )}
              >
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p
                  className={cn(
                    "text-lg font-semibold",
                    isSelected ? "text-teal-800" : "text-foreground"
                  )}
                >
                  {slot.startTime} - {slot.endTime}
                </p>
                <p className="text-sm text-muted-foreground">
                  Sessão de 2 horas
                </p>
              </div>
            </button>
          );
        })}
    </div>
  );
}
