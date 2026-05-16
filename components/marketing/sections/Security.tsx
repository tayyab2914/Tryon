import { SECURITY } from "@/lib/marketing-data";

export function Security() {
  return (
    <section style={{ padding: "64px 0" }}>
      <div className="container">
        <div
          className="sec-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16 }}
        >
          {SECURITY.map((s) => (
            <div
              key={s.name}
              style={{
                border: "1px solid var(--paper-line)",
                borderRadius: "var(--r-md)",
                padding: "20px 18px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.01em" }}>
                {s.name}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--mute)",
                  fontFamily: "var(--font-mono)",
                  marginTop: 4,
                }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
