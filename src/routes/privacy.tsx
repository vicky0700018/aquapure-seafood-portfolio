import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/site";
export const Route = createFileRoute("/privacy")({
  head: () => ({ meta: [{ title: "Privacy Policy — AquaPure Seafoods Exim" }, { name: "description", content: "Privacy Policy (demo page)." }, { property: "og:title", content: "Privacy Policy" }, { property: "og:description", content: "Privacy Policy demo page." }] }),
  component: () => <SiteLayout><section className="mx-auto max-w-3xl px-4 py-20"><h1 className="text-4xl font-semibold">Privacy Policy</h1><p className="mt-4 text-muted-foreground">Demo page. Final wording should be supplied by the company. This demo site stores enquiries only in your own browser and sends nothing to any server.</p></section></SiteLayout>,
});
