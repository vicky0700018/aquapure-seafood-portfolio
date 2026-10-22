import hero from "@/assets/hero.jpg";
import aquaculture from "@/assets/aquaculture.jpg";
import shrimp from "@/assets/shrimp.jpg";
import processing from "@/assets/processing.jpg";
import fish from "@/assets/fish.jpg";
import squid from "@/assets/squid.jpg";
import crab from "@/assets/crab.jpg";
import frozen from "@/assets/frozen.jpg";

export const IMG = { hero, aquaculture, shrimp, processing, fish, squid, crab, frozen };

export type Product = { id: string; name: string; category: string; description: string; details: string; image: string; availability: string; visible: boolean };
export type GalleryItem = { id: string; title: string; description: string; image: string; visible: boolean };
export type Block = { id: string; title: string; text: string; image?: string };
export type EnquiryStatus = "New" | "Contacted" | "Closed";
export type Enquiry = { id: string; date: string; name: string; company: string; email: string; phone: string; country: string; product: string; quantity: string; type: string; message: string; status: EnquiryStatus };

export const ENQUIRY_TYPES = ["Product Enquiry", "Bulk Supply", "Seafood Export Enquiry", "Supplier Partnership", "General Business Enquiry"];
export const AVAILABILITY = ["Available on Enquiry", "Seasonal", "Made to Order", "Currently Unavailable"];

export const defaultData = {
  settings: {
    companyName: "AQUAPURE SEAFOODS EXIM PRIVATE LIMITED",
    brandShort: "AquaPure",
    brandTag: "Seafoods Exim",
    logoUrl: "",
    phone: "3246152325",
    email: "nehamunnannaidu145@gmail.com",
    address: "C/o Nalini Naidu, P.K. Salve Road, Pole No. 20, Mohan Nagar, Nagpur, Maharashtra, India – 440001",
    directors: "Ganesh Bhaskarrao Joge, Neha Munnan Naidu",
    heroHeadline: "From Ocean Freshness to Global Quality.",
    heroText: "Discover AQUAPURE SEAFOODS EXIM PRIVATE LIMITED — focused on seafood, fishing and aquaculture, with a commitment to quality, responsible sourcing and lasting business relationships.",
    heroImage: IMG.hero,
    heroOverlay: true,
    btnPrimary: "Explore Our Products",
    btnSecondary: "Contact Our Team",
    btnQuote: "Get a Quote",
    btnLearnMore: "Learn More",
    btnRequirements: "Discuss Your Requirements",
    footerIntro: "A seafood, fishing and aquaculture business based in Nagpur, Maharashtra, building dependable relationships with buyers, suppliers and trade partners.",
    showSocial: false,
    social: { linkedin: "", facebook: "", instagram: "" },
    seoTitle: "AquaPure Seafoods Exim — Seafood, Fishing & Aquaculture",
    seoDescription: "AQUAPURE SEAFOODS EXIM PRIVATE LIMITED — seafood sourcing, fishing and aquaculture business from Nagpur, India. Send a B2B enquiry today.",
    sections: { about: true, products: true, aquaculture: true, quality: true, why: true, gallery: true, contact: true },
  },
  about: {
    intro: "AQUAPURE SEAFOODS EXIM PRIVATE LIMITED operates in the fishing and aquaculture sector. Our business vision is to connect seafood quality with responsible sourcing, professional handling and dependable business relationships. We aim to develop a strong corporate presence for customers, suppliers and potential seafood trade partners.",
    image: IMG.fish,
    points: [
      { id: "a1", title: "Business activities", text: "Fishing, aquaculture and seafood sourcing, with a focus on supplying B2B buyers and trade partners." },
      { id: "a2", title: "Sourcing approach", text: "We aim to work with responsible fishers and farms, and to share clear product information with every buyer." },
      { id: "a3", title: "Commitment to quality", text: "Careful attention to freshness, hygiene-focused handling and consistent specifications." },
      { id: "a4", title: "Partnership philosophy", text: "We value long-term relationships built on honest communication and reliable follow-through." },
    ] as Block[],
  },
  aquaculture: [
    { id: "q1", title: "Fishing & seafood sourcing", text: "Sourcing seafood through fishing communities and supply partners, with attention to species, size and condition.", image: IMG.hero },
    { id: "q2", title: "Aquaculture operations", text: "Engagement with farmed fish and shrimp supply, with interest in responsible aquaculture practices.", image: IMG.aquaculture },
    { id: "q3", title: "Supply & handling", text: "Coordinating seafood movement from source to buyer with care for product condition.", image: IMG.processing },
    { id: "q4", title: "Freshness management", text: "Prioritising temperature awareness and timely handling to preserve natural freshness.", image: IMG.shrimp },
    { id: "q5", title: "Packaging concepts", text: "Exploring packaging formats suited to fresh and frozen seafood requirements of different buyers.", image: IMG.frozen },
    { id: "q6", title: "B2B supply opportunities", text: "Open to enquiries from wholesalers, distributors, processors and importers.", image: IMG.crab },
  ] as Block[],
  quality: [
    { id: "s1", title: "Responsible sourcing", text: "We aim to source from suppliers who respect fishing regulations and marine ecosystems." },
    { id: "s2", title: "Product handling practices", text: "Seafood should be handled with care at every step to protect its quality." },
    { id: "s3", title: "Freshness awareness", text: "Time and temperature matter. We keep both in view when planning supply." },
    { id: "s4", title: "Hygiene-focused handling", text: "Clean surfaces, clean tools and clean water are basic expectations, not extras." },
    { id: "s5", title: "Traceability objective", text: "We are working towards clear records of where each consignment comes from." },
    { id: "s6", title: "Responsible aquaculture", text: "We support farming practices that respect water quality and animal health." },
  ] as Block[],
  qualityImage: IMG.processing,
  why: [
    { id: "w1", title: "Seafood Industry Focus", text: "Our attention stays on seafood, fishing and aquaculture." },
    { id: "w2", title: "Customer-Oriented Service", text: "Every enquiry is read and answered by a person." },
    { id: "w3", title: "Product Information Transparency", text: "Clear details on species, form and availability." },
    { id: "w4", title: "Professional Communication", text: "Prompt, courteous and well-documented correspondence." },
    { id: "w5", title: "Flexible B2B Enquiries", text: "From trial lots to recurring supply discussions." },
    { id: "w6", title: "Long-Term Relationships", text: "We prefer partners we can work with for years." },
  ] as Block[],
  products: [
    { id: "p1", name: "Fresh Whole Fish", category: "Fresh Fish", description: "Seasonal marine fish such as pomfret and mackerel, kept on ice.", details: "Sample entry. Species, sizes and grading are confirmed per enquiry based on season and supply.", image: IMG.fish, availability: "Seasonal", visible: true },
    { id: "p2", name: "Frozen Fish Blocks", category: "Frozen Fish", description: "Frozen fish options packed for longer storage and transport.", details: "Sample entry. Freezing format, pack size and specification are discussed with the buyer.", image: IMG.frozen, availability: "Available on Enquiry", visible: true },
    { id: "p3", name: "Shrimp & Prawns", category: "Shrimp and Prawns", description: "Tiger prawns and white shrimp in head-on or processed forms.", details: "Sample entry. Count sizes, forms (HOSO, HLSO, PD) and quantities are available on request.", image: IMG.shrimp, availability: "Available on Enquiry", visible: true },
    { id: "p4", name: "Squid & Cuttlefish", category: "Squid and Cuttlefish", description: "Whole squid and cuttlefish for food service and processing.", details: "Sample entry. Whole, cleaned or tube formats can be discussed.", image: IMG.squid, availability: "Seasonal", visible: true },
    { id: "p5", name: "Crab & Shellfish", category: "Crab and Shellfish", description: "Mud crab, mussels and clams subject to seasonal supply.", details: "Sample entry. Live or chilled supply depends on logistics and buyer location.", image: IMG.crab, availability: "Seasonal", visible: true },
    { id: "p6", name: "Processed Seafood", category: "Processed Seafood", description: "Cleaned, portioned and value-added seafood formats.", details: "Sample entry. Processing requirements are reviewed case by case.", image: IMG.processing, availability: "Made to Order", visible: true },
    { id: "p7", name: "Farmed Fish & Shrimp", category: "Aquaculture Products", description: "Aquaculture-sourced fish and shrimp from partner farms.", details: "Sample entry. Farm origin and harvest timing shared per enquiry.", image: IMG.aquaculture, availability: "Available on Enquiry", visible: true },
    { id: "p8", name: "Customized Seafood Supply", category: "Customized Seafood Supply", description: "Tell us your species, spec and volume — we will review feasibility.", details: "Sample entry. Share your requirement and we will respond with what we can realistically offer.", image: IMG.hero, availability: "Made to Order", visible: true },
  ] as Product[],
  gallery: [
    { id: "g1", title: "Fishing at dawn", description: "Trawlers heading out at first light.", image: IMG.hero, visible: true },
    { id: "g2", title: "Aquaculture pens", description: "Circular net pens in open water.", image: IMG.aquaculture, visible: true },
    { id: "g3", title: "Prawns on ice", description: "Tiger prawns and white shrimp.", image: IMG.shrimp, visible: true },
    { id: "g4", title: "Hygienic handling", description: "Sorting fish on stainless steel tables.", image: IMG.processing, visible: true },
    { id: "g5", title: "Fresh marine fish", description: "Pomfret, mackerel and seer fish.", image: IMG.fish, visible: true },
    { id: "g6", title: "Squid & cuttlefish", description: "Cephalopods kept chilled.", image: IMG.squid, visible: true },
    { id: "g7", title: "Crab & shellfish", description: "Mud crab, mussels and clams.", image: IMG.crab, visible: true },
    { id: "g8", title: "Cold storage packing", description: "Frozen packs in white cartons.", image: IMG.frozen, visible: true },
  ] as GalleryItem[],
  enquiries: [] as Enquiry[],
};

export type SiteData = typeof defaultData;
