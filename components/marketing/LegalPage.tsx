import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import type { LegalDoc } from "@/lib/legal-content";

const labelStyle: React.CSSProperties = {
  fontSize: 16,
  fontWeight: 500,
  color: "var(--mute)",
  fontFamily: "var(--font-mono)",
  textTransform: "uppercase",
  letterSpacing: "0.04em",
  paddingTop: 4,
  margin: 0,
};

export function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />
      <article>
        <div className="container" style={{ padding: "120px 0 64px", maxWidth: 880 }}>
          <div className="eyebrow">{doc.eyebrow}</div>
          <h1
            style={{
              fontSize: "clamp(36px, 5vw, 60px)",
              fontWeight: 500,
              letterSpacing: "-0.03em",
              lineHeight: 1.05,
              marginTop: 16,
              marginBottom: 24,
              textWrap: "balance",
            }}
          >
            {doc.title}
          </h1>
          <p style={{ fontSize: 19, color: "var(--mute)", lineHeight: 1.55, maxWidth: 720 }}>
            {doc.intro}
          </p>
        </div>

        <div className="container" style={{ padding: "32px 0 120px", maxWidth: 880 }}>
          {doc.sections.map((s, i) => (
            <section
              key={i}
              style={{ padding: "40px 0", borderTop: "1px solid var(--paper-line)" }}
            >
              <div
                className="roi-grid"
                style={{ display: "grid", gridTemplateColumns: "180px 1fr", gap: 40 }}
              >
                <h2 style={labelStyle}>{s.h}</h2>
                <div>
                  {s.body?.map((p, j) => (
                    <p
                      key={j}
                      style={{
                        fontSize: 16,
                        lineHeight: 1.65,
                        marginBottom: 14,
                        color: "var(--ink-2)",
                      }}
                    >
                      {p}
                    </p>
                  ))}

                  {s.stats && (
                    <div
                      style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}
                    >
                      {s.stats.map(([n, l]) => (
                        <div key={l}>
                          <div
                            style={{ fontSize: 40, fontWeight: 500, letterSpacing: "-0.025em" }}
                          >
                            {n}
                          </div>
                          <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 4 }}>
                            {l}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.team && (
                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                      {s.team.map(([n, r, b]) => (
                        <div key={n} style={{ display: "flex", gap: 16 }}>
                          <div
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: 12,
                              background: "var(--paper-2)",
                              flexShrink: 0,
                              border: "1px solid var(--paper-line)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily: "var(--font-serif)",
                              fontStyle: "italic",
                              fontSize: 22,
                              color: "var(--mute)",
                            }}
                          >
                            {n
                              .split(" ")
                              .map((w) => w[0])
                              .join("")}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 15, fontWeight: 500 }}>{n}</div>
                            <div style={{ fontSize: 13, color: "var(--mute)", marginBottom: 4 }}>
                              {r}
                            </div>
                            <div
                              style={{ fontSize: 14, color: "var(--ink-2)", lineHeight: 1.5 }}
                            >
                              {b}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {s.partners && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                      {s.partners.map((p) => (
                        <div
                          key={p}
                          style={{
                            padding: "8px 14px",
                            border: "1px solid var(--paper-line-strong)",
                            borderRadius: 999,
                            fontSize: 13,
                            fontFamily: "var(--font-mono)",
                          }}
                        >
                          {p}
                        </div>
                      ))}
                    </div>
                  )}

                  {s.badges && (
                    <div
                      style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}
                    >
                      {s.badges.map(([t, sub, b]) => (
                        <div key={t} className="card" style={{ padding: 18 }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                            <div style={{ fontSize: 17, fontWeight: 500 }}>{t}</div>
                            <div
                              style={{
                                fontFamily: "var(--font-mono)",
                                fontSize: 11,
                                color: "var(--mute)",
                              }}
                            >
                              {sub}
                            </div>
                          </div>
                          <div style={{ fontSize: 13, color: "var(--mute)", marginTop: 6 }}>
                            {b}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      </article>
      <Footer />
    </div>
  );
}
