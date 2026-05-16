"use client";

import { useState } from "react";
import { Reveal } from "@/components/marketing/Reveal";
import { Icons } from "@/components/marketing/icons";
import { Mannequin } from "@/components/marketing/Imagery";

interface CaseStudy {
  brand: string;
  cat: string;
  size: string;
  platform: string;
  headline: string;
  metric: string;
  metricLabel: string;
  color: string;
}

const CASE_STUDIES: CaseStudy[] = [
  {
    brand: "Maison Kira",
    cat: "Womenswear",
    size: "Mid-market",
    platform: "Shopify",
    headline: "Cut returns 32% on denim in Q1.",
    metric: "−32%",
    metricLabel: "denim returns",
    color: "oklch(0.4 0.05 250)",
  },
  {
    brand: "Northfold",
    cat: "Outerwear",
    size: "Enterprise",
    platform: "Magento",
    headline: "Lifted PDP conversion 2.4× on hero coats.",
    metric: "2.4×",
    metricLabel: "PDP conv",
    color: "oklch(0.32 0.04 180)",
  },
  {
    brand: "STÄRK Studio",
    cat: "Menswear",
    size: "Mid-market",
    platform: "Shopify",
    headline: "Recovered $1.8M GMV in the first 6 months.",
    metric: "+$1.8M",
    metricLabel: "GMV",
    color: "oklch(0.45 0.06 30)",
  },
  {
    brand: "éclat.",
    cat: "Womenswear",
    size: "Indie",
    platform: "WooCommerce",
    headline: "Hit 38% try-on adoption — first month.",
    metric: "38%",
    metricLabel: "adoption",
    color: "oklch(0.55 0.08 320)",
  },
  {
    brand: "Studio Vela",
    cat: "Swim",
    size: "Indie",
    platform: "Shopify",
    headline: "Doubled swim conversion for the new collection.",
    metric: "2.1×",
    metricLabel: "conversion",
    color: "oklch(0.55 0.08 200)",
  },
  {
    brand: "Paloma & co.",
    cat: "Loungewear",
    size: "Indie",
    platform: "Shopify",
    headline: "14-day payback on first store.",
    metric: "14d",
    metricLabel: "payback",
    color: "oklch(0.65 0.06 60)",
  },
  {
    brand: "OFFCUT",
    cat: "Streetwear",
    size: "Mid-market",
    platform: "Shopify",
    headline: "Outfit try-on lifted AOV 41%.",
    metric: "+41%",
    metricLabel: "AOV",
    color: "oklch(0.35 0.04 280)",
  },
  {
    brand: "Linn Atelier",
    cat: "Womenswear",
    size: "Indie",
    platform: "WooCommerce",
    headline: "From 28% to 14% returns on knitwear.",
    metric: "−14pp",
    metricLabel: "returns",
    color: "oklch(0.5 0.06 60)",
  },
  {
    brand: "Graphite",
    cat: "Menswear",
    size: "Enterprise",
    platform: "Magento",
    headline: "Rolled out across 11 EU markets in 6 weeks.",
    metric: "11",
    metricLabel: "markets",
    color: "oklch(0.3 0.02 250)",
  },
];

const FILTERS: Record<"cat" | "size" | "platform", string[]> = {
  cat: ["All", "Womenswear", "Menswear", "Outerwear", "Streetwear", "Loungewear", "Swim"],
  size: ["All", "Indie", "Mid-market", "Enterprise"],
  platform: ["All", "Shopify", "WooCommerce", "Magento"],
};

export function CaseStudyGrid() {
  const [filters, setFilters] = useState<Record<"cat" | "size" | "platform", string>>({
    cat: "All",
    size: "All",
    platform: "All",
  });

  const filtered = CASE_STUDIES.filter(
    (c) =>
      (filters.cat === "All" || c.cat === filters.cat) &&
      (filters.size === "All" || c.size === filters.size) &&
      (filters.platform === "All" || c.platform === filters.platform),
  );

  return (
    <>
      <div style={{ marginBottom: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        {(Object.keys(FILTERS) as ("cat" | "size" | "platform")[]).map((key) => (
          <div
            key={key}
            style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}
          >
            <div className="eyebrow" style={{ width: 80 }}>
              {key}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {FILTERS[key].map((o) => {
                const active = filters[key] === o;
                return (
                  <button
                    key={o}
                    type="button"
                    onClick={() => setFilters((f) => ({ ...f, [key]: o }))}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 999,
                      border: `1px solid ${active ? "var(--ink)" : "var(--paper-line)"}`,
                      background: active ? "var(--ink)" : "transparent",
                      color: active ? "var(--paper)" : "var(--ink)",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                      transition: "all 0.15s var(--ease)",
                    }}
                  >
                    {o}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div
        className="case-grid"
        style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
      >
        {filtered.map((c, i) => (
          <Reveal key={c.brand} delay={i * 40}>
            <div
              className="card card-hover"
              style={{
                padding: 0,
                overflow: "hidden",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  aspectRatio: "4/3",
                  background: c.color,
                  position: "relative",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Mannequin size={150} seed={i} />
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    left: 14,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "rgba(255,255,255,0.85)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {c.cat}
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: 14,
                    right: 14,
                    padding: "4px 10px",
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 999,
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    color: "#fff",
                  }}
                >
                  {c.platform}
                </div>
              </div>
              <div style={{ padding: 22, flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ fontSize: 14, fontWeight: 500, fontFamily: "var(--font-mono)" }}>
                  {c.brand}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 20,
                    lineHeight: 1.25,
                    letterSpacing: "-0.015em",
                    flex: 1,
                  }}
                >
                  {c.headline}
                </div>
                <div
                  style={{
                    marginTop: 18,
                    paddingTop: 16,
                    borderTop: "1px solid var(--paper-line)",
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        color: "var(--coral-deep)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {c.metric}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: "var(--mute)",
                        fontFamily: "var(--font-mono)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {c.metricLabel}
                    </div>
                  </div>
                  <Icons.ArrowUR size={18} style={{ opacity: 0.5 }} />
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{ textAlign: "center", padding: "48px 0", color: "var(--mute)", fontSize: 14 }}
        >
          No case studies match this filter combination. Try widening one filter.
        </div>
      )}
    </>
  );
}
