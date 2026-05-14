import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/Button";
import { RecentTryOns } from "@/components/dashboard/RecentTryOns";

export const metadata = { title: "Try-ons · FitRoom" };

const FILTERS = ["All", "Completed", "Processing", "Failed"] as const;

export default function TryOnsPage() {
  return (
    <>
      <Topbar
        title="Try-ons"
        description="Every try-on session your shoppers have started."
        action={<Button size="sm" variant="secondary">Export CSV</Button>}
      />
      <PageShell>
        <div className="flex items-center gap-2">
          {FILTERS.map((f, i) => (
            <button
              key={f}
              className={
                i === 0
                  ? "rounded-full bg-ink text-canvas px-3.5 py-1.5 text-xs font-medium"
                  : "rounded-full border border-line bg-surface text-muted hover:text-ink hover:border-line-strong px-3.5 py-1.5 text-xs font-medium transition-colors"
              }
            >
              {f}
            </button>
          ))}
        </div>
        <RecentTryOns />
      </PageShell>
    </>
  );
}
