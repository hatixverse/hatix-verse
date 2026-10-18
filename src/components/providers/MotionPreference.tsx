"use client";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Ctx = { reduced: boolean; toggle: () => void };
const C = createContext<Ctx>({ reduced: false, toggle: () => {} });
export const useMotionPref = () => useContext(C);

export function MotionPreference({ children }: { children: React.ReactNode }) {
  const [system, setSystem] = useState(false);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const upd = () => setSystem(mq.matches);

    upd();
    mq.addEventListener("change", upd);
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setManual(localStorage.getItem("reduce-motion") === "1");
    } catch {}
    return () => mq.removeEventListener("change", upd);
  }, []);
  const reduced = system || manual;
  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);
  const toggle = useCallback(() => {
    setManual((m) => {
      try {
        localStorage.setItem("reduce-motion", m ? "0" : "1");
      } catch {}
      return !m;
    });
  }, []);
  return <C.Provider value={{ reduced, toggle }}>{children}</C.Provider>;
}
