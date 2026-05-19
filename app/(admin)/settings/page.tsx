import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Field } from "@/components/ui/Field";
import { TryOnLimitForm } from "@/components/dashboard/TryOnLimitForm";
import { getCurrentBrand } from "@/lib/session";
import { db } from "@/lib/db";

export const metadata = { title: "Settings · FitRoom AI" };

export default async function SettingsPage() {
  const brand = await getCurrentBrand();
  const limits = brand
    ? await db.brand.findUnique({
        where: { id: brand.id },
        select: {
          tryOnLimitEnabled: true,
          tryOnLimitPerIp: true,
          tryOnLimitPeriod: true,
        },
      })
    : null;

  return (
    <>
      <Topbar title="Settings" description="Manage your brand profile and account." />
      <PageShell>
        <Card className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Brand profile</h3>
            <p className="text-sm text-muted">Visible to your shoppers in the try-on widget.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Brand name" htmlFor="brand">
              <Input id="brand" name="brand" defaultValue={brand?.name ?? ""} />
            </Field>
            <Field label="Work email" htmlFor="email">
              <Input id="email" name="email" type="email" defaultValue={brand?.email ?? ""} disabled />
            </Field>
          </div>
          <div className="flex justify-end">
            <Button size="sm" disabled>Save changes</Button>
          </div>
        </Card>

        <Card className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Try-on limits</h3>
            <p className="text-sm text-muted">
              Stop a single shopper from using up your generation budget. Limits are
              enforced per IP address on every try-on request.
            </p>
          </div>
          <TryOnLimitForm
            enabled={limits?.tryOnLimitEnabled ?? true}
            perIp={limits?.tryOnLimitPerIp ?? 5}
            period={limits?.tryOnLimitPeriod ?? "DAILY"}
          />
        </Card>

        <Card className="p-5 flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">Security</h3>
            <p className="text-sm text-muted">Change your password and manage sessions.</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-ink">Password</span>
              <span className="text-xs text-muted">Last changed when account was created.</span>
            </div>
            <Button size="sm" variant="secondary" disabled>Change password</Button>
          </div>
        </Card>

        <Card className="p-5 flex items-center justify-between gap-4 border-red-100">
          <div className="flex flex-col gap-1">
            <h3 className="text-[15px] font-semibold tracking-tight text-danger">Delete account</h3>
            <p className="text-sm text-muted">Permanently remove your brand and all data. This cannot be undone.</p>
          </div>
          <Button size="sm" variant="secondary" disabled>Delete</Button>
        </Card>
      </PageShell>
    </>
  );
}
