"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { adminLogoutAction } from "@/app/actions/admin";
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
  { href: "/admin", label: "Overview", icon: <Icon d="M3 12l9-9 9 9M5 10v10h14V10" /> },
  { href: "/admin/brands", label: "Brands", icon: <Icon d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01" /> },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-line bg-canvas">
      <div className="px-5 py-5">
        <Link href="/admin" aria-label="FitRoom AI admin" className="inline-flex items-center gap-2">
          <Logo size={28} />
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-ink">FitRoom AI</span>
            <span className="mt-0.5 text-[11px] text-accent font-medium">Admin panel</span>
          </span>
        </Link>
      </div>
      <nav className="flex-1 px-3 pb-4">
        <ul className="flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href || pathname.startsWith(item.href + "/");
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
            A
          </span>
          <span className="flex flex-col leading-tight min-w-0">
            <span className="text-sm font-medium text-ink truncate">Platform admin</span>
            <span className="text-xs text-muted truncate">Super-admin access</span>
          </span>
        </div>
        <form action={adminLogoutAction}>
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
