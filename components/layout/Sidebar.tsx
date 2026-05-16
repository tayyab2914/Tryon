"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { signoutAction } from "@/app/actions/auth";
import { cn } from "@/lib/cn";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const Icon = ({ d }: { d: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={d} />
  </svg>
);

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: <Icon d="M3 12l9-9 9 9M5 10v10h14V10" /> },
  { href: "/try-ons", label: "Try-ons", icon: <Icon d="M12 3v18M3 12h18" /> },
  { href: "/install", label: "Install", icon: <Icon d="M8 6l-4 6 4 6M16 6l4 6-4 6" /> },
  { href: "/analytics", label: "Analytics", icon: <Icon d="M4 19V5M4 19h16M8 15v-4M12 15V9M16 15v-7" /> },
  { href: "/billing", label: "Billing", icon: <Icon d="M3 7h18v10H3zM3 11h18" /> },
  { href: "/settings", label: "Settings", icon: <Icon d="M12 8a4 4 0 100 8 4 4 0 000-8zM19 12a7 7 0 00-.1-1.2l2-1.5-2-3.5-2.4.9a7 7 0 00-2-1.2L14 3h-4l-.5 2.5a7 7 0 00-2 1.2l-2.4-.9-2 3.5 2 1.5A7 7 0 005 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.5 2.4-.9c.6.5 1.3.9 2 1.2L10 21h4l.5-2.5c.7-.3 1.4-.7 2-1.2l2.4.9 2-3.5-2-1.5c.1-.4.1-.8.1-1.2z" /> },
];

interface SidebarProps {
  brand: { name: string; email: string };
}

export function Sidebar({ brand }: SidebarProps) {
  const pathname = usePathname();
  const initial = (brand.name.trim().charAt(0) || "F").toUpperCase();

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-line bg-canvas">
      <div className="px-5 py-5">
        <Link href="/dashboard" aria-label="FitRoom AI" className="inline-flex">
          <Logo size={28} withWordmark />
        </Link>
      </div>
      <nav className="flex-1 px-3 pb-4">
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-[10px] px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-surface text-ink border border-line shadow-[var(--shadow-card)]"
                      : "text-muted hover:bg-line/60 hover:text-ink",
                  )}
                >
                  <span className={active ? "text-ink" : "text-muted"}>{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="border-t border-line px-3 py-3 flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5 rounded-[10px] px-3 py-2">
          <span className="h-8 w-8 rounded-full bg-ink text-canvas flex items-center justify-center text-sm font-semibold">
            {initial}
          </span>
          <span className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-medium text-ink truncate">{brand.name}</span>
            <span className="text-xs text-muted truncate">{brand.email}</span>
          </span>
        </div>
        <form action={signoutAction}>
          <button
            type="submit"
            className="w-full text-left rounded-[10px] px-3 py-2 text-sm text-muted hover:bg-line/60 hover:text-ink transition-colors"
          >
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
