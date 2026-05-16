import { INTEGRATIONS } from "@/lib/marketing-data";

export function Integrations() {
  return (
    <section id="integrations" className="section" style={{ paddingTop: 64, paddingBottom: 64 }}>
      <div className="container">
        <div
          className="integ-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2.4fr",
            gap: 48,
            alignItems: "center",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>
              Integrations
            </div>
            <h3 className="h3" style={{ maxWidth: 280, marginBottom: 12 }}>
              Plays nicely with your existing stack.
            </h3>
            <p className="body" style={{ maxWidth: 280 }}>
              One-click installs for the platforms you already use. Custom storefronts work too.
            </p>
          </div>
          <div
            className="integ-cards"
            style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}
          >
            {INTEGRATIONS.map((it) => (
              <div
                key={it.name}
                className="card card-hover"
                style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "var(--ink)",
                    color: "var(--paper)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {it.name[0]}
                </div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{it.name}</div>
                <div
                  style={{ fontSize: 11.5, color: "var(--mute)", fontFamily: "var(--font-mono)" }}
                >
                  {it.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
