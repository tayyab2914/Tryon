import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { LEGAL } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Security — FitRoom AI",
  description:
    "How FitRoom AI handles shopper photos and brand catalogues: SOC 2, ISO 27001, GDPR, BIPA, encryption, and data residency.",
};

export default function SecurityPage() {
  return <LegalPage doc={LEGAL.security} />;
}
