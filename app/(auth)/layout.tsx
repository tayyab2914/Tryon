import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-5">
        <Link href="/" aria-label="FitRoom AI home" className="inline-flex">
          <Logo size={32} withWordmark />
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
      <footer className="px-6 py-5 text-xs text-muted flex justify-between">
        <span>&copy; FitRoom AI</span>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-ink">Privacy</Link>
          <Link href="/terms" className="hover:text-ink">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
