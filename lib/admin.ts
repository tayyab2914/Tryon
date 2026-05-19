import { db } from "@/lib/db";
import type { DailyPoint } from "@/lib/tryon";

/**
 * Platform-wide aggregation for the super-admin panel. Every function here
 * spans all brands — unlike lib/tryon.ts, which always scopes to one brand.
 */

const DAY_MS = 24 * 60 * 60 * 1000;

export interface PlatformStats {
  brands: number;
  verifiedBrands: number;
  newBrands30d: number;
  tryOns: number;
  tryOns30d: number;
  demoRequests: number;
  verifiedDomains: number;
}

/** Headline counts for the admin overview page. */
export async function getPlatformStats(): Promise<PlatformStats> {
  const since30 = new Date(Date.now() - 30 * DAY_MS);
  const [
    brands,
    verifiedBrands,
    newBrands30d,
    tryOns,
    tryOns30d,
    demoRequests,
    verifiedDomains,
  ] = await Promise.all([
    db.brand.count(),
    db.brand.count({ where: { emailVerified: true } }),
    db.brand.count({ where: { createdAt: { gte: since30 } } }),
    db.tryOn.count(),
    db.tryOn.count({ where: { createdAt: { gte: since30 } } }),
    db.demoRequest.count(),
    db.domain.count({ where: { verified: true } }),
  ]);
  return { brands, verifiedBrands, newBrands30d, tryOns, tryOns30d, demoRequests, verifiedDomains };
}

export interface BrandRow {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  tryOnCount: number;
  domainCount: number;
}

/** Every brand that has signed up, newest first. */
export async function listBrands(): Promise<BrandRow[]> {
  const rows = await db.brand.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { tryOns: true, domains: true } },
    },
  });
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    emailVerified: r.emailVerified,
    createdAt: r.createdAt,
    tryOnCount: r._count.tryOns,
    domainCount: r._count.domains,
  }));
}

/** Full profile for one brand, or null if the id is unknown. */
export async function getBrandDetail(id: string) {
  return db.brand.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      domains: { orderBy: { createdAt: "asc" } },
      _count: { select: { tryOns: true } },
    },
  });
}

/** The most recent try-on events for one brand. */
export async function getBrandRecentTryOns(brandId: string, limit = 20) {
  return db.tryOn.findMany({
    where: { brandId },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

function utcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Daily signup counts across the whole platform over the last `days` days.
 * Every day in the window is pre-seeded so the chart has no gaps.
 */
export async function getSignupDaily(days: number): Promise<DailyPoint[]> {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  since.setUTCDate(since.getUTCDate() - (days - 1));

  const rows = await db.brand.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setUTCDate(d.getUTCDate() + i);
    buckets.set(utcDateKey(d), 0);
  }
  for (const r of rows) {
    const key = utcDateKey(r.createdAt);
    if (buckets.has(key)) buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return [...buckets.entries()].map(([date, count]) => ({
    date,
    label: new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    }),
    count,
  }));
}
