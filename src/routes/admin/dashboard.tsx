import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard — AquaPure" }, { name: "description", content: "Demo admin dashboard." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Admin Dashboard" }, { property: "og:description", content: "Demo admin." }] }),
  component: Dash,
});
function Dash() {
  const { data, ready, authed, logout, update } = useStore(); const nav = useNavigate();
  useEffect(() => { if (ready && !authed) nav({ to: "/admin/login" }); }, [ready, authed, nav]);
  if (!ready || !authed) return null;
  const cats = new Set(data.products.filter((p) => p.visible).map((p) => p.category)).size;
  return <div className="mx-auto max-w-6xl px-4 py-10">
    <div className="flex items-center justify-between"><h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="flex gap-2"><Link to="/" className="btn btn-outline">View site</Link><button className="btn btn-primary" onClick={() => { logout(); nav({ to: "/admin/login" }); }}>Logout</button></div></div>
    <div className="mt-8 grid gap-4 sm:grid-cols-4">
      {[["Products", data.products.length], ["Active categories", cats], ["Gallery images", data.gallery.length], ["Demo enquiries", data.enquiries.length]].map(([l, v]) => <div key={l} className="rounded-xl border p-5"><p className="text-sm text-muted-foreground">{l}</p><p className="font-display text-3xl text-navy">{v}</p></div>)}
    </div>
    <h2 className="mt-10 text-xl font-semibold">Recent enquiries</h2>
    {data.enquiries.length === 0 ? <p className="mt-2 text-muted-foreground">No enquiries yet.</p> :
      <ul className="mt-3 divide-y rounded-xl border">{data.enquiries.map((q) => <li key={q.id} className="flex flex-wrap items-center justify-between gap-2 p-4 text-sm"><span><b>{q.name}</b> · {q.type} · {q.email}</span>
        <span className="flex gap-2"><select className="field !w-auto" value={q.status} onChange={(e) => update((d) => ({ ...d, enquiries: d.enquiries.map((x) => x.id === q.id ? { ...x, status: e.target.value as typeof q.status } : x) }))}><option>New</option><option>Contacted</option><option>Closed</option></select>
        <button className="text-destructive" onClick={() => update((d) => ({ ...d, enquiries: d.enquiries.filter((x) => x.id !== q.id) }))}>Delete</button></span></li>)}</ul>}
  </div>;
}
