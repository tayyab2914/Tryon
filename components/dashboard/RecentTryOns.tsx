import { Card } from "@/components/ui/Card";

interface Row {
  id: string;
  garment: string;
  shopper: string;
  status: "completed" | "processing" | "failed";
  when: string;
}

const ROWS: Row[] = [
  { id: "t_001", garment: "Linen Shirt — Sand", shopper: "anon_84ac", status: "completed", when: "2m ago" },
  { id: "t_002", garment: "Cropped Tee — Black", shopper: "anon_91be", status: "completed", when: "9m ago" },
  { id: "t_003", garment: "Wide-Leg Trouser", shopper: "anon_22fd", status: "processing", when: "14m ago" },
  { id: "t_004", garment: "Oversized Hoodie", shopper: "anon_55a1", status: "completed", when: "1h ago" },
  { id: "t_005", garment: "Pleated Skirt", shopper: "anon_77c0", status: "failed", when: "3h ago" },
];

const statusClass: Record<Row["status"], string> = {
  completed: "bg-accent-soft text-ink",
  processing: "bg-line text-muted",
  failed: "bg-red-50 text-danger",
};

export function RecentTryOns() {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">Recent try-ons</h3>
        <a href="/try-ons" className="text-xs text-muted hover:text-ink">View all</a>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-muted">
            <th className="px-5 py-2.5 font-medium">Garment</th>
            <th className="px-5 py-2.5 font-medium">Shopper</th>
            <th className="px-5 py-2.5 font-medium">Status</th>
            <th className="px-5 py-2.5 font-medium text-right">When</th>
          </tr>
        </thead>
        <tbody>
          {ROWS.map((r) => (
            <tr key={r.id} className="border-t border-line">
              <td className="px-5 py-3 text-ink">{r.garment}</td>
              <td className="px-5 py-3 text-muted font-mono text-xs">{r.shopper}</td>
              <td className="px-5 py-3">
                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${statusClass[r.status]}`}>
                  {r.status}
                </span>
              </td>
              <td className="px-5 py-3 text-right text-muted">{r.when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
