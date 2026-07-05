import "server-only";

import nodemailer from "nodemailer";

function getTransport() {
  const port = Number(process.env.SMTP_PORT ?? 587);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const transport = getTransport();

  await transport.sendMail({
    from: process.env.MAIL_FROM ?? process.env.SMTP_USER,
    to,
    subject: "Reset your Account Sales Admin password",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Reset your password</h2>
        <p>Someone requested a password reset for the Account Sales Admin panel. If this was you, click the button below to choose a new password. This link expires in 1 hour.</p>
        <p style="margin: 24px 0;">
          <a href="${resetUrl}" style="background:#dc2626;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600;">
            Reset password
          </a>
        </p>
        <p style="color:#71717a;font-size:13px;">If you didn't request this, you can safely ignore this email — your password will not change.</p>
        <p style="color:#71717a;font-size:12px;word-break:break-all;">Or paste this link into your browser: ${resetUrl}</p>
      </div>
    `,
  });
}
