"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PartialPaymentBannerProps {
  remainingAmount: number;
  deadline?: string;
  appointmentId: string;
  className?: string;
}

export default function PartialPaymentBanner({
  remainingAmount,
  deadline,
  appointmentId,
  className,
}: PartialPaymentBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4",
        className
      )}
    >
      <AlertTriangle className="h-5 w-5 text-orange-600 shrink-0 mt-0.5 sm:mt-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-orange-800">
          Pagamento parcial pendente
        </p>
        <p className="text-xs text-orange-600 mt-0.5">
          Restam{" "}
          <span className="font-semibold">
            R$ {remainingAmount.toFixed(2).replace(".", ",")}
          </span>{" "}
          para completar o pagamento via PIX.
          {deadline && (
            <>
              {" "}Prazo: <span className="font-semibold">{deadline}</span>
            </>
          )}
        </p>
      </div>
      <Link href={`/appointments/${appointmentId}/pay-remaining`}>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white shrink-0">
          Pagar Agora
        </Button>
      </Link>
    </div>
  );
}
