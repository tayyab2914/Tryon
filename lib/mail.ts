import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function getTransporter(): Transporter {
  if (cached) return cached;
  cached = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  return cached;
}

function fromHeader(): string {
  const name = process.env.SMTP_FROM_NAME ?? "FitRoom";
  const email = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? "no-reply@fitroom.app";
  return `"${name}" <${email}>`;
}

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: fromHeader(),
    to,
    subject: "Verify your FitRoom email",
    text: `Welcome to FitRoom!\n\nConfirm your email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;color:#0c0c0c">
        <h1 style="font-size:20px;font-weight:600;letter-spacing:-0.02em;margin:0 0 12px">Verify your email</h1>
        <p style="font-size:14px;line-height:1.55;color:#5a5854;margin:0 0 20px">Welcome to FitRoom. Confirm your address to activate your brand account.</p>
        <a href="${verifyUrl}" style="display:inline-block;background:#0c0c0c;color:#faf9f5;padding:11px 18px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:500">Verify email</a>
        <p style="font-size:12px;line-height:1.5;color:#8a8784;margin:24px 0 0">Or paste this link: <span style="word-break:break-all">${verifyUrl}</span></p>
        <p style="font-size:12px;color:#8a8784;margin:8px 0 0">This link expires in 24 hours.</p>
      </div>
    `,
  });
}
