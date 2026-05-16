import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { verifyEmailAction } from "@/app/actions/auth";

export const metadata = { title: "Verify email · FitRoom AI" };

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function VerifyPage({ searchParams }: Props) {
  const { token } = await searchParams;
  const result = await verifyEmailAction(token ?? "");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-semibold tracking-tight">
          {result.ok ? "Email verified" : "Verification failed"}
        </h1>
        <p className="text-sm text-muted">
          {result.ok
            ? "Your brand account is now active. Sign in to get started."
            : (result.reason ?? "We couldn't verify this link.")}
        </p>
      </div>
      <Card className="p-6">
        <Link href="/signin">
          <Button size="lg" fullWidth>
            {result.ok ? "Continue to sign in" : "Back to sign in"}
          </Button>
        </Link>
      </Card>
    </div>
  );
}
