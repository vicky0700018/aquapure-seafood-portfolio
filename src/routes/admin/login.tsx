import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useStore } from "@/lib/store";
export const Route = createFileRoute("/admin/login")({
  head: () => ({ meta: [{ title: "Admin Login — AquaPure" }, { name: "description", content: "Demo admin login." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Admin Login" }, { property: "og:description", content: "Demo admin." }] }),
  component: Login,
});
function Login() {
  const { login } = useStore(); const nav = useNavigate();
  const [u, setU] = useState(""); const [p, setP] = useState(""); const [e, setE] = useState("");
  return <div className="flex min-h-screen items-center justify-center bg-ice px-4">
    <form className="w-full max-w-sm rounded-xl border bg-card p-8" onSubmit={(ev) => { ev.preventDefault(); if (login(u, p)) nav({ to: "/admin/dashboard" }); else setE("Incorrect username or password."); }}>
      <h1 className="text-2xl font-semibold">Admin Login</h1>
      <p className="mt-1 text-xs text-muted-foreground">Demo only — not secure authentication.</p>
      {e && <p role="alert" className="mt-4 text-sm text-destructive">{e}</p>}
      <label className="mt-4 block text-sm">Username<input className="field mt-1" value={u} onChange={(x) => setU(x.target.value)} /></label>
      <label className="mt-3 block text-sm">Password<input type="password" className="field mt-1" value={p} onChange={(x) => setP(x.target.value)} /></label>
      <button className="btn btn-primary mt-6 w-full">Sign in</button>
    </form></div>;
}
