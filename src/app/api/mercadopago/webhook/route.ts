import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getPaymentStatus } from "@/lib/mercadopago";
import { createMeetLink } from "@/lib/google-meet";
import { sendBookingConfirmation } from "@/lib/email";
import { PIX_FIRST_PAYMENT, PIX_SECOND_PAYMENT, PIX_TOTAL, CARD_TOTAL } from "@/lib/payment-logic";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate webhook signature if secret is set
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    if (process.env.MERCADOPAGO_WEBHOOK_SECRET && xSignature) {
      const parts = xSignature.split(",");
      const tsObj = parts.find((p) => p.trim().startsWith("ts="));
      const hashObj = parts.find((p) => p.trim().startsWith("v1="));

      if (tsObj && hashObj) {
        const ts = tsObj.trim().replace("ts=", "");
        const hash = hashObj.trim().replace("v1=", "");
        const dataId = body.data?.id || "";

        const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
        const hmac = crypto
          .createHmac("sha256", process.env.MERCADOPAGO_WEBHOOK_SECRET)
          .update(manifest)
          .digest("hex");

        if (hmac !== hash) {
          console.error("Invalid webhook signature");
          return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }
      }
    }

    // Handle payment notification
    if (body.type === "payment" && body.data?.id) {
      const mpPaymentId = String(body.data.id);
      const { status } = await getPaymentStatus(Number(body.data.id));

      // Find payment by MercadoPago ID (check first and second payment IDs)
      const payment = await prisma.payment.findFirst({
        where: {
          OR: [
            { firstPaymentMPId: mpPaymentId },
            { secondPaymentMPId: mpPaymentId },
            { mercadoPagoPaymentId: mpPaymentId },
          ],
        },
        include: {
          appointment: {
            include: { user: true, service: true },
          },
        },
      });

      if (!payment) {
        console.error("Payment not found for MP ID:", mpPaymentId);
        return NextResponse.json({ received: true });
      }

      const isFirstPayment = payment.firstPaymentMPId === mpPaymentId;
      const isSecondPayment = payment.secondPaymentMPId === mpPaymentId;
      const isCardPayment = payment.paymentMethod === "CARD";

      if (status === "approved") {
        if (isCardPayment) {
          // Card: single full payment
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "PAID",
              paidAmount: CARD_TOTAL,
              remainingAmount: 0,
              firstPaymentStatus: "approved",
              firstPaymentDate: new Date(),
            },
          });

          // Confirm appointment and create Meet link
          let meetLink: string | null = null;
          try {
            meetLink = await createMeetLink(
              `Radiestesia - ${payment.appointment.user.name}`,
              payment.appointment.startTime,
              payment.appointment.endTime,
              payment.appointment.user.email
            );
          } catch (meetError) {
            console.error("Error creating Meet link:", meetError);
          }

          await prisma.appointment.update({
            where: { id: payment.appointmentId },
            data: {
              status: "CONFIRMED",
              meetLink,
            },
          });

          // Send confirmation email
          try {
            await sendBookingConfirmation(payment.appointment.user.email, {
              id: payment.appointment.id,
              date: payment.appointment.date,
              startTime: payment.appointment.startTime,
              endTime: payment.appointment.endTime,
              serviceName: payment.appointment.service.name,
              paymentMethod: "CARD",
              totalAmount: CARD_TOTAL,
              meetLink,
              userName: payment.appointment.user.name,
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
          }
        } else if (isFirstPayment) {
          // PIX first payment
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "PARTIAL_PAID",
              paidAmount: PIX_FIRST_PAYMENT,
              remainingAmount: PIX_SECOND_PAYMENT,
              firstPaymentStatus: "approved",
              firstPaymentDate: new Date(),
            },
          });

          // Confirm appointment and create Meet link
          let meetLink: string | null = null;
          try {
            meetLink = await createMeetLink(
              `Radiestesia - ${payment.appointment.user.name}`,
              payment.appointment.startTime,
              payment.appointment.endTime,
              payment.appointment.user.email
            );
          } catch (meetError) {
            console.error("Error creating Meet link:", meetError);
          }

          await prisma.appointment.update({
            where: { id: payment.appointmentId },
            data: {
              status: "CONFIRMED",
              meetLink,
            },
          });

          try {
            await sendBookingConfirmation(payment.appointment.user.email, {
              id: payment.appointment.id,
              date: payment.appointment.date,
              startTime: payment.appointment.startTime,
              endTime: payment.appointment.endTime,
              serviceName: payment.appointment.service.name,
              paymentMethod: "PIX",
              totalAmount: PIX_TOTAL,
              meetLink,
              userName: payment.appointment.user.name,
            });
          } catch (emailError) {
            console.error("Error sending confirmation email:", emailError);
          }
        } else if (isSecondPayment) {
          // PIX second payment
          await prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: "PAID",
              paidAmount: PIX_TOTAL,
              remainingAmount: 0,
              secondPaymentStatus: "approved",
              secondPaymentDate: new Date(),
            },
          });
        }
      } else if (status === "rejected" || status === "cancelled") {
        if (isFirstPayment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { firstPaymentStatus: status },
          });
        } else if (isSecondPayment) {
          await prisma.payment.update({
            where: { id: payment.id },
            data: { secondPaymentStatus: status },
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ received: true });
  }
}
