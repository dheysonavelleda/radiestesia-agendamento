import { addHours, isBefore, subHours } from "date-fns";

// Price constants
export const PIX_TOTAL = 450;
export const PIX_FIRST_PAYMENT = 100; // Signal
export const PIX_SECOND_PAYMENT = 350; // Remainder
export const CARD_TOTAL = 500;
export const MAX_INSTALLMENTS = 4;
export const CANCEL_REFUND_HOURS = 12;
export const SECOND_PAYMENT_DEADLINE_HOURS = 1; // 1h before session

interface PaymentAmounts {
  total: number;
  firstPayment: number;
  secondPayment?: number;
}

interface PaymentRecord {
  totalAmount: number;
  paidAmount: number;
  paymentMethod: "PIX" | "CARD";
  firstPaymentAmount: number | null;
  secondPaymentAmount: number | null;
}

interface AppointmentWithPayment {
  startTime: Date;
  payment?: {
    paymentMethod: "PIX" | "CARD";
    status: string;
    secondPaymentStatus: string | null;
  } | null;
}

/**
 * Calculate payment amounts based on method
 */
export function calculatePaymentAmounts(method: "PIX" | "CARD"): PaymentAmounts {
  if (method === "PIX") {
    return {
      total: PIX_TOTAL,
      firstPayment: PIX_FIRST_PAYMENT,
      secondPayment: PIX_SECOND_PAYMENT,
    };
  }

  return {
    total: CARD_TOTAL,
    firstPayment: CARD_TOTAL,
  };
}

/**
 * Check if an appointment can be cancelled with a refund
 * Refund is available if more than 12h before session
 */
export function canCancelWithRefund(appointmentDate: Date): boolean {
  const now = new Date();
  const deadline = subHours(appointmentDate, CANCEL_REFUND_HOURS);
  return isBefore(now, deadline);
}

/**
 * Calculate refund amount
 * Full refund if >12h before, no refund if <12h
 */
export function getRefundAmount(
  payment: PaymentRecord,
  cancelDate: Date
): number {
  // If >12h before session, full refund of what was paid
  // We use cancelDate as the appointment date for the check
  if (canCancelWithRefund(cancelDate)) {
    return payment.paidAmount;
  }

  // Less than 12h - no refund
  return 0;
}

/**
 * Get the deadline for the second PIX payment (1h before session)
 */
export function getSecondPaymentDeadline(appointmentDate: Date): Date {
  return subHours(appointmentDate, SECOND_PAYMENT_DEADLINE_HOURS);
}

/**
 * Check if the second payment is due (past deadline)
 */
export function isSecondPaymentDue(appointment: AppointmentWithPayment): boolean {
  if (!appointment.payment) return false;
  if (appointment.payment.paymentMethod !== "PIX") return false;

  // If second payment is already done, not due
  if (appointment.payment.secondPaymentStatus === "approved") return false;

  const deadline = getSecondPaymentDeadline(appointment.startTime);
  const now = new Date();
  return isBefore(deadline, now);
}
