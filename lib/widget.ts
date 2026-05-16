import { db } from "@/lib/db";

export interface WidgetConfig {
  enabled: boolean;
  buttonLabel: string;
  accentColor: string;
  consentText: string;
}

/** Default privacy-consent copy shown beside the upload checkbox. */
export const DEFAULT_CONSENT_TEXT =
  "I agree to upload my photo for a one-time virtual try-on. I understand it is processed only to generate my result, is never saved to any database, and is removed the moment I refresh or close this window.";

const DEFAULTS: Omit<WidgetConfig, "enabled"> = {
  buttonLabel: "Try On with AI",
  accentColor: "#0c0c0c",
  consentText: DEFAULT_CONSENT_TEXT,
};

/**
 * Resolves a brand's public widget configuration. Returns null when the
 * brand id is unknown — callers should treat that as "store not set up".
 */
export async function getWidgetConfig(brandId: string): Promise<WidgetConfig | null> {
  const brand = await db.brand.findUnique({
    where: { id: brandId },
    select: { id: true, widgetSettings: true },
  });
  if (!brand) return null;

  const s = brand.widgetSettings;
  return {
    enabled: s?.enabled ?? true,
    buttonLabel: s?.buttonLabel?.trim() || DEFAULTS.buttonLabel,
    accentColor: s?.accentColor?.trim() || DEFAULTS.accentColor,
    consentText: s?.consentText?.trim() || DEFAULTS.consentText,
  };
}

/** Absolute base URL of this app, with no trailing slash. */
export function appBaseUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

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
