"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo, Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";

const NAV_LINKS = [
  { label: "Product", href: "/product" },
  { label: "Pricing", href: "/pricing" },
  { label: "Customers", href: "/customers" },
  { label: "Docs", href: "/docs" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        transition: "all 0.25s var(--ease)",
        background: scrolled ? "rgba(247,245,242,0.85)" : "transparent",
        backdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "saturate(140%) blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? "var(--paper-line)" : "transparent"}`,
        color: "var(--ink)",
      }}
    >
      <div
        className="container"
        style={{ height: 64, display: "flex", alignItems: "center", gap: 24 }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center" }} aria-label="FitRoom AI home">
          <Logo />
        </Link>

        <nav className="nav-links" style={{ display: "flex", gap: 4, marginLeft: 16 }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                fontSize: 14,
                padding: "8px 12px",
                borderRadius: 8,
                opacity: 0.7,
                fontWeight: 500,
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div style={{ flex: 1 }} />

        <div className="nav-cta" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link
            href="/signin"
            style={{ fontSize: 14, padding: "8px 12px", opacity: 0.7, fontWeight: 500 }}
          >
            Sign in
          </Link>
          <Button href="/demo" variant="primary" size="sm">
            Book demo
          </Button>
        </div>

        <button
          type="button"
          className="nav-menu-btn"
          onClick={() => setOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={open}
          style={{ display: "none", padding: 8, background: "none", border: "none" }}
        >
          <Icons.Menu />
        </button>
      </div>

      {open && (
        <div
          style={{
            padding: "16px 18px 24px",
            borderTop: "1px solid var(--paper-line)",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ padding: "10px 8px", fontSize: 16, fontWeight: 500 }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ height: 8 }} />
          <Link
            href="/signin"
            onClick={() => setOpen(false)}
            style={{ padding: "10px 8px", fontSize: 16, fontWeight: 500 }}
          >
            Sign in
          </Link>
          <Button
            href="/demo"
            variant="primary"
            style={{ alignSelf: "flex-start", marginTop: 4 }}
          >
            Book demo
          </Button>
        </div>
      )}
    </header>
  );
}
