"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface InstallSnippetProps {
  /** Absolute URL of embed.js, e.g. https://app.fitroom.ai/embed.js */
  scriptSrc: string;
  /** Absolute base URL of this app, used as data-api-base. */
  apiBase: string;
  /** The brand's public id, used as data-brand-id. */
  brandId: string;
}

export function InstallSnippet({ scriptSrc, apiBase, brandId }: InstallSnippetProps) {
  const [copied, setCopied] = useState(false);

  const scriptTag =
    `<script src="${scriptSrc}"\n` +
    `  data-brand-id="${brandId}"\n` +
    `  data-api-base="${apiBase}"\n` +
    `  async></script>`;

  async function copy() {
    await navigator.clipboard.writeText(scriptTag);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">Add the script</h3>
          <p className="text-xs text-muted">
            Paste once, just before {"</body>"} on every page. The widget detects your products
            and adds a &ldquo;Try It On&rdquo; button automatically — no per-product setup.
          </p>
        </div>
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="rounded-[10px] bg-ink text-canvas text-xs px-4 py-3 overflow-x-auto font-mono">
        <code>{scriptTag}</code>
      </pre>
    </Card>
  );
}
