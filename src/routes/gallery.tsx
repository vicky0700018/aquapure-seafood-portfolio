import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, GallerySection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/gallery")({
  head: () => ({ meta: [{ title: "Seafood Gallery — AquaPure Seafoods Exim" }, { name: "description", content: "Photos of fishing, aquaculture and seafood handling." }, { property: "og:title", content: "AquaPure Gallery" }, { property: "og:description", content: "From the sea, the farm and the handling floor." }] }),
  component: () => <SiteLayout><PageBanner title="Gallery" text="Marine and seafood photography." image={IMG.fish} /><GallerySection full /></SiteLayout>,
});
