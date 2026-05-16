import { Topbar } from "@/components/layout/Topbar";
import { PageShell } from "@/components/layout/PageShell";
import { RecentTryOns } from "@/components/dashboard/RecentTryOns";

export const metadata = { title: "Try-ons · FitRoom AI" };

export default function TryOnsPage() {
  return (
    <>
      <Topbar
        title="Try-ons"
        description="Every try-on your shoppers have run through the widget."
      />
      <PageShell>
        <RecentTryOns limit={50} />
      </PageShell>
    </>
  );
}
