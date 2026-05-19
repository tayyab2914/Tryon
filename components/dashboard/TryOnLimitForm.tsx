"use client";

import { useActionState } from "react";
import type { TryOnLimitPeriod } from "@prisma/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { updateTryOnLimitAction, type TryOnLimitState } from "@/app/actions/settings";

interface TryOnLimitFormProps {
  enabled: boolean;
  perIp: number;
  period: TryOnLimitPeriod;
}

const initial: TryOnLimitState = {};

export function TryOnLimitForm({ enabled, perIp, period }: TryOnLimitFormProps) {
  const [state, formAction, pending] = useActionState(updateTryOnLimitAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <label className="flex items-start justify-between gap-4 cursor-pointer">
        <span className="flex flex-col gap-0.5">
          <span className="text-sm font-medium text-ink">Limit try-ons per visitor</span>
          <span className="text-xs text-muted">
            When on, the limit below is enforced per shopper IP. When off, shoppers
            can generate unlimited try-ons.
          </span>
        </span>
        <input
          type="checkbox"
          name="enabled"
          defaultChecked={enabled}
          className="mt-0.5 h-4 w-4 accent-ink"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field
          label="Try-ons per visitor"
          htmlFor="perIp"
          hint="Each individual IP gets this many generations."
        >
          <Input
            id="perIp"
            name="perIp"
            type="number"
            min={1}
            max={1000}
            step={1}
            required
            defaultValue={perIp}
          />
        </Field>
        <Field label="Resets" htmlFor="period" hint="When the per-visitor count resets.">
          <select
            id="period"
            name="period"
            defaultValue={period}
            className="h-10 w-full rounded-control border border-line-strong bg-surface px-3 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink/10"
          >
            <option value="DAILY">Every day</option>
            <option value="MONTHLY">Every month</option>
          </select>
        </Field>
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-xs" role="status">
          {state.error ? (
            <span className="text-danger">{state.error}</span>
          ) : state.ok ? (
            <span className="text-success">Try-on limit saved.</span>
          ) : (
            <span className="text-muted">Default: 5 try-ons per visitor each day.</span>
          )}
        </p>
        <Button type="submit" size="sm" disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
