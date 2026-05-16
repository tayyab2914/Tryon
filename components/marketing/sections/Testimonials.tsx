import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead } from "@/components/marketing/ui";
import { TESTIMONIALS } from "@/lib/marketing-data";

export function Testimonials() {
  return (
    <section id="testimonials" className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container">
        <SectionHead
          eyebrow="What brands say"
          title="From skeptics, in <em>their own words</em>."
          maxWidth={620}
        />
        <div
          className="testi-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={i} delay={i * 80}>
              <div
                className="card"
                style={{
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 22,
                    lineHeight: 1.35,
                    letterSpacing: "-0.015em",
                    color: "var(--ink)",
                    marginBottom: 24,
                    flex: 1,
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    paddingTop: 20,
                    borderTop: "1px solid var(--paper-line)",
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 500 }}>{t.author}</div>
                    <div style={{ fontSize: 12, color: "var(--mute)" }}>{t.role}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 22,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        color: "var(--coral-deep)",
                      }}
                    >
                      {t.metric}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 10,
                        color: "var(--mute)",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {t.metricLabel}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
