import { db } from "@/lib/db";
import { appBaseUrl } from "@/lib/app-url";

/** Default privacy-consent copy shown beside the upload checkbox. */
export const DEFAULT_CONSENT_TEXT =
  "I agree to upload my photo for a one-time virtual try-on. I understand it is processed only to generate my result, is never saved to any database, and is removed the moment I refresh or close this window.";

/**
 * Fixed cosmetic config served to the embedded widget. Brands no longer
 * customize this; the widget script (public/embed.js) tolerates missing
 * fields, so the shape stays stable for already-deployed embeds.
 */
export const WIDGET_CONFIG = {
  enabled: true,
  buttonLabel: "Try On with AI",
  accentColor: "#0c0c0c",
  consentText: DEFAULT_CONSENT_TEXT,
} as const;

/**
 * Reports whether a brand id maps to a real brand. Callers treat a false
 * result as "store not set up for virtual try-on".
 */
export async function brandExists(brandId: string): Promise<boolean> {
  if (!brandId) return false;
  const brand = await db.brand.findUnique({
    where: { id: brandId },
    select: { id: true },
  });
  return brand !== null;
}

/**
 * Fetches a brand together with its per-IP try-on rate-limit config.
 * Returns null when the brand id is unknown.
 */
export async function getBrandTryOnConfig(brandId: string) {
  if (!brandId) return null;
  return db.brand.findUnique({
    where: { id: brandId },
    select: {
      id: true,
      tryOnLimitEnabled: true,
      tryOnLimitPerIp: true,
      tryOnLimitPeriod: true,
    },
  });
}

export { appBaseUrl };

/** Absolute URL of the embeddable widget script. */
export function widgetScriptSrc(): string {
  return `${appBaseUrl()}/embed.js`;
}

/**
 * CORS headers for the widget API. The request Origin is reflected (not "*")
 * so the browser exposes our JSON bodies — including 403 / unverified
 * responses — to the widget's fetch. `Vary: Origin` keeps caches honest.
 */
export function corsHeaders(origin: string | null): Record<string, string> {
  return {
    "Access-Control-Allow-Origin": origin ?? "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
    "Access-Control-Max-Age": "86400",
  };
}
