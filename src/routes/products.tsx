import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, ProductsSection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/products")({
  validateSearch: (s: Record<string, unknown>): { category?: string } => (typeof s.category === "string" ? { category: s.category } : {}),
  head: () => ({ meta: [{ title: "Our Products — AquaPure Seafoods Exim" }, { name: "description", content: "Sample seafood catalogue: fish, shrimp, squid, crab and more." }, { property: "og:title", content: "AquaPure Seafood Products" }, { property: "og:description", content: "Browse our sample seafood catalogue." }] }),
  component: Page,
});
function Page() { const { category } = Route.useSearch(); return <SiteLayout><PageBanner title="Our Products" text="Sample catalogue — confirmed per enquiry." image={IMG.shrimp} /><ProductsSection full initialCategory={category ?? "All"} /></SiteLayout>; }
