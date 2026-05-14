import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/Card";
import { InstallSnippet } from "@/components/dashboard/InstallSnippet";

export const metadata = { title: "Install · FitRoom" };

const STEPS = [
  {
    title: "Paste the snippet",
    body: "Drop the script tag into your store's template just before </body>. It loads asynchronously and won't block your page.",
  },
  {
    title: "Place the button",
    body: "On each product page, add <button data-fitroom-product=\"<sku>\">Try it on</button>. The widget binds to it automatically.",
  },
  {
    title: "Test it",
    body: "Open a product page and click Try it on. The widget opens in an overlay — no further setup required.",
  },
];

export default function InstallPage() {
  return (
    <>
      <Topbar title="Install" description="Embed the FitRoom widget in your store in under a minute." />
      <PageShell>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 flex flex-col gap-4">
            <InstallSnippet />
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
          <Card className="p-5 flex flex-col gap-3 h-fit">
            <h3 className="text-[15px] font-semibold tracking-tight text-ink">API key</h3>
            <p className="text-xs text-muted">
              Used for server-side calls. Keep it secret — never paste it in client code.
            </p>
            <code className="rounded-[10px] bg-canvas border border-line text-xs px-3 py-2 font-mono text-muted break-all">
              fr_live_••••••••••••••••
            </code>
            <p className="text-xs text-muted">Generate a real key once your backend is wired up.</p>
          </Card>
        </div>
      </PageShell>
    </>
  );
}
