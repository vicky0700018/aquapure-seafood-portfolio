import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site";
export const Route = createFileRoute("/terms")({
  head: () => ({ meta: [{ title: "Terms of Use — AquaPure Seafoods Exim" }, { name: "description", content: "Terms of Use (demo page)." }, { property: "og:title", content: "Terms of Use" }, { property: "og:description", content: "Terms of Use demo page." }] }),
  component: () => <SiteLayout><section className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-4xl font-semibold">Terms of Use</h1><p className="mt-4 text-muted-foreground">Demo page. Final wording should be supplied by the company. This demo site stores enquiries only in your own browser and sends nothing to any server.</p></section></SiteLayout>,
});
