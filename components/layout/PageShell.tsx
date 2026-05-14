import { cn } from "@/lib/cn";
import type { HTMLAttributes } from "react";

export function PageShell({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...rest}
      className={cn("flex-1 p-6 flex flex-col gap-6 max-w-[1200px] w-full", className)}
    />
  );
}
