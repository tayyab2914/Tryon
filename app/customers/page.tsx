import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead, Tag, Button, BrandWord } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { CaseStudyGrid } from "@/components/marketing/customers/CaseStudyGrid";
import { BRAND_LOGOS } from "@/lib/marketing-data";

export const metadata: Metadata = {
  title: "Customers — FitRoom AI",
  description:
    "200+ fashion brands run FitRoom AI on their storefronts. See the conversion lift and return reduction they measure.",
};

const HERO_STATS = [
  { big: "32M+", label: "try-ons rendered", sub: "since 2024" },
  { big: "$48M+", label: "returns prevented", sub: "across all customers" },
  { big: "22%", label: "avg conversion lift", sub: "on PDP traffic" },
];

export default function CustomersPage() {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      <section style={{ padding: "64px 0 96px" }}>
        <div className="container">
          <Reveal>
            <Tag>Customers</Tag>
            <h1 className="display" style={{ marginTop: 20, maxWidth: 900 }}>
              The numbers <em>fashion brands</em>
              <br />
              measure us by.
            </h1>
            <p className="lede" style={{ marginTop: 24, maxWidth: 580 }}>
              200+ brands across 24 countries — from indie labels shipping on WooCommerce to global
              retailers running Shopify Plus.
            </p>
          </Reveal>
          <div
            className="hero-stats-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
              marginTop: 56,
            }}
          >
            {HERO_STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div
                  style={{
                    padding: "32px 28px",
                    border: "1px solid var(--paper-line)",
                    borderRadius: 14,
                    background: "#fff",
                  }}
                >
                  <div
                    style={{
                      fontSize: "clamp(48px, 5vw, 72px)",
                      fontWeight: 500,
                      letterSpacing: "-0.035em",
                      lineHeight: 0.95,
                    }}
                  >
                    {s.big}
                  </div>
                  <div style={{ marginTop: 12, fontSize: 14, fontWeight: 500 }}>{s.label}</div>
                  <div
                    style={{
                      marginTop: 4,
                      fontSize: 12,
                      color: "var(--mute)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {s.sub}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured case study */}
      <section
        className="section surface-ink"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        <div className="container">
          <Tag
            style={{ background: "var(--ink-3)", color: "var(--paper)", border: "1px solid var(--line)" }}
          >
            Featured · Northfold
          </Tag>
          <div
            className="featured-case roi-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: 56,
              marginTop: 24,
              alignItems: "center",
            }}
          >
            <div>
              <h2 className="h1" style={{ color: "var(--paper)" }}>
                <em>“We stopped guessing</em> at fit. Returns dropped 32% in a quarter.”
              </h2>
              <p className="lede" style={{ marginTop: 24, maxWidth: 520, color: "var(--mute-light)" }}>
                Northfold sells $400–$1,200 outerwear globally. Fit-driven returns ate 28% of
                revenue in their busiest channel. FitRoom AI changed the math.
              </p>
              <div style={{ marginTop: 28 }}>
                <Button href="/demo" variant="primary" style={{ background: "var(--paper)", color: "var(--ink)" }}>
                  Read the full case <Icons.Arrow size={14} />
                </Button>
              </div>
            </div>
            <div
              className="card"
              style={{ background: "var(--ink-2)", borderColor: "var(--line)", padding: 32 }}
            >
              <div className="eyebrow" style={{ color: "var(--mute-light)" }}>
                The problem
              </div>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 14.5,
                  color: "var(--mute-light)",
                  lineHeight: 1.55,
                }}
              >
                Outerwear returns running at 28%, with 60% of refunds citing fit. Customer service
                costs growing faster than revenue. Re-platforming a sizing tool failed twice.
              </p>
              <div className="eyebrow" style={{ marginTop: 24, color: "var(--mute-light)" }}>
                The solution
              </div>
              <p
                style={{
                  marginTop: 8,
                  fontSize: 14.5,
                  color: "var(--mute-light)",
                  lineHeight: 1.55,
                }}
              >
                Shipped FitRoom AI across all 11 EU markets in 6 weeks. Try-on widget on PDP +
                collection. Klaviyo browse-abandon flow surfaces the last try-on.
              </p>
              <div className="eyebrow" style={{ marginTop: 24, color: "var(--mute-light)" }}>
                The results · 90 days
              </div>
              <div
                style={{
                  marginTop: 12,
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                }}
              >
                {[
                  ["−32%", "returns"],
                  ["2.4×", "PDP conv"],
                  ["+$2.1M", "GMV"],
                ].map(([n, l]) => (
                  <div key={l}>
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 500,
                        letterSpacing: "-0.025em",
                        color: "var(--coral)",
                      }}
                    >
                      {n}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--mute-light)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginTop: 2,
                      }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filterable grid */}
      <section className="section">
        <div className="container">
          <SectionHead
            eyebrow="Case studies"
            title="Browse by category, store size, or platform."
            maxWidth={640}
          />
          <CaseStudyGrid />
        </div>
      </section>

      {/* Logo wall */}
      <section style={{ padding: "64px 0", background: "var(--paper-2)" }}>
        <div className="container">
          <div className="eyebrow" style={{ textAlign: "center", marginBottom: 40 }}>
            200+ brands ship FitRoom AI — here are some
          </div>
          <div
            className="logo-wall"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              border: "1px solid var(--paper-line)",
              borderRadius: 14,
              overflow: "hidden",
            }}
          >
            {BRAND_LOGOS.map((b, i) => (
              <div
                key={b.name}
                style={{
                  padding: "32px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRight: (i + 1) % 4 === 0 ? "none" : "1px solid var(--paper-line)",
                  borderBottom:
                    i >= BRAND_LOGOS.length - 4 ? "none" : "1px solid var(--paper-line)",
                  background: "#fff",
                }}
              >
                <BrandWord name={b.name} italic={b.italic} weight={b.weight} mono={b.mono} size={20} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}
