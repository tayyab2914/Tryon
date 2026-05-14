import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { StatCard } from "@/components/dashboard/StatCard";
import { InstallSnippet } from "@/components/dashboard/InstallSnippet";
import { RecentTryOns } from "@/components/dashboard/RecentTryOns";

export const metadata = { title: "Overview · FitRoom" };

export default function DashboardPage() {
  return (
    <>
      <Topbar
        title="Overview"
        description="What's happening with your try-on widget today."
      />
      <PageShell>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Try-ons (30d)" value="12,438" delta={{ value: "18%", positive: true }} />
          <StatCard label="Avg per day" value="414" delta={{ value: "9%", positive: true }} />
          <StatCard label="Conversion lift" value="+24%" delta={{ value: "3%", positive: true }} />
          <StatCard label="Plan" value="Free" />
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <RecentTryOns />
          </div>
          <div className="flex flex-col gap-4">
            <InstallSnippet />
          </div>
        </section>
      </PageShell>
    </>
  );
}
