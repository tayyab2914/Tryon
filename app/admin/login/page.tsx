import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Logo } from "@/components/brand/Logo";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { isAdmin } from "@/lib/admin-session";

export const metadata = { title: "Admin sign in · FitRoom AI" };

export default async function AdminLoginPage() {
  if (await isAdmin()) redirect("/admin");

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5">
        <span className="inline-flex items-center gap-2">
          <Logo size={32} />
          <span className="text-[15px] font-semibold tracking-tight text-ink">FitRoom AI</span>
        </span>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[400px] flex flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[28px] font-semibold tracking-tight">Admin panel</h1>
            <p className="text-sm text-muted">
              Restricted access. Enter the platform admin password to continue.
            </p>
          </div>
          <Card className="p-6">
            <AdminLoginForm />
          </Card>
        </div>
      </main>
    </div>
  );
}
