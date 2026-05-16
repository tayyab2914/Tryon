"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { signupAction, type FormState } from "@/app/actions/auth";

const initial: FormState = {};

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Brand name" htmlFor="brand">
        <Input id="brand" name="brand" placeholder="Acme Apparel" required autoComplete="organization" />
      </Field>
      <Field label="Work email" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="you@brand.com" required autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters.">
        <Input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" />
      </Field>
      {state.error && (
        <p className="text-sm text-danger" role="alert">{state.error}</p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={pending} className="mt-1">
        {pending ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-[11px] text-muted text-center mt-1">
        By continuing, you agree to FitRoom AI&apos;s Terms and Privacy Policy.
      </p>
    </form>
  );
}
