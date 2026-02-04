"use client";

import { cn } from "@/lib/utils";
import { CreditCard, QrCode, Star } from "lucide-react";
import type { PaymentMethodType } from "./BookingContext";

interface PaymentMethodSelectorProps {
  selected: PaymentMethodType;
  onSelect: (method: PaymentMethodType) => void;
}

export default function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* PIX Option */}
      <button
        onClick={() => onSelect("PIX")}
        className={cn(
          "relative flex flex-col p-6 rounded-xl border-2 transition-all text-left",
          selected === "PIX"
            ? "border-copper-600 bg-copper-50 ring-2 ring-copper-200 shadow-lg"
            : "border-copper-200 bg-white hover:border-copper-400 hover:shadow-md"
        )}
      >
        {/* Discount badge */}
        <div className="absolute -top-3 right-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3 h-3" />
          Economize R$50
        </div>

        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              selected === "PIX"
                ? "bg-copper-600 text-white"
                : "bg-copper-100 text-copper-600"
            )}
          >
            <QrCode className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-800">PIX</h3>
            <p className="text-2xl font-bold text-copper-600">R$ 450,00</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-teal-700">Pagamento em 2 etapas:</p>
          <div className="flex items-start gap-2">
            <span className="bg-copper-200 text-copper-700 text-xs font-bold px-2 py-0.5 rounded mt-0.5">1ª</span>
            <p><strong>R$ 150,00</strong> — sinal para confirmar (agora)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="bg-copper-200 text-copper-700 text-xs font-bold px-2 py-0.5 rounded mt-0.5">2ª</span>
            <p><strong>R$ 300,00</strong> — até 1h antes da sessão</p>
          </div>
        </div>
      </button>

      {/* Card Option */}
      <button
        onClick={() => onSelect("CARD")}
        className={cn(
          "flex flex-col p-6 rounded-xl border-2 transition-all text-left",
          selected === "CARD"
            ? "border-copper-600 bg-copper-50 ring-2 ring-copper-200 shadow-lg"
            : "border-copper-200 bg-white hover:border-copper-400 hover:shadow-md"
        )}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className={cn(
              "flex items-center justify-center w-12 h-12 rounded-full",
              selected === "CARD"
                ? "bg-copper-600 text-white"
                : "bg-teal-100 text-teal-600"
            )}
          >
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-teal-800">Cartão de Crédito</h3>
            <p className="text-2xl font-bold text-copper-600">R$ 500,00</p>
          </div>
        </div>

        <div className="space-y-2 text-sm text-muted-foreground">
          <p className="font-medium text-teal-700">Pagamento único:</p>
          <p>Parcele em até <strong>4x de R$ 125,00</strong> sem juros</p>
          <p>Confirmação imediata após aprovação</p>
        </div>
      </button>
    </div>
  );
}
