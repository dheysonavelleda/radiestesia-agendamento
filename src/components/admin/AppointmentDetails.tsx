"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Bell,
  Video,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import MeetLinkEditor from "./MeetLinkEditor";

export interface AppointmentDetail {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  meetLink: string | null;
  notes: string | null;
  adminNotes: string | null;
  rescheduleCount: number;
  client: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    image: string | null;
  };
  service: {
    name: string;
    duration: number;
  };
  payment: {
    id: string;
    totalAmount: number;
    paidAmount: number;
    remainingAmount: number;
    paymentMethod: string;
    status: string;
    installments: number;
    firstPaymentAmount: number | null;
    firstPaymentDate: string | null;
    firstPaymentStatus: string | null;
    secondPaymentAmount: number | null;
    secondPaymentDate: string | null;
    secondPaymentStatus: string | null;
    secondPaymentDue: string | null;
  } | null;
}

interface AppointmentDetailsProps {
  appointment: AppointmentDetail;
  onCancel?: () => void;
  onComplete?: () => void;
  onSendReminder?: () => void;
  onSaveMeetLink?: (link: string) => void;
  onSaveAdminNotes?: (notes: string) => void;
}

const statusConfig: Record<string, { label: string; className: string }> = {
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

export default function AppointmentDetails({
  appointment,
  onCancel,
  onComplete,
  onSendReminder,
  onSaveMeetLink,
  onSaveAdminNotes,
}: AppointmentDetailsProps) {
  const status =
    statusConfig[appointment.status] || statusConfig.PENDING;
  const isActionable =
    appointment.status !== "COMPLETED" && appointment.status !== "CANCELLED";

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left Column */}
      <div className="space-y-6">
        {/* Appointment Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Detalhes da Sessão</CardTitle>
              <Badge variant="outline" className={status.className}>
                {status.label}
              </Badge>
            </div>
            <CardDescription>{appointment.service.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="size-4 text-copper-500" />
              <span className="text-sm">
                {format(new Date(appointment.date), "EEEE, dd 'de' MMMM 'de' yyyy", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="size-4 text-copper-500" />
              <span className="text-sm">
                {format(new Date(appointment.startTime), "HH:mm")} -{" "}
                {format(new Date(appointment.endTime), "HH:mm")} (
                {appointment.service.duration} min)
              </span>
            </div>
            {appointment.notes && (
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 size-4 text-copper-500" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Notas do cliente
                  </p>
                  <p className="text-sm">{appointment.notes}</p>
                </div>
              </div>
            )}
            <div className="text-xs text-muted-foreground">
              Remarcações: {appointment.rescheduleCount}/2
            </div>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-4" />
              Informações do Cliente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="size-4 text-muted-foreground" />
              <span className="text-sm font-medium">
                {appointment.client.name}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="size-4 text-muted-foreground" />
              <span className="text-sm">{appointment.client.email}</span>
            </div>
            {appointment.client.phone && (
              <div className="flex items-center gap-3">
                <Phone className="size-4 text-muted-foreground" />
                <span className="text-sm">{appointment.client.phone}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        {isActionable && (
          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {onComplete && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={onComplete}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="mr-2 size-4" />
                  Marcar como realizado
                </Button>
              )}
              {onSendReminder && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onSendReminder}
                >
                  <Bell className="mr-2 size-4" />
                  Enviar lembrete
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={onCancel}
                >
                  <XCircle className="mr-2 size-4" />
                  Cancelar
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Payment Details */}
        {appointment.payment && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="size-4" />
                  Pagamento
                </CardTitle>
                <Badge
                  variant="outline"
                  className={
                    (
                      paymentStatusConfig[appointment.payment.status] ||
                      paymentStatusConfig.PENDING
                    ).className
                  }
                >
                  {
                    (
                      paymentStatusConfig[appointment.payment.status] ||
                      paymentStatusConfig.PENDING
                    ).label
                  }
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Método</p>
                  <p className="text-sm font-medium">
                    {appointment.payment.paymentMethod === "PIX"
                      ? "PIX"
                      : `Cartão ${appointment.payment.installments}x`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="text-sm font-bold">
                    R$ {appointment.payment.totalAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Pago</p>
                  <p className="text-sm font-medium text-green-600">
                    R$ {appointment.payment.paidAmount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Restante</p>
                  <p className="text-sm font-medium text-orange-600">
                    R$ {appointment.payment.remainingAmount.toFixed(2)}
                  </p>
                </div>
              </div>

              <Separator />

              {/* Payment Timeline */}
              <div className="space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase">
                  Linha do Tempo
                </p>
                {/* First Payment */}
                {appointment.payment.firstPaymentAmount != null && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-copper-500" />
                    <div>
                      <p className="text-sm font-medium">
                        1ª Parcela — R${" "}
                        {appointment.payment.firstPaymentAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.payment.firstPaymentDate
                          ? format(
                              new Date(appointment.payment.firstPaymentDate),
                              "dd/MM/yyyy HH:mm",
                              { locale: ptBR }
                            )
                          : "Aguardando pagamento"}
                        {appointment.payment.firstPaymentStatus &&
                          ` • ${appointment.payment.firstPaymentStatus}`}
                      </p>
                    </div>
                  </div>
                )}
                {/* Second Payment (PIX only) */}
                {appointment.payment.secondPaymentAmount != null && (
                  <div className="flex items-start gap-3">
                    <div className="mt-1 size-2 rounded-full bg-teal-400" />
                    <div>
                      <p className="text-sm font-medium">
                        2ª Parcela — R${" "}
                        {appointment.payment.secondPaymentAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {appointment.payment.secondPaymentDate
                          ? format(
                              new Date(appointment.payment.secondPaymentDate),
                              "dd/MM/yyyy HH:mm",
                              { locale: ptBR }
                            )
                          : appointment.payment.secondPaymentDue
                          ? `Vencimento: ${format(
                              new Date(appointment.payment.secondPaymentDue),
                              "dd/MM/yyyy HH:mm",
                              { locale: ptBR }
                            )}`
                          : "Aguardando pagamento"}
                        {appointment.payment.secondPaymentStatus &&
                          ` • ${appointment.payment.secondPaymentStatus}`}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Meet Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="size-4" />
              Link do Google Meet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MeetLinkEditor
              meetLink={appointment.meetLink || ""}
              onSave={onSaveMeetLink || (() => {})}
              disabled={!isActionable}
            />
          </CardContent>
        </Card>

        {/* Admin Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-4" />
              Notas da Joana
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AdminNotesEditor
              notes={appointment.adminNotes || ""}
              onSave={onSaveAdminNotes || (() => {})}
              disabled={false}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function AdminNotesEditor({
  notes,
  onSave,
  disabled,
}: {
  notes: string;
  onSave: (notes: string) => void;
  disabled: boolean;
}) {
  const { useState } = require("react");
  const [value, setValue] = useState(notes);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave(value);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-2">
      <textarea
        className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-24 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
        placeholder="Adicionar notas privadas..."
        value={value}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          setValue(e.target.value)
        }
        disabled={disabled}
      />
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} disabled={disabled}>
          Salvar notas
        </Button>
        {saved && (
          <span className="text-xs text-green-600">✓ Salvo</span>
        )}
      </div>
    </div>
  );
}
