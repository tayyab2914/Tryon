import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";

/**
 * Platform super-admin session — completely separate from brand sessions
 * (lib/session.ts). Access is gated by the ADMIN_PASSWORD env var; there is
 * no admin row in the database and no way to sign up into it.
 */

const COOKIE_NAME = "fitroom_admin";
const MAX_AGE_SECONDS = 60 * 60 * 12; // 12 hours
const ISSUER = "fitroom";
const AUDIENCE = "fitroom-superadmin";

function secretKey() {
  const raw = process.env.JWT_SECRET;
  if (!raw) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(raw);
}

/** The configured admin password, or null when admin login is disabled. */
function adminPassword(): string | null {
  const raw = process.env.ADMIN_PASSWORD;
  return raw && raw.trim().length > 0 ? raw : null;
}

/** Whether the admin panel is usable at all (password configured). */
export function isAdminEnabled(): boolean {
  return adminPassword() !== null;
}

/**
 * Constant-time password check. Hashes both sides so inputs of differing
 * length don't leak through `timingSafeEqual`'s length requirement. An unset
 * ADMIN_PASSWORD always fails — admin login is disabled, never open.
 */
export function checkAdminPassword(input: string): boolean {
  const expected = adminPassword();
  if (!expected) return false;
  const a = createHash("sha256").update(input).digest();
  const b = createHash("sha256").update(expected).digest();
  return timingSafeEqual(a, b);
}

export async function createAdminSession(): Promise<void> {
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject("admin")
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("12h")
    .sign(secretKey());

  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroyAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secretKey(), { issuer: ISSUER, audience: AUDIENCE });
    return true;
  } catch {
    return false;
  }
}
