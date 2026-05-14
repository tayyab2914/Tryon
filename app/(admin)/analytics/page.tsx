import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { StatCard } from "@/components/dashboard/StatCard";

export const metadata = { title: "Analytics · FitRoom" };

const PERIODS = ["24h", "7d", "30d", "90d"] as const;

export default function AnalyticsPage() {
  return (
    <>
      <Topbar
        title="Analytics"
        description="How shoppers are engaging with your try-on widget."
        action={
          <div className="inline-flex rounded-[10px] border border-line bg-surface p-0.5">
            {PERIODS.map((p, i) => (
              <button
                key={p}
                className={
                  i === 2
                    ? "rounded-[8px] bg-ink text-canvas px-3 py-1 text-xs font-medium"
                    : "rounded-[8px] text-muted hover:text-ink px-3 py-1 text-xs font-medium transition-colors"
                }
              >
                {p}
              </button>
            ))}
          </div>
        }
      />
      <PageShell>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Try-ons" value="12,438" delta={{ value: "18%", positive: true }} />
          <StatCard label="Unique shoppers" value="3,209" delta={{ value: "12%", positive: true }} />
          <StatCard label="Add-to-cart lift" value="+19%" delta={{ value: "2%", positive: true }} />
          <StatCard label="Avg session" value="42s" delta={{ value: "4s", positive: true }} />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">Try-ons over time</h3>
              <span className="text-xs text-muted">Last 30 days</span>
            </div>
            <div className="h-48 rounded-[10px] bg-canvas border border-dashed border-line flex items-center justify-center text-xs text-muted">
              Chart goes here once analytics is wired up.
            </div>
          </Card>
          <Card className="p-5 flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Top garments</h3>
            <div className="h-48 rounded-[10px] bg-canvas border border-dashed border-line flex items-center justify-center text-xs text-muted">
              Ranked list goes here.
            </div>
          </Card>
        </section>
      </PageShell>
    </>
  );
}
