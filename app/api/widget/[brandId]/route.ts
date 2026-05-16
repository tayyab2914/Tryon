import { type NextRequest } from "next/server";
import { corsHeaders, getWidgetConfig } from "@/lib/widget";

// The config drives cosmetics only — the try-on endpoint enforces the real
// `enabled` and domain gates — so a short edge cache is safe and spares the DB.
const CACHE_CONTROL = "public, max-age=60, stale-while-revalidate=300";

function json(body: unknown, status: number, origin: string | null, cache = false) {
  return Response.json(body, {
    status,
    headers: {
      ...corsHeaders(origin),
      ...(cache ? { "Cache-Control": CACHE_CONTROL } : {}),
    },
  });
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

/**
 * Public widget configuration for the embedded script (public/embed.js).
 * Returns the brand's button label, accent color, consent copy, and enabled
 * flag so the storefront widget can render itself with the brand's settings.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ brandId: string }> },
) {
  const origin = request.headers.get("origin");
  try {
    const { brandId } = await params;
    const config = await getWidgetConfig(brandId.trim());
    if (!config) {
      return json({ error: "This store is not set up for virtual try-on." }, 404, origin);
    }
    return json(config, 200, origin, true);
  } catch (err) {
    console.error("widget config lookup failed", err);
    // The widget falls back to defaults on a non-OK response, so a failure
    // here degrades gracefully rather than breaking the storefront.
    return json({ error: "Couldn't load widget configuration." }, 500, origin);
  }
}
