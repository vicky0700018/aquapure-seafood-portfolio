import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout, PageBanner, ContactSection } from "@/components/site";
import { IMG } from "@/lib/defaults";
export const Route = createFileRoute("/contact")({
  validateSearch: (s: Record<string, unknown>): { product?: string } => (typeof s.product === "string" ? { product: s.product } : {}),
  head: () => ({ meta: [{ title: "Contact Us — AquaPure Seafoods Exim" }, { name: "description", content: "Contact AquaPure Seafoods Exim in Nagpur or send a B2B enquiry." }, { property: "og:title", content: "Contact AquaPure Seafoods Exim" }, { property: "og:description", content: "Send a business enquiry." }] }),
  component: Page,
});
function Page() { const { product } = Route.useSearch(); return <SiteLayout><PageBanner title="Contact Us" text="Reach our team in Nagpur." image={IMG.crab} /><ContactSection product={product ?? ""} /></SiteLayout>; }
