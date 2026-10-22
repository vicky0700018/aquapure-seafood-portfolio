import { Link, useNavigate } from "@tanstack/react-router";
import { useId, useMemo, useState, type ReactNode } from "react";
import { useStore, uid } from "@/lib/store";
import {
  AVAILABILITY,
  ENQUIRY_STATUSES,
  ENQUIRY_TYPES,
  type Block,
  type Enquiry,
  type EnquiryStatus,
  type FooterLink,
  type GalleryItem,
  type Product,
  type SiteData,
} from "@/lib/defaults";
import { Modal, SafeImg } from "@/components/site";

type Settings = SiteData["settings"];

export const TABS = [
  { id: "overview", label: "Overview" },
  { id: "website", label: "Website Settings" },
  { id: "products", label: "Products" },
  { id: "gallery", label: "Gallery" },
  { id: "about", label: "About Us" },
  { id: "content", label: "Aquaculture & Quality" },
  { id: "enquiries", label: "Enquiries" },
  { id: "contact", label: "Contact & Footer" },
  { id: "general", label: "General Settings" },
] as const;
export type TabId = (typeof TABS)[number]["id"];
export const isTab = (t: unknown): t is TabId => typeof t === "string" && TABS.some((x) => x.id === t);

/* ---------------- small building blocks ---------------- */
function Field({ label, value, onChange, textarea, type = "text", hint, required, error, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; type?: string; hint?: string | undefined; required?: boolean; error?: string | undefined; placeholder?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy">{label}{required && <span className="text-coral"> *</span>}</label>
      {textarea ? (
        <textarea id={id} rows={4} className="field" value={value} placeholder={placeholder} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} type={type} className="field" value={value} placeholder={placeholder} aria-invalid={!!error} onChange={(e) => onChange(e.target.value)} />
      )}
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-medium text-navy">
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-marine" : "bg-input"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </span>
      {label}
    </button>
  );
}

const MAX_UPLOAD = 1_500_000;
function ImageField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const id = useId();
  const [err, setErr] = useState("");
  const isData = value.startsWith("data:");
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy">{label}</label>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <SafeImg src={value} alt={`${label} preview`} className="h-20 w-32 shrink-0 rounded-md border" />
        <div className="flex-1 space-y-2">
          <input id={id} className="field" placeholder="https://… image link" value={isData ? "(uploaded image)" : value} readOnly={isData} onChange={(e) => onChange(e.target.value)} />
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <label className="cursor-pointer font-semibold text-marine hover:underline">
              Upload from computer
              <input type="file" accept="image/*" className="sr-only" onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                if (file.size > MAX_UPLOAD) { setErr("Image is larger than 1.5 MB. Please use a smaller file or an image link."); return; }
                const r = new FileReader();
                r.onload = () => { setErr(""); onChange(String(r.result)); };
                r.onerror = () => setErr("Could not read that file.");
                r.readAsDataURL(file);
              }} />
            </label>
            {value && <button type="button" className="text-muted-foreground hover:text-destructive" onClick={() => onChange("")}>Remove image</button>}
          </div>
          {err && <p className="text-xs text-destructive">{err}</p>}
        </div>
      </div>
    </div>
  );
}

function Panel({ title, text, actions, children }: { title: string; text?: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          {text && <p className="mt-1 text-sm text-muted-foreground">{text}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  );
}

function Confirm({ title, text, confirmLabel = "Delete", onConfirm, onClose }: { title: string; text: string; confirmLabel?: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal onClose={onClose} label={title}>
      <div className="p-6 sm:p-8">
        <h3 className="text-2xl font-semibold">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{text}</p>
        <div className="mt-6 flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn btn-coral" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
        </div>
      </div>
    </Modal>
  );
}

function useSettings() {
  const { data, update } = useStore();
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => update((d) => ({ ...d, settings: { ...d.settings, [k]: v } }));
  return { s: data.settings, set };
}

/* ---------------- block list editor (about points, aquaculture, quality, why) ---------------- */
function BlockList({ items, onChange, withImage, addLabel }: { items: Block[]; onChange: (b: Block[]) => void; withImage?: boolean; addLabel: string }) {
  const [del, setDel] = useState<Block | null>(null);
  const patch = (id: string, p: Partial<Block>) => onChange(items.map((b) => (b.id === id ? { ...b, ...p } : b)));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    const [moved] = next.splice(i, 1);
    if (moved) next.splice(j, 0, moved);
    onChange(next);
  };
  return (
    <div className="space-y-4">
      {items.length === 0 && <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">Nothing here yet.</p>}
      {items.map((b, i) => (
        <div key={b.id} className="rounded-lg border bg-ice/50 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="font-display text-sm text-marine">#{i + 1}</span>
            <div className="flex gap-1 text-xs">
              <button type="button" className="rounded px-2 py-1 hover:bg-background disabled:opacity-30" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up">↑ Up</button>
              <button type="button" className="rounded px-2 py-1 hover:bg-background disabled:opacity-30" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down">↓ Down</button>
              <button type="button" className="rounded px-2 py-1 text-destructive hover:bg-background" onClick={() => setDel(b)}>Delete</button>
            </div>
          </div>
          <div className="grid gap-3">
            <Field label="Title" value={b.title} onChange={(v) => patch(b.id, { title: v })} />
            <Field label="Description" textarea value={b.text} onChange={(v) => patch(b.id, { text: v })} />
            {withImage && <ImageField label="Image" value={b.image ?? ""} onChange={(v) => patch(b.id, { image: v })} />}
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-outline" onClick={() => onChange([...items, { id: uid(), title: "New item", text: "", ...(withImage ? { image: "" } : {}) }])}>+ {addLabel}</button>
      {del && <Confirm title="Delete this item?" text={`“${del.title || "Untitled"}” will be removed from the website.`} onConfirm={() => onChange(items.filter((x) => x.id !== del.id))} onClose={() => setDel(null)} />}
    </div>
  );
}

/* ---------------- Overview ---------------- */
function Overview({ go }: { go: (t: TabId) => void }) {
  const { data } = useStore();
  const cats = new Set(data.products.filter((p) => p.visible).map((p) => p.category)).size;
  const fresh = data.enquiries.filter((e) => e.status === "New").length;
  const stats: [string, number, string][] = [
    ["Total products", data.products.length, `${data.products.filter((p) => p.visible).length} shown on website`],
    ["Active categories", cats, "From visible products"],
    ["Gallery images", data.gallery.length, `${data.gallery.filter((g) => g.visible).length} shown on website`],
    ["Demo enquiries", data.enquiries.length, `${fresh} marked New`],
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(([l, v, h]) => (
          <div key={l} className="rounded-xl border bg-card p-5">
            <p className="text-sm text-muted-foreground">{l}</p>
            <p className="mt-1 font-display text-4xl text-navy">{v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{h}</p>
          </div>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Panel title="Recent enquiries" actions={<button className="btn btn-outline !py-2" onClick={() => go("enquiries")}>View all</button>}>
            {data.enquiries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No enquiries yet. Enquiries sent from the Contact page in this browser will appear here.</p>
            ) : (
              <ul className="divide-y">
                {data.enquiries.slice(0, 5).map((q) => (
                  <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm">
                    <span><b className="text-navy">{q.name}</b> <span className="text-muted-foreground">· {q.type} · {new Date(q.date).toLocaleDateString()}</span></span>
                    <StatusBadge s={q.status} />
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
        <Panel title="Quick actions">
          <div className="grid gap-2">
            <button className="btn btn-primary" onClick={() => go("products")}>Manage products</button>
            <button className="btn btn-outline" onClick={() => go("gallery")}>Manage gallery</button>
            <button className="btn btn-outline" onClick={() => go("website")}>Edit main banner</button>
            <button className="btn btn-outline" onClick={() => go("general")}>Sections & SEO</button>
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline">Preview website ↗</a>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function StatusBadge({ s }: { s: EnquiryStatus }) {
  const cls = s === "New" ? "bg-coral/15 text-coral" : s === "Contacted" ? "bg-aqua/15 text-marine" : "bg-muted text-muted-foreground";
  return <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{s}</span>;
}

/* ---------------- Website settings ---------------- */
function WebsiteSettings({ go }: { go: (t: TabId) => void }) {
  const { s, set } = useSettings();
  return (
    <div className="space-y-6">
      <Panel title="Company & branding" text="Shown in the header, footer and page titles.">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2"><Field label="Company name" value={s.companyName} onChange={(v) => set("companyName", v)} /></div>
          <Field label="Brand name (logo text)" value={s.brandShort} onChange={(v) => set("brandShort", v)} />
          <Field label="Brand tagline (under logo)" value={s.brandTag} onChange={(v) => set("brandTag", v)} />
          <Field label="Directors" value={s.directors} onChange={(v) => set("directors", v)} hint="Shown on the About page." />
          <div className="md:col-span-2"><ImageField label="Logo (leave empty to use the fish icon)" value={s.logoUrl} onChange={(v) => set("logoUrl", v)} /></div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">Phone, email, address and footer text are in <button className="font-semibold text-marine underline" onClick={() => go("contact")}>Contact & Footer</button>.</p>
      </Panel>
      <Panel title="Main banner" text="The large banner at the top of the home page.">
        <div className="grid gap-4">
          <Field label="Headline" value={s.heroHeadline} onChange={(v) => set("heroHeadline", v)} />
          <Field label="Supporting text" textarea value={s.heroText} onChange={(v) => set("heroText", v)} />
          <ImageField label="Banner image" value={s.heroImage} onChange={(v) => set("heroImage", v)} />
          <Toggle label="Dark overlay on banner image (keeps text readable)" checked={s.heroOverlay} onChange={(v) => set("heroOverlay", v)} />
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="First button label" value={s.btnPrimary} onChange={(v) => set("btnPrimary", v)} />
            <Field label="Second button label" value={s.btnSecondary} onChange={(v) => set("btnSecondary", v)} />
          </div>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Products ---------------- */
const blankProduct: Product = { id: "", name: "", category: "", description: "", details: "", image: "", availability: "Available on Enquiry", visible: true };

function ProductForm({ initial, categories, onSave, onClose }: { initial: Product; categories: string[]; onSave: (p: Product) => void; onClose: () => void }) {
  const [p, setP] = useState(initial);
  const [err, setErr] = useState<{ name?: string; category?: string }>({});
  const listId = useId();
  const set = <K extends keyof Product>(k: K, v: Product[K]) => setP((x) => ({ ...x, [k]: v }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: typeof err = {};
    if (!p.name.trim()) v.name = "Please enter a product name.";
    if (!p.category.trim()) v.category = "Please enter a category.";
    setErr(v);
    if (Object.keys(v).length) return;
    onSave({ ...p, name: p.name.trim(), category: p.category.trim() });
    onClose();
  };
  return (
    <Modal onClose={onClose} label={initial.id ? "Edit product" : "Add product"}>
      <form onSubmit={submit} noValidate className="grid gap-4 p-6 sm:p-8">
        <h3 className="text-2xl font-semibold">{initial.id ? "Edit product" : "Add product"}</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Product name" required value={p.name} error={err.name} onChange={(v) => set("name", v)} />
          <div>
            <label htmlFor={`${listId}-c`} className="mb-1 block text-sm font-medium text-navy">Category<span className="text-coral"> *</span></label>
            <input id={`${listId}-c`} list={listId} className="field" value={p.category} aria-invalid={!!err.category} onChange={(e) => set("category", e.target.value)} />
            <datalist id={listId}>{categories.map((c) => <option key={c} value={c} />)}</datalist>
            {err.category ? <p className="mt-1 text-xs text-destructive">{err.category}</p> : <p className="mt-1 text-xs text-muted-foreground">Pick an existing one or type a new one.</p>}
          </div>
        </div>
        <Field label="Short description" textarea value={p.description} onChange={(v) => set("description", v)} />
        <Field label="Full details (shown in the product popup)" textarea value={p.details} onChange={(v) => set("details", v)} />
        <ImageField label="Product image" value={p.image} onChange={(v) => set("image", v)} />
        <div className="grid gap-4 sm:grid-cols-2 sm:items-end">
          <div>
            <label htmlFor={`${listId}-a`} className="mb-1 block text-sm font-medium text-navy">Availability label</label>
            <select id={`${listId}-a`} className="field" value={p.availability} onChange={(e) => set("availability", e.target.value)}>
              {[...new Set([...AVAILABILITY, p.availability])].map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          <Toggle label="Show on website" checked={p.visible} onChange={(v) => set("visible", v)} />
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save product</button>
        </div>
      </form>
    </Modal>
  );
}

function ProductsAdmin() {
  const { data, update } = useStore();
  const [edit, setEdit] = useState<Product | null>(null);
  const [del, setDel] = useState<Product | null>(null);
  const [q, setQ] = useState("");
  const categories = [...new Set(data.products.map((p) => p.category))];
  const list = data.products.filter((p) => (p.name + p.category).toLowerCase().includes(q.toLowerCase()));
  const patch = (id: string, v: Partial<Product>) => update((d) => ({ ...d, products: d.products.map((x) => (x.id === id ? { ...x, ...v } : x)) }));
  const save = (p: Product) =>
    update((d) => ({ ...d, products: p.id ? d.products.map((x) => (x.id === p.id ? p : x)) : [{ ...p, id: uid() }, ...d.products] }));
  return (
    <Panel title="Products" text="Sample catalogue entries shown on the Products page and home page." actions={<button className="btn btn-coral" onClick={() => setEdit(blankProduct)}>+ Add product</button>}>
      <label className="mb-4 block max-w-sm"><span className="sr-only">Search products</span><input className="field" placeholder="Search products…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
      {list.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No products found.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {list.map((p) => (
            <li key={p.id} className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center">
              <SafeImg src={p.image} alt={p.name} className="h-16 w-24 shrink-0 rounded-md" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-navy">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.category}</p>
              </div>
              <select aria-label={`Availability of ${p.name}`} className="field !w-auto !py-1.5 text-xs" value={p.availability} onChange={(e) => patch(p.id, { availability: e.target.value })}>
                {[...new Set([...AVAILABILITY, p.availability])].map((a) => <option key={a}>{a}</option>)}
              </select>
              <Toggle label={p.visible ? "Shown" : "Hidden"} checked={p.visible} onChange={(v) => patch(p.id, { visible: v })} />
              <div className="flex gap-2 text-sm">
                <button className="font-semibold text-marine hover:underline" onClick={() => setEdit(p)}>Edit</button>
                <button className="text-destructive hover:underline" onClick={() => setDel(p)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {edit && <ProductForm initial={edit} categories={categories} onSave={save} onClose={() => setEdit(null)} />}
      {del && <Confirm title="Delete product?" text={`“${del.name}” will be removed from the website.`} onConfirm={() => update((d) => ({ ...d, products: d.products.filter((x) => x.id !== del.id) }))} onClose={() => setDel(null)} />}
    </Panel>
  );
}

/* ---------------- Gallery ---------------- */
const blankGallery: GalleryItem = { id: "", title: "", description: "", image: "", visible: true };

function GalleryForm({ initial, onSave, onClose }: { initial: GalleryItem; onSave: (g: GalleryItem) => void; onClose: () => void }) {
  const [g, setG] = useState(initial);
  const [err, setErr] = useState<{ title?: string; image?: string }>({});
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v: typeof err = {};
    if (!g.title.trim()) v.title = "Please enter a title.";
    if (!g.image.trim()) v.image = "Please add an image link or upload an image.";
    setErr(v);
    if (Object.keys(v).length) return;
    onSave({ ...g, title: g.title.trim() });
    onClose();
  };
  return (
    <Modal onClose={onClose} label={initial.id ? "Edit photo" : "Add photo"}>
      <form onSubmit={submit} noValidate className="grid gap-4 p-6 sm:p-8">
        <h3 className="text-2xl font-semibold">{initial.id ? "Edit photo" : "Add photo"}</h3>
        <Field label="Title" required value={g.title} error={err.title} onChange={(v) => setG({ ...g, title: v })} />
        <Field label="Description" textarea value={g.description} onChange={(v) => setG({ ...g, description: v })} />
        <ImageField label="Image" value={g.image} onChange={(v) => setG({ ...g, image: v })} />
        {err.image && <p className="-mt-2 text-xs text-destructive">{err.image}</p>}
        <Toggle label="Show on website" checked={g.visible} onChange={(v) => setG({ ...g, visible: v })} />
        <div className="flex justify-end gap-2">
          <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary">Save photo</button>
        </div>
      </form>
    </Modal>
  );
}

function GalleryAdmin() {
  const { data, update } = useStore();
  const [edit, setEdit] = useState<GalleryItem | null>(null);
  const [del, setDel] = useState<GalleryItem | null>(null);
  const patch = (id: string, v: Partial<GalleryItem>) => update((d) => ({ ...d, gallery: d.gallery.map((x) => (x.id === id ? { ...x, ...v } : x)) }));
  const save = (g: GalleryItem) => update((d) => ({ ...d, gallery: g.id ? d.gallery.map((x) => (x.id === g.id ? g : x)) : [...d.gallery, { ...g, id: uid() }] }));
  return (
    <Panel title="Gallery" text="Photos shown on the Gallery page and home page." actions={<button className="btn btn-coral" onClick={() => setEdit(blankGallery)}>+ Add photo</button>}>
      {data.gallery.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No photos yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.gallery.map((g) => (
            <div key={g.id} className={`overflow-hidden rounded-lg border ${g.visible ? "" : "opacity-60"}`}>
              <SafeImg src={g.image} alt={g.title} className="aspect-[3/2] w-full" />
              <div className="space-y-3 p-4">
                <div>
                  <p className="font-semibold text-navy">{g.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{g.description}</p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <Toggle label={g.visible ? "Shown" : "Hidden"} checked={g.visible} onChange={(v) => patch(g.id, { visible: v })} />
                  <div className="flex gap-3 text-sm">
                    <button className="font-semibold text-marine hover:underline" onClick={() => setEdit(g)}>Edit</button>
                    <button className="text-destructive hover:underline" onClick={() => setDel(g)}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {edit && <GalleryForm initial={edit} onSave={save} onClose={() => setEdit(null)} />}
      {del && <Confirm title="Delete photo?" text={`“${del.title}” will be removed from the gallery.`} onConfirm={() => update((d) => ({ ...d, gallery: d.gallery.filter((x) => x.id !== del.id) }))} onClose={() => setDel(null)} />}
    </Panel>
  );
}

/* ---------------- About & content ---------------- */
function AboutAdmin() {
  const { data, update } = useStore();
  const { s, set } = useSettings();
  const setAbout = (v: Partial<SiteData["about"]>) => update((d) => ({ ...d, about: { ...d.about, ...v } }));
  return (
    <div className="space-y-6">
      <Panel title="Company introduction">
        <div className="grid gap-4">
          <Field label="Introduction" textarea value={data.about.intro} onChange={(v) => setAbout({ intro: v })} />
          <ImageField label="About image" value={data.about.image} onChange={(v) => setAbout({ image: v })} />
          <Field label="“Learn More” button label" value={s.btnLearnMore} onChange={(v) => set("btnLearnMore", v)} />
        </div>
      </Panel>
      <Panel title="Business activities & approach" text="The short points under the introduction.">
        <BlockList items={data.about.points} onChange={(points) => setAbout({ points })} addLabel="Add point" />
      </Panel>
      <Panel title="Why Choose Us" text="Value points shown on the home and About pages.">
        <BlockList items={data.why} onChange={(why) => update((d) => ({ ...d, why }))} addLabel="Add value point" />
      </Panel>
    </div>
  );
}

function ContentAdmin() {
  const { data, update } = useStore();
  const { s, set } = useSettings();
  return (
    <div className="space-y-6">
      <Panel title="Fishing & Aquaculture" text="Activity cards shown on the Aquaculture page (first three on the home page).">
        <BlockList withImage items={data.aquaculture} onChange={(aquaculture) => update((d) => ({ ...d, aquaculture }))} addLabel="Add activity" />
        <div className="mt-5 max-w-md"><Field label="“Discuss Your Requirements” button label" value={s.btnRequirements} onChange={(v) => set("btnRequirements", v)} /></div>
      </Panel>
      <Panel title="Quality & Sustainability" text="Company commitments — not certifications.">
        <div className="mb-5"><ImageField label="Section image" value={data.qualityImage} onChange={(v) => update((d) => ({ ...d, qualityImage: v }))} /></div>
        <BlockList items={data.quality} onChange={(quality) => update((d) => ({ ...d, quality }))} addLabel="Add statement" />
      </Panel>
    </div>
  );
}

/* ---------------- Enquiries ---------------- */
export function filterEnquiries(list: Enquiry[], q: string, type: string, status: string) {
  const needle = q.trim().toLowerCase();
  return list.filter(
    (e) =>
      (type === "All" || e.type === type) &&
      (status === "All" || e.status === status) &&
      (!needle || [e.name, e.company, e.email, e.phone, e.product, e.country, e.message].join(" ").toLowerCase().includes(needle)),
  );
}

function EnquiriesAdmin() {
  const { data, update } = useStore();
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");
  const [viewId, setViewId] = useState<string | null>(null);
  const [del, setDel] = useState<Enquiry | null>(null);
  const list = useMemo(() => filterEnquiries(data.enquiries, q, type, status), [data.enquiries, q, type, status]);
  const view = data.enquiries.find((e) => e.id === viewId) ?? null;
  const setSt = (id: string, st: EnquiryStatus) => update((d) => ({ ...d, enquiries: d.enquiries.map((x) => (x.id === id ? { ...x, status: st } : x)) }));
  return (
    <Panel title="Enquiries" text="Demo only: enquiries are saved in this browser and are not emailed to the company.">
      <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto]">
        <label><span className="sr-only">Search enquiries</span><input className="field" placeholder="Search name, company, email, product…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <label><span className="sr-only">Filter by enquiry type</span>
          <select className="field md:!w-56" value={type} onChange={(e) => setType(e.target.value)}><option value="All">All enquiry types</option>{ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label><span className="sr-only">Filter by status</span>
          <select className="field md:!w-40" value={status} onChange={(e) => setStatus(e.target.value)}><option value="All">All statuses</option>{ENQUIRY_STATUSES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
      </div>
      {data.enquiries.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No enquiries yet. Submit one from the <Link to="/contact" className="text-marine underline">Contact page</Link> to see it here.</p>
      ) : list.length === 0 ? (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">No enquiries match your search.</p>
      ) : (
        <ul className="divide-y rounded-lg border">
          {list.map((e) => (
            <li key={e.id} className="flex flex-col gap-3 p-4 text-sm md:flex-row md:items-center">
              <button className="min-w-0 flex-1 text-left" onClick={() => setViewId(e.id)}>
                <p className="font-semibold text-navy">{e.name}{e.company && <span className="font-normal text-muted-foreground"> · {e.company}</span>}</p>
                <p className="truncate text-xs text-muted-foreground">{e.type} · {e.product || "No product selected"} · {new Date(e.date).toLocaleString()}</p>
              </button>
              <StatusBadge s={e.status} />
              <select aria-label={`Status for ${e.name}`} className="field !w-auto !py-1.5 text-xs" value={e.status} onChange={(ev) => setSt(e.id, ev.target.value as EnquiryStatus)}>
                {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <div className="flex gap-3">
                <button className="font-semibold text-marine hover:underline" onClick={() => setViewId(e.id)}>View</button>
                <button className="text-destructive hover:underline" onClick={() => setDel(e)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {view && (
        <Modal onClose={() => setViewId(null)} label={`Enquiry from ${view.name}`}>
          <div className="p-6 sm:p-8">
            <p className="eyebrow">{view.type}</p>
            <h3 className="mt-2 text-2xl font-semibold">{view.name}</h3>
            <p className="text-sm text-muted-foreground">{new Date(view.date).toLocaleString()}</p>
            <dl className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
              {([["Company", view.company], ["Email", view.email], ["Phone", view.phone], ["Country", view.country], ["Product", view.product], ["Estimated quantity", view.quantity]] as const).map(([k, v]) => (
                <div key={k}><dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt><dd className="mt-0.5 break-words font-medium text-navy">{v || "—"}</dd></div>
              ))}
              <div className="sm:col-span-2"><dt className="text-xs uppercase tracking-wider text-muted-foreground">Message</dt><dd className="mt-0.5 whitespace-pre-wrap text-ink">{view.message}</dd></div>
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <label className="text-sm font-medium text-navy">Status{" "}
                <select className="field !inline-block !w-auto" value={view.status} onChange={(ev) => setSt(view.id, ev.target.value as EnquiryStatus)}>{ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
              </label>
              <a className="btn btn-primary" href={`mailto:${view.email}?subject=${encodeURIComponent("Re: your enquiry to " + data.settings.brandShort)}`}>Reply by email</a>
              {view.phone && <a className="btn btn-outline" href={`tel:${view.phone}`}>Call</a>}
              <button className="ml-auto text-sm text-destructive hover:underline" onClick={() => { setDel(view); setViewId(null); }}>Delete</button>
            </div>
          </div>
        </Modal>
      )}
      {del && <Confirm title="Delete enquiry?" text={`The enquiry from ${del.name} will be removed from this browser.`} onConfirm={() => update((d) => ({ ...d, enquiries: d.enquiries.filter((x) => x.id !== del.id) }))} onClose={() => setDel(null)} />}
    </Panel>
  );
}

/* ---------------- Contact & footer ---------------- */
function ContactAdmin() {
  const { s, set } = useSettings();
  const setLinks = (l: FooterLink[]) => set("footerLinks", l);
  return (
    <div className="space-y-6">
      <Panel title="Contact details" text="Used on the Contact page, footer and call/email buttons.">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Phone" type="tel" value={s.phone} onChange={(v) => set("phone", v)} />
          <Field label="Email" type="email" value={s.email} onChange={(v) => set("email", v)} />
          <div className="md:col-span-2"><Field label="Address" textarea value={s.address} onChange={(v) => set("address", v)} /></div>
        </div>
      </Panel>
      <Panel title="Footer">
        <div className="grid gap-4">
          <Field label="Footer introduction" textarea value={s.footerIntro} onChange={(v) => set("footerIntro", v)} />
          <div>
            <p className="mb-2 text-sm font-medium text-navy">Extra footer links</p>
            <p className="mb-3 text-xs text-muted-foreground">Added under Quick Links. Privacy Policy, Terms and the Admin Login link always stay in the footer.</p>
            <div className="space-y-3">
              {s.footerLinks.map((l) => (
                <div key={l.id} className="grid gap-2 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
                  <Field label="Label" value={l.label} onChange={(v) => setLinks(s.footerLinks.map((x) => (x.id === l.id ? { ...x, label: v } : x)))} />
                  <Field label="Link" placeholder="https://… or /page" value={l.url} onChange={(v) => setLinks(s.footerLinks.map((x) => (x.id === l.id ? { ...x, url: v } : x)))} />
                  <button className="mb-2 text-sm text-destructive hover:underline" onClick={() => setLinks(s.footerLinks.filter((x) => x.id !== l.id))}>Remove</button>
                </div>
              ))}
              <button className="btn btn-outline" onClick={() => setLinks([...s.footerLinks, { id: uid(), label: "", url: "" }])}>+ Add footer link</button>
            </div>
          </div>
        </div>
      </Panel>
      <Panel title="Social links">
        <div className="grid gap-4">
          <Toggle label="Show social links in footer" checked={s.showSocial} onChange={(v) => set("showSocial", v)} />
          <div className="grid gap-4 md:grid-cols-3">
            {(["linkedin", "facebook", "instagram"] as const).map((k) => (
              <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} placeholder="https://…" value={s.social[k]} onChange={(v) => set("social", { ...s.social, [k]: v })} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Only links with an address are shown.</p>
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- General ---------------- */
const SECTION_LABELS: Record<keyof Settings["sections"], string> = {
  about: "About the Company",
  products: "Our Products",
  aquaculture: "Fishing & Aquaculture",
  quality: "Quality & Sustainability",
  why: "Why Choose Us",
  gallery: "Seafood Gallery",
  contact: "Contact & Enquiry form",
};

function GeneralAdmin() {
  const { s, set } = useSettings();
  const { reset } = useStore();
  const [confirm, setConfirm] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-6">
      <Panel title="Home page sections" text="Hide a section from the home page. Its own page stays available.">
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(SECTION_LABELS) as (keyof Settings["sections"])[]).map((k) => (
            <Toggle key={k} label={SECTION_LABELS[k]} checked={s.sections[k]} onChange={(v) => set("sections", { ...s.sections, [k]: v })} />
          ))}
        </div>
      </Panel>
      <Panel title="Button labels">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Header quote button" value={s.btnQuote} onChange={(v) => set("btnQuote", v)} />
          <Field label="Banner first button" value={s.btnPrimary} onChange={(v) => set("btnPrimary", v)} />
          <Field label="Banner second button" value={s.btnSecondary} onChange={(v) => set("btnSecondary", v)} />
          <Field label="About “Learn More” button" value={s.btnLearnMore} onChange={(v) => set("btnLearnMore", v)} />
          <Field label="Aquaculture button" value={s.btnRequirements} onChange={(v) => set("btnRequirements", v)} />
        </div>
      </Panel>
      <Panel title="Search engine (SEO)" text="Title and description for the home page in browser tabs and search results.">
        <div className="grid gap-4">
          <Field label="Page title" value={s.seoTitle} onChange={(v) => set("seoTitle", v)} hint={`${s.seoTitle.length} characters — aim for under 60.`} />
          <Field label="Meta description" textarea value={s.seoDescription} onChange={(v) => set("seoDescription", v)} hint={`${s.seoDescription.length} characters — aim for under 160.`} />
        </div>
      </Panel>
      <Panel title="Preview website" text="Open any page in a new tab to check your changes.">
        <div className="flex flex-wrap gap-2">
          {[["/", "Home"], ["/about", "About"], ["/products", "Products"], ["/aquaculture", "Aquaculture"], ["/quality", "Quality"], ["/gallery", "Gallery"], ["/contact", "Contact"]].map(([href, l]) => (
            <a key={href} href={href} target="_blank" rel="noreferrer" className="btn btn-outline !py-2">{l} ↗</a>
          ))}
        </div>
      </Panel>
      <Panel title="Reset demo data" text="Restores all original sample content and settings, and removes every saved enquiry in this browser.">
        <button className="btn btn-coral" onClick={() => setConfirm(true)}>Reset Demo Data</button>
        {done && <p role="status" className="mt-3 text-sm text-marine">Demo data has been reset.</p>}
      </Panel>
      {confirm && <Confirm title="Reset all demo data?" text="All your edits, products, gallery changes and enquiries in this browser will be replaced with the original sample content. This cannot be undone." confirmLabel="Yes, reset" onConfirm={() => { reset(); setDone(true); }} onClose={() => setConfirm(false)} />}
    </div>
  );
}

/* ---------------- Shell ---------------- */
export function AdminShell({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) {
  const { data, logout } = useStore();
  const nav = useNavigate();
  const [menu, setMenu] = useState(false);
  const current = TABS.find((t) => t.id === tab) ?? TABS[0];
  const go = (t: TabId) => { onTab(t); setMenu(false); };
  const newCount = data.enquiries.filter((e) => e.status === "New").length;
  return (
    <div className="min-h-screen bg-ice lg:flex">
      <aside className={`${menu ? "block" : "hidden"} bg-navy text-on-dark/80 lg:sticky lg:top-0 lg:block lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto`}>
        <div className="hidden px-6 py-6 lg:block">
          <p className="font-display text-xl text-on-dark">{data.settings.brandShort}</p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-aqua">Admin · Demo</p>
        </div>
        <nav aria-label="Admin" className="grid gap-1 px-3 pb-6 pt-2 lg:pt-0">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => go(t.id)} aria-current={t.id === tab ? "page" : undefined}
              className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition ${t.id === tab ? "bg-marine text-on-dark" : "hover:bg-on-dark/10 hover:text-on-dark"}`}>
              {t.label}
              {t.id === "enquiries" && newCount > 0 && <span className="rounded-full bg-coral px-2 text-xs text-on-dark">{newCount}</span>}
            </button>
          ))}
        </nav>
      </aside>
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b bg-background px-4 py-3 lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 text-navy lg:hidden" aria-label={menu ? "Close admin menu" : "Open admin menu"} aria-expanded={menu} onClick={() => setMenu(!menu)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{menu ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}</svg>
            </button>
            <h1 className="text-xl font-semibold sm:text-2xl">{current.label}</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn btn-outline !px-3 !py-2 text-xs sm:text-sm">View site</Link>
            <button className="btn btn-primary !px-3 !py-2 text-xs sm:text-sm" onClick={() => { logout(); nav({ to: "/admin/login" }); }}>Logout</button>
          </div>
        </header>
        <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 lg:px-8 lg:py-8">
          <p className="rounded-lg border border-aqua/40 bg-background px-4 py-2 text-xs text-muted-foreground">
            Demo admin: changes update the website instantly and are saved only in this browser.
          </p>
          {tab === "overview" && <Overview go={go} />}
          {tab === "website" && <WebsiteSettings go={go} />}
          {tab === "products" && <ProductsAdmin />}
          {tab === "gallery" && <GalleryAdmin />}
          {tab === "about" && <AboutAdmin />}
          {tab === "content" && <ContentAdmin />}
          {tab === "enquiries" && <EnquiriesAdmin />}
          {tab === "contact" && <ContactAdmin />}
          {tab === "general" && <GeneralAdmin />}
        </main>
      </div>
    </div>
  );
}
