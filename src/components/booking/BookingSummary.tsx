"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import TermsModal from "./TermsModal";
import {
  CalendarDays,
  Clock,
  CreditCard,
  QrCode,
  FileText,
  Sun,
} from "lucide-react";

interface BookingSummaryProps {
  date: string;
  formattedDate: string;
  startTime: string;
  endTime: string;
  paymentMethod: "PIX" | "CARD";
  totalPrice: number;
  termsAccepted: boolean;
  onTermsAccepted: (accepted: boolean) => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function BookingSummary({
  formattedDate,
  startTime,
  endTime,
  paymentMethod,
  totalPrice,
  termsAccepted,
  onTermsAccepted,
  onConfirm,
  isLoading = false,
}: BookingSummaryProps) {
  const [showTerms, setShowTerms] = useState(false);

  return (
    <>
      <Card className="border-copper-200 shadow-md">
        <CardHeader className="border-b border-copper-100">
          <CardTitle className="text-teal-800 flex items-center gap-2">
            <Sun className="w-5 h-5 text-copper-600" />
            Resumo do Agendamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          {/* Service */}
          <div className="flex items-start gap-3">
            <Sun className="w-5 h-5 text-copper-500 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Serviço</p>
              <p className="font-semibold">Sessão de Radiestesia Terapêutica</p>
              <p className="text-sm text-muted-foreground">2 horas via Google Meet</p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <CalendarDays className="w-5 h-5 text-copper-500 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-semibold capitalize">{formattedDate}</p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-copper-500 mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Horário</p>
              <p className="font-semibold">
                {startTime} - {endTime}
              </p>
            </div>
          </div>

          {/* Payment */}
          <div className="flex items-start gap-3">
            {paymentMethod === "PIX" ? (
              <QrCode className="w-5 h-5 text-copper-500 mt-0.5" />
            ) : (
              <CreditCard className="w-5 h-5 text-copper-500 mt-0.5" />
            )}
            <div>
              <p className="text-sm text-muted-foreground">Forma de Pagamento</p>
              <p className="font-semibold">
                {paymentMethod === "PIX" ? "PIX" : "Cartão de Crédito"}
              </p>
              {paymentMethod === "PIX" && (
                <p className="text-xs text-muted-foreground">
                  R$ 150,00 agora + R$ 300,00 antes da sessão
                </p>
              )}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-copper-100 pt-4 mt-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-teal-800">Total</span>
              <span className="text-2xl font-bold text-copper-600">
                R$ {totalPrice.toFixed(2).replace(".", ",")}
              </span>
            </div>
            {paymentMethod === "PIX" && (
              <p className="text-xs text-green-600 mt-1">
                ✨ Você economiza R$ 50,00 pagando com PIX!
              </p>
            )}
          </div>

          {/* Terms */}
          <div className="border-t border-copper-100 pt-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => onTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-copper-300 text-copper-600 focus:ring-copper-500"
              />
              <span className="text-sm text-muted-foreground">
                Li e aceito os{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(true);
                  }}
                  className="text-copper-600 underline hover:text-copper-800 font-medium"
                >
                  termos e condições
                </button>{" "}
                e a{" "}
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTerms(true);
                  }}
                  className="text-copper-600 underline hover:text-copper-800 font-medium"
                >
                  política de cancelamento
                </button>
                .
              </span>
            </label>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={onConfirm}
            disabled={!termsAccepted || isLoading}
            className="w-full bg-copper-600 hover:bg-copper-700 text-white py-6 text-lg font-semibold"
            size="lg"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Processando...
              </span>
            ) : (
              <>
                <FileText className="w-5 h-5 mr-2" />
                Confirmar e Pagar
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <TermsModal
        open={showTerms}
        onOpenChange={setShowTerms}
        onAccept={() => onTermsAccepted(true)}
      />
    </>
  );
}
