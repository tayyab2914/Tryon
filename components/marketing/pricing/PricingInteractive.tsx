"use client";

import { Fragment, useState } from "react";
import { Reveal } from "@/components/marketing/Reveal";
import { Button, SectionHead } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";
import { TIERS } from "@/lib/marketing-data";

type Billing = "monthly" | "annual";
type Cell = boolean | string;

const MATRIX: { group: string; rows: [string, Cell, Cell, Cell, Cell][] }[] = [
  {
    group: "Core try-on",
    rows: [
      ["Monthly try-ons", "500", "5,000", "50,000", "Unlimited"],
      ["Stores", "1", "3", "Unlimited", "Unlimited"],
      ["Photoreal render", true, true, true, true],
      ["Median latency", "10s", "8s", "5s", "5s"],
      ["Outfit try-on", false, false, true, true],
      ["Pre-cached results", false, false, true, true],
    ],
  },
  {
    group: "Analytics & growth",
    rows: [
      ["Try-on analytics", "Basic", true, true, true],
      ["Return-impact dashboard", false, true, true, true],
      ["A/B testing", false, true, true, true],
      ["Cohort analysis", false, true, true, true],
      ["Klaviyo / Meta integrations", false, true, true, true],
      ["GA4 custom events", false, true, true, true],
    ],
  },
  {
    group: "Developer & branding",
    rows: [
      ["REST API + webhooks", false, false, true, true],
      ["White-label widget", false, false, true, true],
      ["Custom branding (colour + logo)", false, true, true, true],
      ["Mobile SDK (iOS / Android)", false, false, false, true],
      ["Model fine-tuning", false, false, false, true],
    ],
  },
  {
    group: "Security & support",
    rows: [
      ["SOC 2 / GDPR / BIPA", true, true, true, true],
      ["EU / US data residency", false, false, true, true],
      ["SSO (SAML / OIDC)", false, false, false, true],
      ["Support", "Email", "Priority email", "Slack · 4h SLA", "Dedicated CSM"],
      ["SLA", "99.5%", "99.9%", "99.95%", "99.99%"],
      ["DPA & custom MSA", false, false, false, true],
    ],
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "How are try-ons counted?",
    a: "A try-on counts when our model successfully returns an image to the shopper. Failed renders, in-progress jobs, and re-rolls on the same garment within 30 seconds are not counted. We never count internal QA traffic.",
  },
  {
    q: "Do you support Shopify Plus?",
    a: "Yes — our Shopify app supports both standard and Plus. Plus customers get script-tag-free installs, theme-app-extension support, and Markets-aware quotas.",
  },
  {
    q: "What happens if I exceed my plan?",
    a: "We never block your widget. Overages are billed at the rate listed on your plan ($0.04–$0.10 per try-on depending on tier), and we send a heads-up email when you cross 80%.",
  },
  {
    q: "Can I switch plans mid-month?",
    a: "Yes. Upgrades take effect immediately and we prorate the difference. Downgrades take effect at the next renewal — your features stay intact until then.",
  },
  {
    q: "How do you handle shopper photos?",
    a: "Photos are encrypted at rest (AES-256), auto-deleted within 24 hours, and never used to train models. We are SOC 2 Type II audited and BIPA-compliant. EU residency is available on Pro and above.",
  },
  {
    q: "Does this work with on-model imagery?",
    a: "Yes — and you can mix sources freely. We support flat-lay, ghost mannequin, and on-model inputs. Outputs are stylistically consistent regardless of input type.",
  },
  {
    q: "Do you charge per garment or per shopper?",
    a: "Per try-on render. A shopper can try 20 SKUs in one session — that's 20 try-ons. If we surface cached results (Pro+), those don't count against your quota.",
  },
  {
    q: "What's the contract length?",
    a: "Monthly plans are no-commit. Annual plans are 12 months billed upfront with a 20% discount. Enterprise contracts are typically 12–36 months with custom terms.",
  },
];

function BillingToggle({ billing, setBilling }: { billing: Billing; setBilling: (b: Billing) => void }) {
  return (
    <div
      style={{
        display: "inline-flex",
        background: "var(--paper-2)",
        border: "1px solid var(--paper-line)",
        borderRadius: 999,
        padding: 4,
      }}
    >
      {(["monthly", "annual"] as Billing[]).map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => setBilling(opt)}
          style={{
            padding: "8px 18px",
            fontSize: 14,
            fontWeight: 500,
            borderRadius: 999,
            border: "none",
            cursor: "pointer",
            background: billing === opt ? "var(--ink)" : "transparent",
            color: billing === opt ? "var(--paper)" : "var(--ink)",
            transition: "all 0.2s var(--ease)",
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {opt === "monthly" ? "Monthly" : "Annual"}
          {opt === "annual" && (
            <span
              style={{
                background: billing === "annual" ? "var(--coral)" : "transparent",
                color: billing === "annual" ? "#fff" : "var(--coral-deep)",
                border: billing === "annual" ? "none" : "1px solid var(--coral-soft)",
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                padding: "2px 6px",
                borderRadius: 999,
                letterSpacing: "0.04em",
              }}
            >
              −20%
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export function PricingClient() {
  const [billing, setBilling] = useState<Billing>("annual");
  const [open, setOpen] = useState<Set<number>>(new Set([0]));

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
        <BillingToggle billing={billing} setBilling={setBilling} />
      </div>

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
          const price = billing === "annual" ? t.annual : t.monthly;
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
                  href={t.id === "enterprise" ? "/demo" : "/signup"}
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
                  {t.features.map((f, j) => {
                    const heading = f.endsWith(":");
                    return (
                      <li
                        key={j}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                          opacity: heading ? 0.6 : 1,
                        }}
                      >
                        {!heading && (
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

      {/* Feature matrix */}
      <div style={{ marginTop: 88 }}>
        <SectionHead
          eyebrow="Compare all features"
          title="Every box, ticked."
          lede="Click a category to expand. Pro and Enterprise unlock the bulk of the developer features."
          align="center"
          maxWidth={620}
        />
      </div>
      <div className="card" style={{ overflow: "hidden" }}>

        <div style={{ overflowX: "auto" }}>
          <table
            style={{ width: "100%", minWidth: 760, borderCollapse: "collapse", fontSize: 14 }}
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
                    width: 280,
                  }}
                >
                  Feature
                </th>
                {TIERS.map((t) => (
                  <th
                    key={t.id}
                    style={{
                      padding: "20px 24px",
                      textAlign: "center",
                      fontSize: 14,
                      fontWeight: 500,
                      background: t.popular ? "rgba(14,14,16,0.04)" : "transparent",
                    }}
                  >
                    <div>{t.name}</div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 11,
                        color: "var(--mute)",
                        marginTop: 2,
                      }}
                    >
                      {typeof t.monthly === "number"
                        ? `$${billing === "annual" ? t.annual : t.monthly}/mo`
                        : "Custom"}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MATRIX.map((group, gi) => (
                <Fragment key={group.group}>
                  <tr
                    onClick={() =>
                      setOpen((prev) => {
                        const next = new Set(prev);
                        if (next.has(gi)) next.delete(gi);
                        else next.add(gi);
                        return next;
                      })
                    }
                    style={{
                      cursor: "pointer",
                      background: "var(--paper-2)",
                      borderBottom: "1px solid var(--paper-line)",
                    }}
                  >
                    <td
                      colSpan={5}
                      style={{
                        padding: "14px 24px",
                        fontFamily: "var(--font-mono)",
                        fontSize: 12,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        color: "var(--ink)",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          transform: open.has(gi) ? "rotate(90deg)" : "rotate(0deg)",
                          transition: "transform 0.2s var(--ease)",
                          marginRight: 10,
                        }}
                      >
                        ▸
                      </span>
                      {group.group}
                    </td>
                  </tr>
                  {open.has(gi) &&
                    group.rows.map((row, ri) => (
                      <tr key={ri} style={{ borderBottom: "1px solid var(--paper-line)" }}>
                        <td style={{ padding: "14px 24px", fontSize: 14 }}>{row[0]}</td>
                        {row.slice(1).map((cell, ci) => (
                          <td
                            key={ci}
                            style={{
                              padding: "14px 24px",
                              textAlign: "center",
                              background: TIERS[ci].popular ? "rgba(14,14,16,0.02)" : "transparent",
                            }}
                          >
                            {typeof cell === "boolean" ? (
                              cell ? (
                                <Icons.Check size={16} style={{ color: "var(--ink)" }} />
                              ) : (
                                <Icons.Minus
                                  size={16}
                                  style={{ color: "var(--mute)", opacity: 0.4 }}
                                />
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
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      {FAQS.map((f, i) => (
        <div key={i} style={{ borderBottom: "1px solid var(--paper-line)" }}>
          <button
            type="button"
            onClick={() => setOpen(open === i ? -1 : i)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "24px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 16,
              cursor: "pointer",
              background: "none",
              border: "none",
            }}
          >
            <span style={{ fontSize: 17, fontWeight: 500, letterSpacing: "-0.01em" }}>{f.q}</span>
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: 999,
                border: "1px solid var(--paper-line-strong)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                transition: "all 0.2s var(--ease)",
                transform: open === i ? "rotate(45deg)" : "rotate(0)",
                background: open === i ? "var(--ink)" : "transparent",
                color: open === i ? "var(--paper)" : "var(--ink)",
              }}
            >
              <Icons.Plus size={14} />
            </span>
          </button>
          {open === i && (
            <div
              style={{
                paddingBottom: 24,
                maxWidth: 640,
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--mute)",
              }}
            >
              {f.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
