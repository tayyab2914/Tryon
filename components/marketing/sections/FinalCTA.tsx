import { Button } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";

export function FinalCTA() {
  return (
    <section
      className="section surface-ink"
      style={{
        background: "var(--ink)",
        color: "var(--paper)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="grid-lines" style={{ position: "absolute", inset: 0, opacity: 0.5 }} />
      <div className="container" style={{ position: "relative", textAlign: "center" }}>
        <h2 className="display" style={{ color: "var(--paper)", maxWidth: 880, margin: "0 auto" }}>
          Ready to turn try-ons
          <br />
          into <em>checkouts</em>?
        </h2>
        <p
          className="lede"
          style={{ marginTop: 28, maxWidth: 540, marginLeft: "auto", marginRight: "auto" }}
        >
          Book a 20-minute demo. We&apos;ll render five of your own SKUs on a real shopper photo,
          live.
        </p>
        <div
          style={{ marginTop: 36, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}
        >
          <Button href="/demo" variant="primary" size="lg">
            Book a demo <Icons.Arrow size={16} />
          </Button>
          <Button href="/#pricing" variant="ghost" size="lg">
            See pricing
          </Button>
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 13,
            color: "var(--mute-light)",
            fontFamily: "var(--font-mono)",
          }}
        >
          no credit card · free for first 500 try-ons
        </div>
      </div>
    </section>
  );
}
