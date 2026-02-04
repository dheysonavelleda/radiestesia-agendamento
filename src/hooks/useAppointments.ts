"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  paymentMethod: string | null;
  meetLink: string | null;
  notes: string | null;
  service: {
    name: string;
    duration: number;
    pricePix: number;
    priceCard: number;
  };
  payment: {
    status: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentMethod: string;
  } | null;
}

export function useAppointments() {
  return useQuery<Appointment[]>({
    queryKey: ["appointments"],
    queryFn: async () => {
      const res = await fetch("/api/appointments");
      if (!res.ok) throw new Error("Erro ao buscar agendamentos");
      const data = await res.json();
      return data.appointments ?? [];
    },
  });
}

export function useAppointment(id: string | null) {
  return useQuery<Appointment>({
    queryKey: ["appointment", id],
    queryFn: async () => {
      const res = await fetch(`/api/appointments/${id}`);
      if (!res.ok) throw new Error("Erro ao buscar agendamento");
      return res.json();
    },
    enabled: !!id,
  });
}

export function useCancelAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (appointmentId: string) => {
      const res = await fetch("/api/appointments/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao cancelar agendamento");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      appointmentId,
      newDate,
      newStartTime,
    }: {
      appointmentId: string;
      newDate: string;
      newStartTime: string;
    }) => {
      const res = await fetch("/api/appointments/reschedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, newDate, newStartTime }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao remarcar agendamento");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });
}
