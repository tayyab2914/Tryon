"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const SNIPPET = `<script src="https://cdn.fitroom.app/widget.js" data-brand="acme"></script>`;

export function InstallSnippet() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(SNIPPET);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Card className="p-5 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">Install widget</h3>
          <p className="text-xs text-muted">One line of code. Paste before {"</body>"}.</p>
        </div>
        <Button size="sm" variant="secondary" onClick={copy}>
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
      <pre className="rounded-[10px] bg-ink text-canvas text-xs px-4 py-3 overflow-x-auto font-mono">
        <code>{SNIPPET}</code>
      </pre>
    </Card>
  );
}
