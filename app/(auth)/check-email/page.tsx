import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ResendButton } from "@/components/auth/ResendButton";

export const metadata = { title: "Check your email · FitRoom" };

interface Props {
  searchParams: Promise<{ email?: string }>;
}

export default async function CheckEmailPage({ searchParams }: Props) {
  const { email } = await searchParams;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-semibold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted">
          We sent a verification link {email ? <>to <span className="text-ink">{email}</span></> : "to your inbox"}.
          Click it to activate your account.
        </p>
      </div>
      <Card className="p-6 flex flex-col gap-3">
        <p className="text-sm text-muted">Didn&apos;t get the email? Check your spam folder, or resend it below.</p>
        {email && <ResendButton email={email} />}
      </Card>
      <p className="text-sm text-muted text-center">
        <Link href="/signin" className="text-ink font-medium hover:underline">Back to sign in</Link>
      </p>
    </div>
  );
}
