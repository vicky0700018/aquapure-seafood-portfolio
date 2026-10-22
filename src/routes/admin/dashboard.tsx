import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { AdminShell, isTab, type TabId } from "@/components/admin";

export const Route = createFileRoute("/admin/dashboard")({
  validateSearch: (s: Record<string, unknown>): { tab?: TabId } => (isTab(s["tab"]) ? { tab: s["tab"] } : {}),
  head: () => ({
    meta: [
      { title: "Admin Dashboard — AquaPure Seafoods Exim" },
      { name: "description", content: "Demo admin dashboard for the AquaPure Seafoods Exim website." },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Admin Dashboard — AquaPure" },
      { property: "og:description", content: "Demo admin dashboard." },
    ],
  }),
  component: Dash,
});

function Dash() {
  const { ready, authed } = useStore();
  const nav = useNavigate();
  const { tab = "overview" } = Route.useSearch();
  useEffect(() => {
    if (ready && !authed) nav({ to: "/admin/login", replace: true });
  }, [ready, authed, nav]);
  if (!ready || !authed)
    return <div className="flex min-h-screen items-center justify-center bg-ice text-sm text-muted-foreground">Checking access…</div>;
  return <AdminShell tab={tab} onTab={(t) => nav({ to: "/admin/dashboard", search: { tab: t } })} />;
}
