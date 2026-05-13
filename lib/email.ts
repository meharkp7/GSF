import nodemailer from "nodemailer";

export type EmailPayload = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export async function sendEmail({ to, subject, text, html }: EmailPayload) {
  // If SMTP not configured, do a no-op but log so deployments don't fail.
  const host = process.env.SMTP_HOST;
  if (!host) {
    // eslint-disable-next-line no-console
    console.warn("SMTP not configured; skipping email to", to, "subject:", subject);
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: host,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });

  const from = process.env.EMAIL_FROM || `no-reply@${process.env.NEXT_PUBLIC_HOST || "localhost"}`;

  const info = await transporter.sendMail({
    from,
    to,
    subject,
    text,
    html,
  });

  return info;
}
