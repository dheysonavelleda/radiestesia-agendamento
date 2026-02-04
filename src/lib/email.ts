import { Resend } from "resend";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_placeholder");
}

const FROM_EMAIL = process.env.FROM_EMAIL || "Joana Savi <agendamento@joanasavi.com.br>";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface AppointmentDetails {
  id: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  serviceName: string;
  paymentMethod: string;
  totalAmount: number;
  meetLink?: string | null;
  userName?: string;
}

interface RefundInfo {
  amount: number;
  method: string;
}

function formatDate(date: Date): string {
  return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
}

function formatTime(date: Date): string {
  return format(date, "HH:mm");
}

function baseTemplate(content: string): string {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #faf8f5; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #7c5e99 0%, #a78bba 100%); padding: 30px; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 300;">Joana Savi</h1>
        <p style="color: rgba(255,255,255,0.9); margin: 5px 0 0; font-size: 14px;">Radiestesia Terapêutica</p>
      </div>
      <div style="padding: 30px; color: #333;">
        ${content}
      </div>
      <div style="padding: 20px 30px; background-color: #f0ebe6; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">Joana Savi - Radiestesia Terapêutica</p>
        <p style="margin: 5px 0 0;">Este é um email automático. Em caso de dúvidas, entre em contato.</p>
      </div>
    </div>
  `;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(
  to: string,
  appointmentDetails: AppointmentDetails
): Promise<void> {
  const { id, date, startTime, endTime, serviceName, paymentMethod, totalAmount, meetLink } =
    appointmentDetails;

  const content = `
    <h2 style="color: #7c5e99; margin-top: 0;">Agendamento Confirmado! ✨</h2>
    <p>Olá${appointmentDetails.userName ? `, ${appointmentDetails.userName}` : ""}!</p>
    <p>Seu agendamento foi realizado com sucesso. Confira os detalhes:</p>
    
    <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #7c5e99;">
      <p style="margin: 5px 0;"><strong>📋 Serviço:</strong> ${serviceName}</p>
      <p style="margin: 5px 0;"><strong>📅 Data:</strong> ${formatDate(date)}</p>
      <p style="margin: 5px 0;"><strong>🕐 Horário:</strong> ${formatTime(startTime)} às ${formatTime(endTime)}</p>
      <p style="margin: 5px 0;"><strong>💳 Pagamento:</strong> ${paymentMethod === "PIX" ? "PIX (R$450,00)" : "Cartão (R$500,00)"}</p>
      ${meetLink ? `<p style="margin: 5px 0;"><strong>📹 Link da sessão:</strong> <a href="${meetLink}" style="color: #7c5e99;">${meetLink}</a></p>` : ""}
    </div>

    ${
      paymentMethod === "PIX"
        ? `<div style="background-color: #fff3cd; border-radius: 8px; padding: 15px; margin: 15px 0;">
        <p style="margin: 0; font-size: 14px;">⚠️ <strong>Lembrete:</strong> O segundo pagamento de R$300,00 via PIX deve ser realizado até 1 hora antes da sessão.</p>
      </div>`
        : ""
    }

    <p>Estou muito feliz em poder te ajudar nessa jornada! 💜</p>
    <p>Com carinho,<br>Joana Savi</p>
  `;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Agendamento Confirmado - ${formatDate(date)} às ${formatTime(startTime)}`,
    html: baseTemplate(content),
  });
}

/**
 * Send payment reminder for 2nd PIX payment
 */
export async function sendPaymentReminder(
  to: string,
  appointmentDetails: AppointmentDetails
): Promise<void> {
  const { date, startTime, totalAmount } = appointmentDetails;

  const content = `
    <h2 style="color: #7c5e99; margin-top: 0;">Lembrete de Pagamento 💰</h2>
    <p>Olá${appointmentDetails.userName ? `, ${appointmentDetails.userName}` : ""}!</p>
    <p>Estamos lembrando que o segundo pagamento da sua sessão ainda está pendente:</p>
    
    <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #e6a817;">
      <p style="margin: 5px 0;"><strong>📅 Sessão:</strong> ${formatDate(date)} às ${formatTime(startTime)}</p>
      <p style="margin: 5px 0;"><strong>💰 Valor pendente:</strong> R$300,00</p>
      <p style="margin: 5px 0;"><strong>⏰ Prazo:</strong> Até 1 hora antes da sessão</p>
    </div>

    <div style="text-align: center; margin: 25px 0;">
      <a href="${APP_URL}/meus-agendamentos" style="display: inline-block; background: linear-gradient(135deg, #7c5e99 0%, #a78bba 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">Realizar Pagamento</a>
    </div>

    <p>Com carinho,<br>Joana Savi</p>
  `;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Lembrete de Pagamento - Sessão ${formatDate(date)}`,
    html: baseTemplate(content),
  });
}

/**
 * Send appointment reminder (24h or 2h before)
 */
export async function sendAppointmentReminder(
  to: string,
  appointmentDetails: AppointmentDetails,
  hoursUntil: number
): Promise<void> {
  const { date, startTime, meetLink } = appointmentDetails;

  const timeLabel = hoursUntil === 24 ? "amanhã" : "em 2 horas";

  const content = `
    <h2 style="color: #7c5e99; margin-top: 0;">Lembrete da Sessão 🔔</h2>
    <p>Olá${appointmentDetails.userName ? `, ${appointmentDetails.userName}` : ""}!</p>
    <p>Sua sessão de Radiestesia Terapêutica é <strong>${timeLabel}</strong>!</p>
    
    <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #7c5e99;">
      <p style="margin: 5px 0;"><strong>📅 Data:</strong> ${formatDate(date)}</p>
      <p style="margin: 5px 0;"><strong>🕐 Horário:</strong> ${formatTime(startTime)}</p>
      ${meetLink ? `<p style="margin: 5px 0;"><strong>📹 Link:</strong> <a href="${meetLink}" style="color: #7c5e99;">${meetLink}</a></p>` : ""}
    </div>

    <p>Prepare-se para um momento especial de cuidado e equilíbrio! 💜</p>
    <p>Com carinho,<br>Joana Savi</p>
  `;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Lembrete: Sessão ${timeLabel} - ${formatTime(startTime)}`,
    html: baseTemplate(content),
  });
}

/**
 * Send cancellation confirmation
 */
export async function sendCancellationConfirmation(
  to: string,
  appointmentDetails: AppointmentDetails,
  refundInfo: RefundInfo
): Promise<void> {
  const { date, startTime } = appointmentDetails;

  const refundText =
    refundInfo.amount > 0
      ? `<p style="margin: 5px 0;"><strong>💰 Reembolso:</strong> R$${refundInfo.amount.toFixed(2)} (será processado em até 5 dias úteis)</p>`
      : `<p style="margin: 5px 0;"><strong>⚠️ Reembolso:</strong> Cancelamento realizado com menos de 12h de antecedência. Sem direito a reembolso conforme nossa política.</p>`;

  const content = `
    <h2 style="color: #7c5e99; margin-top: 0;">Cancelamento Confirmado</h2>
    <p>Olá${appointmentDetails.userName ? `, ${appointmentDetails.userName}` : ""}!</p>
    <p>Seu agendamento foi cancelado conforme solicitado:</p>
    
    <div style="background-color: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #dc3545;">
      <p style="margin: 5px 0;"><strong>📅 Data cancelada:</strong> ${formatDate(date)} às ${formatTime(startTime)}</p>
      ${refundText}
    </div>

    <p>Espero te ver em breve! Quando desejar, é só agendar novamente. 💜</p>
    <p>Com carinho,<br>Joana Savi</p>
  `;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: `Cancelamento Confirmado - ${formatDate(date)}`,
    html: baseTemplate(content),
  });
}

/**
 * Send feedback request after session
 */
export async function sendFeedbackRequest(
  to: string,
  appointmentDetails: AppointmentDetails
): Promise<void> {
  const { date, startTime } = appointmentDetails;

  const content = `
    <h2 style="color: #7c5e99; margin-top: 0;">Como foi sua sessão? 💜</h2>
    <p>Olá${appointmentDetails.userName ? `, ${appointmentDetails.userName}` : ""}!</p>
    <p>Espero que sua sessão de ${formatDate(date)} tenha sido uma experiência especial!</p>
    <p>Gostaria muito de saber como você se sentiu. Seu feedback me ajuda a melhorar cada vez mais o atendimento.</p>

    <div style="text-align: center; margin: 25px 0;">
      <a href="${APP_URL}/feedback/${appointmentDetails.id}" style="display: inline-block; background: linear-gradient(135deg, #7c5e99 0%, #a78bba 100%); color: white; text-decoration: none; padding: 12px 30px; border-radius: 8px; font-weight: bold;">Deixar Feedback</a>
    </div>

    <p>Agradeço muito pela confiança! 🙏</p>
    <p>Com carinho,<br>Joana Savi</p>
  `;

  await getResend().emails.send({
    from: FROM_EMAIL,
    to,
    subject: "Como foi sua sessão? Adoraria saber! 💜",
    html: baseTemplate(content),
  });
}
