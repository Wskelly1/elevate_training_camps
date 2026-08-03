import nodemailer from 'nodemailer';

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

interface SendMailOptions {
  to: string;
  /** Newsletter sends batch recipients here so addresses stay hidden from each other. */
  bcc?: string[];
  subject: string;
  html: string;
  text: string;
}

export async function sendMail({ to, bcc, subject, html, text }: SendMailOptions) {
  return getTransporter().sendMail({
    from: `"Elevate Training Camps" <${process.env.GMAIL_FROM_EMAIL}>`,
    to,
    ...(bcc && bcc.length > 0 ? { bcc } : {}),
    subject,
    html,
    text,
  });
}
