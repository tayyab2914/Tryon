"use client";

import { useActionState, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { addDomain, verifyDomain, removeDomain, type DomainFormState } from "@/app/actions/domain";

interface DomainView {
  id: string;
  hostname: string;
  verified: boolean;
  verifiedAt: Date | string | null;
  token: string;
}

const EMPTY: DomainFormState = {};

export function DomainManager({ domains }: { domains: DomainView[] }) {
  const [addState, addAction, adding] = useActionState(addDomain, EMPTY);

  return (
    <Card className="p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-[15px] font-semibold tracking-tight text-ink">Verify your domain</h3>
        <p className="text-xs text-muted">
          Verify the site where you&apos;ll embed the widget. Until then it runs in preview-only mode
          and won&apos;t work for shoppers.
        </p>
      </div>

      <form key={domains.length} action={addAction} className="flex items-start gap-2">
        <Input name="hostname" placeholder="example.com" aria-label="Domain" className="flex-1" />
        <Button type="submit" disabled={adding}>
          {adding ? "Adding…" : "Add domain"}
        </Button>
      </form>
      {addState.error && (
        <p className="text-sm text-danger" role="alert">
          {addState.error}
        </p>
      )}

      {domains.length > 0 && (
        <ul className="flex flex-col gap-3">
          {domains.map((d) => (
            <DomainRow key={d.id} domain={d} />
          ))}
        </ul>
      )}

      <p className="text-xs text-muted">
        Verifying a domain also covers all of its subdomains (www., shop., …). DNS changes can take
        up to an hour to propagate.
      </p>
    </Card>
  );
}

function DomainRow({ domain }: { domain: DomainView }) {
  const [verifyState, verifyAction, verifying] = useActionState(verifyDomain, EMPTY);
  const [removeState, removeAction, removing] = useActionState(removeDomain, EMPTY);
  const [copied, setCopied] = useState(false);

  const recordName = `_fitroom-verify.${domain.hostname}`;
  const recordValue = `fitroom-site-verification=${domain.token}`;
  const error = verifyState.error ?? removeState.error;

  async function copyValue() {
    await navigator.clipboard.writeText(recordValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <li className="rounded-[12px] border border-line p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink truncate">{domain.hostname}</span>
        {domain.verified ? (
          <span className="shrink-0 rounded-full bg-green-50 text-success text-xs px-2 py-0.5">
            Verified
          </span>
        ) : (
          <span className="shrink-0 rounded-full bg-accent-soft text-ink text-xs px-2 py-0.5">
            Pending
          </span>
        )}
      </div>

      {domain.verified ? (
        domain.verifiedAt && (
          <span className="text-xs text-muted">
            Verified on {new Date(domain.verifiedAt).toLocaleDateString()}
          </span>
        )
      ) : (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted">Add this TXT record to your DNS, then click Verify.</p>
          <div className="rounded-[10px] border border-line bg-canvas overflow-hidden text-xs">
            <RecordRow label="Type" value="TXT" />
            <RecordRow label="Name" value={recordName} mono />
            <RecordRow
              label="Value"
              value={recordValue}
              mono
              action={
                <button
                  type="button"
                  onClick={copyValue}
                  className="shrink-0 text-muted hover:text-ink font-medium"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              }
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}

      <div className="flex items-center gap-2">
        {!domain.verified && (
          <form action={verifyAction}>
            <input type="hidden" name="domainId" value={domain.id} />
            <Button type="submit" size="sm" disabled={verifying}>
              {verifying ? "Checking DNS…" : "Verify"}
            </Button>
          </form>
        )}
        <form
          action={removeAction}
          onSubmit={(e) => {
            if (
              !window.confirm(
                "Remove this domain? If it's your last verified domain, the live widget will stop working.",
              )
            ) {
              e.preventDefault();
            }
          }}
        >
          <input type="hidden" name="domainId" value={domain.id} />
          <Button type="submit" size="sm" variant="secondary" disabled={removing}>
            Remove
          </Button>
        </form>
      </div>
    </li>
  );
}

function RecordRow({
  label,
  value,
  mono,
  action,
}: {
  label: string;
  value: string;
  mono?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 border-b border-line last:border-0">
      <span className="w-12 shrink-0 text-muted">{label}</span>
      <span className={`flex-1 break-all text-ink ${mono ? "font-mono" : ""}`}>{value}</span>
      {action}
    </div>
  );
}
