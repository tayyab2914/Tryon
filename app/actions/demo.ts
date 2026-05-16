"use server";

import { db } from "@/lib/db";
import { sendDemoConfirmation, sendDemoNotification } from "@/lib/mail";

export interface DemoFormState {
  error?: string;
  ok?: boolean;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Persists a "Book a demo" request from the marketing site. Returns a
 * state object the form uses to render inline errors or a success panel.
 */
export async function submitDemoRequest(
  _prev: DemoFormState,
  formData: FormData,
): Promise<DemoFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const company = String(formData.get("company") ?? "").trim();
  const website = String(formData.get("website") ?? "").trim();
  const catalogSize = String(formData.get("catalogSize") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) return { error: "Please enter your name." };
  if (!EMAIL_RE.test(email)) return { error: "Enter a valid work email." };
  if (!company) return { error: "Please tell us which brand you're with." };

  try {
    await db.demoRequest.create({
      data: {
        name,
        email,
        company,
        website: website || null,
        catalogSize: catalogSize || null,
        message: message || null,
      },
    });
  } catch (err) {
    console.error("demo request failed", err);
    return { error: "Something went wrong on our end. Please try again in a moment." };
  }

  // Email is best-effort: the lead is already saved, so a mail failure
  // shouldn't fail the submission. Both emails are attempted independently.
  const details = { name, email, company, website, catalogSize, message };
  const results = await Promise.allSettled([
    sendDemoConfirmation(details),
    sendDemoNotification(details),
  ]);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("demo email failed", result.reason);
    }
  }

  return { ok: true, email };
}
