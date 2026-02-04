"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

export type PaymentMethodType = "PIX" | "CARD" | null;

interface BookingState {
  date: string | null;        // YYYY-MM-DD
  startTime: string | null;   // "09:00"
  endTime: string | null;     // "11:00"
  paymentMethod: PaymentMethodType;
  appointmentId: string | null;
  paymentId: string | null;
  termsAccepted: boolean;
}

interface BookingContextType extends BookingState {
  setDate: (date: string) => void;
  setTimeSlot: (startTime: string, endTime: string) => void;
  setPaymentMethod: (method: PaymentMethodType) => void;
  setAppointmentId: (id: string) => void;
  setPaymentId: (id: string) => void;
  setTermsAccepted: (accepted: boolean) => void;
  reset: () => void;
  totalPrice: number;
  formattedDate: string;
}

const initialState: BookingState = {
  date: null,
  startTime: null,
  endTime: null,
  paymentMethod: null,
  appointmentId: null,
  paymentId: null,
  termsAccepted: false,
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<BookingState>(initialState);

  const setDate = useCallback((date: string) => {
    setState((prev) => ({ ...prev, date }));
  }, []);

  const setTimeSlot = useCallback((startTime: string, endTime: string) => {
    setState((prev) => ({ ...prev, startTime, endTime }));
  }, []);

  const setPaymentMethod = useCallback((paymentMethod: PaymentMethodType) => {
    setState((prev) => ({ ...prev, paymentMethod }));
  }, []);

  const setAppointmentId = useCallback((appointmentId: string) => {
    setState((prev) => ({ ...prev, appointmentId }));
  }, []);

  const setPaymentId = useCallback((paymentId: string) => {
    setState((prev) => ({ ...prev, paymentId }));
  }, []);

  const setTermsAccepted = useCallback((termsAccepted: boolean) => {
    setState((prev) => ({ ...prev, termsAccepted }));
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const totalPrice = state.paymentMethod === "PIX" ? 450 : state.paymentMethod === "CARD" ? 500 : 0;

  const formattedDate = state.date
    ? new Date(state.date + "T12:00:00").toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <BookingContext.Provider
      value={{
        ...state,
        setDate,
        setTimeSlot,
        setPaymentMethod,
        setAppointmentId,
        setPaymentId,
        setTermsAccepted,
        reset,
        totalPrice,
        formattedDate,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
