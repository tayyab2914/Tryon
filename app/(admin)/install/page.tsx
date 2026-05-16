import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { InstallSnippet } from "@/components/dashboard/InstallSnippet";
import { DomainManager } from "@/components/dashboard/DomainManager";
import { WidgetSettingsForm } from "@/components/dashboard/WidgetSettingsForm";
import { getCurrentBrand } from "@/lib/session";
import { db } from "@/lib/db";
import { DEFAULT_CONSENT_TEXT, appBaseUrl, widgetScriptSrc } from "@/lib/widget";

export const metadata = { title: "Install · FitRoom AI" };

const STEPS = [
  {
    title: "Shopper clicks “Try On with AI”",
    body: "Your try-on button opens the FitRoom modal directly on your storefront — no redirect.",
  },
  {
    title: "They consent and upload a photo",
    body: "The shopper agrees to the privacy terms, then uploads one photo of themselves.",
  },
  {
    title: "AI renders the try-on",
    body: "The photo is processed once to generate the result and is never stored.",
  },
  {
    title: "They add to cart",
    body: "From the result, the shopper taps Add to Cart and returns to your checkout flow.",
  },
];

export default async function InstallPage() {
  const brand = await getCurrentBrand();
  if (!brand) return null;

  const [settings, domains] = await Promise.all([
    db.widgetSettings.findUnique({ where: { brandId: brand.id } }),
    db.domain.findMany({ where: { brandId: brand.id }, orderBy: { createdAt: "asc" } }),
  ]);

  return (
    <>
      <Topbar
        title="Install"
        description="Embed the FitRoom virtual try-on widget on your storefront."
      />
      <PageShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <DomainManager domains={domains} />
            <div className="flex flex-col gap-2">
              <p className="text-xs text-muted">
                Try-ons are blocked on unverified domains — verify yours above to go live.
              </p>
              <InstallSnippet
                scriptSrc={widgetScriptSrc()}
                apiBase={appBaseUrl()}
                brandId={brand.id}
              />
            </div>
            <Card className="p-5 flex flex-col gap-4">
              <h3 className="text-[15px] font-semibold tracking-tight text-ink">How it works</h3>
              <ol className="flex flex-col gap-4">
                {STEPS.map((s, i) => (
                  <li key={s.title} className="flex gap-3">
                    <span className="shrink-0 h-6 w-6 rounded-full bg-ink text-canvas text-xs font-semibold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-medium text-ink">{s.title}</span>
                      <span className="text-sm text-muted">{s.body}</span>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>

          <WidgetSettingsForm
            initial={{
              enabled: settings?.enabled ?? true,
              buttonLabel: settings?.buttonLabel ?? "Try On with AI",
              accentColor: settings?.accentColor ?? "#0c0c0c",
              consentText: settings?.consentText ?? "",
            }}
            consentPlaceholder={DEFAULT_CONSENT_TEXT}
          />
        </div>
      </PageShell>
    </>
  );
}
