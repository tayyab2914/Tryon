import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { getCurrentBrand } from "@/lib/session";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const brand = await getCurrentBrand();
  if (!brand) redirect("/signin");

  return (
    <div className="min-h-screen flex">
      <Sidebar brand={{ name: brand.name, email: brand.email }} />
      <div className="flex-1 flex flex-col bg-canvas">{children}</div>
    </div>
  );
}
