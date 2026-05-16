import Link from "next/link";
import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { getCurrentBrand } from "@/lib/session";
import { getAnalytics } from "@/lib/tryon";
import { cn } from "@/lib/cn";

export const metadata = { title: "Analytics · FitRoom AI" };

const PERIODS = [
  { key: "7d", days: 7, label: "7 days" },
  { key: "30d", days: 30, label: "30 days" },
  { key: "90d", days: 90, label: "90 days" },
] as const;

const DEFAULT_PERIOD = PERIODS[1];

interface Props {
  searchParams: Promise<{ period?: string }>;
}

export default async function AnalyticsPage({ searchParams }: Props) {
  const { period } = await searchParams;
  const active = PERIODS.find((p) => p.key === period) ?? DEFAULT_PERIOD;

  const brand = await getCurrentBrand();
  const data = brand ? await getAnalytics(brand.id, active.days) : null;

  const periodSwitcher = (
    <div className="inline-flex rounded-[10px] border border-line bg-surface p-0.5">
      {PERIODS.map((p) => (
        <Link
          key={p.key}
          href={`/analytics?period=${p.key}`}
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
      <Topbar
        title="Analytics"
        description="How shoppers are engaging with your try-on widget."
        action={periodSwitcher}
      />
      <PageShell>
        {!data || data.total === 0 ? (
          <EmptyState
            title="No try-on activity yet"
            description={`No try-ons in the last ${active.days} days. Once your widget is live on a storefront, engagement shows up here.`}
          />
        ) : (
          <>
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label={`Try-ons (${active.label})`} value={data.total.toLocaleString()} />
              <StatCard label="Completed" value={data.completed.toLocaleString()} />
              <StatCard label="Failed" value={data.failed.toLocaleString()} />
              <StatCard label="Success rate" value={`${data.successRate}%`} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="lg:col-span-2 p-5 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[15px] font-semibold tracking-tight text-ink">Try-ons over time</h3>
                  <span className="text-xs text-muted">Last {active.label}</span>
                </div>
                <BarChart data={data.daily} />
              </Card>

              <Card className="p-5 flex flex-col gap-4">
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">Top products</h3>
                {data.topProducts.length === 0 ? (
                  <p className="text-sm text-muted">No products tried on yet.</p>
                ) : (
                  <ul className="flex flex-col gap-3">
                    {data.topProducts.map((p) => {
                      const pct = Math.round((p.count / data.topProducts[0].count) * 100);
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
          </>
        )}
      </PageShell>
    </>
  );
}
