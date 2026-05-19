import { randomUUID } from "node:crypto";
import { db } from "@/lib/db";
import { runTryOn as generateTryOn } from "@/lib/gemini";

/** A raw image buffer plus its MIME type. */
export interface ImageInput {
  data: Buffer;
  mimeType: string;
}

export interface RunTryOnInput {
  brandId: string;
  /** Human-readable product label for the dashboard event log. */
  productLabel?: string;
  /** Salted hash of the shopper's IP, for per-IP rate-limit accounting. */
  ipHash?: string | null;
  personImage: ImageInput;
  garmentImage: ImageInput;
}

export interface RunTryOnResult {
  image: ImageInput;
}

/**
 * Runs one virtual try-on through the Gemini engine (lib/gemini.ts).
 *
 * Privacy: no image — uploaded or generated — is ever persisted. Only a
 * lightweight, image-free event row is written so brands can see try-on
 * volume in their dashboard.
 */
export async function runTryOn(input: RunTryOnInput): Promise<RunTryOnResult> {
  try {
    const result = await generateTryOn({
      personBase64: input.personImage.data.toString("base64"),
      personMimeType: input.personImage.mimeType,
      garmentBase64: input.garmentImage.data.toString("base64"),
      garmentMimeType: input.garmentImage.mimeType,
    });
    await logEvent(input.brandId, input.productLabel, "COMPLETED", null, input.ipHash);
    return {
      image: {
        data: Buffer.from(result.imageBase64, "base64"),
        mimeType: result.mimeType,
      },
    };
  } catch (err) {
    const detail = err instanceof Error ? err.message.slice(0, 200) : "error";
    await logEvent(input.brandId, input.productLabel, "FAILED", detail, input.ipHash);
    throw err;
  }
}

/** Writes an image-free analytics row. Never throws into the request path. */
async function logEvent(
  brandId: string,
  productLabel: string | undefined,
  status: "COMPLETED" | "FAILED",
  error: string | null,
  ipHash?: string | null,
): Promise<void> {
  try {
    await db.tryOn.create({
      data: {
        brandId,
        garment: productLabel?.trim() || "Virtual try-on",
        shopper: `anon_${randomUUID().slice(0, 4)}`,
        status,
        error,
        ipHash: ipHash ?? null,
      },
    });
  } catch (err) {
    console.error("try-on event log failed", err);
  }
}

export interface TryOnStats {
  total: number;
  last30Days: number;
  avgPerDay: number;
}

/** Aggregate try-on counts for a brand's dashboard. */
export async function getTryOnStats(brandId: string): Promise<TryOnStats> {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const [total, last30Days] = await Promise.all([
    db.tryOn.count({ where: { brandId } }),
    db.tryOn.count({ where: { brandId, createdAt: { gte: thirtyDaysAgo } } }),
  ]);
  return { total, last30Days, avgPerDay: Math.round(last30Days / 30) };
}

export interface DailyPoint {
  /** ISO date, YYYY-MM-DD (UTC). */
  date: string;
  /** Short human label, e.g. "May 16". */
  label: string;
  count: number;
}

export interface ProductCount {
  label: string;
  count: number;
}

export interface Analytics {
  periodDays: number;
  total: number;
  completed: number;
  failed: number;
  processing: number;
  /** Completed / (completed + failed), as a 0-100 percentage. */
  successRate: number;
  daily: DailyPoint[];
  topProducts: ProductCount[];
}

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Aggregates a brand's try-on activity over the last `periodDays` days for the
 * analytics dashboard. One query; bucketing is done in memory.
 */
export async function getAnalytics(brandId: string, periodDays: number): Promise<Analytics> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (periodDays - 1));

  const rows = await db.tryOn.findMany({
    where: { brandId, createdAt: { gte: since } },
    select: { createdAt: true, status: true, garment: true },
  });

  // Pre-seed every day in the window so the chart has no gaps.
  const buckets = new Map<string, number>();
  for (let i = 0; i < periodDays; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    buckets.set(utcDateKey(d), 0);
  }

  let completed = 0;
  let failed = 0;
  let processing = 0;
  const products = new Map<string, number>();

  for (const row of rows) {
    const key = utcDateKey(row.createdAt);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);

    if (row.status === "COMPLETED") completed++;
    else if (row.status === "FAILED") failed++;
    else processing++;

    products.set(row.garment, (products.get(row.garment) ?? 0) + 1);
  }

  const daily: DailyPoint[] = [...buckets.entries()].map(([date, count]) => ({
    date,
    label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    count,
  }));

  const finished = completed + failed;
  const topProducts: ProductCount[] = [...products.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    periodDays,
    total: rows.length,
    completed,
    failed,
    processing,
    successRate: finished ? Math.round((completed / finished) * 100) : 0,
    daily,
    topProducts,
  };
}
