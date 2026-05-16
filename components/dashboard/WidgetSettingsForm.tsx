"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { updateWidgetSettings, type WidgetFormState } from "@/app/actions/widget";

interface WidgetSettingsFormProps {
  initial: {
    enabled: boolean;
    buttonLabel: string;
    accentColor: string;
    consentText: string;
  };
  consentPlaceholder: string;
}

const initialState: WidgetFormState = {};

export function WidgetSettingsForm({ initial, consentPlaceholder }: WidgetSettingsFormProps) {
  const [state, action, pending] = useActionState(updateWidgetSettings, initialState);

  return (
    <Card className="p-5">
      <form action={action} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold tracking-tight text-ink">Widget settings</h3>
          <p className="text-xs text-muted">
            Control how the try-on modal looks and behaves on your storefront.
          </p>
        </div>

        <label className="flex items-center gap-2.5 rounded-[10px] border border-line bg-canvas px-3.5 py-3">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={initial.enabled}
            className="h-4 w-4 accent-ink"
          />
          <span className="flex flex-col">
            <span className="text-sm font-medium text-ink">Enable virtual try-on</span>
            <span className="text-xs text-muted">
              When off, the widget stays embedded but won&apos;t open for shoppers.
            </span>
          </span>
        </label>

        <Field label="Button label" htmlFor="buttonLabel" hint="Shown on your storefront's try-on button.">
          <Input
            id="buttonLabel"
            name="buttonLabel"
            defaultValue={initial.buttonLabel}
            maxLength={40}
            placeholder="Try On with AI"
          />
        </Field>

        <Field label="Accent color" htmlFor="accentColor" hint="Used for the modal's primary buttons.">
          <input
            id="accentColor"
            name="accentColor"
            type="color"
            defaultValue={initial.accentColor}
            className="h-10 w-20 cursor-pointer rounded-[10px] border border-line-strong bg-surface p-1"
          />
        </Field>

        <Field
          label="Privacy consent text"
          htmlFor="consentText"
          hint="Shown beside the consent checkbox. Leave blank to use the default."
        >
          <textarea
            id="consentText"
            name="consentText"
            defaultValue={initial.consentText}
            placeholder={consentPlaceholder}
            rows={4}
            className="w-full resize-y rounded-[10px] border border-line-strong bg-surface px-3 py-2 text-sm text-ink placeholder:text-muted-soft focus:border-ink focus:outline-none focus:ring-2 focus:ring-ink/10"
          />
        </Field>

        {state.error && (
          <p className="text-sm text-danger" role="alert">
            {state.error}
          </p>
        )}
        {state.ok && (
          <p className="text-sm text-success" role="status">
            Settings saved.
          </p>
        )}

        <Button type="submit" size="md" disabled={pending}>
          {pending ? "Saving…" : "Save settings"}
        </Button>
      </form>
    </Card>
  );
}
