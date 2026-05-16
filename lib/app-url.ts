/**
 * Canonical absolute base URL of this app.
 *
 * Resolution order:
 *  1. APP_URL env var — unless it points at localhost (a stale dev value
 *     must never leak into emails or the install snippet).
 *  2. VERCEL_PROJECT_PRODUCTION_URL — injected automatically on Vercel.
 *  3. The known production domain as a last resort.
 */
const PRODUCTION_URL = "https://tryon-gold.vercel.app";

const isLocal = (url: string): boolean =>
  /localhost|127\.0\.0\.1|0\.0\.0\.0/.test(url);

/** Absolute base URL of this app, with no trailing slash. */
export function appBaseUrl(): string {
  const fromEnv = process.env.APP_URL?.trim().replace(/\/+$/, "");
  if (fromEnv && !isLocal(fromEnv)) return fromEnv;

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return PRODUCTION_URL;
}
