/**
 * FitRoom AI — icon set. Minimal stroke-based icons, 1.6px stroke, 20px default.
 */
import type { PropsWithChildren, SVGProps } from "react";

export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number;
}

function Icon({ children, size = 20, ...rest }: PropsWithChildren<IconProps>) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  );
}

export const Icons = {
  Logo: ({ size = 22, ...rest }: IconProps) => (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true" {...rest}>
      <path d="M6 7h20v3H6z" fill="currentColor" />
      <path
        d="M9 10v15a2 2 0 002 2h10a2 2 0 002-2V10"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <circle cx="16" cy="17" r="2.2" fill="currentColor" />
      <path d="M16 14.8V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  Arrow: (p: IconProps) => (
    <Icon {...p}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  ),
  ArrowUR: (p: IconProps) => (
    <Icon {...p}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  ),
  ArrowDown: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Icon>
  ),
  Check: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 12l5 5L20 6" />
    </Icon>
  ),
  X: (p: IconProps) => (
    <Icon {...p}>
      <path d="M6 6l12 12M18 6L6 18" />
    </Icon>
  ),
  Plus: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  ),
  Minus: (p: IconProps) => (
    <Icon {...p}>
      <path d="M5 12h14" />
    </Icon>
  ),
  ChevronDown: (p: IconProps) => (
    <Icon {...p}>
      <path d="M6 9l6 6 6-6" />
    </Icon>
  ),
  ChevronRight: (p: IconProps) => (
    <Icon {...p}>
      <path d="M9 6l6 6-6 6" />
    </Icon>
  ),
  ChevronLeft: (p: IconProps) => (
    <Icon {...p}>
      <path d="M15 6l-6 6 6 6" />
    </Icon>
  ),
  Search: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </Icon>
  ),
  Sparkle: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3zM19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8L19 14z" />
    </Icon>
  ),
  Upload: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M5 20h14" />
    </Icon>
  ),
  Image: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="M21 17l-5-5-9 9" />
    </Icon>
  ),
  User: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" />
    </Icon>
  ),
  Users: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c1-3.5 3.5-5 6.5-5s5.5 1.5 6.5 5" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16 14c2.5 0 4.5 1 5.5 3.5" />
    </Icon>
  ),
  Cart: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 4h2l2.4 12.2a2 2 0 002 1.6h8.8a2 2 0 002-1.6L21 8H6" />
      <circle cx="9" cy="21" r="1.2" />
      <circle cx="18" cy="21" r="1.2" />
    </Icon>
  ),
  Chart: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <path d="M8 15l4-6 3 3 5-7" />
    </Icon>
  ),
  ChartBar: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 19V5" />
      <path d="M4 19h16" />
      <rect x="7" y="11" width="3" height="6" />
      <rect x="12" y="7" width="3" height="10" />
      <rect x="17" y="13" width="3" height="4" />
    </Icon>
  ),
  TrendDown: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 7l6 6 4-4 6 8" />
      <path d="M20 17h-4M20 17v-4" />
    </Icon>
  ),
  TrendUp: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 17l6-6 4 4 6-8" />
      <path d="M20 7h-4M20 7v4" />
    </Icon>
  ),
  Bolt: (p: IconProps) => (
    <Icon {...p}>
      <path d="M13 3L4 14h7l-1 7 9-11h-7l1-7z" />
    </Icon>
  ),
  Shield: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 3l8 3v5c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-3z" />
    </Icon>
  ),
  Lock: (p: IconProps) => (
    <Icon {...p}>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </Icon>
  ),
  Mail: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </Icon>
  ),
  Github: (p: IconProps) => (
    <Icon {...p}>
      <path d="M9 19c-4 1.5-4-2-6-2.5M15 22v-3.5a3 3 0 00-1-2.4c3.3-.4 6.7-1.6 6.7-7.2A5.6 5.6 0 0019 5a5.2 5.2 0 00-.1-3.9S17.7.7 15 2.6a13 13 0 00-7 0C5.3.7 4.1 1.1 4.1 1.1A5.2 5.2 0 004 5a5.6 5.6 0 00-1.7 3.9c0 5.6 3.4 6.8 6.7 7.2a3 3 0 00-1 2.4V22" />
    </Icon>
  ),
  Twitter: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 4l7 9-7 7h2l6-6 5 6h4l-7.5-9L20 4h-2l-5.5 5.5L8 4z" />
    </Icon>
  ),
  Linkedin: (p: IconProps) => (
    <Icon {...p}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M8 10v8M8 7v.01M12 18v-5a2.5 2.5 0 015 0v5M12 10v8" />
    </Icon>
  ),
  Copy: (p: IconProps) => (
    <Icon {...p}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 012-2h10" />
    </Icon>
  ),
  Camera: (p: IconProps) => (
    <Icon {...p}>
      <path d="M5 8h3l2-2h4l2 2h3a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2z" />
      <circle cx="12" cy="13" r="3.5" />
    </Icon>
  ),
  Building: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 21V5l8-2 8 2v16" />
      <path d="M9 21v-4h6v4M8 9h.01M12 9h.01M16 9h.01M8 13h.01M12 13h.01M16 13h.01" />
    </Icon>
  ),
  Tag: (p: IconProps) => (
    <Icon {...p}>
      <path d="M12 3H5a2 2 0 00-2 2v7l9 9 9-9-9-9z" />
      <circle cx="8" cy="8" r="1.5" />
    </Icon>
  ),
  Menu: (p: IconProps) => (
    <Icon {...p}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Icon>
  ),
  ExternalLink: (p: IconProps) => (
    <Icon {...p}>
      <path d="M14 3h7v7M21 3l-9 9M19 14v5a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5" />
    </Icon>
  ),
  Eye: (p: IconProps) => (
    <Icon {...p}>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <circle cx="12" cy="12" r="3" />
    </Icon>
  ),
  EyeOff: (p: IconProps) => (
    <Icon {...p}>
      <path d="M3 3l18 18M10.6 6.1A10 10 0 0112 6c6.5 0 10 6 10 6a17 17 0 01-3.4 4.1M6.6 6.6A17 17 0 002 12s3.5 6 10 6c1.6 0 3-.3 4.3-.9" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </Icon>
  ),
  Play: (p: IconProps) => (
    <Icon {...p}>
      <path d="M7 5l12 7-12 7V5z" />
    </Icon>
  ),
  Sun: (p: IconProps) => (
    <Icon {...p}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </Icon>
  ),
  Moon: (p: IconProps) => (
    <Icon {...p}>
      <path d="M20 14.5A8 8 0 119.5 4 6.5 6.5 0 0020 14.5z" />
    </Icon>
  ),
} as const;

export type IconName = keyof typeof Icons;
