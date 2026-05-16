import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";
import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead, Tag } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { PricingClient, Faq } from "@/components/marketing/pricing/PricingInteractive";

export const metadata: Metadata = {
  title: "Pricing — FitRoom AI",
  description:
    "Plans from $49/mo. Every tier includes the full try-on stack — you only pay more when your shoppers actually use it.",
};

const COUNTED: [string, string][] = [
  [
    "One render = one try-on",
    "A try-on is counted only when our model returns a finished image. In-flight requests don't count.",
  ],
  [
    "Re-rolls are free for 30s",
    "If a shopper isn't happy and re-renders within 30s, it's one try-on. We'd rather they keep going than abandon.",
  ],
  [
    "Cached results are free on Pro+",
    "When the same shopper retries a previously-rendered garment, we serve the cached image without counting it again.",
  ],
  [
    "Failures and QA don't count",
    "If we fail to render, you owe us nothing. Internal test traffic from your dashboard is exempt by default.",
  ],
];

export default function PricingPage() {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      <section style={{ padding: "64px 0 48px", textAlign: "center" }}>
        <div className="container">
          <Reveal>
            <Tag>Pricing</Tag>
            <h1 className="display" style={{ marginTop: 20 }}>
              Pricing that <em>compounds</em> as you grow.
            </h1>
            <p className="lede" style={{ maxWidth: 620, margin: "24px auto 0" }}>
              Every plan includes the full try-on stack. You only pay more when the shoppers on your
              store actually use it.
            </p>
          </Reveal>
        </div>
      </section>

      <section style={{ paddingBottom: 96 }}>
        <div className="container">
          <PricingClient />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div
            className="roi-grid"
            style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 48 }}
          >
            <div>
              <div className="eyebrow" style={{ marginBottom: 12 }}>
                How try-ons are counted
              </div>
              <h3 className="h2" style={{ maxWidth: 320 }}>
                Pay for shoppers who actually try.
              </h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {COUNTED.map(([t, d]) => (
                <div
                  key={t}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "20px 0",
                    borderBottom: "1px solid var(--paper-line)",
                  }}
                >
                  <Icons.Check
                    size={18}
                    style={{ marginTop: 3, flexShrink: 0, color: "var(--coral)" }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 15 }}>{t}</div>
                    <p className="body" style={{ marginTop: 4 }}>
                      {d}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--paper-2)" }}>
        <div className="container">
          <SectionHead
            eyebrow="FAQ"
            title="The questions we hear most."
            align="center"
            maxWidth={620}
          />
          <Faq />
        </div>
      </section>

      <FinalCTA />
      <Footer />
    </div>
  );
}
