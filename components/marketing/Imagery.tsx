/**
 * Real-photo primitives. `Mannequin` shows an on-model shot, `FlatlayGarment`
 * a flat-lay — both pick a stable look from the catalog via a hashed seed.
 */
import Image from "next/image";
import { REAL_LOOKS } from "@/lib/marketing-data";

function hashSeed(value: string | number): number {
  const s = String(value);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function pickLook(seed: number | undefined, fallback: string | number) {
  const index = (seed ?? hashSeed(fallback)) % REAL_LOOKS.length;
  return REAL_LOOKS[index];
}

export function Mannequin({
  size = 240,
  color,
  accent,
  seed,
  ratio = "3 / 4",
}: {
  size?: number;
  color?: string;
  accent?: string;
  seed?: number;
  ratio?: string;
}) {
  const look = pickLook(seed, accent ?? color ?? size);
  return (
    <div
      style={{
        width: size,
        aspectRatio: ratio,
        borderRadius: Math.min(14, size * 0.06),
        overflow: "hidden",
        background: look.color,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Image src={look.model} alt="" fill sizes={`${size}px`} style={{ objectFit: "cover" }} />
    </div>
  );
}

export function FlatlayGarment({
  size = 200,
  color,
  seed,
}: {
  size?: number;
  color?: string;
  seed?: number;
}) {
  const look = pickLook(seed, color ?? size);
  return (
    <div
      style={{
        width: size,
        aspectRatio: "1",
        borderRadius: Math.min(12, size * 0.06),
        overflow: "hidden",
        background: look.color,
        position: "relative",
        flexShrink: 0,
      }}
    >
      <Image src={look.flat} alt="" fill sizes={`${size}px`} style={{ objectFit: "cover" }} />
    </div>
  );
}
