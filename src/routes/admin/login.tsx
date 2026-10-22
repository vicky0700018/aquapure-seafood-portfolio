import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Login — AquaPure Seafoods Exim" },
      { name: "description", content: "Demo admin login for the AquaPure Seafoods Exim website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Login — AquaPure" },
      { property: "og:description", content: "Demo admin login." },
    ],
  }),
  component: Login,
});

function Login() {
  const { login, ready, authed, data } = useStore();
  const nav = useNavigate();
  const [u, setU] = useState("");
  const [p, setP] = useState("");
  const [e, setE] = useState("");
  useEffect(() => {
    if (ready && authed) nav({ to: "/admin/dashboard", replace: true });
  }, [ready, authed, nav]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-ice px-4">
      <div className="w-full max-w-sm">
        <form
          className="rounded-xl border bg-card p-8 shadow-sm"
          onSubmit={(ev) => {
            ev.preventDefault();
            if (!u.trim() || !p) return setE("Please enter both username and password.");
            if (login(u, p)) nav({ to: "/admin/dashboard" });
            else setE("Incorrect username or password.");
          }}
        >
          <p className="eyebrow">{data.settings.brandShort}</p>
          <h1 className="mt-2 text-2xl font-semibold">Admin Login</h1>
          <p className="mt-1 text-xs text-muted-foreground">Demo only — this is not secure authentication.</p>
          {e && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{e}</p>}
          <label className="mt-5 block text-sm font-medium text-navy">Username
            <input className="field mt-1" autoComplete="username" value={u} onChange={(x) => setU(x.target.value)} />
          </label>
          <label className="mt-3 block text-sm font-medium text-navy">Password
            <input type="password" autoComplete="current-password" className="field mt-1" value={p} onChange={(x) => setP(x.target.value)} />
          </label>
          <button type="submit" className="btn btn-primary mt-6 w-full">Sign in</button>
        </form>
        <Link to="/" className="mt-4 block text-center text-sm text-marine hover:underline">← Back to website</Link>
      </div>
    </div>
  );
}
