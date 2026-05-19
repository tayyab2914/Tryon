import Link from "next/link";
import { notFound } from "next/navigation";
import type { TryOnStatus } from "@prisma/client";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { BrandActions } from "@/components/admin/BrandActions";
import { getBrandDetail, getBrandRecentTryOns } from "@/lib/admin";
import { getAnalytics } from "@/lib/tryon";
import { cn } from "@/lib/cn";

const PERIODS = [
  { key: "7d", days: 7, label: "7 days" },
  { key: "30d", days: 30, label: "30 days" },
  { key: "90d", days: 90, label: "90 days" },
] as const;

const DEFAULT_PERIOD = PERIODS[1];

const statusClass: Record<TryOnStatus, string> = {
  COMPLETED: "bg-accent-soft text-ink",
  PROCESSING: "bg-line text-muted",
  FAILED: "bg-red-50 text-danger",
};

function formatDateTime(date: Date): string {
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ period?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const brand = await getBrandDetail(id);
  return { title: brand ? `${brand.name} · FitRoom AI admin` : "Brand · FitRoom AI admin" };
}

export default async function AdminBrandDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { period } = await searchParams;
  const active = PERIODS.find((p) => p.key === period) ?? DEFAULT_PERIOD;

  const brand = await getBrandDetail(id);
  if (!brand) notFound();

  const [analytics, recentTryOns] = await Promise.all([
    getAnalytics(brand.id, active.days),
    getBrandRecentTryOns(brand.id, 25),
  ]);

  const periodSwitcher = (
    <div className="inline-flex rounded-[10px] border border-line bg-surface p-0.5">
      {PERIODS.map((p) => (
        <Link
          key={p.key}
          href={`/admin/brands/${brand.id}?period=${p.key}`}
          className={cn(
            "rounded-[8px] px-3 py-1 text-xs font-medium transition-colors",
            p.key === active.key ? "bg-ink text-canvas" : "text-muted hover:text-ink",
          )}
        >
          {p.label}
        </Link>
      ))}
    </div>
  );

  return (
    <>
      <AdminTopbar title={brand.name} description={brand.email} action={periodSwitcher} />
      <PageShell>
        <Link href="/admin/brands" className="text-sm text-muted hover:text-ink">
          ← All brands
        </Link>

        <Card className="p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3 text-sm">
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">Email status</dt>
                <dd>
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2 py-0.5 text-xs",
                      brand.emailVerified ? "bg-accent-soft text-ink" : "bg-line text-muted",
                    )}
                  >
                    {brand.emailVerified ? "verified" : "unverified"}
                  </span>
                </dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">Signed up</dt>
                <dd className="text-ink">{formatDateTime(brand.createdAt)}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">Try-ons (all time)</dt>
                <dd className="text-ink tabular-nums">{brand._count.tryOns.toLocaleString()}</dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-xs uppercase tracking-wide text-muted">Brand ID</dt>
                <dd className="text-ink font-mono text-xs">{brand.id}</dd>
              </div>
            </dl>
          </div>
          <div className="border-t border-line pt-4">
            <BrandActions
              brandId={brand.id}
              brandName={brand.name}
              emailVerified={brand.emailVerified}
            />
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-1.5">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">
            Per-visitor try-on limit
          </h3>
          <p className="text-sm text-muted">
            {brand.tryOnLimitEnabled
              ? `${brand.tryOnLimitPerIp} try-on${
                  brand.tryOnLimitPerIp === 1 ? "" : "s"
                } per shopper IP, resetting ${
                  brand.tryOnLimitPeriod === "MONTHLY" ? "every month" : "every day"
                }. The brand manages this in its own settings.`
              : "Disabled — this brand allows unlimited try-ons per shopper."}
          </p>
        </Card>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label={`Try-ons (${active.label})`} value={analytics.total.toLocaleString()} />
          <StatCard label="Completed" value={analytics.completed.toLocaleString()} />
          <StatCard label="Failed" value={analytics.failed.toLocaleString()} />
          <StatCard label="Success rate" value={`${analytics.successRate}%`} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                Try-ons over time
              </h3>
              <span className="text-xs text-muted">Last {active.label}</span>
            </div>
            <BarChart data={analytics.daily} />
          </Card>

          <Card className="p-5 flex flex-col gap-4">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Top products</h3>
            {analytics.topProducts.length === 0 ? (
              <p className="text-sm text-muted">No products tried on yet.</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {analytics.topProducts.map((p) => {
                  const pct = Math.round((p.count / analytics.topProducts[0].count) * 100);
                  return (
                    <li key={p.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-ink truncate">{p.label}</span>
                        <span className="text-sm text-muted tabular-nums">{p.count}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-ink" style={{ width: `${pct}%` }} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Card>
        </section>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">
              Domains ({brand.domains.length})
            </h3>
          </div>
          {brand.domains.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted">
              This brand hasn&apos;t connected a domain yet.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-2.5 font-medium">Hostname</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium text-right">Added</th>
                </tr>
              </thead>
              <tbody>
                {brand.domains.map((d) => (
                  <tr key={d.id} className="border-t border-line">
                    <td className="px-5 py-3 text-ink font-mono text-xs">{d.hostname}</td>
                    <td className="px-5 py-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs",
                          d.verified ? "bg-accent-soft text-ink" : "bg-line text-muted",
                        )}
                      >
                        {d.verified ? "verified" : "pending"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted">
                      {d.createdAt.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b border-line">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Recent try-ons</h3>
          </div>
          {recentTryOns.length === 0 ? (
            <p className="px-5 py-4 text-sm text-muted">No try-on activity recorded yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-2.5 font-medium">Product</th>
                  <th className="px-5 py-2.5 font-medium">Shopper</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium text-right">When</th>
                </tr>
              </thead>
              <tbody>
                {recentTryOns.map((t) => (
                  <tr key={t.id} className="border-t border-line">
                    <td className="px-5 py-3 text-ink">{t.garment}</td>
                    <td className="px-5 py-3 text-muted font-mono text-xs">{t.shopper}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs ${statusClass[t.status]}`}
                      >
                        {t.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right text-muted">
                      {formatDateTime(t.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </PageShell>
    </>
  );
}
