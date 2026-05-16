import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Reveal } from "@/components/marketing/Reveal";
import { Tag } from "@/components/marketing/ui";
import { DemoForm } from "@/components/marketing/DemoForm";

export const metadata: Metadata = {
  title: "Book a demo — FitRoom AI",
  description:
    "Book a 20-minute working session. We render five of your own SKUs on real shopper photos, live.",
};

const STEPS: { title: string; body: string }[] = [
  {
    title: "Share five SKUs",
    body: "Send links or images ahead of time — or just bring them to the call.",
  },
  {
    title: "Watch them render",
    body: "We generate photoreal try-on on real shopper photos, live, in seconds.",
  },
  {
    title: "Walk away with results",
    body: "Keep every render, a fit report, and a five-minute install plan.",
  },
];

const STATS: [string, string][] = [
  ["20 min", "no slides, all product"],
  ["5 SKUs", "rendered on real shoppers"],
  ["1 day", "to a working widget"],
];

export default function DemoPage() {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />

      <main className="container" style={{ paddingTop: 28, paddingBottom: 72 }}>
        {/* ---- Hero strip ---- */}
        <Reveal>
          <div style={{ maxWidth: 720 }}>
            <div className="eyebrow" style={{ marginBottom: 16 }}>
              Book a demo
            </div>
            <h1 className="h1">
              See your catalog on <em>real</em> shoppers.
            </h1>
            <p className="lede" style={{ marginTop: 20, maxWidth: 560 }}>
              A 20-minute working session — no slides. We render five of your own SKUs on real
              shopper photos while you watch, then hand you the results to keep.
            </p>
          </div>
        </Reveal>

        {/* ---- Split card: pitch + form ---- */}
        <Reveal delay={80}>
          <div
            className="card demo-split"
            style={{ marginTop: 44, borderRadius: "var(--r-xl)" }}
          >
            {/* Left — dark pitch panel */}
            <div className="surface-ink" style={{ position: "relative", padding: "44px 40px" }}>
              <div
                className="grid-lines"
                style={{ position: "absolute", inset: 0, opacity: 0.35 }}
                aria-hidden
              />
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                }}
              >
                <Tag coral style={{ alignSelf: "flex-start" }}>
                  20 minutes · free
                </Tag>
                <h2 className="h3" style={{ marginTop: 20, color: "var(--paper)" }}>
                  What happens in your session
                </h2>

                <div style={{ marginTop: 28, display: "flex", flexDirection: "column" }}>
                  {STEPS.map((step, i) => (
                    <div key={step.title}>
                      <div className="demo-step">
                        <span className="demo-step-num">{i + 1}</span>
                        <div style={{ paddingTop: 3 }}>
                          <div style={{ fontSize: 15, fontWeight: 500, color: "var(--paper)" }}>
                            {step.title}
                          </div>
                          <p
                            className="body"
                            style={{ marginTop: 4, fontSize: 14, maxWidth: 320 }}
                          >
                            {step.body}
                          </p>
                        </div>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div style={{ display: "flex" }}>
                          <div style={{ width: 30, display: "flex", justifyContent: "center" }}>
                            <div className="demo-step-line" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ flex: 1, minHeight: 28 }} />

                <div
                  style={{
                    paddingTop: 24,
                    borderTop: "1px solid var(--line)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 8,
                      fontSize: 13,
                      color: "var(--mute-light)",
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: 999,
                        background: "var(--emerald)",
                      }}
                    />
                    We reply within one business day
                  </div>
                  <div
                    style={{
                      fontSize: 12.5,
                      fontFamily: "var(--font-mono)",
                      color: "var(--mute-light-2)",
                    }}
                  >
                    no credit card · no commitment
                  </div>
                </div>
              </div>
            </div>

            {/* Right — form panel */}
            <div style={{ background: "#fff", padding: "44px 40px" }}>
              <h2 className="h3" style={{ marginBottom: 6 }}>
                Tell us about your brand
              </h2>
              <p className="body" style={{ marginBottom: 24 }}>
                A few details so we can tailor the renders to your catalog.
              </p>
              <DemoForm />
            </div>
          </div>
        </Reveal>

        {/* ---- Trust strip ---- */}
        <Reveal delay={140}>
          <div
            className="sec-grid"
            style={{
              marginTop: 36,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 1,
              background: "var(--paper-line)",
              border: "1px solid var(--paper-line)",
              borderRadius: "var(--r-lg)",
              overflow: "hidden",
            }}
          >
            {STATS.map(([value, label]) => (
              <div key={label} style={{ background: "var(--paper)", padding: "22px 24px" }}>
                <div style={{ fontSize: 24, fontWeight: 500, letterSpacing: "-0.02em" }}>
                  {value}
                </div>
                <div
                  style={{
                    marginTop: 4,
                    fontSize: 13,
                    color: "var(--mute)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </main>

      <Footer />
    </div>
  );
}
