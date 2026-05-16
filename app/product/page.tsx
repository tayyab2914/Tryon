import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead, Tag, Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { Mannequin } from "@/components/marketing/Imagery";
import { TryOnHero } from "@/components/marketing/TryOnHero";

export const metadata: Metadata = {
  title: "Product — FitRoom AI try-on for fashion stores",
  description:
    "One widget, one SDK, one API. Add photoreal virtual try-on to your Shopify, WooCommerce, or custom storefront in minutes.",
};

type VisualKind =
  | "fidelity"
  | "inputs"
  | "outfit"
  | "sizing"
  | "cache"
  | "mobile"
  | "analytics"
  | "catalog";

interface Feature {
  eyebrow: string;
  title: string;
  body: string;
  bullets: string[];
  visual: VisualKind;
}

const FEATURES: Feature[] = [
  {
    eyebrow: "01 · Render quality",
    title: "Photoreal fidelity, every time.",
    body: "Our diffusion stack preserves fabric texture, drape, and colour under realistic studio lighting — without the plastic, uncanny look you get from generic AI try-on.",
    bullets: [
      "864×1296 output resolution",
      "Colour-accurate within 2 ΔE",
      "Realistic shadow + occlusion",
      "No hallucinated accessories",
    ],
    visual: "fidelity",
  },
  {
    eyebrow: "02 · Inputs",
    title: "One photo. That's the entire ask.",
    body: "No depth scans, no 3D models, no special lighting. Shoppers upload a single full-body photo and we handle pose estimation, segmentation, and body modelling automatically.",
    bullets: [
      "Selfies, mirror shots, outdoor — all fine",
      "Auto-crop and de-identify",
      "Works on phones from 2018+",
      "No SDK required",
    ],
    visual: "inputs",
  },
  {
    eyebrow: "03 · Outfits",
    title: "Try the full look, not just the piece.",
    body: "Layer up to four garments — top, bottom, outer, accessory — in a single coherent render. Outfit try-on drives 38% higher AOV across our customer base.",
    bullets: [
      "4-layer outfit composition",
      "Smart layering order",
      "“Complete the look” recommendations",
      "PDP and collection-level",
    ],
    visual: "outfit",
  },
  {
    eyebrow: "04 · Sizing",
    title: "Size recommendation that earns trust.",
    body: "We combine the shopper's body proportions with the SKU's pattern grading to suggest a size with a confidence score, shown inline next to your size selector.",
    bullets: [
      "Trained on 32M+ try-ons",
      "Per-SKU pattern data",
      "Confidence shown to shopper",
      "Tunable conservatism",
    ],
    visual: "sizing",
  },
  {
    eyebrow: "05 · Performance",
    title: "Pre-cached results, instant feel.",
    body: "On Pro plans we pre-render popular SKUs against your top shopper body archetypes. Returning shoppers see results in under 200ms.",
    bullets: [
      "Sub-200ms cache hits",
      "Adaptive per-category caching",
      "Geo-distributed CDN",
      "99.95% uptime SLA",
    ],
    visual: "cache",
  },
  {
    eyebrow: "06 · Mobile",
    title: "A native SDK for the app shoppers actually open.",
    body: "iOS and Android SDKs ship with our reference UI, full theming, and offline-tolerant queueing. One render API, two platforms.",
    bullets: [
      "iOS 15+ · Swift / SwiftUI",
      "Android 9+ · Kotlin",
      "Theming via tokens",
      "Offline queue + retry",
    ],
    visual: "mobile",
  },
  {
    eyebrow: "07 · Analytics",
    title: "See returns shrink, week over week.",
    body: "The return-impact dashboard ties every refund back to whether a shopper tried on, what they saw, and what size they chose. Find your worst-fit SKUs in a click.",
    bullets: [
      "Cohort A/B with statistical power",
      "SKU-level fit-flaw flags",
      "Returns vs try-on funnel",
      "Export to GA4 + Looker",
    ],
    visual: "analytics",
  },
  {
    eyebrow: "08 · Catalog",
    title: "On-model imagery, generated.",
    body: "Need on-model PDP imagery from your flat-lays? Generate consistent on-model photos at scale, with brand-defined model archetypes and locations.",
    bullets: [
      "Brand-locked model rosters",
      "Outdoor / studio / editorial",
      "Bulk catalog generation",
      "PNG + WebP outputs",
    ],
    visual: "catalog",
  },
];

const SPECS: [string, string, string][] = [
  ["5–17s", "render latency", "p50 to p99"],
  ["864×1296", "output resolution", "4:3 portrait crop"],
  ["99.95%", "uptime SLA", "rolling 90 days"],
  ["24h", "photo auto-delete", "unless opted in"],
  ["ΔE < 2.5", "colour fidelity", "against ground truth"],
];

const wrap: React.CSSProperties = {
  position: "relative",
  aspectRatio: "5/4",
  borderRadius: "var(--r-lg)",
  background: "var(--ink-2)",
  overflow: "hidden",
  border: "1px solid var(--line)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function FeatureVisual({ kind }: { kind: VisualKind }) {
  if (kind === "fidelity") {
    return (
      <div style={wrap}>
        <div className="grid-lines" style={{ position: "absolute", inset: 0, opacity: 0.4 }} />
        <Mannequin size={260} seed={2} />
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--mute-light)",
          }}
        >
          864 × 1296 · ΔE 1.4
        </div>
      </div>
    );
  }
  if (kind === "inputs") {
    return (
      <div style={wrap}>
        <div style={{ display: "flex", gap: 12 }}>
          {["mirror", "outdoor", "studio"].map((tag, i) => (
            <div
              key={tag}
              style={{
                width: 90,
                height: 140,
                borderRadius: 10,
                background: "var(--ink-3)",
                border: "1px solid var(--line)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Mannequin size={80} seed={i} />
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  left: 6,
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "var(--mute-light)",
                }}
              >
                {tag}
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            color: "var(--mute-light)",
          }}
        >
          1 photo · 3 inputs · same body model
        </div>
      </div>
    );
  }
  if (kind === "outfit") {
    return (
      <div style={wrap}>
        <Mannequin size={260} seed={4} />
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {["Blazer", "Knit · sand", "Trouser", "Loafer"].map((l, i) => (
            <div
              key={l}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "var(--paper)",
                background: "rgba(14,14,16,0.6)",
                padding: "4px 8px",
                borderRadius: 999,
                border: "1px solid var(--line)",
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--coral)" }} />
              {String(i + 1).padStart(2, "0")} · {l}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (kind === "sizing") {
    return (
      <div style={wrap}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["XS", "S", "M", "L", "XL"].map((sz, i) => (
              <div
                key={sz}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  border: `1.5px solid ${i === 2 ? "var(--coral)" : "var(--line-strong)"}`,
                  background: i === 2 ? "var(--coral)" : "transparent",
                  color: i === 2 ? "#fff" : "var(--paper)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {sz}
              </div>
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              color: "var(--mute-light)",
            }}
          >
            <div style={{ color: "var(--paper)", fontSize: 18, fontWeight: 500 }}>94%</div>
            <div>fit confidence · M</div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === "cache") {
    return (
      <div style={wrap}>
        <svg viewBox="0 0 320 200" width="80%" height="80%">
          <defs>
            <linearGradient id="prod-cache" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="oklch(0.70 0.20 30)" stopOpacity="0.35" />
              <stop offset="1" stopColor="oklch(0.70 0.20 30)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 150 L40 145 L80 140 L120 60 L160 55 L200 30 L240 24 L280 18 L320 12 L320 200 L0 200 Z"
            fill="url(#prod-cache)"
          />
          <path
            d="M0 150 L40 145 L80 140 L120 60 L160 55 L200 30 L240 24 L280 18 L320 12"
            stroke="oklch(0.70 0.20 30)"
            strokeWidth="1.6"
            fill="none"
          />
          <circle cx="280" cy="18" r="4" fill="oklch(0.70 0.20 30)" />
          <text x="280" y="8" fill="var(--paper)" fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">
            186ms
          </text>
        </svg>
      </div>
    );
  }
  if (kind === "mobile") {
    return (
      <div style={wrap}>
        <div
          style={{
            width: 160,
            height: 280,
            background: "var(--ink-3)",
            border: "6px solid var(--ink)",
            borderRadius: 24,
            display: "flex",
            flexDirection: "column",
            padding: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              color: "var(--mute-light)",
              marginBottom: 6,
            }}
          >
            9:41 · 5G
          </div>
          <div
            style={{
              flex: 1,
              borderRadius: 12,
              background: "linear-gradient(180deg, var(--ink-2), var(--ink-3))",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <Mannequin size={130} seed={4} />
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 10,
                right: 10,
                padding: "8px 12px",
                background: "var(--coral)",
                borderRadius: 999,
                fontSize: 11,
                fontWeight: 500,
                color: "#fff",
                textAlign: "center",
              }}
            >
              Add to bag · M
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (kind === "analytics") {
    return (
      <div style={wrap}>
        <div
          style={{
            width: "85%",
            background: "var(--ink-3)",
            borderRadius: 12,
            padding: 16,
            border: "1px solid var(--line)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              marginBottom: 14,
            }}
          >
            <div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mute-light)" }}>
                RETURN RATE · LAST 90D
              </div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  color: "var(--paper)",
                  letterSpacing: "-0.02em",
                }}
              >
                21.4%
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                color: "var(--emerald)",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Icons.TrendDown size={12} /> −32%
            </div>
          </div>
          <svg viewBox="0 0 240 60" style={{ width: "100%", height: 60 }}>
            <path
              d="M0 10 L40 14 L80 18 L120 28 L160 34 L200 40 L240 46"
              stroke="oklch(0.70 0.20 30)"
              strokeWidth="2"
              fill="none"
            />
            <path
              d="M0 5 L40 8 L80 6 L120 8 L160 5 L200 7 L240 5"
              stroke="var(--line-strong)"
              strokeWidth="1"
              fill="none"
              strokeDasharray="3,3"
            />
          </svg>
        </div>
      </div>
    );
  }
  // catalog
  return (
    <div style={wrap}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, padding: 24 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 110,
              borderRadius: 8,
              background: "var(--ink-3)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Mannequin size={70} seed={i} />
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 16,
          fontFamily: "var(--font-mono)",
          fontSize: 11,
          color: "var(--mute-light)",
        }}
      >
        6 SKUs · same shopper · 1 minute
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      <section style={{ padding: "64px 0 96px" }}>
        <div className="container">
          <div
            className="hero-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1.2fr",
              gap: 64,
              alignItems: "center",
            }}
          >
            <div>
              <Tag>The product</Tag>
              <h1 className="display" style={{ marginTop: 20 }}>
                The try-on layer for <em>your store</em>.
              </h1>
              <p className="lede" style={{ marginTop: 24, maxWidth: 520 }}>
                FitRoom AI is one widget, one SDK, and one API — covering everything from PDP try-on to
                bulk on-model generation. It drops into the storefront you already run.
              </p>
              <div style={{ marginTop: 28, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button href="/demo" variant="primary" size="lg">
                  Book a demo <Icons.Arrow size={16} />
                </Button>
                <Button href="/docs" variant="ghost" size="lg">
                  Read the docs
                </Button>
              </div>
            </div>
            <Reveal>
              <TryOnHero />
            </Reveal>
          </div>
        </div>
      </section>

      {FEATURES.map((f, i) => (
        <section
          key={f.eyebrow}
          style={{ padding: "64px 0", background: i % 2 === 1 ? "var(--paper-2)" : "transparent" }}
        >
          <div className="container">
            <div
              className="feat-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.2fr",
                gap: 64,
                alignItems: "center",
                direction: i % 2 === 0 ? "ltr" : "rtl",
              }}
            >
              <div style={{ direction: "ltr" }}>
                <Reveal>
                  <div className="eyebrow" style={{ marginBottom: 16 }}>
                    {f.eyebrow}
                  </div>
                  <h2 className="h2">{f.title}</h2>
                  <p className="lede" style={{ marginTop: 16, maxWidth: 480 }}>
                    {f.body}
                  </p>
                  <ul
                    style={{
                      listStyle: "none",
                      margin: "24px 0 0",
                      padding: 0,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: 12,
                      maxWidth: 480,
                    }}
                  >
                    {f.bullets.map((b) => (
                      <li
                        key={b}
                        style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 14 }}
                      >
                        <Icons.Check
                          size={14}
                          style={{ marginTop: 4, color: "var(--coral)", flexShrink: 0 }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              </div>
              <Reveal delay={80}>
                <div style={{ direction: "ltr" }}>
                  <FeatureVisual kind={f.visual} />
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      ))}

      <section
        className="section surface-ink"
        style={{ background: "var(--ink)", color: "var(--paper)" }}
      >
        <div className="container">
          <SectionHead
            eyebrow="Tech specs"
            title="The numbers your eng team will ask about."
            align="center"
            maxWidth={620}
          />
          <div
            className="sec-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}
          >
            {SPECS.map(([n, l, sub]) => (
              <div
                key={l}
                className="card"
                style={{ padding: 24, background: "var(--ink-2)", borderColor: "var(--line)" }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 500,
                    letterSpacing: "-0.025em",
                    color: "var(--paper)",
                  }}
                >
                  {n}
                </div>
                <div style={{ marginTop: 6, fontSize: 13, color: "var(--paper)", fontWeight: 500 }}>
                  {l}
                </div>
                <div
                  style={{
                    marginTop: 2,
                    fontSize: 11,
                    color: "var(--mute-light)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {sub}
                </div>
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
