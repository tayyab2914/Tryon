"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getCurrentBrand } from "@/lib/session";

export interface WidgetFormState {
  error?: string;
  ok?: boolean;
}

/** Persists the brand's try-on widget configuration from the admin panel. */
export async function updateWidgetSettings(
  _prev: WidgetFormState,
  formData: FormData,
): Promise<WidgetFormState> {
  const brand = await getCurrentBrand();
  if (!brand) return { error: "You must be signed in." };

  const enabled = formData.get("enabled") === "on";
  const buttonLabel = String(formData.get("buttonLabel") ?? "").trim() || "Try On with AI";
  const accentColor = String(formData.get("accentColor") ?? "").trim() || "#0c0c0c";
  const consentText = String(formData.get("consentText") ?? "").trim();

  if (!/^#[0-9a-fA-F]{6}$/.test(accentColor)) {
    return { error: "Accent color must be a hex value like #0c0c0c." };
  }
  if (buttonLabel.length > 40) {
    return { error: "Button label must be 40 characters or fewer." };
  }

  try {
    await db.widgetSettings.upsert({
      where: { brandId: brand.id },
      create: {
        brandId: brand.id,
        enabled,
        buttonLabel,
        accentColor,
        consentText: consentText || null,
      },
      update: { enabled, buttonLabel, accentColor, consentText: consentText || null },
    });
  } catch (err) {
    console.error("widget settings update failed", err);
    return { error: "Couldn't save your settings. Please try again." };
  }

  revalidatePath("/install");
  return { ok: true };
}
