import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type PaymentStatus = "PENDING" | "PARTIAL_PAID" | "PAID" | "FAILED" | "REFUNDED";

interface PaymentStatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; classes: string }> = {
  PENDING: {
    label: "Pendente",
    classes: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  PARTIAL_PAID: {
    label: "Parcial",
    classes: "bg-orange-100 text-orange-800 border-orange-200",
  },
  PAID: {
    label: "Pago",
    classes: "bg-green-100 text-green-800 border-green-200",
  },
  FAILED: {
    label: "Falhou",
    classes: "bg-red-100 text-red-800 border-red-200",
  },
  REFUNDED: {
    label: "Reembolsado",
    classes: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export default function PaymentStatusBadge({ status, className }: PaymentStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant="outline" className={cn(config.classes, className)}>
      {config.label}
    </Badge>
  );
}
