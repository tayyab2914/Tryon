"use client";

import { useState } from "react";
import { SectionHead, Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";

function ROISlider({
  label,
  value,
  min,
  max,
  step,
  format,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: 22 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 10,
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500 }}>{label}</span>
        <span
          style={{
            fontSize: 16,
            fontWeight: 500,
            fontFamily: "var(--font-mono)",
            letterSpacing: "-0.01em",
          }}
        >
          {format(value)}
        </span>
      </div>
      <div style={{ position: "relative", height: 28 }}>
        <div
          style={{
            position: "absolute",
            top: 13,
            left: 0,
            right: 0,
            height: 2,
            background: "var(--paper-line-strong)",
            borderRadius: 999,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 13,
            left: 0,
            width: `${pct}%`,
            height: 2,
            background: "var(--ink)",
            borderRadius: 999,
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          aria-label={label}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: 28,
            opacity: 0,
            cursor: "pointer",
            margin: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 6,
            left: `calc(${pct}% - 8px)`,
            width: 16,
            height: 16,
            borderRadius: 999,
            background: "var(--ink)",
            border: "3px solid var(--paper)",
            boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
            pointerEvents: "none",
          }}
        />
      </div>
    </div>
  );
}

export function Roi() {
  const [revenue, setRevenue] = useState(10); // $M
  const [returnRate, setReturnRate] = useState(24); // %
  const [aov, setAov] = useState(120); // $

  const returnVolume = revenue * 1_000_000 * (returnRate / 100);
  const reduced = returnVolume * 0.3;
  const conversionLift = revenue * 1_000_000 * 0.25;
  const total = reduced + conversionLift;

  const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

  return (
    <section id="roi" className="section">
      <div className="container">
        <div
          className="roi-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.1fr",
            gap: 56,
            alignItems: "center",
          }}
        >
          <div>
            <SectionHead
              eyebrow="ROI calculator"
              title="See what FitRoom AI <em>returns</em>."
              lede="Drag the sliders to match your store. We'll show the realized impact based on our customer median: 30% fewer fit-related returns and a 25% conversion lift."
              maxWidth={520}
            />
            <Button href="/signup" variant="primary" size="lg">
              Get a tailored estimate <Icons.Arrow size={16} />
            </Button>
          </div>

          <div className="card" style={{ padding: 28 }}>
            <ROISlider
              label="Annual ecommerce revenue"
              value={revenue}
              min={1}
              max={500}
              step={1}
              format={(v) => (v < 1000 ? `$${v}M` : `$${(v / 1000).toFixed(1)}B`)}
              onChange={setRevenue}
            />
            <ROISlider
              label="Current return rate"
              value={returnRate}
              min={5}
              max={60}
              step={1}
              format={(v) => `${v}%`}
              onChange={setReturnRate}
            />
            <ROISlider
              label="Average order value"
              value={aov}
              min={20}
              max={500}
              step={5}
              format={(v) => `$${v}`}
              onChange={setAov}
            />

            <div
              style={{
                marginTop: 28,
                paddingTop: 24,
                borderTop: "1px dashed var(--paper-line-strong)",
              }}
            >
              <div className="eyebrow" style={{ marginBottom: 16 }}>
                Estimated annual impact
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 16,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>
                    RETURNS PREVENTED
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      letterSpacing: "-0.025em",
                      marginTop: 4,
                    }}
                  >
                    {fmt(reduced)}
                  </div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--mute)" }}>
                    CONVERSION LIFT
                  </div>
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 500,
                      letterSpacing: "-0.025em",
                      marginTop: 4,
                    }}
                  >
                    {fmt(conversionLift)}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "var(--ink)",
                  color: "var(--paper)",
                  borderRadius: 12,
                  padding: 20,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 11,
                      color: "var(--mute-light)",
                    }}
                  >
                    TOTAL ANNUAL UPLIFT
                  </div>
                  <div
                    style={{
                      fontSize: 36,
                      fontWeight: 500,
                      letterSpacing: "-0.03em",
                      marginTop: 4,
                    }}
                  >
                    {fmt(total)}
                  </div>
                </div>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "var(--coral)",
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  +{Math.round((total / (revenue * 1_000_000)) * 100)}% net
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
