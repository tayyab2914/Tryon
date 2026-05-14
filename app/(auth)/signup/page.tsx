import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = { title: "Create account · FitRoom" };

export default function SignupPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-semibold tracking-tight">Start trying on</h1>
        <p className="text-sm text-muted">Let shoppers see your garments on themselves in seconds.</p>
      </div>
      <Card className="p-6">
        <SignupForm />
      </Card>
      <p className="text-sm text-muted text-center">
        Already have an account?{" "}
        <Link href="/signin" className="text-ink font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
