/** Long-form content for the company / legal pages. */

export interface LegalSection {
  h: string;
  body?: string[];
  stats?: [string, string][];
  team?: [string, string, string][];
  partners?: string[];
  badges?: [string, string, string][];
}

export interface LegalDoc {
  eyebrow: string;
  title: string;
  intro: string;
  sections: LegalSection[];
}

export const LEGAL: Record<"about" | "security" | "privacy" | "terms", LegalDoc> = {
  about: {
    eyebrow: "Company",
    title: "We're building the fitting room the internet forgot.",
    intro:
      "FitRoom AI started in 2023 when our founders watched a friend return six dresses in one week. Today, 200+ brands use us to put the fitting room back into their online stores — and cut the waste it costs the planet to ship clothes nobody keeps.",
    sections: [
      {
        h: "What we believe",
        body: [
          "Returns are a design problem, not a logistics one. The 24.5% return rate isn't a fact of nature — it's the cost of buying clothes without trying them on.",
          "Generative AI is finally good enough to close that loop. Photoreal, photo-of-you try-on at sub-10s latency was science fiction two years ago. It is table stakes now.",
          "Brands deserve infrastructure that respects their craft. Our renders honour fabric drape, lighting, and silhouette — not the lowest-common-denominator avatar.",
        ],
      },
      {
        h: "By the numbers",
        stats: [
          ["32M+", "Try-ons rendered"],
          ["200+", "Brand customers"],
          ["$48M+", "Returns prevented"],
          ["22%", "Avg conversion lift"],
        ],
      },
      {
        h: "Leadership",
        team: [
          [
            "Léa Okonkwo",
            "CEO & co-founder",
            "Previously product lead at a major fashion marketplace. Stanford CS.",
          ],
          [
            "Tomás Riviera",
            "CTO & co-founder",
            "Built large-scale diffusion infrastructure at a foundation model lab. MIT EECS.",
          ],
          [
            "Imani Park",
            "Head of Customer",
            "Former VP Ecommerce, scaled DTC apparel from $5M to $80M.",
          ],
          [
            "Dr. Hana Eriksson",
            "Head of Research",
            "Garment physics PhD. Authored the 2024 paper on one-shot try-on diffusion.",
          ],
        ],
      },
      {
        h: "Backed by",
        partners: ["Index Ventures", "Sequoia", "LVMH Luxury Ventures", "a16z", "Cherry"],
      },
    ],
  },
  security: {
    eyebrow: "Trust & security",
    title: "Security is product.",
    intro:
      "FitRoom AI processes shopper photos and brand catalogues. We treat both with the seriousness they deserve. This page is the technical reality, not the marketing version.",
    sections: [
      {
        h: "Certifications",
        badges: [
          ["SOC 2", "Type II", "Audited annually by Prescient Assurance"],
          ["ISO 27001", "2022", "Renewed 2025"],
          ["GDPR", "EU + UK", "Article 28 DPA available"],
          ["CCPA", "California", "Privacy notice on request"],
          ["BIPA", "Illinois", "Biometric Information Privacy Act compliant"],
          ["HIPAA-ready", "On request", "For health-adjacent apparel partners"],
        ],
      },
      {
        h: "Data handling",
        body: [
          "Shopper photos are deleted within 24 hours of render unless the shopper opts in to save them. Median actual retention: 4.2 hours.",
          "Photos never leave the rendering region. EU shoppers render in eu-central-1; US in us-east-1.",
          "No third-party training. Your catalogue, your shoppers, your data — we don't use any of it to train models for other customers.",
          "Encryption in transit (TLS 1.3) and at rest (AES-256). Keys rotated every 90 days.",
        ],
      },
      {
        h: "Infrastructure",
        body: [
          "99.95% measured uptime over the trailing 12 months. Status page at status.fitroom.ai.",
          "Multi-region failover with sub-30-second RTO.",
          "All vendors gated by a dedicated security review. The list is available under NDA.",
        ],
      },
      {
        h: "Report a vulnerability",
        body: [
          "Email security@fitroom.ai with a description and proof of concept. We respond within 24 hours and reward valid reports through our bug bounty (up to $25K).",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal · Last updated April 12, 2026",
    title: "Privacy Policy",
    intro:
      'This Privacy Policy describes how FitRoom AI, Inc. ("FitRoom AI", "we", "us") collects, uses, and discloses information when you visit our website, use our products, or otherwise interact with us.',
    sections: [
      {
        h: "1. Information we collect",
        body: [
          "Account information you provide when signing up (name, work email, brand name, billing details).",
          "Shopper photos uploaded through the try-on widget, processed solely to render the try-on output.",
          "Telemetry from widget usage (anonymised impression counts, render success rates, conversion outcomes).",
          "Standard server logs (IP address, browser, timestamps) for security and abuse prevention.",
        ],
      },
      {
        h: "2. How we use information",
        body: [
          "To deliver the try-on render the shopper requested.",
          "To report aggregated, anonymised performance metrics to the brand that owns the storefront.",
          "To improve our service — within strict guardrails. Shopper photos are never used to train models.",
          "To comply with legal obligations and protect rights, safety, and property.",
        ],
      },
      {
        h: "3. Sharing",
        body: [
          "With the brand operating the storefront, limited to aggregated performance data and try-on outputs the shopper has chosen to save.",
          "With subprocessors necessary to operate the service (cloud compute, payment processing, email delivery).",
          "When required by law, regulation, or valid legal process.",
        ],
      },
      {
        h: "4. Your rights",
        body: [
          "Access, correct, or delete your personal data. Email privacy@fitroom.ai.",
          "Opt out of optional analytics in your account settings.",
          "Lodge a complaint with your local data protection authority.",
        ],
      },
      {
        h: "5. Retention",
        body: [
          "Shopper try-on photos: deleted within 24 hours unless saved by the shopper.",
          "Account data: retained for the life of the account plus 90 days after closure.",
          "Server logs: 30 days.",
        ],
      },
      {
        h: "6. Contact",
        body: ["Privacy questions: privacy@fitroom.ai. Data Protection Officer (EU): dpo@fitroom.ai."],
      },
    ],
  },
  terms: {
    eyebrow: "Legal · Last updated April 12, 2026",
    title: "Terms of Service",
    intro:
      'These Terms of Service ("Terms") govern your access to and use of FitRoom AI services. By using the Service, you agree to these Terms. If you are accepting on behalf of an organisation, you represent that you have authority to bind that organisation.',
    sections: [
      {
        h: "1. The Service",
        body: [
          "FitRoom AI provides virtual try-on infrastructure for clothing brands. The Service includes the rendering API, embeddable widget, dashboard, and supporting documentation.",
        ],
      },
      {
        h: "2. Your account",
        body: [
          "You are responsible for safeguarding your credentials and for all activity under your account.",
          "You must be authorised to bind the brand whose storefront you connect.",
          "You may not share credentials, resell the Service, or use it to compete with FitRoom AI.",
        ],
      },
      {
        h: "3. Acceptable use",
        body: [
          "No reverse-engineering, scraping, or attempting to extract model weights.",
          "No use of the Service to render images of minors or non-consenting individuals.",
          "No use of the Service for purposes that violate applicable law.",
        ],
      },
      {
        h: "4. Fees and billing",
        body: [
          "Fees are billed monthly or annually per your selected plan. Overage charges apply per the rate card.",
          "All fees are non-refundable except where required by law.",
        ],
      },
      {
        h: "5. Term & termination",
        body: [
          "These Terms remain in effect while you use the Service.",
          "Either party may terminate for material breach uncured after 30 days' notice.",
          "On termination, your access ends and exportable data remains available for 30 days.",
        ],
      },
      {
        h: "6. Warranties & disclaimers",
        body: [
          'The Service is provided "as is" except as expressly warranted in a written enterprise agreement. We disclaim all implied warranties to the maximum extent permitted by law.',
        ],
      },
      {
        h: "7. Limitation of liability",
        body: [
          "To the maximum extent permitted by law, neither party will be liable for indirect, consequential, or punitive damages. Our aggregate liability will not exceed fees paid in the prior 12 months.",
        ],
      },
      {
        h: "8. Governing law",
        body: [
          "These Terms are governed by the laws of the State of New York. Disputes will be resolved exclusively in the state and federal courts located in New York County, New York.",
        ],
      },
    ],
  },
};
