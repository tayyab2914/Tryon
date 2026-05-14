import { cn } from "@/lib/cn";

interface LogoProps {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}

export function Logo({ size = 36, withWordmark = false, className }: LogoProps) {
  const radius = Math.round(size * 0.28);
  const dot = Math.max(3, Math.round(size * 0.13));
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="relative inline-block bg-ink"
        style={{ width: size, height: size, borderRadius: radius }}
      >
        <span
          className="absolute inset-0 flex items-center justify-center font-semibold text-canvas"
          style={{ fontSize: size * 0.55, letterSpacing: "-0.04em" }}
        >
          F
        </span>
        <span
          className="absolute rounded-full bg-accent"
          style={{
            width: dot,
            height: dot,
            top: Math.round(size * 0.18),
            right: Math.round(size * 0.18),
          }}
        />
      </span>
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="text-[15px] font-semibold tracking-tight text-ink">FitRoom</span>
          <span className="mt-0.5 text-[11px] text-muted">Try-on dashboard</span>
        </span>
      )}
    </span>
  );
}
