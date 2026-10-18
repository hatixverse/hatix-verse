"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { hero } from "@/content/site";
import { LOGO_LIME, LOGO_PURPLE, X_MAIN, X_TIP, X_VIEWBOX } from "@/lib/logoPaths";
import { Button } from "@/components/ui/Button";
import { StatStrip } from "./StatStrip";
import { useMotionPref } from "@/components/providers/MotionPreference";

const Scene = dynamic(() => import("./HeroScene"), { ssr: false });

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const low = (nav.deviceMemory ?? 8) < 4 || navigator.hardwareConcurrency < 4;
    const mobile = window.matchMedia("(max-width: 1023px)").matches;
    return !!(c.getContext("webgl2") || c.getContext("webgl")) && !(mobile && low);
  } catch {
    return false;
  }
}

// Static stand-in for reduced motion, no WebGL and low-power phones.
function StaticMark() {
  return (
    <div aria-hidden className="absolute inset-0 grid place-items-center">
      <div className="bg-accent/15 absolute size-[420px] rounded-full blur-[110px]" />
      <svg viewBox={X_VIEWBOX} className="relative w-[min(70%,420px)] drop-shadow-xl">
        <path fill={LOGO_PURPLE} d={X_MAIN} />
        <path fill={LOGO_LIME} d={X_TIP} />
      </svg>
    </div>
  );
}

export function Hero() {
  const { reduced } = useMotionPref();
  const root = useRef<HTMLElement>(null);
  // null = still deciding: render nothing, so the still fallback never flashes before the 3D scene.
  const [gl, setGl] = useState<boolean | null>(null);
  const [near, setNear] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobile(window.matchMedia("(max-width: 1023px)").matches);
    setGl(!reduced && canUseWebGL());
  }, [reduced]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={root}
      id="top"
      aria-label="Introduction"
      className="short:pt-24 relative flex min-h-[100svh] flex-col justify-end overflow-hidden pt-[calc(5rem+(100vw-2.5rem)*0.9)] lg:pt-32"
    >
      <div aria-hidden className="grid-overlay absolute inset-0" />
      <div className="short:top-16 short:right-4 short:bottom-auto short:left-auto short:aspect-auto short:h-[calc(100svh-5rem)] short:w-[52%] absolute top-20 right-5 left-5 aspect-[589/530] lg:top-0 lg:right-0 lg:bottom-0 lg:left-auto lg:aspect-auto lg:w-[62%]">
        {gl === null ? null : gl ? <Scene active={near} mobile={mobile} /> : <StaticMark />}
      </div>

      <div className="wrap relative w-full pb-12">
        <h1
          className="display hero-in short:max-w-[52%] mt-6 max-w-3xl"
          style={{ animationDelay: "0.15s" }}
        >
          <span className="label border-line bg-surface-1/70 !text-text mb-6 flex w-fit max-w-full items-center gap-2.5 rounded-full border px-4 py-2 !text-[11px] !leading-snug shadow-[0_8px_24px_-16px_rgba(94,23,235,0.5)] backdrop-blur max-sm:rounded-2xl sm:!text-[12px]">
            <span aria-hidden className="relative flex size-2 shrink-0">
              <span className="bg-accent absolute inline-flex size-full rounded-full opacity-60 motion-safe:animate-ping" />
              <span className="bg-accent relative inline-flex size-2 rounded-full" />
            </span>
            {hero.eyebrow}
          </span>
          {hero.headline.split(" ").map((w, i) => (
            <span key={i}>
              {hero.highlight.includes(w) ? <mark className="mark-lime">{w}</mark> : w}{" "}
            </span>
          ))}
        </h1>
        <p
          className="hero-in text-muted short:max-w-[48%] mt-8 max-w-[52ch] text-lg"
          style={{ animationDelay: "0.4s" }}
        >
          {hero.sub}
        </p>
        <div className="hero-in mt-10 flex flex-wrap gap-4" style={{ animationDelay: "0.55s" }}>
          <Button href={hero.primary.href}>
            {hero.primary.label} <ArrowRight size={18} aria-hidden />
          </Button>
          <Button href={hero.secondary.href} variant="secondary">
            {hero.secondary.label} <ArrowDown size={18} aria-hidden />
          </Button>
        </div>
        <StatStrip stats={hero.signals} />
      </div>
    </section>
  );
}
