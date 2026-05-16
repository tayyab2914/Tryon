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
  const name = process.env.SMTP_FROM_NAME ?? "FitRoom AI";
  const email = process.env.SMTP_FROM_EMAIL ?? process.env.SMTP_USER ?? "no-reply@fitroom.app";
  return `"${name}" <${email}>`;
}

function appUrl(): string {
  return process.env.APP_URL ?? "https://tryon-gold.vercel.app";
}

/** Inbox that receives "Book a demo" lead notifications. */
function demoNotifyAddress(): string {
  return (
    process.env.DEMO_NOTIFY_EMAIL ??
    process.env.SMTP_FROM_EMAIL ??
    process.env.SMTP_USER ??
    "team@fitroom.app"
  );
}

/** Escapes a string for safe interpolation into HTML email markup. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ============================================================
   Branded email template — FitRoom AI
   Hex colours only; email clients don't support oklch / CSS vars.
   ============================================================ */
const C = {
  ink: "#0e0e10",
  paper: "#f4f2ef",
  white: "#ffffff",
  text: "#26252a",
  muted: "#76746f",
  line: "#ecebe8",
  coral: "#f8613e",
};

const FONT =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";

interface BrandedEmailOptions {
  /** Hidden inbox-preview text. */
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  /** Optional pre-built HTML inserted after the intro (steps, details…). */
  block?: string;
  cta?: { label: string; url: string };
  /** Small muted line beneath the CTA. */
  footnote?: string;
  signoff?: string;
}

function brandedEmail(opts: BrandedEmailOptions): string {
  const cta = opts.cta
    ? `<tr><td style="padding:28px 0 4px;">
         <a href="${esc(opts.cta.url)}" style="display:inline-block;background:${C.ink};color:${C.white};font-size:14px;font-weight:600;text-decoration:none;padding:13px 24px;border-radius:10px;">${esc(opts.cta.label)} &rarr;</a>
       </td></tr>`
    : "";

  const footnote = opts.footnote
    ? `<tr><td style="padding:18px 0 0;font-size:12px;line-height:1.6;color:${C.muted};">${opts.footnote}</td></tr>`
    : "";

  const signoff = opts.signoff
    ? `<tr><td style="padding:26px 0 0;font-size:14px;color:${C.text};">${esc(opts.signoff)}</td></tr>`
    : "";

  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(opts.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};">
  <tr><td align="center" style="padding:36px 16px;">
    <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;max-width:540px;">

      <!-- Header -->
      <tr><td style="background:${C.ink};border-radius:16px 16px 0 0;padding:26px 36px;">
        <span style="font-family:${FONT};font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${C.white};">FitRoom AI<span style="color:${C.coral};">.</span></span>
      </td></tr>

      <!-- Body -->
      <tr><td style="background:${C.white};padding:38px 36px 34px;font-family:${FONT};">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          <tr><td style="font-size:11px;font-weight:700;letter-spacing:0.13em;text-transform:uppercase;color:${C.coral};">${esc(opts.eyebrow)}</td></tr>
          <tr><td style="padding:12px 0 0;font-size:23px;font-weight:700;letter-spacing:-0.02em;line-height:1.25;color:${C.ink};">${esc(opts.heading)}</td></tr>
          <tr><td style="padding:14px 0 0;font-size:15px;line-height:1.62;color:${C.text};">${esc(opts.intro)}</td></tr>
          ${opts.block ? `<tr><td style="padding:24px 0 0;">${opts.block}</td></tr>` : ""}
          ${cta}
          ${footnote}
          ${signoff}
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:${C.white};border-radius:0 0 16px 16px;border-top:1px solid ${C.line};padding:22px 36px;font-family:${FONT};">
        <div style="font-size:13px;font-weight:600;color:${C.ink};">FitRoom AI<span style="color:${C.coral};">.</span></div>
        <div style="padding:4px 0 0;font-size:12px;line-height:1.6;color:${C.muted};">Virtual try-on for fashion brands.</div>
      </td></tr>

      <tr><td style="padding:18px 36px 0;font-family:${FONT};font-size:11px;color:${C.muted};text-align:center;">
        &copy; 2026 FitRoom AI, Inc.
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

/** Renders a numbered "what to expect" list for the email body. */
function stepsBlock(title: string, steps: { title: string; body: string }[]): string {
  const rows = steps
    .map(
      (s, i) => `
      <tr>
        <td width="34" valign="top" style="padding:0 0 ${i === steps.length - 1 ? "0" : "16px"};">
          <div style="width:26px;height:26px;background:${C.coral};border-radius:13px;color:${C.white};font-size:12px;font-weight:700;text-align:center;line-height:26px;font-family:${FONT};">${i + 1}</div>
        </td>
        <td valign="top" style="padding:0 0 ${i === steps.length - 1 ? "0" : "16px"};font-family:${FONT};">
          <div style="font-size:14px;font-weight:600;color:${C.ink};">${esc(s.title)}</div>
          <div style="padding:2px 0 0;font-size:13px;line-height:1.55;color:${C.muted};">${esc(s.body)}</div>
        </td>
      </tr>`,
    )
    .join("");

  return `<div style="background:${C.paper};border:1px solid ${C.line};border-radius:12px;padding:22px 22px 22px;">
    <div style="font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};font-family:${FONT};padding:0 0 16px;">${esc(title)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
  </div>`;
}

/** Renders a label/value details table for the lead-notification email. */
function detailsBlock(rows: [string, string][]): string {
  const body = rows
    .map(
      ([label, value], i) => `
      <tr>
        <td style="padding:11px 0;${i < rows.length - 1 ? `border-bottom:1px solid ${C.line};` : ""}font-family:${FONT};">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${C.muted};">${esc(label)}</div>
          <div style="padding:3px 0 0;font-size:14px;line-height:1.5;color:${C.text};">${value}</div>
        </td>
      </tr>`,
    )
    .join("");

  return `<div style="background:${C.paper};border:1px solid ${C.line};border-radius:12px;padding:6px 22px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${body}</table>
  </div>`;
}

/* ============================================================
   Email senders
   ============================================================ */

export async function sendVerificationEmail(to: string, verifyUrl: string) {
  await getTransporter().sendMail({
    from: fromHeader(),
    to,
    subject: "Verify your FitRoom AI email",
    text: `Welcome to FitRoom AI!\n\nConfirm your email by visiting:\n${verifyUrl}\n\nThis link expires in 24 hours.`,
    html: brandedEmail({
      preheader: "Confirm your email to activate your FitRoom AI account.",
      eyebrow: "Verify email",
      heading: "Confirm your email",
      intro: "Welcome to FitRoom AI. Confirm your address to activate your brand account and start shipping virtual try-on.",
      cta: { label: "Verify email", url: verifyUrl },
      footnote: `Or paste this link into your browser:<br><span style="word-break:break-all;color:${C.text};">${esc(verifyUrl)}</span><br>This link expires in 24 hours.`,
    }),
  });
}

export interface DemoRequestDetails {
  name: string;
  email: string;
  company: string;
  website?: string;
  catalogSize?: string;
  message?: string;
}

/** Confirmation sent to the person who booked a demo. */
export async function sendDemoConfirmation(details: DemoRequestDetails) {
  const firstName = details.name.split(/\s+/)[0] || details.name;
  await getTransporter().sendMail({
    from: fromHeader(),
    to: details.email,
    subject: "Your FitRoom AI demo — we'll be in touch",
    text:
      `Hi ${firstName},\n\n` +
      `Thanks for booking a demo with FitRoom AI. A member of our team will reach out within one business day to lock in a time.\n\n` +
      `What to expect:\n` +
      `1. Share five SKUs — send links or images, or bring them to the call.\n` +
      `2. Watch them render — photoreal try-on on real shopper photos, live.\n` +
      `3. Walk away with results — keep the renders, a fit report, and an install plan.\n\n` +
      `— The FitRoom AI team`,
    html: brandedEmail({
      preheader: "We received your demo request — here's what happens next.",
      eyebrow: "Demo request",
      heading: `You're on the list, ${firstName}.`,
      intro:
        "Thanks for booking a demo with FitRoom AI. A member of our team will reach out within one business day to lock in a time that works for you.",
      block: stepsBlock("What to expect", [
        { title: "Share five SKUs", body: "Send links or images ahead of time — or bring them to the call." },
        { title: "Watch them render", body: "Photoreal try-on on real shopper photos, generated live in seconds." },
        { title: "Walk away with results", body: "Keep every render, a fit report, and a five-minute install plan." },
      ]),
      cta: { label: "Explore FitRoom AI", url: appUrl() },
      signoff: "— The FitRoom AI team",
    }),
  });
}

/** Lead notification sent to the FitRoom AI team for a new demo request. */
export async function sendDemoNotification(details: DemoRequestDetails) {
  const dash = `<span style="color:${C.muted};">—</span>`;
  const messageHtml = details.message
    ? esc(details.message).replace(/\n/g, "<br>")
    : dash;

  await getTransporter().sendMail({
    from: fromHeader(),
    to: demoNotifyAddress(),
    replyTo: `"${details.name}" <${details.email}>`,
    subject: `New demo request — ${details.company}`,
    text:
      `New demo request\n\n` +
      `Name: ${details.name}\n` +
      `Email: ${details.email}\n` +
      `Company: ${details.company}\n` +
      `Website: ${details.website || "—"}\n` +
      `Catalog size: ${details.catalogSize || "—"}\n` +
      `Message: ${details.message || "—"}\n\n` +
      `Reply to this email to reach them directly.`,
    html: brandedEmail({
      preheader: `${details.name} from ${details.company} requested a demo.`,
      eyebrow: "New lead",
      heading: "New demo request",
      intro: `${details.name} from ${details.company} just requested a demo. Reply to this email to reach them directly.`,
      block: detailsBlock([
        ["Name", esc(details.name)],
        ["Email", `<a href="mailto:${esc(details.email)}" style="color:${C.coral};text-decoration:none;">${esc(details.email)}</a>`],
        ["Company", esc(details.company)],
        ["Website", details.website ? esc(details.website) : dash],
        ["Catalog size", details.catalogSize ? esc(details.catalogSize) : dash],
        ["Message", messageHtml],
      ]),
    }),
  });
}
