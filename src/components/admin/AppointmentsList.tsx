"use client";

import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Eye,
  XCircle,
  CheckCircle,
  Video,
  MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface AppointmentRow {
  id: string;
  clientName: string;
  clientEmail: string;
  date: string; // ISO string
  startTime: string; // ISO string
  status: string;
  paymentStatus: string;
  paymentMethod: string | null;
  meetLink: string | null;
}

interface AppointmentsListProps {
  appointments: AppointmentRow[];
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onEditMeetLink?: (id: string) => void;
  compact?: boolean;
}

const statusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-yellow-100 text-yellow-800 border-yellow-200",
  },
  CONFIRMED: {
    label: "Confirmado",
    className: "bg-blue-100 text-blue-800 border-blue-200",
  },
  COMPLETED: {
    label: "Realizado",
    className: "bg-green-100 text-green-800 border-green-200",
  },
  CANCELLED: {
    label: "Cancelado",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  NO_SHOW: {
    label: "Não compareceu",
    className: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

const paymentStatusConfig: Record<
  string,
  { label: string; className: string }
> = {
  PENDING: {
    label: "Pendente",
    className: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  PARTIAL_PAID: {
    label: "Parcial",
    className: "bg-orange-50 text-orange-700 border-orange-200",
  },
  PAID: {
    label: "Pago",
    className: "bg-green-50 text-green-700 border-green-200",
  },
  FAILED: {
    label: "Falhou",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  REFUNDED: {
    label: "Reembolsado",
    className: "bg-copper-50 text-copper-700 border-copper-200",
  },
  FORFEITED: {
    label: "Perdido",
    className: "bg-gray-50 text-gray-700 border-gray-200",
  },
};

export default function AppointmentsList({
  appointments,
  onCancel,
  onComplete,
  onEditMeetLink,
  compact = false,
}: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Cliente</TableHead>
          <TableHead>Data</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Status</TableHead>
          {!compact && <TableHead>Pagamento</TableHead>}
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((apt) => {
          const dateObj = new Date(apt.date);
          const startObj = new Date(apt.startTime);
          const status = statusConfig[apt.status] || statusConfig.PENDING;
          const payment =
            paymentStatusConfig[apt.paymentStatus] ||
            paymentStatusConfig.PENDING;

          return (
            <TableRow key={apt.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{apt.clientName}</p>
                  {!compact && (
                    <p className="text-xs text-muted-foreground">
                      {apt.clientEmail}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {format(dateObj, "dd/MM/yyyy", { locale: ptBR })}
              </TableCell>
              <TableCell>
                {format(startObj, "HH:mm", { locale: ptBR })}
              </TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={status.className}
                >
                  {status.label}
                </Badge>
              </TableCell>
              {!compact && (
                <TableCell>
                  <Badge
                    variant="outline"
                    className={payment.className}
                  >
                    {payment.label}
                  </Badge>
                </TableCell>
              )}
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/appointments/${apt.id}`}>
                        <Eye className="mr-2 size-4" />
                        Ver detalhes
                      </Link>
                    </DropdownMenuItem>
                    {apt.status !== "COMPLETED" &&
                      apt.status !== "CANCELLED" && (
                        <>
                          {onComplete && (
                            <DropdownMenuItem
                              onClick={() => onComplete(apt.id)}
                            >
                              <CheckCircle className="mr-2 size-4" />
                              Marcar como realizado
                            </DropdownMenuItem>
                          )}
                          {onEditMeetLink && (
                            <DropdownMenuItem
                              onClick={() => onEditMeetLink(apt.id)}
                            >
                              <Video className="mr-2 size-4" />
                              {apt.meetLink ? "Editar" : "Adicionar"} link Meet
                            </DropdownMenuItem>
                          )}
                          {onCancel && (
                            <DropdownMenuItem
                              onClick={() => onCancel(apt.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <XCircle className="mr-2 size-4" />
                              Cancelar
                            </DropdownMenuItem>
                          )}
                        </>
                      )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
