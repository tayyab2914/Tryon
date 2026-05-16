import { Reveal } from "@/components/marketing/Reveal";
import { SectionHead } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { Mannequin, FlatlayGarment } from "@/components/marketing/Imagery";
import { BENTO_FEATURES, type BentoVisualKind } from "@/lib/marketing-data";

function BentoVisual({ kind }: { kind: BentoVisualKind }) {
  if (kind === "flatlay") {
    return (
      <div
        style={{
          position: "absolute",
          inset: "auto -10% -20% auto",
          width: "70%",
          aspectRatio: "1",
          background: "var(--ink)",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 30px 60px -20px rgba(0,0,0,0.25)",
        }}
      >
        <FlatlayGarment size={160} color="oklch(0.7 0.06 80)" />
      </div>
    );
  }
  if (kind === "multi") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: -8,
          right: -8,
          left: 24,
          display: "flex",
          gap: 8,
          justifyContent: "flex-end",
        }}
      >
        {["oklch(0.7 0.06 80)", "oklch(0.55 0.1 30)", "oklch(0.4 0.05 250)"].map((c, i) => (
          <div
            key={i}
            style={{
              width: 80,
              height: 110,
              borderRadius: 10,
              background: "var(--ink)",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              overflow: "hidden",
              transform: `translateY(${i * -8}px)`,
            }}
          >
            <Mannequin size={70} color="oklch(0.9 0.01 60)" accent={c} />
          </div>
        ))}
      </div>
    );
  }
  if (kind === "chart") {
    return (
      <div style={{ position: "absolute", bottom: 24, right: 24, left: 24, height: 100 }}>
        <svg viewBox="0 0 240 100" width="100%" height="100%">
          <defs>
            <linearGradient id="bento-chart-bg" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="oklch(0.70 0.20 30)" stopOpacity="0.35" />
              <stop offset="1" stopColor="oklch(0.70 0.20 30)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0 70 L40 60 L80 64 L120 40 L160 30 L200 22 L240 12 L240 100 L0 100 Z"
            fill="url(#bento-chart-bg)"
          />
          <path
            d="M0 70 L40 60 L80 64 L120 40 L160 30 L200 22 L240 12"
            fill="none"
            stroke="oklch(0.70 0.20 30)"
            strokeWidth="2"
          />
          <path
            d="M0 90 L40 88 L80 86 L120 84 L160 82 L200 80 L240 78"
            fill="none"
            stroke="var(--paper-line-strong)"
            strokeWidth="1.5"
            strokeDasharray="3,3"
          />
        </svg>
      </div>
    );
  }
  if (kind === "sizes") {
    return (
      <div style={{ position: "absolute", bottom: 24, right: 24, display: "flex", gap: 6 }}>
        {["XS", "S", "M", "L", "XL"].map((sz, i) => (
          <div
            key={sz}
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: `1px solid ${i === 2 ? "var(--coral)" : "var(--paper-line-strong)"}`,
              background: i === 2 ? "var(--coral)" : "transparent",
              color: i === 2 ? "#fff" : "var(--ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 13,
              fontWeight: 500,
              position: "relative",
            }}
          >
            {sz}
            {i === 2 && (
              <span
                style={{
                  position: "absolute",
                  bottom: -22,
                  left: "50%",
                  transform: "translateX(-50%)",
                  fontSize: 10,
                  fontFamily: "var(--font-mono)",
                  color: "var(--coral-deep)",
                  whiteSpace: "nowrap",
                }}
              >
                92% fit
              </span>
            )}
          </div>
        ))}
      </div>
    );
  }
  if (kind === "install") {
    return (
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          left: 24,
          background: "var(--ink)",
          borderRadius: 10,
          padding: "12px 14px",
          fontFamily: "var(--font-mono)",
          fontSize: 11.5,
          color: "var(--paper)",
          lineHeight: 1.6,
        }}
      >
        <span style={{ color: "var(--mute-light-2)" }}>$ </span>
        npm i <span style={{ color: "oklch(0.78 0.14 60)" }}>@fitroom/widget</span>
        <br />
        <span style={{ color: "var(--mute-light-2)" }}>→</span> installed in{" "}
        <span style={{ color: "var(--emerald)" }}>4.2s</span>
      </div>
    );
  }
  if (kind === "security") {
    return (
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 24,
          bottom: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {["SOC 2", "GDPR", "BIPA", "ISO"].map((b) => (
          <div
            key={b}
            style={{
              padding: "8px 14px",
              border: "1px solid var(--paper-line-strong)",
              borderRadius: 999,
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              background: "var(--paper)",
              color: "var(--ink)",
            }}
          >
            {b}
          </div>
        ))}
      </div>
    );
  }
  return null;
}

export function Bento() {
  return (
    <section id="features" className="section" style={{ background: "var(--paper-2)" }}>
      <div className="container">
        <SectionHead
          eyebrow="Built for fashion"
          title="A try-on stack <em>your brand</em> can actually ship."
          lede="Every brand told us the same thing: AI demos are easy, production-grade try-on is hard. We built FitRoom AI for production from day one."
          maxWidth={720}
        />

        <div
          className="bento-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridAutoRows: "280px",
            gap: 16,
          }}
        >
          {BENTO_FEATURES.map((f, i) => {
            const FeatureIcon = Icons[f.icon];
            return (
              <Reveal
                key={f.title}
                delay={i * 60}
                className={`bento-${f.span ?? "std"}`}
                style={{
                  gridColumn: f.span === "wide" ? "span 2" : "span 1",
                  gridRow: f.span === "tall" ? "span 2" : "span 1",
                }}
              >
                <div
                  className="card card-hover"
                  style={{
                    padding: 24,
                    height: "100%",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--paper-2)",
                      border: "1px solid var(--paper-line)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 16,
                    }}
                  >
                    <FeatureIcon size={18} />
                  </div>
                  <h3 className="h3" style={{ marginBottom: 8, position: "relative", zIndex: 1 }}>
                    {f.title}
                  </h3>
                  <p className="body" style={{ position: "relative", zIndex: 1, maxWidth: 320 }}>
                    {f.body}
                  </p>
                  <BentoVisual kind={f.visual} />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
