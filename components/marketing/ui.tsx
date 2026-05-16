/**
 * Shared, presentational building blocks for the marketing landing page.
 * All server components — no client-side state.
 */
import Link from "next/link";
import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { Icons } from "@/components/marketing/icons";

/* ----- Logo ----- */
export function Logo({ size = 22, light = false }: { size?: number; light?: boolean }) {
  const color = light ? "var(--paper)" : "var(--ink)";
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icons.Logo size={size} style={{ color }} />
      <span
        style={{
          fontFamily: "var(--font-sans)",
          fontWeight: 600,
          fontSize: 16,
          letterSpacing: "-0.02em",
          color,
        }}
      >
        FitRoom AI<span style={{ color: "var(--coral)" }}>.</span>
      </span>
    </span>
  );
}

/* ----- Button ----- */
type ButtonVariant = "primary" | "coral" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

function buttonClass(variant: ButtonVariant, size: ButtonSize, className = "") {
  const sizeClass = size === "lg" ? "btn-lg" : size === "sm" ? "btn-sm" : "";
  return `btn btn-${variant} ${sizeClass} ${className}`.trim();
}

/** Renders a Next link when `href` is set, otherwise a native button. */
export function Button({
  variant = "primary",
  size = "md",
  className,
  style,
  href,
  children,
  ...rest
}: ButtonBaseProps &
  ({ href: string } | ({ href?: undefined } & ButtonHTMLAttributes<HTMLButtonElement>))) {
  const cls = buttonClass(variant, size, className);
  if (typeof href === "string") {
    return (
      <Link href={href} className={cls} style={style}>
        {children}
      </Link>
    );
  }
  return (
    <button className={cls} style={style} {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}>
      {children}
    </button>
  );
}

/* ----- Tag / chip ----- */
export function Tag({
  children,
  dot = false,
  coral = false,
  className = "",
  style,
}: {
  children: ReactNode;
  dot?: boolean;
  coral?: boolean;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`tag ${dot ? "tag-dot" : ""} ${coral ? "tag-coral" : ""} ${className}`.trim()}
      style={style}
    >
      {children}
    </span>
  );
}

/* ----- Section header ----- */
export function SectionHead({
  eyebrow,
  title,
  lede,
  align = "left",
  maxWidth = 720,
  children,
}: {
  eyebrow?: string;
  /** May contain inline HTML (e.g. <em>) — rendered verbatim. */
  title?: string;
  lede?: string;
  align?: "left" | "center";
  maxWidth?: number;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        textAlign: align,
        maxWidth,
        marginLeft: align === "center" ? "auto" : 0,
        marginRight: align === "center" ? "auto" : 0,
        marginBottom: 48,
      }}
    >
      {eyebrow && <div className="eyebrow" style={{ marginBottom: 16 }}>{eyebrow}</div>}
      {title && <h2 className="h2" dangerouslySetInnerHTML={{ __html: title }} />}
      {lede && <p className="lede" style={{ marginTop: 16 }}>{lede}</p>}
      {children}
    </div>
  );
}

/* ----- Brand wordmark ----- */
export function BrandWord({
  name,
  italic = false,
  weight = 500,
  size = 18,
  mono = false,
}: {
  name: string;
  italic?: boolean;
  weight?: number;
  size?: number;
  mono?: boolean;
}) {
  return (
    <span
      style={{
        fontFamily: mono
          ? "var(--font-mono)"
          : italic
            ? "var(--font-serif)"
            : "var(--font-sans)",
        fontStyle: italic ? "italic" : "normal",
        fontWeight: weight,
        fontSize: size,
        letterSpacing: italic ? "-0.01em" : "-0.02em",
        whiteSpace: "nowrap",
        color: "currentColor",
      }}
    >
      {name}
    </span>
  );
}
