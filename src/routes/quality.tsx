import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, QualitySection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/quality")({
  head: () => ({ meta: [{ title: "Quality & Sustainability — AquaPure Seafoods Exim" }, { name: "description", content: "Our quality and responsible sourcing commitments." }, { property: "og:title", content: "Quality & Sustainability" }, { property: "og:description", content: "Commitments stated plainly." }] }),
  component: () => <SiteLayout><PageBanner title="Quality & Sustainability" text="Principles we work towards." image={IMG.frozen} /><QualitySection /></SiteLayout>,
});
