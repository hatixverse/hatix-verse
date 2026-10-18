"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cortex } from "@/content/site";
import { darkTokens } from "@/lib/darkTokens";
import { Tag } from "@/components/ui/Tag";
import { useMotionPref } from "@/components/providers/MotionPreference";

const CortexScene = dynamic(() => import("./CortexScene"), { ssr: false });

function canUseWebGL() {
  try {
    const c = document.createElement("canvas");
    const nav = navigator as Navigator & { deviceMemory?: number };
    const low = (nav.deviceMemory ?? 8) < 4 || navigator.hardwareConcurrency < 4;
    const mobile = window.matchMedia("(max-width: 767px)").matches;
    return !!(c.getContext("webgl2") || c.getContext("webgl")) && !(mobile && low);
  } catch {
    return false;
  }
}

const cx = 210;
const cy = 165;
const R = 118;
const nodes = cortex.nodes.map((label, i) => {
  const a = (-90 + i * (360 / cortex.nodes.length)) * (Math.PI / 180);
  return { label, x: Math.round(cx + R * Math.cos(a)), y: Math.round(cy + R * Math.sin(a) * 0.92) };
});

// Still view for reduced motion, no WebGL and low-power phones.
function Fallback() {
  const { reduced } = useMotionPref();
  return (
    <svg
      viewBox="0 0 420 330"
      className="mx-auto w-full"
      role="img"
      aria-label="Cortex connects many kinds of AI to your business"
    >
      {nodes.map((n, i) => (
        <g key={n.label}>
          <line
            x1={cx}
            y1={cy}
            x2={n.x}
            y2={n.y}
            stroke="var(--color-accent-hi)"
            strokeOpacity="0.45"
            strokeDasharray="3 5"
          />
          {!reduced && (
            <circle r="3" fill="var(--color-lime)">
              <animateMotion
                dur={`${2.4 + (i % 3) * 0.5}s`}
                begin={`${i * 0.4}s`}
                repeatCount="indefinite"
                path={i % 2 ? `M${n.x} ${n.y} L${cx} ${cy}` : `M${cx} ${cy} L${n.x} ${n.y}`}
              />
            </circle>
          )}
        </g>
      ))}
      <circle cx={cx} cy={cy} r="38" fill="var(--color-accent)" />
      <circle
        cx={cx}
        cy={cy}
        r="38"
        fill="none"
        stroke="var(--color-accent-hi)"
        className="pulse-ring"
        style={{ transformOrigin: `${cx}px ${cy}px` }}
      />
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#fff">
        Cortex
      </text>
      {nodes.map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r="29"
            fill="var(--color-void)"
            stroke="var(--color-accent-hi)"
            strokeOpacity="0.65"
          />
          <text x={n.x} y={n.y + 3} textAnchor="middle" fontSize="9.5" fill="var(--color-muted)">
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Cortex() {
  const { reduced } = useMotionPref();
  const stage = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const [gl, setGl] = useState(false);
  const [near, setNear] = useState(false);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobile(window.matchMedia("(max-width: 767px)").matches);
    setGl(!reduced && canUseWebGL());
  }, [reduced]);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), {
      rootMargin: "20% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      style={darkTokens}
      className="border-line bg-void text-text relative overflow-hidden rounded-3xl border"
    >
      <div aria-hidden className="grid-overlay absolute inset-0 !opacity-[0.05]" />
      <div
        aria-hidden
        className="bg-accent/30 absolute top-1/2 right-[-6%] size-[420px] -translate-y-1/2 rounded-full blur-[120px]"
      />
      <div className="relative grid items-center gap-8 p-7 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
        <div>
          <p className="flex items-center gap-3">
            <span className="border-accent-hi/50 text-accent-hi rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase">
              {cortex.kind}
            </span>
            <span className="label label-dot">{cortex.eyebrow}</span>
          </p>
          <h3 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
            <span className="text-faint">HATIX </span>
            {cortex.name}
          </h3>
          <p className="text-text mt-3 text-xl">{cortex.headline}</p>
          <p className="text-muted mt-3 max-w-[52ch] text-[15px]">{cortex.body}</p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="What Cortex covers">
            {cortex.kinds.map((k) => (
              <li key={k}>
                <Tag>{k}</Tag>
              </li>
            ))}
          </ul>

          <div className="border-line mt-7 flex flex-wrap items-center gap-x-8 gap-y-4 border-t pt-6">
            <p className="text-muted max-w-[28ch] text-sm leading-snug">{cortex.quoteLine}</p>
            <a
              href="#contact"
              onClick={() =>
                window.dispatchEvent(new CustomEvent("hatix:prefill", { detail: cortex.message }))
              }
              className="bg-accent hover:bg-lime inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors hover:text-[#111823] sm:ml-auto"
            >
              {cortex.cta} <ArrowUpRight size={18} aria-hidden />
            </a>
            <Link
              href="/services/cortex"
              aria-label="Know more about HATIX Cortex"
              className="hover:border-lime hover:text-lime inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition-colors"
            >
              Know more <ArrowRight size={14} aria-hidden />
            </Link>
          </div>
        </div>

        <div ref={stage} className="relative mx-auto aspect-square w-full max-w-[540px]">
          {gl ? (
            <>
              <CortexScene active={near} mobile={mobile} labels={labels} />
              {cortex.nodes.map((n, k) => (
                <span
                  key={n}
                  ref={(el) => {
                    labels.current[k] = el;
                  }}
                  className="border-line bg-void/70 text-text pointer-events-none absolute top-0 left-0 rounded-full border px-2.5 py-1 text-[11px] whitespace-nowrap opacity-0 backdrop-blur-md"
                >
                  {n}
                </span>
              ))}
            </>
          ) : (
            <Fallback />
          )}
        </div>
      </div>
    </div>
  );
}
