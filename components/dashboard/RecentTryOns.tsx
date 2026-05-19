import type { TryOnStatus } from "@prisma/client";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { db } from "@/lib/db";
import { getCurrentBrand } from "@/lib/session";

const statusClass: Record<TryOnStatus, string> = {
  COMPLETED: "bg-accent-soft text-ink",
  PROCESSING: "bg-line text-muted",
  FAILED: "bg-red-50 text-danger",
};

/** Strips the protocol and `www.` for a compact, readable link label. */
function prettyUrl(url: string): string {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "") + (u.pathname === "/" ? "" : u.pathname);
  } catch {
    return url;
  }
}

function relativeTime(date: Date): string {
  const seconds = Math.round((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export async function RecentTryOns({ limit = 5 }: { limit?: number }) {
  const brand = await getCurrentBrand();
  const rows = brand
    ? await db.tryOn.findMany({
        where: { brandId: brand.id },
        orderBy: { createdAt: "desc" },
        take: limit,
      })
    : [];

  if (rows.length === 0) {
    return (
      <EmptyState
        title="No try-ons yet"
        description="Once your widget is live, every shopper try-on appears here. Images are never stored — only this activity log."
      />
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">Recent try-ons</h3>
        <a href="/try-ons" className="text-xs text-muted hover:text-ink">View all</a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="px-5 py-2.5 font-medium">Product</th>
            <th className="px-5 py-2.5 font-medium">Product link</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium text-right">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <td className="px-5 py-3 text-ink">
                <div className="flex items-center gap-3">
                  {r.productUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.productUrl}
                      alt={r.garment}
                      className="h-10 w-10 shrink-0 rounded-md border border-line bg-line object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 shrink-0 rounded-md border border-line bg-line" />
                  )}
                  <span>{r.garment}</span>
                </div>
              </td>
              <td className="px-5 py-3">
                {r.productUrl ? (
                  <a
                    href={r.productUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={r.productUrl}
                    className="inline-block max-w-65 truncate align-middle font-mono text-xs text-accent hover:underline"
                  >
                    {prettyUrl(r.productUrl)}
                  </a>
                ) : (
                  <span className="text-muted text-xs">—</span>
                )}
              </td>
              <td className="px-5 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${statusClass[r.status]}`}>
                  {r.status.toLowerCase()}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-muted">{relativeTime(r.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
