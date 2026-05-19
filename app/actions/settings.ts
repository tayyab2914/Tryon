"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentBrand } from "@/lib/session";
import type { TryOnLimitPeriod } from "@prisma/client";

export interface TryOnLimitState {
  error?: string;
  ok?: boolean;
}

const MIN_LIMIT = 1;
const MAX_LIMIT = 1000;

/**
 * Saves a brand's per-IP try-on rate limit (Settings → Try-on limits).
 * Scoped to the signed-in brand — a brand can only edit its own config.
 */
export async function updateTryOnLimitAction(
  _: TryOnLimitState,
  formData: FormData,
): Promise<TryOnLimitState> {
  const brand = await getCurrentBrand();
  if (!brand) return { error: "Your session has expired. Please sign in again." };

  const enabled = formData.get("enabled") === "on";
  const period = String(formData.get("period") ?? "");
  const perIp = Number(formData.get("perIp"));

  if (period !== "DAILY" && period !== "MONTHLY") {
    return { error: "Choose a daily or monthly limit." };
  }
  if (!Number.isInteger(perIp) || perIp < MIN_LIMIT || perIp > MAX_LIMIT) {
    return { error: `Limit must be a whole number between ${MIN_LIMIT} and ${MAX_LIMIT}.` };
  }

  await db.brand.update({
    where: { id: brand.id },
    data: {
      tryOnLimitEnabled: enabled,
      tryOnLimitPerIp: perIp,
      tryOnLimitPeriod: period as TryOnLimitPeriod,
    },
  });

  revalidatePath("/settings");
  return { ok: true };
}
