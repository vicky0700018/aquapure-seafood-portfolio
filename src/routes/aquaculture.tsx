import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, AquacultureSection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/aquaculture")({
  head: () => ({ meta: [{ title: "Fishing & Aquaculture — AquaPure Seafoods Exim" }, { name: "description", content: "Our fishing, aquaculture, sourcing and handling activities." }, { property: "og:title", content: "Fishing & Aquaculture at AquaPure" }, { property: "og:description", content: "From water to buyer." }] }),
  component: () => <SiteLayout><PageBanner title="Fishing & Aquaculture" text="Our business activities." image={IMG.aquaculture} /><AquacultureSection full /></SiteLayout>,
});
