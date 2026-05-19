import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart } from "@/components/dashboard/BarChart";
import { getPlatformStats, getSignupDaily, listBrands } from "@/lib/admin";

export const metadata = { title: "Admin overview · FitRoom AI" };

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function AdminOverviewPage() {
  const [stats, signups, brands] = await Promise.all([
    getPlatformStats(),
    getSignupDaily(30),
    listBrands(),
  ]);
  const recent = brands.slice(0, 8);
  const signupTotal = signups.reduce((sum, d) => sum + d.count, 0);

  return (
    <>
      <AdminTopbar
        title="Platform overview"
        description="Signups and activity across every brand on FitRoom AI."
      />
      <PageShell>
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total brands" value={stats.brands.toLocaleString()} />
          <StatCard label="Verified brands" value={stats.verifiedBrands.toLocaleString()} />
          <StatCard label="New signups (30d)" value={stats.newBrands30d.toLocaleString()} />
          <StatCard label="Demo requests" value={stats.demoRequests.toLocaleString()} />
          <StatCard label="Try-ons (all time)" value={stats.tryOns.toLocaleString()} />
          <StatCard label="Try-ons (30d)" value={stats.tryOns30d.toLocaleString()} />
          <StatCard label="Verified domains" value={stats.verifiedDomains.toLocaleString()} />
          <StatCard
            label="Unverified brands"
            value={(stats.brands - stats.verifiedBrands).toLocaleString()}
          />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                Signups over time
              </h3>
              <span className="text-xs text-muted">
                {signupTotal} in the last 30 days
              </span>
            </div>
            <BarChart data={signups} />
          </Card>

          <Card className="p-5 flex flex-col gap-3">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">At a glance</h3>
            <dl className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Verification rate</dt>
                <dd className="text-ink tabular-nums">
                  {stats.brands
                    ? Math.round((stats.verifiedBrands / stats.brands) * 100)
                    : 0}
                  %
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Avg try-ons / brand</dt>
                <dd className="text-ink tabular-nums">
                  {stats.brands ? Math.round(stats.tryOns / stats.brands) : 0}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Signups today</dt>
                <dd className="text-ink tabular-nums">
                  {signups[signups.length - 1]?.count ?? 0}
                </dd>
              </div>
            </dl>
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          {recent.length === 0 ? (
            <EmptyState
              title="No brands have signed up yet"
              description="When a brand creates an account, it shows up here and in the Brands tab."
            />
          ) : (
            <Card className="overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                <h3 className="text-[15px] font-semibold tracking-tight text-ink">
                  Latest signups
                </h3>
                <Link href="/admin/brands" className="text-xs text-muted hover:text-ink">
                  View all brands
                </Link>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-muted">
                    <th className="px-5 py-2.5 font-medium">Brand</th>
                    <th className="px-5 py-2.5 font-medium">Email</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium text-right">Try-ons</th>
                    <th className="px-5 py-2.5 font-medium text-right">Signed up</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id} className="border-t border-line hover:bg-line/30">
                      <td className="px-5 py-3">
                        <Link
                          href={`/admin/brands/${b.id}`}
                          className="font-medium text-ink hover:underline"
                        >
                          {b.name}
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-muted">{b.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                            b.emailVerified
                              ? "bg-accent-soft text-ink"
                              : "bg-line text-muted"
                          }`}
                        >
                          {b.emailVerified ? "verified" : "unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right text-muted tabular-nums">
                        {b.tryOnCount}
                      </td>
                      <td className="px-5 py-3 text-right text-muted">
                        {formatDate(b.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}
        </section>
      </PageShell>
    </>
  );
}
