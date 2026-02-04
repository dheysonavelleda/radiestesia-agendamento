import { MercadoPagoConfig, Payment, Preference, PaymentRefund } from "mercadopago";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN || "",
});

const paymentClient = new Payment(client);
const preferenceClient = new Preference(client);
const refundClient = new PaymentRefund(client);

interface PixPaymentResult {
  id: number;
  qrCode: string;
  qrCodeBase64: string;
  status: string;
}

interface CardPreferenceResult {
  id: string;
  initPoint: string;
  sandboxInitPoint: string;
}

interface BackUrls {
  success: string;
  failure: string;
  pending: string;
}

/**
 * Create a PIX payment via MercadoPago
 */
export async function createPixPayment(
  amount: number,
  description: string,
  externalRef: string,
  email: string
): Promise<PixPaymentResult> {
  const payment = await paymentClient.create({
    body: {
      transaction_amount: amount,
      description,
      payment_method_id: "pix",
      payer: {
        email,
      },
      external_reference: externalRef,
    },
  });

  const pointOfInteraction = payment.point_of_interaction;
  const transactionData = pointOfInteraction?.transaction_data;

  return {
    id: payment.id!,
    qrCode: transactionData?.qr_code || "",
    qrCodeBase64: transactionData?.qr_code_base64 || "",
    status: payment.status || "pending",
  };
}

/**
 * Create a card checkout preference via MercadoPago
 */
export async function createCardPreference(
  amount: number,
  description: string,
  externalRef: string,
  installments: number,
  backUrls: BackUrls
): Promise<CardPreferenceResult> {
  const preference = await preferenceClient.create({
    body: {
      items: [
        {
          id: externalRef,
          title: description,
          quantity: 1,
          unit_price: amount,
          currency_id: "BRL",
        },
      ],
      payment_methods: {
        installments: installments,
        excluded_payment_types: [{ id: "ticket" }, { id: "atm" }],
      },
      back_urls: backUrls,
      auto_return: "approved",
      external_reference: externalRef,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/mercadopago/webhook`,
    },
  });

  return {
    id: preference.id!,
    initPoint: preference.init_point!,
    sandboxInitPoint: preference.sandbox_init_point!,
  };
}

/**
 * Get payment status from MercadoPago
 */
export async function getPaymentStatus(
  paymentId: number
): Promise<{ status: string; statusDetail: string }> {
  const payment = await paymentClient.get({ id: paymentId });

  return {
    status: payment.status || "unknown",
    statusDetail: payment.status_detail || "",
  };
}

/**
 * Create a refund (full or partial)
 */
export async function createRefund(
  paymentId: number,
  amount?: number
): Promise<{ id: number; status: string }> {
  const refund = await refundClient.create({
    payment_id: paymentId,
    body: amount ? { amount } : {},
  });

  return {
    id: refund.id ?? 0,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    status: String((refund as any).status ?? "pending"),
  };
}
