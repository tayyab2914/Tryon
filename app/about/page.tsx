import type { Metadata } from "next";
import { LegalPage } from "@/components/marketing/LegalPage";
import { LEGAL } from "@/lib/legal-content";

export const metadata: Metadata = {
  title: "About — FitRoom AI",
  description:
    "FitRoom AI builds virtual try-on infrastructure for fashion brands — putting the fitting room back into online stores.",
};

export default function AboutPage() {
  return <LegalPage doc={LEGAL.about} />;
}
