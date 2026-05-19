"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { adminLoginAction, type AdminFormState } from "@/app/actions/admin";

const initial: AdminFormState = {};

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(adminLoginAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field label="Admin password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="Enter the platform admin password"
        />
      </Field>
      {state.error && (
        <p className="text-sm text-danger" role="alert">{state.error}</p>
      )}
      <Button type="submit" size="lg" fullWidth disabled={pending}>
        {pending ? "Verifying…" : "Enter admin panel"}
      </Button>
    </form>
  );
}
