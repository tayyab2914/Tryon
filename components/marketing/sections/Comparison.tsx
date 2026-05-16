import { SectionHead } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { COMPARISON_COLS, COMPARISON_ROWS } from "@/lib/marketing-data";

export function Comparison() {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="How we compare"
          title="A category of <em>one</em>, if you actually need it to ship."
          maxWidth={680}
        />
        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                minWidth: 760,
                borderCollapse: "collapse",
                fontSize: 14,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--paper-line)" }}>
                  <th
                    style={{
                      padding: "20px 24px",
                      textAlign: "left",
                      fontSize: 12,
                      fontFamily: "var(--font-mono)",
                      color: "var(--mute)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      fontWeight: 500,
                    }}
                  >
                    Feature
                  </th>
                  {COMPARISON_COLS.map((c, i) => (
                    <th
                      key={c}
                      style={{
                        padding: "20px 24px",
                        textAlign: "center",
                        fontWeight: 500,
                        fontSize: 14,
                        background: i === 0 ? "var(--ink)" : "transparent",
                        color: i === 0 ? "var(--paper)" : "var(--ink)",
                        position: "relative",
                      }}
                    >
                      {c}
                      {i === 0 && (
                        <div
                          style={{
                            fontFamily: "var(--font-mono)",
                            fontSize: 10,
                            color: "var(--coral)",
                            marginTop: 2,
                          }}
                        >
                          RECOMMENDED
                        </div>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row, i) => (
                  <tr
                    key={i}
                    style={{
                      borderBottom:
                        i === COMPARISON_ROWS.length - 1
                          ? "none"
                          : "1px solid var(--paper-line)",
                    }}
                  >
                    <td style={{ padding: "16px 24px", fontSize: 14 }}>{row[0]}</td>
                    {row.slice(1).map((cell, j) => (
                      <td
                        key={j}
                        style={{
                          padding: "16px 24px",
                          textAlign: "center",
                          background: j === 0 ? "rgba(14,14,16,0.02)" : "transparent",
                        }}
                      >
                        {typeof cell === "boolean" ? (
                          cell ? (
                            <span
                              style={{
                                display: "inline-flex",
                                width: 24,
                                height: 24,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 999,
                                background: j === 0 ? "var(--ink)" : "var(--paper-2)",
                                color: j === 0 ? "var(--paper)" : "var(--mute)",
                              }}
                            >
                              <Icons.Check size={14} />
                            </span>
                          ) : (
                            <span style={{ color: "var(--mute)", opacity: 0.4 }}>
                              <Icons.Minus size={16} />
                            </span>
                          )
                        ) : (
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: 13 }}>
                            {cell}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
