/**
 * Static content for the FitRoom AI marketing landing page.
 * Kept separate from components so copy can be edited without touching JSX.
 */
import type { IconName } from "@/components/marketing/icons";

export interface BrandLogo {
  name: string;
  italic?: boolean;
  weight?: number;
  mono?: boolean;
}

export const BRAND_LOGOS: BrandLogo[] = [
  { name: "MAISON KIRA", italic: false, weight: 600 },
  { name: "éclat.", italic: true, weight: 400 },
  { name: "NORTHFOLD", italic: false, weight: 500 },
  { name: "Studio Vela", italic: true, weight: 400 },
  { name: "STÄRK", italic: false, weight: 600 },
  { name: "paloma & co.", italic: true, weight: 400 },
  { name: "OFFCUT", italic: false, weight: 700 },
  { name: "Linn Atelier", italic: true, weight: 400 },
  { name: "GRAPHITE", italic: false, weight: 500 },
  { name: "odessa", mono: true, weight: 500 },
  { name: "BARRA NOVA", italic: false, weight: 500 },
  { name: "florent.", italic: true, weight: 400 },
];

export interface Look {
  name: string;
  sku: string;
  model: string;
  flat: string;
  color: string;
}

/** Real fashion photography used by the Mannequin / Flatlay primitives. */
export const REAL_LOOKS: Look[] = [
  {
    name: "Oversized Linen Blazer",
    sku: "LN-2241",
    model:
      "https://images.unsplash.com/photo-1485518882345-15568b007407?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.62 0.06 80)",
  },
  {
    name: "Wool Turtleneck — Sand",
    sku: "WT-0918",
    model:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.78 0.04 80)",
  },
  {
    name: "Pleated Trouser",
    sku: "PT-1130",
    model:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1542327897-d73f4005b533?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.32 0.02 250)",
  },
  {
    name: "Cropped Denim Jacket",
    sku: "DJ-3320",
    model:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.45 0.08 230)",
  },
  {
    name: "Silk Slip Dress",
    sku: "SS-3309",
    model:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.55 0.08 320)",
  },
  {
    name: "Cashmere Crewneck",
    sku: "CC-7702",
    model:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80&fit=crop&auto=format",
    flat: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=320&q=80&fit=crop&auto=format",
    color: "oklch(0.45 0.05 30)",
  },
];

export interface ProblemStat {
  big: string;
  label: string;
  body: string;
  source: string;
}

export const PROBLEM_STATS: ProblemStat[] = [
  {
    big: "24.5%",
    label: "global apparel return rate",
    body: "Online fashion has the highest return rate of any retail category. Most of it is fit-related, and most of it never makes it back to inventory.",
    source: "Coresight Research, 2025",
  },
  {
    big: "$25B",
    label: "lost to returns each year",
    body: "Returns processing, reverse logistics, and re-merchandising eat margin before the product even sells. Half of returned apparel is discounted or destroyed.",
    source: "Optoro Industry Report",
  },
  {
    big: "53%",
    label: "cite size & fit as the reason",
    body: "Shoppers are guessing — and brands are paying for the guess. Size charts and “true to size” tags don't close the gap.",
    source: "NRF Consumer View",
  },
];

export interface Step {
  n: string;
  title: string;
  body: string;
  icon: IconName;
}

export const STEPS: Step[] = [
  {
    n: "01",
    title: "Upload your catalog",
    body: "Sync flat-lay product photos via Shopify, CSV, or our REST API. No re-shoots — we work with what you already have.",
    icon: "Upload",
  },
  {
    n: "02",
    title: 'Shopper clicks "Try it on"',
    body: "The widget appears on PDP, collection, and quick-view. One tap to launch. No SDK, no account required.",
    icon: "Cart",
  },
  {
    n: "03",
    title: "Uploads one photo",
    body: "Single full-body photo, taken anywhere. We crop, segment, and anonymize before the model ever sees it.",
    icon: "Camera",
  },
  {
    n: "04",
    title: "AI renders + suggests size",
    body: "Photoreal try-on in 10s, plus a confidence-weighted size recommendation based on the shopper's body and the SKU spec sheet.",
    icon: "Sparkle",
  },
];

export type BentoVisualKind =
  | "flatlay"
  | "multi"
  | "chart"
  | "sizes"
  | "install"
  | "security";

export interface BentoFeature {
  title: string;
  body: string;
  icon: IconName;
  span?: "tall" | "wide";
  visual: BentoVisualKind;
}

export const BENTO_FEATURES: BentoFeature[] = [
  {
    title: "Flat-lay support",
    body: "No on-model shoots needed. We turn your existing flat-lay photography into try-on-ready inputs automatically.",
    icon: "Image",
    span: "tall",
    visual: "flatlay",
  },
  {
    title: "One photo, many SKUs",
    body: "Shoppers upload once. We reuse the body model across every garment they try, instantly.",
    icon: "User",
    visual: "multi",
  },
  {
    title: "Return-impact analytics",
    body: "See exactly which SKUs cause the most fit-driven returns — and how try-on changes the curve.",
    icon: "ChartBar",
    visual: "chart",
  },
  {
    title: "Size recommendation",
    body: "Confidence-weighted size suggestions trained on 32M+ try-ons. Surfaces inline next to “Add to cart”.",
    icon: "Tag",
    visual: "sizes",
  },
  {
    title: "5-minute Shopify install",
    body: "OAuth into Shopify and you're live. No code, no theme edits. Magento, BigCommerce, custom too.",
    icon: "Bolt",
    visual: "install",
  },
  {
    title: "BIPA & GDPR compliant",
    body: "Photos auto-delete in 24h, never train models, and never leave the EU when residency is set.",
    icon: "Shield",
    span: "wide",
    visual: "security",
  },
];

export interface Integration {
  name: string;
  desc: string;
}

export const INTEGRATIONS: Integration[] = [
  { name: "Shopify", desc: "Native app · OAuth" },
  { name: "WooCommerce", desc: "Plugin · WP 6.x" },
  { name: "Magento", desc: "Adobe Commerce" },
  { name: "Klaviyo", desc: "Email + flows" },
  { name: "Meta", desc: "Ads + Pixel" },
  { name: "GA4", desc: "Custom events" },
  { name: "Loop", desc: "Returns data" },
  { name: "Custom", desc: "REST + Webhooks" },
];

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  metric: string;
  metricLabel: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "We shipped FitRoom AI in an afternoon and saw return rate drop from 31% to 21% within two months. The Klaviyo flow integration alone paid for the year.",
    author: "Imani Park",
    role: "VP Ecommerce, Northfold",
    metric: "−32%",
    metricLabel: "returns Q1",
  },
  {
    quote:
      "Our denim category has the highest fit anxiety in the store. Try-on conversion is 2.4× our PDP average and the size suggestions are eerily accurate.",
    author: "Léo Charest",
    role: "Head of Digital, Maison Kira",
    metric: "2.4×",
    metricLabel: "try-on conv",
  },
  {
    quote:
      "The dashboard tells us which SKUs are fit-flawed before customer service does. That alone changed how we brief product.",
    author: "Sara Holm",
    role: "CMO, STÄRK Studio",
    metric: "+$1.8M",
    metricLabel: "GMV recovered",
  },
];

export type ComparisonCell = boolean | string;

export const COMPARISON_COLS = [
  "FitRoom AI",
  "Generic AI try-on",
  "Sizing-only tools",
  "DIY in-house",
];

export const COMPARISON_ROWS: [string, ...ComparisonCell[]][] = [
  ["Photoreal try-on (not AR)", true, false, false, false],
  ["Works from flat-lay only", true, false, true, false],
  ["Size recommendation w/ confidence", true, true, true, false],
  ["Outfit try-on (multi-garment)", true, false, false, false],
  ["Return-impact dashboard", true, false, false, false],
  ["5-min Shopify install", true, true, false, false],
  ["BIPA / GDPR compliant", true, true, false, false],
  ["Mobile SDK (iOS / Android)", true, false, false, false],
  ["Auto-delete photos in 24h", true, false, false, false],
  ["Median render time", "< 10s", "30s+", "n/a", "minutes"],
];

export interface SecurityBadge {
  name: string;
  sub: string;
}

export const SECURITY: SecurityBadge[] = [
  { name: "SOC 2", sub: "Type II audited" },
  { name: "GDPR", sub: "EU residency" },
  { name: "CCPA", sub: "California compliant" },
  { name: "BIPA", sub: "Biometric consent" },
  { name: "ISO 27001", sub: "Information security" },
];

export interface Tier {
  id: string;
  name: string;
  monthly: number | "Custom";
  annual: number | "Custom";
  tagline: string;
  quota: string;
  cta: string;
  popular?: boolean;
  features: string[];
}

export const TIERS: Tier[] = [
  {
    id: "starter",
    name: "Starter",
    monthly: 49,
    annual: 39,
    tagline: "For indie brands testing the waters.",
    quota: "500 try-ons / mo",
    cta: "Start free",
    features: [
      "1 store",
      "Shopify, Woo, or Magento install",
      "Basic try-on analytics",
      "Size recommendation",
      "Standard email support",
      "FitRoom AI branded widget",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    monthly: 299,
    annual: 239,
    tagline: "Most ecom teams start here.",
    quota: "5,000 try-ons / mo",
    cta: "Start free trial",
    popular: true,
    features: [
      "Up to 3 stores",
      "All Starter features, plus:",
      "A/B testing & cohorts",
      "Klaviyo + Meta integrations",
      "GA4 custom events",
      "Return-impact dashboard",
      "Custom branding (color + logo)",
      "Priority email support",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 999,
    annual: 799,
    tagline: "For brands scaling try-on across the catalog.",
    quota: "50,000 try-ons / mo",
    cta: "Talk to sales",
    features: [
      "Unlimited stores",
      "All Growth features, plus:",
      "Outfit try-on (multi-garment)",
      "White-label widget + emails",
      "REST API + webhooks",
      "Pre-cached results on PDP",
      "Slack-based support, 4h SLA",
      "Dedicated solutions engineer",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    monthly: "Custom",
    annual: "Custom",
    tagline: "For global retailers and platforms.",
    quota: "Unlimited try-ons",
    cta: "Contact sales",
    features: [
      "All Pro features, plus:",
      "SSO (SAML, OIDC)",
      "EU / US data residency",
      "Mobile SDK (iOS + Android)",
      "Custom model fine-tuning",
      "Dedicated CSM + quarterly review",
      "99.99% SLA with credits",
      "DPA, BIPA notice, custom MSA",
    ],
  },
];
