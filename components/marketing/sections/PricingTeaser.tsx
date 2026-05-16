import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead, Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { TIERS } from "@/lib/marketing-data";

/** Compact pricing grid for the homepage — annual pricing, top 5 features. */
function PricingCards() {
  return (
    <div
      className="tiers-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: 12,
        alignItems: "stretch",
      }}
    >
      {TIERS.map((t, i) => {
        const price = t.annual;
        return (
          <Reveal key={t.id} delay={i * 60}>
            <div
              className="card"
              style={{
                padding: 28,
                height: "100%",
                display: "flex",
                flexDirection: "column",
                background: t.popular ? "var(--ink)" : "#fff",
                color: t.popular ? "var(--paper)" : "var(--ink)",
                borderColor: t.popular ? "var(--ink)" : "var(--paper-line)",
                position: "relative",
              }}
            >
              {t.popular && (
                <div
                  style={{
                    position: "absolute",
                    top: -10,
                    left: 24,
                    background: "var(--coral)",
                    color: "#fff",
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    padding: "4px 10px",
                    borderRadius: 999,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontWeight: 500,
                  }}
                >
                  most popular
                </div>
              )}
              <div style={{ marginBottom: 16 }}>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    fontFamily: "var(--font-mono)",
                    opacity: 0.7,
                  }}
                >
                  {t.name}
                </div>
                <p
                  style={{
                    margin: "6px 0 0",
                    fontSize: 13.5,
                    lineHeight: 1.4,
                    color: t.popular ? "var(--mute-light)" : "var(--mute)",
                  }}
                >
                  {t.tagline}
                </p>
              </div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                  {typeof price === "number" ? (
                    <>
                      <span
                        style={{
                          fontSize: 44,
                          fontWeight: 500,
                          letterSpacing: "-0.03em",
                          lineHeight: 1,
                        }}
                      >
                        ${price}
                      </span>
                      <span style={{ fontSize: 13, opacity: 0.6 }}>/ mo</span>
                    </>
                  ) : (
                    <span
                      style={{
                        fontSize: 36,
                        fontWeight: 500,
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                      }}
                    >
                      {price}
                    </span>
                  )}
                </div>
                <div
                  style={{
                    marginTop: 6,
                    fontSize: 12,
                    fontFamily: "var(--font-mono)",
                    color: t.popular ? "var(--mute-light)" : "var(--mute)",
                  }}
                >
                  {t.quota}
                </div>
              </div>

              <Button
                href="/signup"
                variant={t.popular ? "primary" : "ghost"}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 24,
                  ...(t.popular ? { background: "var(--paper)", color: "var(--ink)" } : {}),
                }}
              >
                {t.cta} <Icons.Arrow size={14} />
              </Button>

              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                  fontSize: 13,
                  flex: 1,
                }}
              >
                {t.features.slice(0, 5).map((f, j) => {
                  const isHeading = f.endsWith(":");
                  return (
                    <li
                      key={j}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        opacity: isHeading ? 0.6 : 1,
                      }}
                    >
                      {!isHeading && (
                        <Icons.Check
                          size={14}
                          style={{
                            marginTop: 3,
                            color: t.popular ? "var(--coral)" : "var(--ink)",
                            flexShrink: 0,
                          }}
                        />
                      )}
                      <span>{f}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

export function PricingTeaser() {
  return (
    <section id="pricing" className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container">
        <SectionHead
          eyebrow="Pricing"
          title="Built to <em>scale with you</em>."
          lede="Start at $49/mo. Upgrade only when your try-on volume earns it. Every tier includes our full SDK and dashboard."
          align="center"
          maxWidth={620}
        />
        <PricingCards />
        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Button href="/signup" variant="ghost">
            See full feature matrix <Icons.Arrow size={14} />
          </Button>
        </div>
      </div>
    </section>
  );
}
