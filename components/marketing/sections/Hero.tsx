import { Reveal } from "@/components/marketing/Reveal";
import { Tag, Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { TryOnHero } from "@/components/marketing/TryOnHero";

const HERO_STATS: [string, string][] = [
  ["30%", "fewer returns"],
  ["25%", "conversion lift"],
  ["10s", "avg render"],
  ["200+", "brands shipped"],
];

export function Hero() {
  return (
    <section style={{ position: "relative", paddingTop: 48, paddingBottom: 96 }}>
      <div className="container">
        <div
          className="hero-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "0.85fr 1.25fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <Reveal>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
                <Tag dot>v3.1 · Outfit try-on live</Tag>
              </div>
            </Reveal>

            <Reveal delay={60}>
              <h1 className="display">
                See it on <em>you</em>.
                <br />
                Before you <em>buy</em>.
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="lede" style={{ marginTop: 28, maxWidth: 460 }}>
                Photoreal AI try-on for fashion. Ship in 5 minutes. Cut returns{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 600 }}>30%</strong>, lift
                conversion <strong style={{ color: "var(--ink)", fontWeight: 600 }}>25%</strong>.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div style={{ marginTop: 36, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Button href="/demo" variant="primary" size="lg">
                  Book a demo <Icons.Arrow size={16} />
                </Button>
                <Button href="/#how-it-works" variant="ghost" size="lg">
                  See it live
                </Button>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <div
                style={{
                  marginTop: 40,
                  display: "flex",
                  gap: 28,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                {HERO_STATS.map(([n, l]) => (
                  <div key={n} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <div style={{ fontSize: 22, fontWeight: 500, letterSpacing: "-0.02em" }}>{n}</div>
                    <div
                      style={{ fontSize: 12, color: "var(--mute)", fontFamily: "var(--font-mono)" }}
                    >
                      {l}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <TryOnHero />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
