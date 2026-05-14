import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn(
        "rounded-[16px] border border-line bg-surface shadow-[var(--shadow-card)]",
        className,
      )}
    />
  );
}
