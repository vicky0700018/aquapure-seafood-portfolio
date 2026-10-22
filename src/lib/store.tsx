import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { defaultData, type SiteData } from "./defaults";

const KEY = "aquapure-demo-data-v1";
const AUTH = "aquapure-demo-admin";
export const DEMO_USER = "admin";
export const DEMO_PASS = "AquaPure@123";

type Ctx = {
  data: SiteData;
  ready: boolean;
  update: (fn: (d: SiteData) => SiteData) => void;
  reset: () => void;
  authed: boolean;
  login: (u: string, p: string) => boolean;
  logout: () => void;
};
const StoreCtx = createContext<Ctx | null>(null);

const clone = () => JSON.parse(JSON.stringify(defaultData)) as SiteData;

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(defaultData);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        setData({ ...clone(), ...saved, settings: { ...defaultData.settings, ...saved.settings, sections: { ...defaultData.settings.sections, ...saved.settings?.sections } } });
      }
      setAuthed(sessionStorage.getItem(AUTH) === "1");
    } catch { /* ignore corrupt demo data */ }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(data));
  }, [data, ready]);

  const value: Ctx = {
    data, ready, authed,
    update: (fn) => setData((d) => fn(d)),
    reset: () => setData(clone()),
    login: (u, p) => {
      const ok = u.trim() === DEMO_USER && p === DEMO_PASS;
      if (ok) { sessionStorage.setItem(AUTH, "1"); setAuthed(true); }
      return ok;
    },
    logout: () => { sessionStorage.removeItem(AUTH); setAuthed(false); },
  };
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("useStore outside provider");
  return c;
}

export const uid = () => Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
