import Link from "next/link";
import { AdminTopbar } from "@/components/admin/AdminTopbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { listBrands } from "@/lib/admin";

export const metadata = { title: "Brands · FitRoom AI admin" };

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminBrandsPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = (q ?? "").trim().toLowerCase();

  const all = await listBrands();
  const brands = query
    ? all.filter(
        (b) =>
          b.name.toLowerCase().includes(query) ||
          b.email.toLowerCase().includes(query),
      )
    : all;

  const search = (
    <form className="w-[260px]">
      <Input
        type="search"
        name="q"
        defaultValue={q ?? ""}
        placeholder="Search name or email…"
        aria-label="Search brands"
      />
    </form>
  );

  return (
    <>
      <AdminTopbar
        title="Brands"
        description={`${all.length} brand${all.length === 1 ? "" : "s"} have signed up.`}
        action={search}
      />
      <PageShell>
        {brands.length === 0 ? (
          <EmptyState
            title={query ? "No brands match your search" : "No brands have signed up yet"}
            description={
              query
                ? "Try a different name or email."
                : "When a brand creates an account, it appears here."
            }
          />
        ) : (
          <Card className="overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-muted">
                  <th className="px-5 py-3 font-medium">Brand</th>
                  <th className="px-5 py-3 font-medium">Email</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Try-ons</th>
                  <th className="px-5 py-3 font-medium text-right">Domains</th>
                  <th className="px-5 py-3 font-medium text-right">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {brands.map((b) => (
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
                    <td className="px-5 py-3 text-right text-muted tabular-nums">
                      {b.domainCount}
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
      </PageShell>
    </>
  );
}
