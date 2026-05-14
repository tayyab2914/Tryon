import { cookies } from "next/headers";
import { signSession, verifySession } from "@/lib/jwt";
import { db } from "@/lib/db";

const COOKIE_NAME = "fitroom_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export async function createSession(claims: { brandId: string; email: string }) {
  const token = await signSession(claims);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function getCurrentBrand() {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const claims = await verifySession(token);
  if (!claims) return null;
  return db.brand.findUnique({
    where: { id: claims.sub },
    select: { id: true, name: true, email: true, emailVerified: true },
  });
}
