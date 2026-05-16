import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { InstallSnippet } from "@/components/dashboard/InstallSnippet";
import { RecentTryOns } from "@/components/dashboard/RecentTryOns";
import { getCurrentBrand } from "@/lib/session";
import { getTryOnStats } from "@/lib/tryon";
import { appBaseUrl, widgetScriptSrc } from "@/lib/widget";

export const metadata = { title: "Overview · FitRoom AI" };

export default async function DashboardPage() {
  const brand = await getCurrentBrand();
  const stats = brand
    ? await getTryOnStats(brand.id)
    : { total: 0, last30Days: 0, avgPerDay: 0 };

  return (
    <>
      <Topbar
        title="Overview"
        description="What's happening with your try-on widget today."
      />
      <PageShell>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Try-ons (30d)" value={stats.last30Days.toLocaleString()} />
          <StatCard label="Avg per day" value={stats.avgPerDay.toLocaleString()} />
          <StatCard label="Try-ons (all time)" value={stats.total.toLocaleString()} />
          <StatCard label="Plan" value="Free" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentTryOns />
          </div>
          <div className="flex flex-col gap-4">
            <InstallSnippet
              scriptSrc={widgetScriptSrc()}
              apiBase={appBaseUrl()}
              brandId={brand?.id ?? ""}
            />
          </div>
        </section>
      </PageShell>
    </>
  );
}
