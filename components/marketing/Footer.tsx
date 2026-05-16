import Link from "next/link";
import { Logo } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";

interface FooterCol {
  title: string;
  links: { label: string; href: string }[];
}

const FOOTER_COLS: FooterCol[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "Pricing", href: "/pricing" },
      { label: "Customers", href: "/customers" },
      { label: "Integrations", href: "/product" },
      { label: "Book a demo", href: "/demo" },
      { label: "ROI calculator", href: "/#roi" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Customers", href: "/customers" },
      { label: "Security", href: "/security" },
      { label: "Contact sales", href: "/demo" },
      { label: "Sign in", href: "/signin" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Docs", href: "/docs" },
      { label: "API reference", href: "/docs/api" },
      { label: "Quickstart", href: "/docs/quickstart" },
      { label: "Pricing FAQ", href: "/pricing" },
      { label: "Get started", href: "/signup" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
      { label: "Security", href: "/security" },
      { label: "About FitRoom AI", href: "/about" },
    ],
  },
];

const SOCIALS = [Icons.Twitter, Icons.Linkedin, Icons.Github];

export function Footer() {
  return (
    <footer
      className="surface-ink"
      style={{ background: "var(--ink)", color: "var(--paper)", paddingTop: 96, paddingBottom: 32 }}
    >
      <div className="container">
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr repeat(4, 1fr)",
            gap: 48,
            marginBottom: 72,
          }}
        >
          <div>
            <Logo light />
            <p
              style={{
                marginTop: 16,
                maxWidth: 280,
                fontSize: 14,
                lineHeight: 1.55,
                color: "var(--mute-light)",
              }}
            >
              Virtual try-on infrastructure for fashion brands. Photoreal renders in seconds.
            </p>
            <div style={{ marginTop: 28, display: "flex", gap: 10 }}>
              {SOCIALS.map((I, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 999,
                    border: "1px solid var(--line-strong)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--paper)",
                  }}
                >
                  <I size={16} />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                {col.title}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      style={{ fontSize: 14, color: "var(--paper)", opacity: 0.75 }}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingTop: 28,
            borderTop: "1px solid var(--line)",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 13, color: "var(--mute-light)" }}>
            © 2026 FitRoom AI, Inc. All rights reserved. Made in New York &amp; Lisbon.
          </div>
          <div style={{ display: "flex", gap: 18, fontSize: 13, color: "var(--mute-light)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <span
                style={{ width: 6, height: 6, borderRadius: 999, background: "var(--emerald)" }}
              />
              All systems operational
            </span>
            <span>SOC 2 Type II</span>
            <span>GDPR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
