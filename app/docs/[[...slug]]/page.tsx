import type { Metadata } from "next";
import { DocsPortal } from "@/components/marketing/docs/DocsPortal";

export const metadata: Metadata = {
  title: "Docs — FitRoom AI",
  description:
    "Integration guides and API reference for adding FitRoom AI virtual try-on to your storefront.",
};

export default async function DocsPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const { slug } = await params;
  return <DocsPortal slug={(slug ?? []).join("/")} />;
}
