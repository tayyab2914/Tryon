"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createHash, randomBytes } from "node:crypto";
import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/lib/mail";
import { appBaseUrl } from "@/lib/app-url";
import {
  checkAdminPassword,
  createAdminSession,
  destroyAdminSession,
  isAdmin,
  isAdminEnabled,
} from "@/lib/admin-session";

export interface AdminFormState {
  error?: string;
}

const VERIFY_TTL_MS = 1000 * 60 * 60 * 24;

/** Guards every management action — server actions are public endpoints. */
async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) throw new Error("Unauthorized");
}

export async function adminLoginAction(
  _: AdminFormState,
  formData: FormData,
): Promise<AdminFormState> {
  if (!isAdminEnabled()) {
    return { error: "Admin login is disabled — set ADMIN_PASSWORD in the environment." };
  }
  const password = String(formData.get("password") ?? "");
  if (!checkAdminPassword(password)) {
    return { error: "Incorrect password." };
  }
  await createAdminSession();
  redirect("/admin");
}

export async function adminLogoutAction(): Promise<void> {
  await destroyAdminSession();
  redirect("/admin/login");
}

/** Permanently deletes a brand and (via cascade) its try-ons and domains. */
export async function deleteBrandAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const brandId = String(formData.get("brandId") ?? "");
  if (!brandId) return;
  await db.brand.delete({ where: { id: brandId } });
  revalidatePath("/admin/brands");
  redirect("/admin/brands");
}

/** Manually marks a brand's email as verified. */
export async function verifyBrandEmailAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const brandId = String(formData.get("brandId") ?? "");
  if (!brandId) return;
  await db.brand.update({ where: { id: brandId }, data: { emailVerified: true } });
  revalidatePath(`/admin/brands/${brandId}`);
}

/** Issues a fresh verification email to a brand that hasn't verified yet. */
export async function resendBrandVerificationAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const brandId = String(formData.get("brandId") ?? "");
  if (!brandId) return;

  const brand = await db.brand.findUnique({
    where: { id: brandId },
    select: { id: true, email: true, emailVerified: true },
  });
  if (!brand || brand.emailVerified) return;

  await db.verificationToken.deleteMany({ where: { brandId } });
  const token = randomBytes(32).toString("hex");
  await db.verificationToken.create({
    data: {
      brandId,
      tokenHash: createHash("sha256").update(token).digest("hex"),
      expiresAt: new Date(Date.now() + VERIFY_TTL_MS),
    },
  });
  await sendVerificationEmail(brand.email, `${appBaseUrl()}/verify?token=${token}`);
  revalidatePath(`/admin/brands/${brandId}`);
}
