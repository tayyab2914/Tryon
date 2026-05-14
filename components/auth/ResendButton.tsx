"use client";

import { useTransition, useState } from "react";
import { Button } from "@/components/ui/Button";
import { resendVerificationAction } from "@/app/actions/auth";

export function ResendButton({ email }: { email: string }) {
  const [pending, start] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="secondary"
        size="md"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await resendVerificationAction(email);
            setMessage(res.error ?? "Sent. Check your inbox.");
          })
        }
      >
        {pending ? "Sending…" : "Resend email"}
      </Button>
      {message && <span className="text-xs text-muted">{message}</span>}
    </div>
  );
}
