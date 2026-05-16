import type { Metadata } from "next";
import { Nav } from "@/components/marketing/Nav";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/sections/Hero";
import { LogoBar } from "@/components/marketing/sections/LogoBar";
import { Problem } from "@/components/marketing/sections/Problem";
import { HowItWorks } from "@/components/marketing/sections/HowItWorks";
import { Bento } from "@/components/marketing/sections/Bento";
import { Roi } from "@/components/marketing/sections/Roi";
import { Integrations } from "@/components/marketing/sections/Integrations";
import { Testimonials } from "@/components/marketing/sections/Testimonials";
import { Comparison } from "@/components/marketing/sections/Comparison";
import { PricingTeaser } from "@/components/marketing/sections/PricingTeaser";
import { Security } from "@/components/marketing/sections/Security";
import { FinalCTA } from "@/components/marketing/sections/FinalCTA";

export const metadata: Metadata = {
  title: "FitRoom AI — Virtual try-on for fashion brands",
  description:
    "Photoreal AI try-on for fashion. Ship in 5 minutes, cut returns 30%, and lift conversion 25%.",
};

export default function LandingPage() {
  return (
    <div className="fitroom page-enter" style={{ minHeight: "100vh", background: "var(--paper)" }}>
      <Nav />
      <Hero />
      <LogoBar />
      <Problem />
      <HowItWorks />
      <Bento />
      <Roi />
      <Integrations />
      <Testimonials />
      <Comparison />
      <PricingTeaser />
      <Security />
      <FinalCTA />
      <Footer />
    </div>
  );
}
