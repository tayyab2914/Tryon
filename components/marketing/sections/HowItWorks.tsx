import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { STEPS } from "@/lib/marketing-data";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="section">
      <div className="container">
        <SectionHead
          eyebrow="How it works"
          title="From catalog to checkout, <em>in four steps</em>."
          lede="Drop one script tag. The widget handles the rest — capture, render, recommend, and route shoppers to the right size."
          align="center"
          maxWidth={680}
        />

        <div style={{ position: "relative" }}>
          <div
            className="hiw-line"
            style={{
              position: "absolute",
              top: 28,
              left: "6%",
              right: "6%",
              height: 1,
              background:
                "repeating-linear-gradient(to right, var(--paper-line-strong), var(--paper-line-strong) 4px, transparent 4px, transparent 8px)",
              zIndex: 0,
            }}
          />

          <div
            className="hiw-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 24,
              position: "relative",
              zIndex: 1,
            }}
          >
            {STEPS.map((s, i) => {
              const StepIcon = Icons[s.icon];
              return (
                <Reveal key={s.n} delay={i * 100}>
                  <div style={{ position: "relative", textAlign: "left" }}>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 14,
                        background: "var(--paper)",
                        border: "1px solid var(--paper-line-strong)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 20,
                        position: "relative",
                      }}
                    >
                      <StepIcon size={22} />
                      <div
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          width: 26,
                          height: 26,
                          borderRadius: 999,
                          background: "var(--ink)",
                          color: "var(--paper)",
                          fontFamily: "var(--font-mono)",
                          fontSize: 10,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 500,
                        }}
                      >
                        {s.n}
                      </div>
                    </div>
                    <h3 className="h3" style={{ marginBottom: 8 }}>
                      {s.title}
                    </h3>
                    <p className="body">{s.body}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
