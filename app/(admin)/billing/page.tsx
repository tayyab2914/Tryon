import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata = { title: "Billing · FitRoom" };

const PLANS = [
  { name: "Free", price: "$0", tryons: "200 try-ons / month", current: true },
  { name: "Growth", price: "$49", tryons: "5,000 try-ons / month", current: false },
  { name: "Scale", price: "$199", tryons: "50,000 try-ons / month", current: false },
];

export default function BillingPage() {
  return (
    <>
      <Topbar title="Billing" description="Manage your plan, usage, and invoices." />
      <PageShell>
        <Card className="p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">Current usage</h3>
              <p className="text-sm text-muted">This month, resets on the 1st.</p>
            </div>
            <span className="text-sm font-medium text-ink">142 / 200</span>
          </div>
          <div className="h-2 w-full rounded-full bg-line overflow-hidden">
            <div className="h-full bg-ink" style={{ width: "71%" }} />
          </div>
        </Card>

        <section className="flex flex-col gap-3">
          <h2 className="text-[15px] font-semibold tracking-tight text-ink">Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PLANS.map((plan) => (
              <Card key={plan.name} className="p-5 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-ink">{plan.name}</span>
                  {plan.current && (
                    <span className="text-[11px] text-ink bg-accent-soft px-2 py-0.5 rounded-full">Current</span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[28px] font-semibold tracking-tight text-ink">{plan.price}</span>
                  <span className="text-xs text-muted">/ mo</span>
                </div>
                <span className="text-sm text-muted">{plan.tryons}</span>
                <Button size="sm" variant={plan.current ? "secondary" : "primary"} className="mt-1">
                  {plan.current ? "Current plan" : "Upgrade"}
                </Button>
              </Card>
            ))}
          </div>
        </section>

        <Card className="p-5 flex items-center justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Payment method</h3>
            <p className="text-sm text-muted">No card on file.</p>
          </div>
          <Button size="sm" variant="secondary">Add card</Button>
        </Card>
      </PageShell>
    </>
  );
}
