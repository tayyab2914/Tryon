import { Card } from "@/components/ui/Card";

interface StatCardProps {
  label: string;
  value: string;
  delta?: { value: string; positive?: boolean };
}

export function StatCard({ label, value, delta }: StatCardProps) {
  return (
    <Card className="p-5 flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-semibold tracking-tight text-ink">{value}</span>
        {delta && (
          <span className={delta.positive ? "text-xs text-success" : "text-xs text-danger"}>
            {delta.positive ? "+" : ""}
            {delta.value}
          </span>
        )}
      </div>
    </Card>
  );
}
