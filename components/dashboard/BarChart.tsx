import type { DailyPoint } from "@/lib/tryon";

interface BarChartProps {
  data: DailyPoint[];
}

/**
 * Lightweight, dependency-free bar chart. Heights are CSS percentages so it
 * stays responsive; each bar carries a native tooltip with its exact count.
 */
export function BarChart({ data }: BarChartProps) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const lastIndex = data.length - 1;
  const midIndex = Math.floor(lastIndex / 2);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end gap-[2px] h-44">
        {data.map((d) => (
          <div
            key={d.date}
            className="group flex-1 flex flex-col justify-end"
            title={`${d.label}: ${d.count} try-on${d.count === 1 ? "" : "s"}`}
          >
            <div
              className="rounded-t-[3px] bg-ink/85 group-hover:bg-ink transition-colors"
              style={{ height: `${Math.max((d.count / max) * 100, d.count > 0 ? 4 : 1.5)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[11px] text-muted">
        <span>{data[0]?.label}</span>
        <span>{data[midIndex]?.label}</span>
        <span>{data[lastIndex]?.label}</span>
      </div>
    </div>
  );
}
