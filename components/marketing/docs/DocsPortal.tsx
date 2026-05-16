"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/marketing/ui";
import { Icons } from "@/components/marketing/icons";

interface DocPage {
  slug: string;
  title: string;
}
const DOCS_NAV: { group: string; pages: DocPage[] }[] = [
  {
    group: "Getting started",
    pages: [
      { slug: "getting-started", title: "Introduction" },
      { slug: "quickstart", title: "Quickstart · 5-min Shopify install" },
      { slug: "concepts", title: "Core concepts" },
      { slug: "auth", title: "Authentication" },
    ],
  },
  {
    group: "API reference",
    pages: [
      { slug: "api", title: "Overview" },
      { slug: "api/tryons", title: "Try-ons" },
      { slug: "api/garments", title: "Garments" },
      { slug: "api/shoppers", title: "Shoppers" },
      { slug: "api/sizing", title: "Size recommendations" },
    ],
  },
  {
    group: "Webhooks",
    pages: [
      { slug: "webhooks", title: "Configuring webhooks" },
      { slug: "webhooks/events", title: "Event types" },
      { slug: "webhooks/signing", title: "Signature verification" },
    ],
  },
  {
    group: "SDKs",
    pages: [
      { slug: "sdk/js", title: "JavaScript" },
      { slug: "sdk/ios", title: "iOS" },
      { slug: "sdk/android", title: "Android" },
    ],
  },
];

const ALL_DOC_PAGES = DOCS_NAV.flatMap((g) => g.pages.map((p) => ({ ...p, group: g.group })));

interface DocSection {
  id: string;
  title: string;
  body: string;
  code?: keyof typeof CODE_SAMPLES;
}
interface DocContent {
  title: string;
  sub: string;
  sections: DocSection[];
}

const CODE_SAMPLES = {
  shopify: {
    curl: `# Install the Shopify app via OAuth
# https://fitroom.ai/install?shop=YOUR_STORE.myshopify.com

# After OAuth, fetch your widget config:
curl https://api.fitroom.ai/v1/widget \\
  -H "Authorization: Bearer sk_live_..."`,
    node: `import { FitRoom } from '@fitroom/node';

const fr = new FitRoom({
  apiKey: process.env.FITROOM_API_KEY,
  store:  process.env.SHOPIFY_STORE,
});

const widget = await fr.widget.get();
console.log(widget.theme.primary);`,
    python: `from fitroom import Client

fr = Client(
    api_key=os.environ["FITROOM_API_KEY"],
    store=os.environ["SHOPIFY_STORE"],
)

widget = fr.widget.get()
print(widget.theme.primary)`,
  },
  curl: {
    curl: `curl https://api.fitroom.ai/v1/tryons \\
  -H "Authorization: Bearer sk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "garment_id": "gmt_4f1a8b2c",
    "shopper_photo_url": "https://cdn.you.com/p/x.jpg",
    "size_guidance": true
  }'`,
    node: `const tryon = await fr.tryons.create({
  garment_id: 'gmt_4f1a8b2c',
  shopper_photo_url: 'https://cdn.you.com/p/x.jpg',
  size_guidance: true,
});

console.log(tryon.image_url);
console.log(tryon.size_suggestion);`,
    python: `tryon = fr.tryons.create(
    garment_id="gmt_4f1a8b2c",
    shopper_photo_url="https://cdn.you.com/p/x.jpg",
    size_guidance=True,
)

print(tryon.image_url)
print(tryon.size_suggestion)`,
  },
};

const DOC_CONTENT: Record<string, DocContent> = {
  "getting-started": {
    title: "Introduction",
    sub: "Build photoreal virtual try-on into your storefront in minutes.",
    sections: [
      {
        id: "what",
        title: "What is FitRoom AI?",
        body: "FitRoom AI is a hosted virtual try-on layer for fashion brands. You upload your catalogue, embed our widget on PDP, and shoppers can see themselves in any SKU in 10 seconds. We handle pose estimation, garment segmentation, photoreal rendering, and size recommendation — you handle the storefront.",
      },
      {
        id: "how",
        title: "How most teams ship",
        body: "Most brands go from sign-up to live in under 30 minutes. The Shopify install is OAuth-only. The custom-storefront install is a single script tag plus a configuration object. SDKs are available for mobile.",
      },
      {
        id: "next",
        title: "Where to next",
        body: "If you're on Shopify, head straight to the Quickstart. If you're building custom, the API Reference is your starting point. Either way, the Concepts page explains the few primitives you need to know.",
      },
    ],
  },
  quickstart: {
    title: "Quickstart · 5-min Shopify install",
    sub: "From OAuth to live widget in five minutes.",
    sections: [
      {
        id: "install",
        title: "Install the app",
        body: "Open the FitRoom AI listing on the Shopify app store and click Install. We request the read_products, read_orders, and write_script_tags scopes. We never request write_orders or read_customer_data.",
        code: "shopify",
      },
      {
        id: "sync",
        title: "Sync your catalogue",
        body: "After OAuth, we pull your products and start the initial render queue. Most catalogues of 1–10K SKUs are ready inside an hour. Sync progress is live in the dashboard.",
      },
      {
        id: "configure",
        title: "Configure the widget",
        body: "In the dashboard, set your brand colour, button copy, and the templates where the widget should appear. Defaults are sensible — you can ship without changing anything.",
      },
      {
        id: "publish",
        title: "Publish",
        body: "Toggle the widget from Draft to Live in the dashboard. The button appears for shoppers immediately. You can roll out to a percentage of traffic if you prefer.",
        code: "curl",
      },
    ],
  },
  api: {
    title: "API Reference",
    sub: "REST · JSON · OAuth 2.0",
    sections: [
      {
        id: "base",
        title: "Base URL",
        body: "All requests go to https://api.fitroom.ai/v1. Versions are pinned by URL path. Breaking changes are reserved for new major versions.",
        code: "curl",
      },
      {
        id: "auth",
        title: "Authentication",
        body: "Authenticate with a Bearer token in the Authorization header. Tokens are issued in the dashboard, scoped per store, and rotatable without downtime.",
        code: "curl",
      },
      {
        id: "errors",
        title: "Errors",
        body: "We use conventional HTTP status codes. 2xx for success, 4xx for client errors, 5xx for our problem. Every error response includes a code field and a human-readable message field.",
      },
    ],
  },
};

function CodeTabs({ sample, dark }: { sample: keyof typeof CODE_SAMPLES; dark: boolean }) {
  const [tab, setTab] = useState<"curl" | "node" | "python">("curl");
  const [copied, setCopied] = useState(false);
  const code = CODE_SAMPLES[sample][tab];
  return (
    <div
      style={{
        marginTop: 16,
        border: `1px solid ${dark ? "var(--line)" : "var(--paper-line)"}`,
        borderRadius: 12,
        overflow: "hidden",
        background: "var(--ink)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px 6px 12px",
          borderBottom: "1px solid var(--line)",
        }}
      >
        <div style={{ display: "flex", gap: 2 }}>
          {(["curl", "node", "python"] as const).map((tk) => (
            <button
              key={tk}
              type="button"
              onClick={() => setTab(tk)}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontFamily: "var(--font-mono)",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
                color: tab === tk ? "var(--paper)" : "var(--mute-light)",
                background: tab === tk ? "var(--ink-3)" : "transparent",
              }}
            >
              {tk === "curl" ? "cURL" : tk === "node" ? "Node" : "Python"}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            });
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "6px 10px",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: copied ? "var(--emerald)" : "var(--mute-light)",
            borderRadius: 6,
            border: "none",
            background: "none",
            cursor: "pointer",
          }}
        >
          <Icons.Copy size={12} />
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre
        style={{
          margin: 0,
          padding: "18px 20px",
          fontFamily: "var(--font-mono)",
          fontSize: 13,
          lineHeight: 1.55,
          color: "var(--paper)",
          overflowX: "auto",
          whiteSpace: "pre",
        }}
      >
        {code}
      </pre>
    </div>
  );
}

function CmdK({ onClose, dark }: { onClose: () => void; dark: boolean }) {
  const [q, setQ] = useState("");
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const results = ALL_DOC_PAGES.filter(
    (p) =>
      p.title.toLowerCase().includes(q.toLowerCase()) ||
      p.group.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(14,14,16,0.5)",
        backdropFilter: "blur(8px)",
        zIndex: 100,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "12vh",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "90%",
          maxWidth: 580,
          background: dark ? "var(--ink-2)" : "#fff",
          borderRadius: 14,
          boxShadow: "0 30px 80px -20px rgba(0,0,0,0.4)",
          border: `1px solid ${dark ? "var(--line)" : "var(--paper-line)"}`,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "14px 18px",
            borderBottom: `1px solid ${dark ? "var(--line)" : "var(--paper-line)"}`,
          }}
        >
          <Icons.Search size={16} style={{ color: "var(--mute)" }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search docs…"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 15,
              color: dark ? "var(--paper)" : "var(--ink)",
            }}
          />
          <kbd
            style={{
              padding: "2px 6px",
              fontFamily: "var(--font-mono)",
              fontSize: 11,
              border: `1px solid ${dark ? "var(--line)" : "var(--paper-line)"}`,
              borderRadius: 4,
              color: "var(--mute)",
            }}
          >
            ESC
          </kbd>
        </div>
        <div style={{ maxHeight: 360, overflowY: "auto", padding: "8px 0" }}>
          {results.slice(0, 8).map((r) => (
            <button
              key={r.slug}
              type="button"
              onClick={() => {
                router.push(`/docs/${r.slug}`);
                onClose();
              }}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "10px 18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                color: dark ? "var(--paper)" : "var(--ink)",
                fontSize: 14,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span>
                <span style={{ fontWeight: 500, display: "block" }}>{r.title}</span>
                <span style={{ fontSize: 12, color: "var(--mute)" }}>{r.group}</span>
              </span>
              <Icons.ChevronRight size={14} style={{ opacity: 0.5 }} />
            </button>
          ))}
          {results.length === 0 && (
            <div style={{ padding: 24, textAlign: "center", color: "var(--mute)", fontSize: 13 }}>
              No matches for &ldquo;{q}&rdquo;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DocsPortal({ slug }: { slug: string }) {
  const [dark, setDark] = useState(false);
  const [kOpen, setKOpen] = useState(false);
  const content = DOC_CONTENT[slug] ?? DOC_CONTENT["getting-started"];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setKOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const bg = dark ? "var(--ink)" : "var(--paper)";
  const text = dark ? "var(--paper)" : "var(--ink)";
  const mute = dark ? "var(--mute-light)" : "var(--mute)";
  const line = dark ? "var(--line)" : "var(--paper-line)";

  return (
    <div
      className="fitroom"
      style={{ background: bg, color: text, minHeight: "100vh", letterSpacing: "normal" }}
    >
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: bg,
          borderBottom: `1px solid ${line}`,
          height: 56,
        }}
      >
        <div
          style={{
            maxWidth: 1480,
            margin: "0 auto",
            padding: "0 24px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <Logo light={dark} />
          </Link>
          <div
            style={{
              padding: "2px 8px",
              fontFamily: "var(--font-mono)",
              fontSize: 12,
              border: `1px solid ${line}`,
              borderRadius: 6,
              color: mute,
            }}
          >
            docs
          </div>
          <div style={{ flex: 1 }} />
          <button
            type="button"
            onClick={() => setKOpen(true)}
            className="docs-search"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 10px 6px 12px",
              border: `1px solid ${line}`,
              borderRadius: 8,
              background: dark ? "var(--ink-3)" : "var(--paper-2)",
              color: mute,
              fontSize: 13,
              minWidth: 240,
              cursor: "pointer",
            }}
          >
            <Icons.Search size={14} />
            <span style={{ flex: 1, textAlign: "left" }}>Search docs…</span>
            <kbd
              style={{
                padding: "2px 6px",
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                border: `1px solid ${line}`,
                borderRadius: 4,
              }}
            >
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => setDark((d) => !d)}
            aria-label="Toggle theme"
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              border: `1px solid ${line}`,
              color: text,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {dark ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}
          </button>
          <Link href="/" style={{ fontSize: 13, color: mute }}>
            ← Back to site
          </Link>
        </div>
      </header>

      <div
        className="docs-grid"
        style={{
          maxWidth: 1480,
          margin: "0 auto",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "240px 1fr 200px",
          gap: 48,
        }}
      >
        {/* Sidebar */}
        <aside
          style={{
            paddingTop: 32,
            position: "sticky",
            top: 56,
            height: "calc(100vh - 56px)",
            overflowY: "auto",
          }}
        >
          {DOCS_NAV.map((g) => (
            <div key={g.group} style={{ marginBottom: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 10, color: mute }}>
                {g.group}
              </div>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                {g.pages.map((p) => {
                  const active = p.slug === slug || (!DOC_CONTENT[slug] && p.slug === "getting-started");
                  return (
                    <li key={p.slug}>
                      <Link
                        href={`/docs/${p.slug}`}
                        style={{
                          display: "block",
                          padding: "6px 10px",
                          fontSize: 14,
                          borderRadius: 6,
                          background: active ? (dark ? "var(--ink-3)" : "var(--paper-2)") : "transparent",
                          color: active ? text : mute,
                          borderLeft: `2px solid ${active ? "var(--coral)" : "transparent"}`,
                          fontWeight: active ? 500 : 400,
                        }}
                      >
                        {p.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main */}
        <main style={{ paddingTop: 32, paddingBottom: 96, maxWidth: 760 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              color: mute,
              marginBottom: 16,
            }}
          >
            <Link href="/docs" style={{ color: mute }}>
              Docs
            </Link>
            <Icons.ChevronRight size={12} />
            <span>{content.title}</span>
          </div>
          <h1
            style={{
              fontSize: "clamp(32px, 4vw, 44px)",
              fontWeight: 500,
              letterSpacing: "-0.025em",
              lineHeight: 1.05,
              margin: 0,
            }}
          >
            {content.title}
          </h1>
          <p style={{ marginTop: 12, fontSize: 18, color: mute, lineHeight: 1.5 }}>{content.sub}</p>

          <div
            style={{
              marginTop: 32,
              padding: "14px 18px",
              borderRadius: 12,
              background: dark ? "var(--ink-3)" : "var(--paper-2)",
              border: `1px solid ${line}`,
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <Icons.Sparkle size={16} style={{ color: "var(--coral)", flexShrink: 0 }} />
            <div style={{ fontSize: 13.5, lineHeight: 1.5 }}>
              <strong>New here?</strong> The fastest path to value is the{" "}
              <Link
                href="/docs/quickstart"
                style={{ color: "var(--coral)", textDecoration: "underline" }}
              >
                5-minute Shopify Quickstart
              </Link>
              . We&apos;ll have you rendering inside an hour.
            </div>
          </div>

          {content.sections.map((s, i) => (
            <section key={s.id} id={s.id} style={{ marginTop: 48 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 500,
                  letterSpacing: "-0.015em",
                  margin: 0,
                  display: "flex",
                  alignItems: "baseline",
                  gap: 10,
                }}
              >
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: mute }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {s.title}
              </h2>
              <p style={{ marginTop: 12, fontSize: 15.5, lineHeight: 1.65, color: text }}>
                {s.body}
              </p>
              {s.code && <CodeTabs sample={s.code} dark={dark} />}
            </section>
          ))}
        </main>

        {/* TOC */}
        <aside
          className="docs-toc"
          style={{ paddingTop: 32, position: "sticky", top: 56, height: "calc(100vh - 56px)" }}
        >
          <div className="eyebrow" style={{ marginBottom: 10, color: mute }}>
            On this page
          </div>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 8,
            }}
          >
            {content.sections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  style={{ fontSize: 13, color: mute, display: "block", paddingLeft: 10 }}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>

      {kOpen && <CmdK onClose={() => setKOpen(false)} dark={dark} />}
    </div>
  );
}
