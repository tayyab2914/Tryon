"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getCurrentBrand } from "@/lib/session";
import { checkDnsTxt, generateVerificationToken, normalizeHostname } from "@/lib/domain";

export interface DomainFormState {
  error?: string;
  ok?: boolean;
}

function isUniqueViolation(err: unknown): boolean {
  return err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002";
}

/** Registers a new (unverified) domain for the signed-in brand. */
export async function addDomain(
  _prev: DomainFormState,
  formData: FormData,
): Promise<DomainFormState> {
  const brand = await getCurrentBrand();
  if (!brand) return { error: "You must be signed in." };

  const hostname = normalizeHostname(String(formData.get("hostname") ?? ""));
  if (!hostname) {
    return { error: "Enter a valid domain like example.com." };
  }

  try {
    await db.domain.create({
      data: { brandId: brand.id, hostname, token: generateVerificationToken() },
    });
  } catch (err) {
    if (isUniqueViolation(err)) {
      return { error: "You've already added that domain." };
    }
    console.error("addDomain failed", err);
    return { error: "Couldn't add that domain. Please try again." };
  }

  revalidatePath("/install");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Runs the DNS TXT check for a domain and marks it verified on success. */
export async function verifyDomain(
  _prev: DomainFormState,
  formData: FormData,
): Promise<DomainFormState> {
  const brand = await getCurrentBrand();
  if (!brand) return { error: "You must be signed in." };

  const domainId = String(formData.get("domainId") ?? "").trim();
  const domain = await db.domain.findFirst({
    where: { id: domainId, brandId: brand.id },
  });
  if (!domain) return { error: "Domain not found." };
  if (domain.verified) return { ok: true };

  // Squatting guard: one verified holder per hostname, regardless of DNS.
  const claimed = await db.domain.findFirst({
    where: { hostname: domain.hostname, verified: true, NOT: { brandId: brand.id } },
    select: { id: true },
  });
  if (claimed) {
    return {
      error: "This domain is already verified by another account. Contact support if you own it.",
    };
  }

  const result = await checkDnsTxt(domain.hostname, domain.token);
  if (!result.ok) return { error: result.reason };

  try {
    await db.domain.update({
      where: { id: domain.id },
      data: { verified: true, verifiedAt: new Date() },
    });
  } catch (err) {
    console.error("verifyDomain update failed", err);
    return { error: "Couldn't save the verification. Please try again." };
  }

  revalidatePath("/install");
  return { ok: true };
}

/** Removes a domain. Removing the last verified domain re-disables the widget. */
export async function removeDomain(
  _prev: DomainFormState,
  formData: FormData,
): Promise<DomainFormState> {
  const brand = await getCurrentBrand();
  if (!brand) return { error: "You must be signed in." };

  const domainId = String(formData.get("domainId") ?? "").trim();
  await db.domain.deleteMany({ where: { id: domainId, brandId: brand.id } });

  revalidatePath("/install");
  revalidatePath("/dashboard");
  return { ok: true };
}
