import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SigninForm } from "@/components/auth/SigninForm";

export const metadata = { title: "Sign in · FitRoom" };

export default function SigninPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted">Sign in to manage your try-on widget.</p>
      </div>
      <Card className="p-6">
        <SigninForm />
      </Card>
      <p className="text-sm text-muted text-center">
        New to FitRoom?{" "}
        <Link href="/signup" className="text-ink font-medium hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
