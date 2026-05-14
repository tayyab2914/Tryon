"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { signinAction, type FormState } from "@/app/actions/auth";

const initial: FormState = {};

export function SigninForm() {
  const [state, formAction, pending] = useActionState(signinAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Work email" htmlFor="email">
        <Input id="email" name="email" type="email" placeholder="you@brand.com" required autoComplete="email" />
      </Field>
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" required autoComplete="current-password" />
      </Field>
      <div className="flex justify-end -mt-1">
        <a href="/forgot" className="text-xs text-muted hover:text-ink">Forgot password?</a>
      </div>
      {state.error && (
        <p className="text-sm text-danger" role="alert">{state.error}</p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
