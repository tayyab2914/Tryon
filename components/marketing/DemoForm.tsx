"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Icons } from "@/components/marketing/icons";
import { submitDemoRequest, type DemoFormState } from "@/app/actions/demo";

const initial: DemoFormState = {};

const CATALOG_SIZES = ["Under 100 SKUs", "100 – 1,000", "1,000 – 10,000", "10,000+"];

export function DemoForm() {
  const [state, formAction, pending] = useActionState(submitDemoRequest, initial);

  if (state.ok) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 18 }}>
        <span
          style={{
            width: 52,
            height: 52,
            borderRadius: 999,
            background: "var(--coral)",
            color: "#fff",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icons.Check size={26} />
        </span>
        <div>
          <h2 className="h3" style={{ marginBottom: 8 }}>
            Request received.
          </h2>
          <p className="body">
            Thanks — we&apos;ll reach out to{" "}
            <strong style={{ color: "var(--ink)", fontWeight: 600 }}>{state.email}</strong> within
            one business day to lock in a time. Keep an eye on your inbox.
          </p>
        </div>
        <Link href="/" className="btn-arrow" style={{ marginTop: 4 }}>
          <span className="arrow" style={{ transform: "rotate(180deg)", display: "inline-flex" }}>
            <Icons.Arrow size={15} />
          </span>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div className="form-row">
        <label className="field">
          <span className="field-label">
            Full name<span className="req">*</span>
          </span>
          <input className="input" name="name" placeholder="Alex Rivera" required autoComplete="name" />
        </label>
        <label className="field">
          <span className="field-label">
            Work email<span className="req">*</span>
          </span>
          <input
            className="input"
            name="email"
            type="email"
            placeholder="alex@brand.com"
            required
            autoComplete="email"
          />
        </label>
      </div>

      <div className="form-row">
        <label className="field">
          <span className="field-label">
            Company<span className="req">*</span>
          </span>
          <input className="input" name="company" placeholder="Acme Apparel" required autoComplete="organization" />
        </label>
        <label className="field">
          <span className="field-label">Store URL</span>
          <input className="input" name="website" placeholder="acme.com" autoComplete="url" />
        </label>
      </div>

      <label className="field">
        <span className="field-label">Catalog size</span>
        <select className="select" name="catalogSize" defaultValue="">
          <option value="" disabled>
            Select a range…
          </option>
          {CATALOG_SIZES.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field-label">Anything we should know?</span>
        <textarea
          className="textarea"
          name="message"
          placeholder="Which categories matter most, launch timelines, the platform you're on…"
        />
      </label>

      {state.error && (
        <p
          role="alert"
          style={{
            fontSize: 14,
            color: "var(--coral-deep)",
            background: "var(--coral-soft)",
            padding: "10px 14px",
            borderRadius: "var(--r-md)",
          }}
        >
          {state.error}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-coral btn-lg"
        disabled={pending}
        style={{ width: "100%", marginTop: 4, opacity: pending ? 0.7 : 1 }}
      >
        {pending ? "Sending…" : "Request my demo"}
        {!pending && <Icons.Arrow size={16} />}
      </button>

      <p style={{ fontSize: 12.5, color: "var(--mute)", fontFamily: "var(--font-mono)" }}>
        By submitting you agree to be contacted about FitRoom AI. No spam.
      </p>
    </form>
  );
}
