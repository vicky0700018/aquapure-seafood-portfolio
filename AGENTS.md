<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project rules
- All site content and settings live in one shared store (`src/lib/store.tsx`, defaults in `src/lib/defaults.ts`) persisted to localStorage; pages and admin read/write only through `useStore()` so admin edits show instantly — no backend by client request.
- Public page sections are shared components in `src/components/site.tsx`; admin modules live in `src/components/admin.tsx`, selected via the `?tab=` search param on `/admin/dashboard`.
- Admin auth is a frontend-only demo (sessionStorage flag); never store real secrets or treat it as secure.
