import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { LEGAL } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Privacy Policy — FitRoom AI",
  description: "How FitRoom AI collects, uses, and discloses information.",
};

export default function PrivacyPage() {
  return <LegalPage doc={LEGAL.privacy} />;
}
