"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const steps = [
  { number: 1, label: "Data" },
  { number: 2, label: "Horário" },
  { number: 3, label: "Pagamento" },
  { number: 4, label: "Confirmação" },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full text-sm font-semibold transition-all",
                currentStep > step.number
                  ? "bg-copper-600 text-white"
                  : currentStep === step.number
                  ? "bg-copper-600 text-white ring-4 ring-copper-200"
                  : "bg-copper-100 text-copper-400"
              )}
            >
              {currentStep > step.number ? (
                <Check className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                step.number
              )}
            </div>
            <span
              className={cn(
                "mt-1 text-xs sm:text-sm font-medium",
                currentStep >= step.number
                  ? "text-copper-700"
                  : "text-muted-foreground"
              )}
            >
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                "w-8 sm:w-16 h-0.5 mx-1 sm:mx-2 mb-5",
                currentStep > step.number
                  ? "bg-copper-600"
                  : "bg-copper-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
