"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import { Icons } from "@/components/marketing/icons";

/**
 * Cinematic, auto-playing "video" of the full AI try-on flow with an animated
 * cursor. ~16s loop: PDP → upload → process → result → repeat.
 * Timing is ported verbatim from the prototype; playback pauses off-screen.
 *
 * The three photos below drive the demo. To use your own branded images,
 * drop files into /public/hero/ and point these constants at them, e.g.
 *   const HERO_DRESS_MODEL = "/hero/dress-model.jpg";
 * Defaults are hosted photos so the demo renders out of the box.
 */
   const HERO_DRESS_MODEL = "/hero/dress-model.jpg";
   const HERO_USER_PHOTO = "/hero/selfie.jpg";
   const HERO_RESULT_PHOTO = "/hero/result.jpg";

const LOOP = 16;
const T_TRYON_CLICK = 2.5;
const T_UPLOAD_CLICK = 3.5;
const T_ADDBAG_CLICK = 11.3;

/** Confetti burst particles — static so server/client render stays identical. */
const CONFETTI = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const dist = 46 + (i % 4) * 16;
  return {
    tx: `${Math.round(Math.cos(angle) * dist)}px`,
    ty: `${Math.round(Math.sin(angle) * dist - 16)}px`,
    rot: `${(i % 2 ? 1 : -1) * (160 + i * 26)}deg`,
    color: ["#722F37", "#B89968", "oklch(0.6 0.14 160)", "#1A1714"][i % 4],
    size: i % 3 === 0 ? 8 : 6,
    delay: `${(i % 6) * 35}ms`,
  };
});

type Point = { x: number; y: number };
type CursorState = Point & { click?: boolean; hidden?: boolean };

function ease(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

function lerp(a: Point, b: Point, p: number, click: boolean): CursorState {
  return { x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, click };
}

function Cursor({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.2}
      viewBox="0 0 20 24"
      fill="none"
      aria-hidden="true"
      style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.35))" }}
    >
      <path
        d="M3 2 L17 12 L11 13 L13 19 L10 20 L8 14 L3 18 Z"
        fill="#fff"
        stroke="#0E0E10"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TryOnHero() {
  const [t, setT] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  // Live click targets — measured from the real DOM each frame so the cursor
  // lands dead-on the buttons regardless of viewport size or layout shifts.
  const tryonBtnRef = useRef<HTMLButtonElement>(null);
  const uploadZoneRef = useRef<HTMLDivElement>(null);
  const addBagRef = useRef<HTMLButtonElement>(null);
  const [targets, setTargets] = useState<{ tryon: Point; upload: Point; addBag: Point }>({
    tryon: { x: 78, y: 88 },
    upload: { x: 50, y: 52 },
    addBag: { x: 50, y: 90 },
  });

  // Phones get a taller (4:5) stage so the modal and its content never clip;
  // desktop stays wide (4:3). Tracked in JS so the ratio is set inline and
  // always applies — no CSS specificity fight with the component's styles.
  const [isPhone, setIsPhone] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 700px)");
    const sync = () => setIsPhone(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let raf = 0;
    let start = performance.now();
    let visible = true;

    // Convert an element's centre into a percentage of the stage rect.
    const measure = () => {
      const stage = rootRef.current?.getBoundingClientRect();
      if (!stage || stage.width === 0) return;
      const pct = (el: Element | null, fallback: Point): Point => {
        if (!el) return fallback;
        const r = el.getBoundingClientRect();
        return {
          x: ((r.left + r.width / 2 - stage.left) / stage.width) * 100,
          y: ((r.top + r.height / 2 - stage.top) / stage.height) * 100,
        };
      };
      setTargets((prev) => ({
        tryon: pct(tryonBtnRef.current, prev.tryon),
        upload: pct(uploadZoneRef.current, prev.upload),
        addBag: pct(addBagRef.current, prev.addBag),
      }));
    };

    const tick = (now: number) => {
      if (visible) {
        measure();
        setT(((now - start) / 1000) % LOOP);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pause playback while off-screen — keeps the loop seamless on return.
    let hiddenAt = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!visible) start += performance.now() - hiddenAt;
          visible = true;
        } else if (visible) {
          visible = false;
          hiddenAt = performance.now();
        }
      },
      { threshold: 0 },
    );
    if (rootRef.current) io.observe(rootRef.current);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, []);

  const phase =
    t < 2.6 ? "pdp" : t < 6.4 ? "upload" : t < 8.4 ? "process" : t < 14.5 ? "result" : "fade";

  const inClickFlash = (clickTime: number) => t > clickTime && t < clickTime + 0.25;

  // Targets come from the measured DOM, so the cursor lands on the real button.
  // Glide progress is clamped to [0,1] and finishes before each click so the
  // cursor is settled on the button when it fires — never overshoots.
  const cursor: CursorState = (() => {
    if (t < 1.0) return { x: 88, y: 22, click: false };
    if (t < 2.6) {
      // Reach the "Try it on" button by t≈2.3, before the 2.5s click.
      const p = ease(Math.min(1, (t - 1.0) / 1.3));
      return lerp({ x: 88, y: 22 }, targets.tryon, p, inClickFlash(T_TRYON_CLICK));
    }
    if (t < 2.95) return { ...targets.tryon, hidden: true };
    if (t < 3.5) {
      // Reach the upload zone by t≈3.4, before the 3.5s click.
      const p = ease(Math.min(1, (t - 2.95) / 0.45));
      return lerp(targets.tryon, targets.upload, p, inClickFlash(T_UPLOAD_CLICK));
    }
    if (t < 4.4) return { ...targets.upload, click: inClickFlash(T_UPLOAD_CLICK) };
    if (t < 6.4) return { x: 80, y: 78, click: false };
    if (t < 8.4) return { x: 50, y: 50, hidden: true };
    if (t < 14.5) {
      const tt = t - 8.4;
      if (tt < 0.8) return { x: 65, y: 30, hidden: true };
      if (tt < 2.3) {
        // Glide to the "Add to bag" button, reaching it by t≈10.7.
        const p = ease(Math.min(1, (tt - 0.8) / 1.5));
        return lerp({ x: 65, y: 30 }, targets.addBag, p, false);
      }
      return { ...targets.addBag, click: inClickFlash(T_ADDBAG_CLICK) };
    }
    return { ...targets.addBag, hidden: true };
  })();

  const secsLeft = phase === "result" ? Math.max(110, 120 - Math.floor(t - 8.4)) : 120;
  const mm = Math.floor(secsLeft / 60);
  const ss = String(secsLeft % 60).padStart(2, "0");

  const uploadProg =
    t < 3.5 ? 0 : t < 4.4 ? Math.min(1, (t - 3.5) / 0.9) : phase === "upload" ? 1 : 0;
  const procProg = Math.max(0, Math.min(1, (t - 6.4) / 2.0));

  const tryonFlash = phase === "pdp" && inClickFlash(T_TRYON_CLICK);
  const added = phase === "result" && t >= T_ADDBAG_CLICK;
  const celebrate = added && t < T_ADDBAG_CLICK + 2.6;

  return (
    <div
      ref={rootRef}
      className="tryon-hero"
      style={{
        position: "relative",
        background: "#FAF8F5",
        border: "1px solid rgba(26,23,20,0.10)",
        borderRadius: 22,
        overflow: "hidden",
        aspectRatio: isPhone ? "4 / 5" : "4 / 3",
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.35)",
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 36,
          background: "rgba(26,23,20,0.04)",
          borderBottom: "1px solid rgba(26,23,20,0.08)",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 12px",
        }}
      >
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#E57373" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#F0C24F" }} />
        <span style={{ width: 9, height: 9, borderRadius: 999, background: "#6FCF97" }} />
        <div
          style={{
            flex: 1,
            marginLeft: 10,
            marginRight: 10,
            height: 22,
            borderRadius: 6,
            background: "#fff",
            border: "1px solid rgba(26,23,20,0.08)",
            display: "flex",
            alignItems: "center",
            padding: "0 10px",
            fontFamily: "var(--font-mono)",
            fontSize: 10.5,
            color: "rgba(26,23,20,0.55)",
          }}
        >
          <Icons.Lock size={9} style={{ marginRight: 6 }} />
fitroom AI       </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "rgba(26,23,20,0.55)",
            padding: "2px 7px",
            background: "#fff",
            border: "1px solid rgba(26,23,20,0.08)",
            borderRadius: 999,
          }}
        >
          live demo
        </span>
      </div>

      {/* PDP underneath (always rendered, dimmed when the modal is up) */}
      <div
        style={{
          position: "absolute",
          top: 36,
          left: 0,
          right: 0,
          bottom: 0,
          background: "#FAF8F5",
          display: "grid",
          gridTemplateColumns: "1.05fr 1fr",
          gap: 16,
          padding: 16,
          filter: phase === "pdp" ? "none" : "blur(2px) brightness(0.85)",
          transition: "filter 0.35s ease",
        }}
      >
        {/* Gallery */}
        <div
          style={{
            background: "#F2EFE8",
            borderRadius: 6,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Image
            src={HERO_DRESS_MODEL}
            alt="Model wearing the Aurelia silk slip dress"
            fill
            sizes="(max-width: 920px) 90vw, 360px"
            style={{ objectFit: "cover" }}
          />
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(250,248,245,0.92)",
              backdropFilter: "blur(6px)",
              padding: "4px 9px",
              borderRadius: 999,
              fontSize: 10,
              fontFamily: "var(--font-mono)",
              color: "#1A1714",
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <span style={{ width: 5, height: 5, background: "#B89968", borderRadius: 999 }} />
            AI try-on available
          </div>
        </div>

        {/* Details */}
        <div style={{ padding: "6px 6px 0" }}>
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              letterSpacing: "0.14em",
              color: "rgba(26,23,20,0.55)",
              textTransform: "uppercase",
            }}
          >
            MAISON KIRA
          </div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(20px, 2.6vw, 32px)",
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              marginTop: 6,
              color: "#1A1714",
            }}
          >
            Aurelia Silk
            <br />
            Slip Dress
          </div>
          <div style={{ fontSize: 11, color: "rgba(26,23,20,0.55)", marginTop: 4 }}>
            Bias-cut midi · mulberry silk
          </div>
          <div
            style={{
              fontSize: 17,
              fontWeight: 500,
              marginTop: 14,
              letterSpacing: "-0.02em",
              color: "#1A1714",
            }}
          >
            $485
          </div>

          {/* Color dots */}
          <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
            {["#722F37", "#EFE6D8", "#1A1714", "#7A8770"].map((c, i) => (
              <span
                key={i}
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: 999,
                  background: c,
                  boxShadow:
                    i === 0
                      ? "0 0 0 1px #1A1714, 0 0 0 3px transparent"
                      : c === "#EFE6D8"
                        ? "inset 0 0 0 1px rgba(26,23,20,0.18)"
                        : "none",
                }}
              />
            ))}
          </div>

          {/* Size pills */}
          <div style={{ display: "flex", gap: 4, marginTop: 12 }}>
            {["XS", "S", "M", "L", "XL"].map((sz, i) => (
              <span
                key={sz}
                style={{
                  minWidth: 26,
                  height: 26,
                  padding: "0 6px",
                  borderRadius: 3,
                  border: "1px solid rgba(26,23,20,0.18)",
                  background: i === 2 ? "#1A1714" : "transparent",
                  color: i === 2 ? "#FAF8F5" : "#1A1714",
                  fontSize: 10,
                  fontWeight: 500,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textDecoration: i === 4 ? "line-through" : "none",
                  opacity: i === 4 ? 0.4 : 1,
                }}
              >
                {sz}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 16 }}>
            <button
              style={{
                height: 34,
                borderRadius: 3,
                background: "#1A1714",
                color: "#FAF8F5",
                border: "none",
                fontSize: 10.5,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Icons.Cart size={11} />
              Add to bag · Size M
            </button>
            <button
              ref={tryonBtnRef}
              style={{
                height: 34,
                borderRadius: 3,
                background: tryonFlash ? "#1A1714" : "transparent",
                color: tryonFlash ? "#FAF8F5" : "#1A1714",
                border: "1px solid #1A1714",
                fontSize: 10.5,
                fontWeight: 500,
                letterSpacing: "0.05em",
                textTransform: "uppercase",
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                overflow: "hidden",
                transition: "all 0.15s ease",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(110deg, transparent 30%, rgba(184,153,104,0.22) 50%, transparent 70%)",
                  backgroundSize: "200% 100%",
                  animation: "hero-shimmer 3s linear infinite",
                }}
              />
              <Icons.Sparkle size={11} />
              <span style={{ position: "relative" }}>Try it on with AI</span>
              <span
                style={{
                  position: "relative",
                  fontFamily: "var(--font-mono)",
                  fontSize: 8,
                  background: "#B89968",
                  color: "#fff",
                  padding: "1px 4px",
                  borderRadius: 2,
                  letterSpacing: "0.08em",
                }}
              >
                NEW
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Modal overlay — upload / process / result share this surface */}
      {phase !== "pdp" && phase !== "fade" && (
        <div
          style={{
            position: "absolute",
            top: 36,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(26,23,20,0.45)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "4%",
            animation: "hero-fade-in 0.3s ease both",
          }}
        >
          <div
            style={{
              background: "#FAF8F5",
              borderRadius: 8,
              width: "86%",
              maxWidth: phase === "result" ? 380 : 320,
              maxHeight: "94%",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.4)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              transition: "max-width 0.3s ease",
            }}
          >
            {/* Modal head */}
            <div
              style={{
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(26,23,20,0.08)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 3,
                    background: "#1A1714",
                    color: "#B89968",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "var(--font-mono)",
                    fontSize: 9,
                    fontWeight: 600,
                  }}
                >
                  FR
                </div>
                <div style={{ lineHeight: 1.15 }}>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 8,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "rgba(26,23,20,0.55)",
                    }}
                  >
                    FitRoom AI{phase === "result" ? " · result" : ""}
                  </div>
                  <div style={{ fontSize: 11.5, fontWeight: 500, color: "#1A1714" }}>
                    {phase === "upload" && "Try on the Aurelia Slip"}
                    {phase === "process" && "Rendering your try-on"}
                    {phase === "result" && "You in the Aurelia Slip"}
                  </div>
                </div>
              </div>
              <Icons.X size={11} style={{ color: "rgba(26,23,20,0.55)" }} />
            </div>

            {/* Result timer bar */}
            {phase === "result" && (
              <>
                <div
                  style={{
                    padding: "6px 12px",
                    background: "#F2EFE8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderBottom: "1px solid rgba(26,23,20,0.08)",
                    flexShrink: 0,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: 999,
                        background: "#722F37",
                        animation: "hero-pulse 1s infinite",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 8,
                          letterSpacing: "0.08em",
                          color: "rgba(26,23,20,0.55)",
                          textTransform: "uppercase",
                        }}
                      >
                        Auto-deletes in
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: 13,
                          fontWeight: 500,
                          color: "#1A1714",
                          fontFeatureSettings: "'tnum'",
                        }}
                      >
                        {mm}:{ss}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 9,
                      color: "rgba(26,23,20,0.55)",
                      fontFamily: "var(--font-mono)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <Icons.EyeOff size={10} />
                    No download
                  </div>
                </div>
                <div style={{ height: 2, background: "#E8E3D8" }}>
                  <div
                    style={{
                      height: "100%",
                      background: "#722F37",
                      width: `${(secsLeft / 120) * 100}%`,
                      transition: "width 0.5s linear",
                    }}
                  />
                </div>
              </>
            )}

            {/* Modal body */}
            <div style={{ padding: 12, flex: 1, minHeight: 0, overflow: "hidden" }}>
              {/* UPLOAD */}
              {phase === "upload" && (
                <>
                  <div
                    ref={uploadZoneRef}
                    style={{
                      border: "1.5px dashed rgba(26,23,20,0.18)",
                      background: "#F2EFE8",
                      borderRadius: 6,
                      padding: "24px 12px",
                      textAlign: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {uploadProg > 0.05 && (
                      <>
                        <div
                          style={{
                            position: "absolute",
                            inset: 0,
                            background: "#1A1714",
                            opacity: uploadProg,
                            transition: "opacity 0.2s ease",
                          }}
                        />
                        <Image
                          src={HERO_USER_PHOTO}
                          alt="Shopper's uploaded photo"
                          fill
                          sizes="320px"
                          style={{
                            objectFit: "contain",
                            opacity: uploadProg,
                            transition: "opacity 0.2s ease",
                          }}
                        />
                      </>
                    )}
                    <div
                      style={{
                        position: "relative",
                        opacity: Math.max(0, 1 - uploadProg * 1.6),
                      }}
                    >
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 999,
                          background: "#1A1714",
                          color: "#FAF8F5",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          marginBottom: 8,
                        }}
                      >
                        <Icons.Upload size={15} />
                      </div>
                      <div style={{ fontSize: 12, fontWeight: 500, color: "#1A1714" }}>
                        Drop your photo here
                      </div>
                      <div
                        style={{ fontSize: 10, color: "rgba(26,23,20,0.55)", marginTop: 2 }}
                      >
                        JPEG or PNG · up to 20MB
                      </div>
                    </div>
                    {uploadProg > 0 && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 2,
                          background: "rgba(26,23,20,0.1)",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            background: "#722F37",
                            width: `${uploadProg * 100}%`,
                            transition: "width 0.1s linear",
                          }}
                        />
                      </div>
                    )}
                    {uploadProg > 0.4 && uploadProg < 0.95 && (
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          top: `${((uploadProg - 0.4) / 0.55) * 100}%`,
                          height: 2,
                          background:
                            "linear-gradient(90deg, transparent, #B89968, transparent)",
                          boxShadow: "0 0 10px #B89968",
                        }}
                      />
                    )}
                  </div>
                  <div
                    style={{
                      marginTop: 10,
                      padding: "8px 10px",
                      background: "#F2EFE8",
                      borderRadius: 5,
                      fontSize: 10,
                      color: "rgba(26,23,20,0.55)",
                      display: "flex",
                      gap: 8,
                      alignItems: "center",
                    }}
                  >
                    <Icons.Lock size={11} style={{ color: "#1A1714", opacity: 0.6 }} />
                    <span>
                      <strong style={{ color: "#1A1714", fontWeight: 500 }}>Private.</strong>{" "}
                      Auto-deletes in 2 min · no download
                    </span>
                  </div>
                </>
              )}

              {/* PROCESS */}
              {phase === "process" && (
                <div style={{ textAlign: "center", padding: "14px 8px" }}>
                  <div style={{ width: 56, height: 56, margin: "0 auto 12px", position: "relative" }}>
                    <svg width="56" height="56" viewBox="0 0 56 56" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="28" cy="28" r="24" stroke="#F2EFE8" strokeWidth="4" fill="none" />
                      <circle
                        cx="28"
                        cy="28"
                        r="24"
                        stroke="#722F37"
                        strokeWidth="4"
                        fill="none"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 24}
                        strokeDashoffset={2 * Math.PI * 24 * (1 - procProg)}
                      />
                    </svg>
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {Math.round(procProg * 100)}%
                    </div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "#1A1714", marginBottom: 4 }}>
                    Working on it…
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(26,23,20,0.55)", marginBottom: 10 }}>
                    About 4–6 seconds
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                      maxWidth: 220,
                      margin: "0 auto",
                      textAlign: "left",
                    }}
                  >
                    {[
                      "Analysing your photo",
                      "Detecting body & pose",
                      "Fitting the Aurelia silhouette",
                      "Rendering photoreal result",
                    ].map((s, i) => {
                      const stepIdx = Math.min(3, Math.floor(procProg * 4));
                      const done = i < stepIdx;
                      const active = i === stepIdx;
                      return (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            padding: "5px 9px",
                            borderRadius: 5,
                            background: active ? "#1A1714" : "transparent",
                            color: active ? "#FAF8F5" : "rgba(26,23,20,0.55)",
                            fontSize: 10.5,
                            transition: "all 0.2s ease",
                          }}
                        >
                          <span
                            style={{
                              width: 11,
                              height: 11,
                              borderRadius: 999,
                              border: "1.5px solid currentColor",
                              background: done ? "#1A1714" : "transparent",
                              borderColor: done ? "#1A1714" : "currentColor",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: done ? "#FAF8F5" : "currentColor",
                              flexShrink: 0,
                            }}
                          >
                            {done && <Icons.Check size={7} />}
                          </span>
                          <span>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* RESULT */}
              {phase === "result" && (
                <div>
                  <div
                    style={{
                      position: "relative",
                      margin: "0 auto 8px",
                      maxWidth: 140,
                      aspectRatio: "3/4",
                      background: "#1A1714",
                      borderRadius: 5,
                      overflow: "hidden",
                    }}
                  >
                    <Image
                      src={HERO_RESULT_PHOTO}
                      alt="AI-rendered try-on result"
                      fill
                      sizes="140px"
                      style={{ objectFit: "contain", background: "#1A1714" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 36,
                        background:
                          "linear-gradient(to bottom, transparent, rgba(184,153,104,0.5), transparent)",
                        mixBlendMode: "screen",
                        top: `${((t * 30) % 140) - 20}%`,
                        pointerEvents: "none",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: 6,
                        left: 6,
                        background: "rgba(26,23,20,0.65)",
                        backdropFilter: "blur(4px)",
                        color: "#FAF8F5",
                        fontSize: 7,
                        fontFamily: "var(--font-mono)",
                        padding: "2px 5px",
                        borderRadius: 3,
                        letterSpacing: "0.04em",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span style={{ width: 4, height: 4, background: "#B89968", borderRadius: 999 }} />
                      FitRoom AI · auto-deletes
                    </div>
                    <div
                      style={{
                        position: "absolute",
                        top: 6,
                        right: 6,
                        background: "rgba(26,23,20,0.65)",
                        backdropFilter: "blur(4px)",
                        color: "#FAF8F5",
                        fontSize: 7,
                        fontFamily: "var(--font-mono)",
                        padding: "2px 5px",
                        borderRadius: 3,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 3,
                      }}
                    >
                      <Icons.EyeOff size={8} />
                      Preview only
                    </div>
                  </div>

                  {/* Fit bar */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "6px 8px",
                      background: "#F2EFE8",
                      borderRadius: 5,
                      marginBottom: 6,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "oklch(0.55 0.13 160)",
                          letterSpacing: "-0.02em",
                          lineHeight: 1,
                        }}
                      >
                        94%
                      </div>
                      <div
                        style={{
                          fontSize: 7.5,
                          color: "rgba(26,23,20,0.55)",
                          fontFamily: "var(--font-mono)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                          marginTop: 2,
                        }}
                      >
                        fit confidence
                      </div>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        fontSize: 9,
                        color: "rgba(26,23,20,0.55)",
                        lineHeight: 1.3,
                      }}
                    >
                      Drapes well · size{" "}
                      <strong style={{ color: "#1A1714", fontWeight: 500 }}>M</strong>
                    </div>
                    <div
                      style={{
                        padding: "2px 7px",
                        background: "#1A1714",
                        color: "#FAF8F5",
                        borderRadius: 999,
                        fontSize: 8.5,
                        fontFamily: "var(--font-mono)",
                        fontWeight: 500,
                      }}
                    >
                      Size M
                    </div>
                  </div>

                  {/* Add to bag CTA — cursor parks on it, then clicks (t≈11.3) */}
                  <div style={{ position: "relative" }}>
                    {celebrate && (
                      <div
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: 14,
                          width: 0,
                          height: 0,
                          pointerEvents: "none",
                          zIndex: 6,
                        }}
                      >
                        {CONFETTI.map((c, i) => (
                          <span
                            key={i}
                            style={
                              {
                                position: "absolute",
                                width: c.size,
                                height: c.size,
                                background: c.color,
                                borderRadius: i % 2 ? "1px" : "999px",
                                animation: `hero-confetti 1.1s cubic-bezier(0.2,0.7,0.3,1) ${c.delay} forwards`,
                                "--tx": c.tx,
                                "--ty": c.ty,
                                "--rot": c.rot,
                              } as CSSProperties
                            }
                          />
                        ))}
                      </div>
                    )}
                    <button
                      ref={addBagRef}
                      style={{
                        width: "100%",
                        height: 28,
                        borderRadius: 3,
                        background: added ? "oklch(0.6 0.14 160)" : "#1A1714",
                        color: "#FAF8F5",
                        border: "none",
                        fontSize: 9.5,
                        fontWeight: 500,
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 6,
                        position: "relative",
                        zIndex: 5,
                        transform: !added && t > 10.5 ? "scale(1.01)" : "scale(1)",
                        boxShadow:
                          !added && t > 10.5 ? "0 0 0 3px rgba(114,47,55,0.18)" : "none",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {added ? <Icons.Check size={11} /> : <Icons.Cart size={10} />}
                      {added ? "Added to bag · Size M" : "Add to bag · Size M"}
                    </button>
                    {added && (
                      <div
                        style={{
                          marginTop: 6,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 5,
                          fontSize: 8.5,
                          fontFamily: "var(--font-mono)",
                          color: "oklch(0.5 0.13 160)",
                          animation: "hero-fade-in 0.3s ease both",
                        }}
                      >
                        <Icons.Sparkle size={9} />
                        Nice — the Aurelia Slip is in your bag
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Animated cursor */}
      {!cursor.hidden && (
        <div
          style={{
            position: "absolute",
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
            transform: `translate(-25%, -10%) scale(${cursor.click ? 0.85 : 1})`,
            // Short transition so the cursor tracks the per-frame glide tightly
            // and is on-target at click time — a long transition lags behind.
            transition: "left 0.18s linear, top 0.18s linear, transform 0.12s ease",
            pointerEvents: "none",
            zIndex: 50,
          }}
        >
          <Cursor size={22} />
        </div>
      )}

      {/* Click ripple */}
      {(inClickFlash(T_TRYON_CLICK) ||
        inClickFlash(T_UPLOAD_CLICK) ||
        inClickFlash(T_ADDBAG_CLICK)) && (
        <div
          style={{
            position: "absolute",
            left: `${cursor.x}%`,
            top: `${cursor.y}%`,
            width: 24,
            height: 24,
            marginLeft: -12,
            marginTop: -12,
            borderRadius: "50%",
            border: "2px solid rgba(184,153,104,0.7)",
            animation: "hero-ripple 0.5s ease-out",
            pointerEvents: "none",
            zIndex: 49,
          }}
        />
      )}
    </div>
  );
}
