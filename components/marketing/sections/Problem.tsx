import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead } from "@/components/marketing/ui";
import { PROBLEM_STATS } from "@/lib/marketing-data";

export function Problem() {
  return (
    <section
      className="section surface-ink"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="container">
        <SectionHead
          eyebrow="The problem"
          title="The cost of guessing &mdash; <em>a quarter of every cart</em> comes back."
          lede="Fit anxiety is the single largest hidden tax on fashion ecommerce. It shows up everywhere: in returns, in abandoned carts, in the customers you never see again."
          maxWidth={760}
        />

        <div
          className="problem-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}
        >
          {PROBLEM_STATS.map((s, i) => (
            <Reveal key={s.big} delay={i * 80}>
              <div
                className="card"
                style={{
                  padding: 28,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  background: "var(--ink-2)",
                  borderColor: "var(--line)",
                }}
              >
                <div
                  style={{
                    fontSize: "clamp(48px, 5vw, 64px)",
                    fontWeight: 500,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.95,
                    color: "var(--paper)",
                  }}
                >
                  {s.big}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontFamily: "var(--font-mono)",
                    fontSize: 12,
                    color: "var(--mute-light)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {s.label}
                </div>
                <p
                  style={{
                    marginTop: 20,
                    fontSize: 14.5,
                    lineHeight: 1.55,
                    color: "var(--mute-light)",
                    flex: 1,
                  }}
                >
                  {s.body}
                </p>
                <div
                  style={{
                    marginTop: 20,
                    paddingTop: 16,
                    borderTop: "1px solid var(--line)",
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    color: "var(--mute-light-2)",
                  }}
                >
                  source · {s.source}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
