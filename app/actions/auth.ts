"use server";

import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, destroySession } from "@/lib/session";
import { sendVerificationEmail } from "@/lib/mail";

export interface FormState {
  error?: string;
  ok?: boolean;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VERIFY_TTL_MS = 1000 * 60 * 60 * 24;

function appUrl(): string {
  return process.env.APP_URL ?? "https://tryon-gold.vercel.app";
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function issueVerificationEmail(brandId: string, email: string) {
  const token = randomBytes(32).toString("hex");
  await db.verificationToken.create({
    data: {
      brandId,
      tokenHash: hashToken(token),
      expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });
  const url = `${appUrl()}/verify?token=${token}`;
  await sendVerificationEmail(email, url);
}

export async function signupAction(_: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("brand") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!name) return { error: "Brand name is required." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid email." };
  if (password.length < 8) return { error: "Password must be at least 8 characters." };

  const existing = await db.brand.findUnique({ where: { email }, select: { id: true } });
  if (existing) return { error: "An account with this email already exists." };

  const passwordHash = await hashPassword(password);
  const brand = await db.brand.create({
    data: { name, email, passwordHash },
    select: { id: true, email: true },
  });

  try {
    await issueVerificationEmail(brand.id, brand.email);
  } catch (err) {
    console.error("verification email failed", err);
    return { error: "Account created but we couldn't send the verification email. Try resending." };
  }

  redirect(`/check-email?email=${encodeURIComponent(email)}`);
}

export async function signinAction(_: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!EMAIL_RE.test(email) || !password) return { error: "Invalid email or password." };

  const brand = await db.brand.findUnique({
    where: { email },
    select: { id: true, email: true, passwordHash: true, emailVerified: true },
  });
  if (!brand) return { error: "Invalid email or password." };

  const ok = await verifyPassword(password, brand.passwordHash);
  if (!ok) return { error: "Invalid email or password." };

  if (!brand.emailVerified) {
    return { error: "Please verify your email before signing in." };
  }

  await createSession({ brandId: brand.id, email: brand.email });
  redirect("/dashboard");
}

export async function signoutAction() {
  await destroySession();
  redirect("/signin");
}

export async function verifyEmailAction(rawToken: string): Promise<{ ok: boolean; reason?: string }> {
  if (!rawToken) return { ok: false, reason: "Missing token." };
  const tokenHash = hashToken(rawToken);
  const record = await db.verificationToken.findUnique({ where: { tokenHash } });
  if (!record) return { ok: false, reason: "Invalid or already-used token." };
  if (record.expiresAt < new Date()) {
    await db.verificationToken.delete({ where: { id: record.id } });
    return { ok: false, reason: "This link has expired. Request a new one." };
  }
  await db.$transaction([
    db.brand.update({ where: { id: record.brandId }, data: { emailVerified: true } }),
    db.verificationToken.deleteMany({ where: { brandId: record.brandId } }),
  ]);
  return { ok: true };
}

export async function resendVerificationAction(email: string): Promise<FormState> {
  const normalized = email.trim().toLowerCase();
  if (!EMAIL_RE.test(normalized)) return { error: "Enter a valid email." };
  const brand = await db.brand.findUnique({
    where: { email: normalized },
    select: { id: true, email: true, emailVerified: true },
  });
  if (!brand || brand.emailVerified) return { ok: true };
  await db.verificationToken.deleteMany({ where: { brandId: brand.id } });
  try {
    await issueVerificationEmail(brand.id, brand.email);
  } catch (err) {
    console.error("verification email failed", err);
    return { error: "Couldn't send email. Try again shortly." };
  }
  return { ok: true };
}
