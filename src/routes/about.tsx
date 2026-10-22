import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, AboutSection, WhySection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/about")({
  head: () => ({ meta: [{ title: "About Us — AquaPure Seafoods Exim" }, { name: "description", content: "About AQUAPURE SEAFOODS EXIM PRIVATE LIMITED, a fishing and aquaculture business in Nagpur." }, { property: "og:title", content: "About AquaPure Seafoods Exim" }, { property: "og:description", content: "Our sourcing approach, quality commitment and partnership philosophy." }] }),
  component: () => <SiteLayout><PageBanner title="About Us" text="Who we are and how we work." image={IMG.processing} /><AboutSection full /><WhySection /></SiteLayout>,
});
