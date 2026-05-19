import { type NextRequest } from "next/server";
import { getBrandTryOnConfig, corsHeaders } from "@/lib/widget";
import { getVerifiedHostnames, isOriginAllowed } from "@/lib/domain";
import { runTryOn, type ImageInput } from "@/lib/tryon";
import { checkIpLimit, ipHashFromHeaders, periodLabel } from "@/lib/rate-limit";

// Gemini image generation can take ~10-30s; allow generous headroom.
export const maxDuration = 300;

const MAX_IMAGE_BYTES = 12 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

function json(body: unknown, status: number, origin: string | null) {
  return Response.json(body, { status, headers: corsHeaders(origin) });
}

export async function OPTIONS(request: NextRequest) {
  return new Response(null, { status: 204, headers: corsHeaders(request.headers.get("origin")) });
}

/**
 * Try-on endpoint called by the embedded widget (public/embed.js).
 * Accepts a shopper photo + product image URL, runs the Gemini try-on,
 * and returns the composite inline. No image is ever stored.
 */
export async function POST(request: NextRequest) {
  // Read the origin first so the catch block can still attach CORS headers.
  const origin = request.headers.get("origin");
  try {
    const form = await request.formData();
    const brandId = String(form.get("brandId") ?? "").trim();
    const garmentUrl = String(form.get("garmentImageUrl") ?? "").trim();
    const productLabel = String(form.get("productId") ?? "").trim() || undefined;
    const photo = form.get("photo");

    // --- Brand gate ---
    const brand = await getBrandTryOnConfig(brandId);
    if (!brand) {
      return json(
        { success: false, error: "This store is not set up for virtual try-on." },
        403,
        origin,
      );
    }

    // --- Domain gate: generation only runs from verified origins ---
    if (!isOriginAllowed(origin, await getVerifiedHostnames(brandId))) {
      return json(
        {
          success: false,
          error: "This domain isn't verified for virtual try-on. Verify it in your FitRoom dashboard.",
          code: "DOMAIN_NOT_VERIFIED",
        },
        403,
        origin,
      );
    }

    // --- Per-IP rate limit: cap how many try-ons one shopper can generate ---
    const ipHash = ipHashFromHeaders(request.headers);
    const limit = await checkIpLimit(brand.id, ipHash, {
      enabled: brand.tryOnLimitEnabled,
      perIp: brand.tryOnLimitPerIp,
      period: brand.tryOnLimitPeriod,
    });
    if (!limit.allowed) {
      return json(
        {
          success: false,
          error: `You've reached the try-on limit for this store (${limit.limit} per visitor ${periodLabel(limit.period)}). Please try again later.`,
          code: "RATE_LIMITED",
        },
        429,
        origin,
      );
    }

    // --- Validate the uploaded photo ---
    if (!(photo instanceof File) || photo.size === 0) {
      return json({ success: false, error: "Please choose a photo to try on." }, 400, origin);
    }
    if (photo.size > MAX_IMAGE_BYTES) {
      return json({ success: false, error: "That photo is too large (max 12 MB)." }, 400, origin);
    }
    if (!ALLOWED_TYPES.includes(photo.type)) {
      return json(
        { success: false, error: "Please upload a JPEG, PNG, or WebP image." },
        400,
        origin,
      );
    }

    // --- Validate + fetch the garment image ---
    if (!/^https?:\/\//i.test(garmentUrl)) {
      return json({ success: false, error: "This product is missing its image." }, 400, origin);
    }
    const garmentImage = await fetchGarment(garmentUrl);
    if (!garmentImage) {
      return json(
        { success: false, error: "We couldn't load this product's image. Please try again." },
        400,
        origin,
      );
    }

    const personImage: ImageInput = {
      data: Buffer.from(await photo.arrayBuffer()),
      mimeType: photo.type,
    };

    const { image } = await runTryOn({ brandId, productLabel, ipHash, personImage, garmentImage });

    // Result is returned inline and never stored anywhere.
    return json(
      {
        success: true,
        resultImage: `data:${image.mimeType};base64,${image.data.toString("base64")}`,
      },
      200,
      origin,
    );
  } catch (err) {
    console.error("widget try-on failed", err);
    return json(
      {
        success: false,
        error: "Something went wrong generating your try-on. Please try a different photo.",
      },
      500,
      origin,
    );
  }
}

/** Fetches the brand's product image. Returns null on any failure. */
async function fetchGarment(url: string): Promise<ImageInput | null> {
  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "image/*" },
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return null;
  }
  if (!response.ok) return null;

  const contentType = (response.headers.get("content-type") ?? "").split(";")[0].trim();
  if (!contentType.startsWith("image/")) return null;

  const data = Buffer.from(await response.arrayBuffer());
  if (data.length === 0 || data.length > MAX_IMAGE_BYTES) return null;

  return { data, mimeType: contentType };
}
