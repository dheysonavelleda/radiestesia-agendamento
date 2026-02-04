"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

interface PixPaymentResponse {
  paymentId: string;
  qrCode: string;
  qrCodeBase64: string;
  amount: number;
  expiresAt: string;
}

interface CardPaymentResponse {
  preferenceId: string;
  initPoint: string; // MercadoPago checkout URL
  amount: number;
}

interface PaymentStatusResponse {
  status: "pending" | "approved" | "rejected" | "cancelled";
  paidAmount: number;
  appointmentId: string;
}

export function useCreateFirstPayment() {
  return useMutation<PixPaymentResponse, Error, { appointmentId: string }>({
    mutationFn: async ({ appointmentId }) => {
      const res = await fetch("/api/mercadopago/create-first-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar pagamento PIX");
      }
      return res.json();
    },
  });
}

export function useCreateSecondPayment() {
  return useMutation<PixPaymentResponse, Error, { appointmentId: string }>({
    mutationFn: async ({ appointmentId }) => {
      const res = await fetch("/api/mercadopago/create-second-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar segundo pagamento PIX");
      }
      return res.json();
    },
  });
}

export function useCreateCardPayment() {
  return useMutation<CardPaymentResponse, Error, { appointmentId: string; installments: number }>({
    mutationFn: async ({ appointmentId, installments }) => {
      const res = await fetch("/api/mercadopago/create-card-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ appointmentId, installments }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Erro ao criar pagamento com cartão");
      }
      return res.json();
    },
  });
}

export function usePaymentStatus(paymentId: string | null, enabled = true) {
  return useQuery<PaymentStatusResponse>({
    queryKey: ["payment-status", paymentId],
    queryFn: async () => {
      const res = await fetch(`/api/mercadopago/webhook?paymentId=${paymentId}`);
      if (!res.ok) throw new Error("Erro ao verificar status do pagamento");
      return res.json();
    },
    enabled: !!paymentId && enabled,
    refetchInterval: enabled ? 10000 : false, // Poll every 10 seconds
  });
}
