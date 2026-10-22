import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode, type ImgHTMLAttributes } from "react";
import { useStore, uid } from "@/lib/store";
import { ENQUIRY_TYPES, type Product, type GalleryItem } from "@/lib/defaults";

/* ---------- Image with graceful fallback ---------- */
export function SafeImg({ src, alt, className = "", ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [src]);
  if (failed || !src)
    return (
      <div role="img" aria-label={alt} className={`flex items-center justify-center bg-gradient-to-br from-marine to-navy text-on-dark/80 ${className}`}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 12c3-5 9-6 14-2l6-4v12l-6-4c-5 4-11 3-14-2Z" /><circle cx="7" cy="11" r="1" /></svg>
      </div>
    );
  return <img src={src} alt={alt} onError={() => setFailed(true)} className={`object-cover ${className}`} {...rest} />;
}

/* ---------- Logo ---------- */
function Logo({ light = false }: { light?: boolean }) {
  const { data } = useStore();
  const s = data.settings;
  return (
    <span className="flex items-center gap-2.5">
      {s.logoUrl ? (
        <SafeImg src={s.logoUrl} alt={`${s.brandShort} logo`} className="h-10 w-10 rounded-full" />
      ) : (
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-marine text-on-dark">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M2 12c3-5 9-6 14-2l6-4v12l-6-4c-5 4-11 3-14-2Z" /><circle cx="7" cy="11" r=".8" fill="currentColor" /></svg>
        </span>
      )}
      <span className="leading-tight">
        <span className={`block font-display text-lg font-semibold ${light ? "text-on-dark" : "text-navy"}`}>{s.brandShort}</span>
        <span className={`block text-[10px] font-bold uppercase tracking-[0.2em] ${light ? "text-aqua" : "text-marine"}`}>{s.brandTag}</span>
      </span>
    </span>
  );
}

const NAV = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/products", label: "Our Products" },
  { to: "/aquaculture", label: "Aquaculture" },
  { to: "/quality", label: "Quality & Sustainability" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact Us" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const { data } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [path]);
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 lg:px-6">
        <Link to="/" aria-label="Home"><Logo /></Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`rounded-full px-3 py-2 text-sm font-medium transition ${path === n.to ? "bg-ice text-marine" : "text-ink hover:text-marine"}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/contact" hash="enquiry" className="btn btn-coral hidden sm:inline-flex">{data.settings.btnQuote}</Link>
          <button className="rounded-md p-2 text-navy xl:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen(!open)}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <nav className="border-t bg-background px-4 pb-4 xl:hidden" aria-label="Mobile">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`block rounded-md px-3 py-3 text-sm font-medium ${path === n.to ? "bg-ice text-marine" : "text-ink"}`}>{n.label}</Link>
          ))}
          <Link to="/contact" hash="enquiry" className="btn btn-coral mt-3 w-full">{data.settings.btnQuote}</Link>
        </nav>
      )}
    </header>
  );
}

export function Footer() {
  const { data } = useStore();
  const s = data.settings;
  const cats = Array.from(new Set(data.products.filter((p) => p.visible).map((p) => p.category))).slice(0, 6);
  return (
    <footer className="bg-navy text-on-dark/75">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-6">
        <div>
          <Logo light />
          <p className="mt-4 text-sm font-semibold text-on-dark">{s.companyName}</p>
          <p className="mt-3 text-sm leading-relaxed">{s.footerIntro}</p>
          {s.showSocial && (
            <div className="mt-4 flex gap-3 text-sm">
              {Object.entries(s.social).filter(([, v]) => v).map(([k, v]) => (
                <a key={k} href={v} target="_blank" rel="noreferrer" className="capitalize text-aqua hover:text-on-dark">{k}</a>
              ))}
            </div>
          )}
        </div>
        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-on-dark">Quick Links</h3>
          <ul className="mt-4 space-y-2 text-sm">{NAV.map((n) => <li key={n.to}><Link to={n.to} className="hover:text-aqua">{n.label}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-on-dark">Business Categories</h3>
          <ul className="mt-4 space-y-2 text-sm">{cats.map((c) => <li key={c}><Link to="/products" search={{ category: c }} className="hover:text-aqua">{c}</Link></li>)}</ul>
        </div>
        <div>
          <h3 className="font-sans text-sm font-bold uppercase tracking-widest text-on-dark">Contact</h3>
          <address className="mt-4 space-y-3 text-sm not-italic">
            <p>{s.address}</p>
            <p><a href={`tel:${s.phone}`} className="hover:text-aqua">Phone: {s.phone}</a></p>
            <p><a href={`mailto:${s.email}`} className="break-all hover:text-aqua">{s.email}</a></p>
          </address>
        </div>
      </div>
      <div className="border-t border-on-dark/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <p>© {new Date().getFullYear()} {s.companyName}. All rights reserved.</p>
          <p className="font-medium text-on-dark">Designed and development by SOSynch Ai Tech</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-aqua">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-aqua">Terms</Link>
            <Link to="/admin/login" className="opacity-60 hover:text-aqua hover:opacity-100">Admin Login</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/* ---------- Shared bits ---------- */
export function Waves() {
  const path = "M0 40 C 150 80 350 0 600 40 C 850 80 1050 0 1200 40 L1200 120 L0 120 Z";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 overflow-hidden" aria-hidden>
      <div className="wave-anim-slow absolute bottom-0 flex h-full w-[200%] opacity-30">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 fill-aqua"><path d={path} /></svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 fill-aqua"><path d={path} /></svg>
      </div>
      <div className="wave-anim absolute bottom-0 flex h-2/3 w-[200%]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 fill-background"><path d={path} /></svg>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="h-full w-1/2 fill-background"><path d={path} /></svg>
      </div>
    </div>
  );
}

export function SectionHead({ eyebrow, title, text, center }: { eyebrow: string; title: string; text?: string; center?: boolean }) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {text && <p className="mt-4 leading-relaxed text-muted-foreground">{text}</p>}
      <div className={`mt-5 h-0.5 w-14 bg-aqua ${center ? "mx-auto" : ""}`} />
    </div>
  );
}

export function PageBanner({ title, text, image }: { title: string; text: string; image: string }) {
  return (
    <section className="relative overflow-hidden bg-navy">
      <SafeImg src={image} alt="" className="absolute inset-0 h-full w-full" />
      <div className="hero-overlay absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-4 pb-24 pt-20 lg:px-6">
        <h1 className="max-w-2xl text-4xl font-semibold text-on-dark sm:text-5xl">{title}</h1>
        <p className="mt-4 max-w-xl text-on-dark/80">{text}</p>
      </div>
      <Waves />
    </section>
  );
}

/* ---------- Hero ---------- */
export function Hero() {
  const s = useStore().data.settings;
  return (
    <section className="relative overflow-hidden bg-navy">
      <SafeImg src={s.heroImage} alt="Fishing boats at sea at dawn" className="absolute inset-0 h-full w-full" fetchPriority="high" />
      {s.heroOverlay && <div className="hero-overlay absolute inset-0" />}
      <div className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col justify-center px-4 pb-32 pt-20 lg:px-6">
        <p className="eyebrow text-aqua">Fishing · Aquaculture · Seafood Sourcing</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.05] text-on-dark sm:text-6xl lg:text-7xl">{s.heroHeadline}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-on-dark/85 sm:text-lg">{s.heroText}</p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/products" className="btn btn-coral">{s.btnPrimary}</Link>
          <Link to="/contact" className="btn btn-ghost-light">{s.btnSecondary}</Link>
        </div>
      </div>
      <Waves />
    </section>
  );
}

/* ---------- About ---------- */
export function AboutSection({ full }: { full?: boolean }) {
  const { data } = useStore();
  return (
    <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 lg:grid-cols-2 lg:px-6">
      <div className="relative">
        <SafeImg src={data.about.image} alt="Fresh marine fish on ice" loading="lazy" className="aspect-[4/5] w-full rounded-xl sm:aspect-[4/3] lg:aspect-[4/5]" />
        <div className="absolute -bottom-6 -right-4 hidden rounded-xl bg-navy p-6 text-on-dark shadow-xl sm:block">
          <p className="text-xs uppercase tracking-widest text-aqua">Based in</p>
          <p className="font-display text-xl">Nagpur, Maharashtra</p>
        </div>
      </div>
      <div>
        <SectionHead eyebrow="About the Company" title="Seafood quality, handled with responsibility." />
        <p className="mt-6 leading-relaxed text-muted-foreground">{data.about.intro}</p>
        <dl className="mt-8 grid gap-6 sm:grid-cols-2">
          {data.about.points.map((p) => (
            <div key={p.id} className="border-l-2 border-aqua pl-4">
              <dt className="font-semibold text-navy">{p.title}</dt>
              <dd className="mt-1 text-sm text-muted-foreground">{p.text}</dd>
            </div>
          ))}
        </dl>
        {full ? (
          <p className="mt-8 text-sm text-muted-foreground"><span className="font-semibold text-navy">Directors:</span> {data.settings.directors}</p>
        ) : (
          <Link to="/about" className="btn btn-primary mt-8">{data.settings.btnLearnMore}</Link>
        )}
      </div>
    </section>
  );
}

/* ---------- Products ---------- */
export function ProductCard({ p, onView }: { p: Product; onView: () => void }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border bg-card transition hover:shadow-lg">
      <div className="relative overflow-hidden">
        <SafeImg src={p.image} alt={p.name} loading="lazy" className="aspect-[4/3] w-full transition duration-500 group-hover:scale-105" />
        <span className="absolute left-3 top-3 rounded-full bg-background/95 px-3 py-1 text-xs font-semibold text-marine">{p.availability}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-aqua">{p.category}</p>
        <h3 className="mt-1 text-xl font-semibold">{p.name}</h3>
        <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-5 flex gap-2">
          <button onClick={onView} className="btn btn-outline flex-1 !px-3 !py-2">View Details</button>
          <Link to="/contact" hash="enquiry" search={{ product: p.name }} className="btn btn-primary flex-1 !px-3 !py-2">Request Quote</Link>
        </div>
      </div>
    </article>
  );
}

export function Modal({ onClose, children, label }: { onClose: () => void; children: ReactNode; label: string }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onClose]);
  return (
    <div role="dialog" aria-modal="true" aria-label={label} className="fixed inset-0 z-50 flex items-center justify-center bg-navy/80 p-4" onClick={onClose}>
      <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-xl bg-background" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 rounded-full bg-background/90 p-2 text-navy">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6 6 18" /></svg>
        </button>
        {children}
      </div>
    </div>
  );
}

export function ProductsSection({ full, initialCategory = "All" }: { full?: boolean; initialCategory?: string }) {
  const { data } = useStore();
  const visible = data.products.filter((p) => p.visible);
  const cats = ["All", ...Array.from(new Set(visible.map((p) => p.category)))];
  const [cat, setCat] = useState(initialCategory);
  const [q, setQ] = useState("");
  const [view, setView] = useState<Product | null>(null);
  useEffect(() => setCat(initialCategory), [initialCategory]);
  const list = useMemo(
    () => visible.filter((p) => (cat === "All" || p.category === cat) && (p.name + p.description + p.category).toLowerCase().includes(q.toLowerCase())),
    [visible, cat, q],
  );
  const shown = full ? list : list.slice(0, 4);
  return (
    <section className="bg-ice">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Our Products" title="A seafood portfolio shaped around buyer needs." text="Sample catalogue entries. Availability, specification and pricing are confirmed per enquiry." />
          {!full && <Link to="/products" className="btn btn-outline">View all products</Link>}
        </div>
        {full && (
          <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
              {cats.map((c) => (
                <button key={c} role="tab" aria-selected={cat === c} onClick={() => setCat(c)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${cat === c ? "border-marine bg-marine text-on-dark" : "bg-background text-ink hover:border-marine"}`}>{c}</button>
              ))}
            </div>
            <label className="relative lg:w-72">
              <span className="sr-only">Search products</span>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products…" className="field !rounded-full !pl-4" />
            </label>
          </div>
        )}
        {shown.length === 0 ? (
          <p className="mt-12 rounded-xl border border-dashed bg-background p-10 text-center text-muted-foreground">No products match your filters.</p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((p) => <ProductCard key={p.id} p={p} onView={() => setView(p)} />)}
          </div>
        )}
      </div>
      {view && (
        <Modal onClose={() => setView(null)} label={view.name}>
          <SafeImg src={view.image} alt={view.name} className="aspect-[16/9] w-full" />
          <div className="p-6 sm:p-8">
            <p className="eyebrow">{view.category}</p>
            <h3 className="mt-2 text-3xl font-semibold">{view.name}</h3>
            <span className="mt-3 inline-block rounded-full bg-ice px-3 py-1 text-xs font-semibold text-marine">{view.availability}</span>
            <p className="mt-4 text-muted-foreground">{view.description}</p>
            <p className="mt-3 text-sm text-muted-foreground">{view.details}</p>
            <Link to="/contact" hash="enquiry" search={{ product: view.name }} className="btn btn-coral mt-6">Request a Quote</Link>
          </div>
        </Modal>
      )}
    </section>
  );
}

/* ---------- Aquaculture ---------- */
export function AquacultureSection({ full }: { full?: boolean }) {
  const { data } = useStore();
  const items = full ? data.aquaculture : data.aquaculture.slice(0, 3);
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
      <SectionHead eyebrow="Fishing & Aquaculture" title="What we work on, from water to buyer." />
      <div className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
        {items.map((b, i) => (
          <article key={b.id}>
            <SafeImg src={b.image} alt={b.title} loading="lazy" className="aspect-[3/2] w-full rounded-xl" />
            <p className="mt-5 font-display text-sm text-aqua">0{i + 1}</p>
            <h3 className="mt-1 text-xl font-semibold">{b.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{b.text}</p>
          </article>
        ))}
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <Link to="/contact" className="btn btn-coral">{data.settings.btnRequirements}</Link>
        {!full && <Link to="/aquaculture" className="btn btn-outline">More about our activities</Link>}
      </div>
    </section>
  );
}

/* ---------- Quality ---------- */
export function QualitySection() {
  const { data } = useStore();
  return (
    <section className="relative overflow-hidden bg-navy text-on-dark">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-5 lg:px-6">
        <div className="lg:col-span-2">
          <p className="eyebrow text-aqua">Quality & Sustainability</p>
          <h2 className="mt-3 text-3xl font-semibold text-on-dark sm:text-4xl">Our commitments, stated plainly.</h2>
          <p className="mt-4 text-on-dark/70">These are the principles we work towards. They are company commitments, not third-party certifications.</p>
          <SafeImg src={data.qualityImage} alt="Hygienic seafood handling" loading="lazy" className="mt-8 aspect-[4/3] w-full rounded-xl" />
        </div>
        <div className="grid gap-px overflow-hidden rounded-xl bg-on-dark/10 sm:grid-cols-2 lg:col-span-3">
          {data.quality.map((q, i) => (
            <div key={q.id} className="bg-navy p-7">
              <span className="font-display text-3xl text-aqua">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-3 text-lg font-semibold text-on-dark">{q.title}</h3>
              <p className="mt-2 text-sm text-on-dark/70">{q.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- Why ---------- */
export function WhySection() {
  const { data } = useStore();
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
      <SectionHead center eyebrow="Why Choose Us" title="How we prefer to do business." />
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.why.map((w) => (
          <div key={w.id} className="flex gap-4 rounded-xl border p-6">
            <span className="mt-1 h-10 w-10 shrink-0 rounded-full border-2 border-aqua bg-ice" aria-hidden>
              <span className="m-[9px] block h-4 w-4 rounded-full bg-marine" />
            </span>
            <div>
              <h3 className="font-sans text-base font-bold text-navy">{w.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{w.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- Gallery ---------- */
export function GallerySection({ full }: { full?: boolean }) {
  const { data } = useStore();
  const items = data.gallery.filter((g) => g.visible);
  const shown = full ? items : items.slice(0, 6);
  const [view, setView] = useState<GalleryItem | null>(null);
  return (
    <section className="bg-ice">
      <div className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead eyebrow="Seafood Gallery" title="From the sea, the farm and the handling floor." />
          {!full && <Link to="/gallery" className="btn btn-outline">Open gallery</Link>}
        </div>
        {shown.length === 0 ? (
          <p className="mt-10 text-muted-foreground">No gallery images to show yet.</p>
        ) : (
          <div className="mt-10 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 lg:auto-rows-[240px]">
            {shown.map((g, i) => (
              <button key={g.id} onClick={() => setView(g)} className={`group relative overflow-hidden rounded-xl text-left ${i % 5 === 0 ? "row-span-2" : ""}`}>
                <SafeImg src={g.image} alt={g.title} loading="lazy" className="h-full w-full transition duration-500 group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/90 to-transparent p-4 text-sm font-semibold text-on-dark">{g.title}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      {view && (
        <Modal onClose={() => setView(null)} label={view.title}>
          <SafeImg src={view.image} alt={view.title} className="max-h-[70vh] w-full" />
          <div className="p-6"><h3 className="text-2xl font-semibold">{view.title}</h3><p className="mt-2 text-muted-foreground">{view.description}</p></div>
        </Modal>
      )}
    </section>
  );
}

/* ---------- Contact & Enquiry ---------- */
const empty = { name: "", company: "", email: "", phone: "", country: "India", product: "", quantity: "", type: ENQUIRY_TYPES[0] as string, message: "" };
type Form = typeof empty;

export function validateEnquiry(f: Form) {
  const e: Partial<Record<keyof Form, string>> = {};
  if (!f.name.trim()) e.name = "Please enter your full name.";
  if (!f.email.trim()) e.email = "Please enter your business email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = "Please enter a valid email address.";
  const digits = f.phone.replace(/\D/g, "");
  if (!f.phone.trim()) e.phone = "Please enter a phone number.";
  else if (!/^[+\d\s()-]+$/.test(f.phone) || digits.length < 7 || digits.length > 15) e.phone = "Enter 7–15 digits (spaces, +, - allowed).";
  if (!f.country.trim()) e.country = "Please enter your country.";
  if (!f.message.trim()) e.message = "Please describe your requirement.";
  else if (f.message.trim().length < 10) e.message = "Please add a little more detail (10+ characters).";
  return e;
}

export function EnquiryForm({ product = "" }: { product?: string }) {
  const { data, update } = useStore();
  const [f, setF] = useState<Form>({ ...empty, product });
  const [err, setErr] = useState<Partial<Record<keyof Form, string>>>({});
  const [done, setDone] = useState(false);
  useEffect(() => { if (product) setF((x) => ({ ...x, product })); }, [product]);
  const set = (k: keyof Form) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = validateEnquiry(f);
    setErr(v);
    if (Object.keys(v).length) return;
    update((d) => ({ ...d, enquiries: [{ ...f, id: uid(), date: new Date().toISOString(), status: "New" }, ...d.enquiries] }));
    setDone(true);
  };

  if (done)
    return (
      <div className="rounded-xl border bg-card p-8 text-center" role="status">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ice text-marine">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m5 12 5 5 9-10" /></svg>
        </div>
        <h3 className="mt-4 text-2xl font-semibold">Enquiry recorded</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          Thank you, {f.name}. This is a demo: your enquiry is saved only in this browser and has <strong>not</strong> been emailed to the company. To reach the team directly, email{" "}
          <a className="text-marine underline" href={`mailto:${data.settings.email}`}>{data.settings.email}</a> or call {data.settings.phone}.
        </p>
        <button onClick={() => { setF({ ...empty }); setDone(false); }} className="btn btn-outline mt-6">Send another enquiry</button>
      </div>
    );

  const F = ({ k, label, type = "text", req }: { k: keyof Form; label: string; type?: string; req?: boolean }) => (
    <div>
      <label htmlFor={`f-${k}`} className="mb-1 block text-sm font-medium text-navy">{label}{req && <span className="text-coral"> *</span>}</label>
      <input id={`f-${k}`} type={type} value={f[k]} onChange={set(k)} aria-invalid={!!err[k]} className="field" />
      {err[k] && <p className="mt-1 text-xs text-destructive">{err[k]}</p>}
    </div>
  );

  return (
    <form onSubmit={submit} noValidate className="rounded-xl border bg-card p-6 sm:p-8">
      <h3 className="text-2xl font-semibold">Business enquiry & quote request</h3>
      <p className="mt-1 text-sm text-muted-foreground">Fields marked * are required. Demo only — submissions stay in this browser.</p>
      {Object.keys(err).length > 0 && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">Please correct the highlighted fields.</p>}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {F({ k: "name", label: "Full Name", req: true })}
        {F({ k: "company", label: "Company Name" })}
        {F({ k: "email", label: "Business Email", type: "email", req: true })}
        {F({ k: "phone", label: "Phone Number", type: "tel", req: true })}
        {F({ k: "country", label: "Country", req: true })}
        <div>
          <label htmlFor="f-product" className="mb-1 block text-sm font-medium text-navy">Interested Product</label>
          <select id="f-product" value={f.product} onChange={set("product")} className="field">
            <option value="">Select a product</option>
            {data.products.filter((p) => p.visible).map((p) => <option key={p.id}>{p.name}</option>)}
            {f.product && !data.products.some((p) => p.name === f.product) && <option>{f.product}</option>}
          </select>
        </div>
        {F({ k: "quantity", label: "Estimated Quantity" })}
        <div>
          <label htmlFor="f-type" className="mb-1 block text-sm font-medium text-navy">Enquiry Type</label>
          <select id="f-type" value={f.type} onChange={set("type")} className="field">{ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="f-message" className="mb-1 block text-sm font-medium text-navy">Message<span className="text-coral"> *</span></label>
          <textarea id="f-message" rows={4} value={f.message} onChange={set("message")} aria-invalid={!!err.message} className="field" />
          {err.message && <p className="mt-1 text-xs text-destructive">{err.message}</p>}
        </div>
      </div>
      <button type="submit" className="btn btn-coral mt-6">Submit Enquiry</button>
    </form>
  );
}

export function ContactSection({ product = "" }: { product?: string }) {
  const s = useStore().data.settings;
  const mapQ = encodeURIComponent("Mohan Nagar, Nagpur, Maharashtra 440001");
  const cards = [
    { label: "Call us", value: s.phone, href: `tel:${s.phone}` },
    { label: "Email us", value: s.email, href: `mailto:${s.email}` },
    { label: "Visit", value: s.address, href: `https://www.google.com/maps/search/?api=1&query=${mapQ}` },
  ];
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-6">
      <SectionHead eyebrow="Contact Us" title="Let's talk about your seafood requirement." />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <a key={c.label} href={c.href} target={c.label === "Visit" ? "_blank" : undefined} rel="noreferrer" className="rounded-xl border bg-ice p-6 transition hover:border-marine">
            <p className="eyebrow">{c.label}</p>
            <p className="mt-2 break-words font-semibold text-navy">{c.value}</p>
          </a>
        ))}
      </div>
      <div id="enquiry" className="mt-10 grid scroll-mt-24 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3"><EnquiryForm product={product} /></div>
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl border">
            <iframe title="Approximate location: Mohan Nagar, Nagpur" src={`https://www.google.com/maps?q=${mapQ}&output=embed`} className="h-80 w-full lg:h-[460px]" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Map shows the approximate area (Mohan Nagar, Nagpur), not a verified pin.</p>
        </div>
      </div>
    </section>
  );
}

export function useGoto() { return useNavigate(); }
