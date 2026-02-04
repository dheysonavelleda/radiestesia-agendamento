// Type definitions for the scheduling system
import type { DefaultSession, DefaultUser } from "next-auth";
import type { DefaultJWT } from "next-auth/jwt";

// ============ ENUMS ============

export enum UserRole {
  ADMIN = "ADMIN",
  CLIENT = "CLIENT",
}

export enum AppointmentStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
  NO_SHOW = "NO_SHOW",
  RESCHEDULED = "RESCHEDULED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  REFUNDED = "REFUNDED",
  CANCELLED = "CANCELLED",
}

export enum PaymentMethod {
  PIX = "PIX",
  CREDIT_CARD = "CREDIT_CARD",
}

export enum PaymentType {
  FIRST_PAYMENT = "FIRST_PAYMENT",
  SECOND_PAYMENT = "SECOND_PAYMENT",
  FULL_PAYMENT = "FULL_PAYMENT",
}

// ============ NEXT-AUTH TYPE EXTENSIONS ============

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User extends DefaultUser {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: string;
  }
}
