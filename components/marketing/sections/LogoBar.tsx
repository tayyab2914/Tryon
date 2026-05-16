import { BrandWord } from "@/components/marketing/ui";
import { BRAND_LOGOS } from "@/lib/marketing-data";

export function LogoBar() {
  return (
    <section style={{ padding: "32px 0 56px", borderTop: "1px solid var(--paper-line)" }}>
      <div className="container">
        <div className="marquee" style={{ height: 32 }}>
          <div className="marquee-track" style={{ alignItems: "center", color: "var(--mute)" }}>
            {[...BRAND_LOGOS, ...BRAND_LOGOS].map((b, i) => (
              <BrandWord
                key={i}
                name={b.name}
                italic={b.italic}
                weight={b.weight}
                mono={b.mono}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
