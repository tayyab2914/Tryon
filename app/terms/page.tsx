import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { LEGAL } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "Terms of Service — FitRoom AI",
  description: "The terms that govern access to and use of FitRoom AI services.",
};

export default function TermsPage() {
  return <LegalPage doc={LEGAL.terms} />;
}
