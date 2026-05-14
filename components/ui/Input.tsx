import { cn } from "@/lib/cn";
import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...rest }: InputProps) {
  return (
    <input
      {...rest}
      className={cn(
        "h-10 w-full rounded-[10px] border border-line-strong bg-surface px-3 text-sm",
        "placeholder:text-muted-soft text-ink",
        "focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10",
        "disabled:opacity-50",
        className,
      )}
    />
  );
}
