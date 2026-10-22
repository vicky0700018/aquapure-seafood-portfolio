import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  SiteLayout,
  Hero,
  AboutSection,
  ProductsSection,
  AquacultureSection,
  QualitySection,
  WhySection,
  GallerySection,
  ContactSection,
} from "@/components/site";
import { useStore } from "@/lib/store";
import { defaultData } from "@/lib/defaults";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: defaultData.settings.seoTitle },
      { name: "description", content: defaultData.settings.seoDescription },
      { property: "og:title", content: defaultData.settings.seoTitle },
      { property: "og:description", content: defaultData.settings.seoDescription },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useStore();
  const { sections, seoTitle, seoDescription } = data.settings;

  // Apply the admin-edited SEO title and description in the browser.
  useEffect(() => {
    if (seoTitle) document.title = seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta && seoDescription) meta.setAttribute("content", seoDescription);
  }, [seoTitle, seoDescription]);

  return (
    <SiteLayout>
      <Hero />
      {sections.about && <AboutSection />}
      {sections.products && <ProductsSection />}
      {sections.aquaculture && <AquacultureSection />}
      {sections.quality && <QualitySection />}
      {sections.why && <WhySection />}
      {sections.gallery && <GallerySection />}
      {sections.contact && <ContactSection />}
    </SiteLayout>
  );
}
