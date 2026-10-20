"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ecosystem, products } from "@/content/site";
import { darkTokens } from "@/lib/darkTokens";
import { useMotionPref } from "@/components/providers/MotionPreference";
import { Tag } from "@/components/ui/Tag";
import { MaskLogo } from "@/components/ui/MaskLogo";
import Link from "next/link";
import { productPages } from "@/content/seo";
import { DunkScene } from "./DunkScene";
import { cn } from "@/lib/cn";

const glass =
  "rounded-xl border border-white/10 bg-surface-1/80 px-3.5 py-2.5 text-xs shadow-[0_18px_40px_-18px_rgba(0,0,0,0.8)] backdrop-blur-md";

// Steps through 0..total on a timer while `run` is true, then rests and loops.
function usePlayhead(run: boolean, total: number, ms: number, rest: number, still: boolean) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (still) return;
    if (!run) {
      const r = setTimeout(() => setStep(0), 0);
      return () => clearTimeout(r);
    }
    const t = setTimeout(() => setStep((s) => (s >= total ? 0 : s + 1)), step >= total ? rest : ms);
    return () => clearTimeout(t);
  }, [run, step, total, ms, rest, still]);
  return still ? total : step;
}

function Chip({
  k,
  v,
  z,
  show,
  className,
  delay = 0,
  warn,
}: {
  k: string;
  v: string;
  z: number;
  show: boolean;
  className: string;
  delay?: number;
  warn?: boolean;
}) {
  return (
    <div
      className={cn("ease-house absolute transition-[opacity,transform] duration-700", className)}
      style={{
        transform: `translateZ(${z}px) scale(${show ? 1 : 0.8})`,
        opacity: show ? 1 : 0,
      }}
    >
      <div className={cn(glass, "float3d")} style={{ animationDelay: `${delay}s` }}>
        <p className="label !text-faint !text-[10px]">{k}</p>
        <p className="text-text mt-1 flex items-center gap-1.5 text-sm font-medium">
          <span
            className={cn(
              "text-void grid size-4 place-items-center rounded-full",
              warn ? "bg-[#ffb020]" : "bg-spark",
            )}
          >
            {warn ? (
              <span className="text-[10px] leading-none font-bold">!</span>
            ) : (
              <Check size={10} strokeWidth={3} aria-hidden />
            )}
          </span>
          {v}
        </p>
      </div>
    </div>
  );
}

function PhoneScene({ run, still }: { run: boolean; still: boolean }) {
  const w = ecosystem.wassabi;
  const n = w.chat.length;
  const step = usePlayhead(run, n + 2, 1250, 3600, still);
  const typing = step < n && w.chat[step]?.from === "agent";
  return (
    <div className="relative h-[540px] w-[290px]" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="absolute inset-0 rounded-[42px] border border-white/20 bg-[#0a0c12] p-2 shadow-[0_60px_100px_-30px_rgb(var(--accent-rgb)/0.65)]"
        style={{ transform: "rotateY(-9deg)" }}
      >
        <div className="relative flex h-full flex-col overflow-hidden rounded-[34px] bg-gradient-to-b from-[#12151f] to-[#0a0c12]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.09] via-transparent to-transparent"
          />
          <div className="mx-auto mt-2 h-5 w-24 rounded-full bg-black" aria-hidden />
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3">
            <span className="bg-accent relative grid size-9 place-items-center rounded-full text-sm font-semibold text-white">
              A
              <span
                aria-hidden
                className="pulse-ring border-accent-hi absolute inset-0 rounded-full border"
              />
            </span>
            <div>
              <p className="text-sm font-medium">{w.hotel}</p>
              <p className="text-spark text-[11px]">{w.role}</p>
            </div>
          </div>
          <div className="flex flex-1 flex-col justify-end gap-2.5 px-3 pb-3">
            {w.chat.map((m, i) => (
              <p
                key={i}
                className={cn(
                  "ease-house max-w-[82%] rounded-2xl px-3.5 py-2 text-[13px] leading-snug transition-[opacity,transform] duration-500",
                  m.from === "guest"
                    ? "text-text self-start rounded-bl-md bg-white/10"
                    : "bg-accent self-end rounded-br-md text-white",
                  i < step ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0",
                  i >= step && "absolute",
                )}
                style={i >= step ? { visibility: "hidden" } : undefined}
              >
                {m.text}
              </p>
            ))}
            {typing && (
              <div
                className="bg-accent/70 flex gap-1 self-end rounded-2xl rounded-br-md px-3.5 py-3"
                aria-hidden
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="dot3 size-1.5 rounded-full bg-white"
                    style={{ animationDelay: `${d * 0.15}s` }}
                  />
                ))}
              </div>
            )}
            <div className="text-faint mt-1 rounded-full border border-white/10 px-3 py-2 text-[11px]">
              Message
            </div>
          </div>
        </div>
      </div>
      <Chip {...w.chips[0]} z={120} show={step >= n} className="top-16 -left-24 sm:-left-40" />
      <Chip
        {...w.chips[1]}
        z={170}
        show={step >= n + 1}
        className="right-[-4.5rem] bottom-28 sm:right-[-9rem]"
        delay={1.4}
      />
    </div>
  );
}

function SiteScene({ run, still }: { run: boolean; still: boolean }) {
  const a = ecosystem.argus;
  const go = run || still;
  const step = usePlayhead(run, 4, 1500, 4200, still);
  const typing = step === 2;
  const floorH = 30;
  return (
    <div className="relative h-[420px] w-[480px]" style={{ transformStyle: "preserve-3d" }}>
      <div
        className="absolute inset-0 overflow-hidden rounded-2xl border border-white/20 bg-[#0a0c12] shadow-[0_60px_100px_-30px_rgb(var(--accent-rgb)/0.65)]"
        style={{ transform: "rotateY(-8deg)" }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-br from-white/[0.07] via-transparent to-transparent"
        />
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <p className="label ml-3 !text-[10px]">{a.title}</p>
          <span className="text-spark ml-auto flex items-center gap-1.5 text-[10px]">
            <span className="bg-spark size-1.5 rounded-full" /> live
          </span>
        </div>

        <div className="grid grid-cols-[150px_1fr] gap-4 p-4">
          {/* the building, floor by floor */}
          <svg viewBox="0 0 150 215" className="w-full" aria-hidden>
            {[...a.floors].reverse().map((f, idx) => {
              const y = 8 + idx * (floorH + 1);
              const w = go ? (f.p / 100) * 118 : 0;
              const live = f.p > 0 && f.p < 100;
              return (
                <g key={f.label}>
                  <rect
                    x="26"
                    y={y}
                    width="118"
                    height={floorH}
                    rx="3"
                    fill="none"
                    stroke="var(--color-line)"
                  />
                  <rect
                    x="26"
                    y={y}
                    width={w}
                    height={floorH}
                    rx="3"
                    fill={live ? "var(--color-lime)" : "var(--color-accent)"}
                    fillOpacity={live ? 0.85 : 0.9}
                    style={{
                      transition: still
                        ? "none"
                        : `width 1.6s var(--ease-house) ${0.3 + idx * 0.25}s`,
                    }}
                  />
                  <text x="0" y={y + 19} fontSize="8" fill="var(--color-faint)">
                    {f.label.replace("Level ", "L").replace("Foundation", "F")}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="flex min-w-0 flex-col gap-3">
            {/* photo with detection */}
            <div className="relative h-[96px] overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br from-[#1b2230] to-[#0d1017]">
              <div
                aria-hidden
                className="absolute inset-0 opacity-50"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(90deg, transparent 0 16px, rgba(255,255,255,0.08) 16px 17px), repeating-linear-gradient(0deg, transparent 0 16px, rgba(255,255,255,0.08) 16px 17px)",
                }}
              />
              <div className="border-lime/80 absolute top-3 left-4 h-[60px] w-[110px] rounded border">
                <span className="bg-lime absolute -top-2.5 left-0 rounded px-1.5 py-0.5 text-[9px] font-semibold text-[#111823]">
                  {a.detect}
                </span>
                {!still && (
                  <span className="pulse-ring border-lime absolute inset-0 rounded border" />
                )}
              </div>
            </div>

            {/* ask your site anything */}
            <div className="flex flex-1 flex-col justify-end gap-2">
              {[a.question].map((q) => (
                <p
                  key={q}
                  className={cn(
                    "ease-house max-w-[88%] self-start rounded-2xl rounded-bl-md bg-white/10 px-3 py-2 text-[12px] leading-snug transition-[opacity,transform] duration-500",
                    step >= 1 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                  )}
                >
                  {q}
                </p>
              ))}
              {typing && (
                <div
                  className="bg-accent/70 flex gap-1 self-end rounded-2xl rounded-br-md px-3 py-2.5"
                  aria-hidden
                >
                  {[0, 1, 2].map((d) => (
                    <span
                      key={d}
                      className="dot3 size-1.5 rounded-full bg-white"
                      style={{ animationDelay: `${d * 0.15}s` }}
                    />
                  ))}
                </div>
              )}
              <p
                className={cn(
                  "bg-accent ease-house max-w-[92%] self-end rounded-2xl rounded-br-md px-3 py-2 text-[12px] leading-snug text-white transition-[opacity,transform] duration-500",
                  step >= 3 ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                )}
              >
                {a.answer}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Chip
        {...a.chips[0]}
        z={130}
        show={step >= 3 || still}
        className="-top-8 right-[-1rem] sm:right-[-4.5rem]"
      />
      <Chip
        {...a.chips[1]}
        z={180}
        show={step >= 4 || still}
        className="bottom-[-1.5rem] left-[-1rem] sm:left-[-5rem]"
        delay={1.2}
      />
    </div>
  );
}

export function Ecosystem() {
  const { reduced } = useMotionPref();
  const [active, setActive] = useState(0);
  const [seen, setSeen] = useState(false);
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const lift = useRef<HTMLDivElement>(null);
  const tilt = useRef<HTMLDivElement>(null);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.05,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The stage rises from a steep angle to face you as it scrolls into view.
  useEffect(() => {
    const st = stage.current;
    const l = lift.current;
    if (!st || !l || reduced) {
      if (l) l.style.transform = "";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = st.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.95 - r.top) / (vh * 0.7)));
      l.style.transform = `rotateX(${((1 - p) * 24).toFixed(2)}deg) translateZ(${((1 - p) * -120).toFixed(0)}px)`;
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = stage.current;
    const t = tilt.current;
    if (!el || !t) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    t.style.transform = `rotateX(${(-py * 10).toFixed(2)}deg) rotateY(${(px * 16).toFixed(2)}deg)`;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
    el.style.setProperty("--px", px.toFixed(3));
    el.style.setProperty("--py", py.toFixed(3));
  };
  const onLeave = () => {
    setPaused(false);
    const el = stage.current;
    if (tilt.current) tilt.current.style.transform = "";
    el?.style.setProperty("--px", "0");
    el?.style.setProperty("--py", "0");
  };
  const go = useCallback((n: number) => setActive((n + products.length) % products.length), []);
  const onKey = (e: React.KeyboardEvent) => {
    const d =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? 1
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? -1
          : 0;
    if (!d) return;
    e.preventDefault();
    go(active + d);
    tabs.current[(active + d + products.length) % products.length]?.focus();
  };

  const cur = products[active];
  const auto = !reduced && seen;

  return (
    <section
      ref={root}
      id="products"
      aria-label="Products"
      style={darkTokens}
      className="bg-void text-text section-pad relative overflow-hidden"
    >
      <div aria-hidden className="grid-overlay absolute inset-0 !opacity-[0.05]" />
      <div
        aria-hidden
        className="bg-accent/25 absolute top-1/2 right-[-10%] size-[700px] -translate-y-1/2 rounded-full blur-[150px]"
      />

      <div className="wrap relative">
        <p className="label flex items-center gap-2">
          <span aria-hidden className="bg-spark size-1.5 rounded-full" />
          {ecosystem.eyebrow}
        </p>
        <h2 className="h2 mt-4 max-w-3xl">{ecosystem.heading}</h2>
        <p className="text-muted mt-5 max-w-[56ch]">{ecosystem.intro}</p>

        <div
          ref={stage}
          onPointerMove={onMove}
          onPointerEnter={() => setPaused(true)}
          onPointerLeave={onLeave}
          className="border-line bg-surface-1/50 relative mt-14 overflow-hidden rounded-[28px] border lg:h-[740px]"
          style={{ perspective: "1800px", ["--px" as string]: 0, ["--py" as string]: 0 }}
        >
          {/* cursor light */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 lg:opacity-100"
            style={{
              background:
                "radial-gradient(520px circle at var(--mx, 70%) var(--my, 40%), rgb(var(--accent-rgb)/0.22), transparent 65%)",
            }}
          />
          {/* oversized product name, deep in the scene */}
          <div
            aria-hidden
            className="pointer-events-none absolute top-[9%] right-0 left-0 z-0 hidden justify-center select-none lg:flex"
            style={{
              transform: "translate(calc(var(--px) * -40px), calc(var(--py) * -24px))",
              transition: "transform 0.3s var(--ease-house)",
            }}
          >
            {cur.logo ? (
              <MaskLogo
                src={cur.logo.outline ?? cur.logo.src}
                ratio={cur.logo.ratio}
                label=""
                className="text-faint/70 h-[clamp(6rem,13vw,12rem)]"
              />
            ) : (
              <p className="text-outline text-[clamp(8rem,17vw,16rem)] leading-none font-bold tracking-[-0.05em]">
                {cur.name}
              </p>
            )}
          </div>

          <div
            ref={lift}
            className="relative h-[470px] lg:absolute lg:inset-0 lg:h-auto"
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* floor */}
            <div
              aria-hidden
              className="absolute inset-x-[-10%] bottom-[0%] h-[48%] opacity-70"
              style={{
                transform: "rotateX(72deg)",
                backgroundImage:
                  "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
                backgroundSize: "52px 52px",
                maskImage: "radial-gradient(ellipse at center, black 28%, transparent 70%)",
              }}
            />
            <div
              ref={tilt}
              className="ease-house absolute inset-0 transition-transform duration-300"
              style={{ transformStyle: "preserve-3d" }}
            >
              {products.map((p, i) => {
                const on = i === active;
                return (
                  <div
                    key={p.name}
                    role="tabpanel"
                    id={`panel-${p.name}`}
                    aria-labelledby={`tab-${p.name}`}
                    aria-hidden={!on}
                    className="ease-house absolute inset-0 grid place-items-center transition-[opacity,transform] duration-[900ms] lg:left-[26%]"
                    style={{
                      transformStyle: "preserve-3d",
                      opacity: on && (seen || reduced) ? 1 : 0,
                      transform: on
                        ? "none"
                        : `translate3d(${i < active ? "-22%" : "22%"}, 0, -480px) rotateY(${i < active ? "-42" : "42"}deg)`,
                      pointerEvents: on ? "auto" : "none",
                    }}
                  >
                    <div
                      className="scale-[0.66] sm:scale-[0.85] lg:scale-100"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {p.art === "agents" ? (
                        <PhoneScene run={on && seen} still={reduced} />
                      ) : p.art === "dunk" ? (
                        <DunkScene run={on && seen} still={reduced} />
                      ) : (
                        <SiteScene run={on && seen} still={reduced} />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* product details */}
          <div className="relative z-10 p-6 lg:absolute lg:bottom-[88px] lg:left-8 lg:w-[360px] lg:p-0">
            <div
              key={cur.name}
              className="bg-void/70 rounded-2xl border border-white/10 p-6 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="label !text-text">{cur.audience}</p>
                <Tag tone="lime">{cur.status}</Tag>
              </div>
              {cur.logo ? (
                <h3 className="mt-5">
                  <MaskLogo
                    src={cur.logo.src}
                    ratio={cur.logo.ratio}
                    label={cur.name}
                    className="h-9"
                  />
                </h3>
              ) : (
                <h3 className="mt-4 text-4xl font-semibold tracking-tight">{cur.name}</h3>
              )}
              <p className="text-text mt-3 text-[15px] leading-snug">{cur.problem}</p>
              <p className="text-muted mt-2 text-[15px]">{cur.description}</p>
              <ul className="border-line text-muted mt-5 space-y-2 border-t pt-4 text-sm">
                {(ecosystem.points[cur.name] ?? []).map((t) => (
                  <li key={t} className="flex gap-2.5">
                    <span aria-hidden className="bg-spark mt-2 size-1 shrink-0 rounded-full" />
                    {t}
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("hatix:prefill", {
                      detail: `Hi, I'm interested in ${cur.name} (${cur.audience.toLowerCase()}). ${cur.cta}, please.`,
                    }),
                  )
                }
                className="bg-accent hover:bg-lime mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white transition-colors hover:text-[#111823]"
              >
                {cur.href ? "Visit" : cur.cta} <ArrowUpRight size={16} aria-hidden />
              </a>
              <Link
                href={`/products/${productPages[cur.name].slug}`}
                aria-label={`See details about ${cur.name}`}
                className="hover:border-lime hover:text-lime mt-5 ml-2 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2.5 text-sm font-medium transition-colors"
              >
                See details <ArrowRight size={14} aria-hidden />
              </Link>
              <ul className="border-line text-faint mt-5 space-y-1.5 border-t pt-4 text-xs">
                {ecosystem.assurances.map((a) => (
                  <li key={a} className="flex items-center gap-2">
                    <Check size={12} className="text-lime shrink-0" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* switcher with auto-advance progress */}
          <div
            role="tablist"
            aria-label="Products"
            onKeyDown={onKey}
            className="relative z-10 flex gap-3 p-6 pt-0 lg:absolute lg:inset-x-8 lg:bottom-6 lg:p-0"
          >
            {products.map((p, i) => {
              const on = i === active;
              return (
                <button
                  key={p.name}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  role="tab"
                  id={`tab-${p.name}`}
                  aria-selected={on}
                  aria-controls={`panel-${p.name}`}
                  tabIndex={on ? 0 : -1}
                  onClick={() => go(i)}
                  className="group flex-1 text-left"
                >
                  <span
                    className={cn(
                      "label block transition-colors",
                      on ? "!text-text" : "group-hover:!text-text",
                    )}
                  >
                    {p.name}
                  </span>
                  <span className="bg-line mt-2 block h-0.5 overflow-hidden rounded-full">
                    {on && (
                      <span
                        key={`${p.name}-${auto}`}
                        onAnimationEnd={() => go(active + 1)}
                        className="bg-accent-hi block h-full origin-left"
                        style={{
                          animation: auto
                            ? `bar-fill ${ecosystem.autoAdvanceMs}ms linear forwards`
                            : undefined,
                          animationPlayState: paused ? "paused" : "running",
                          transform: auto ? undefined : "scaleX(1)",
                        }}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
        <p className="text-faint mt-4 px-1 text-xs">{ecosystem.note}</p>
        <p className="label mt-8">Explore each product</p>
        <ul className="mt-4 grid gap-3 md:grid-cols-3">
          {products.map((p) => (
            <li key={p.name}>
              <Link
                href={`/products/${productPages[p.name].slug}`}
                aria-label={`See details about ${p.name}`}
                className="border-line hover:border-lime group flex h-full flex-col justify-between gap-4 rounded-xl border p-4 transition-colors"
              >
                <span>
                  <span className="block font-medium">{p.name}</span>
                  <span className="text-muted mt-1 block text-sm">
                    {productPages[p.name].descriptor}
                  </span>
                </span>
                <span className="text-lime inline-flex items-center gap-1.5 text-sm font-medium">
                  See details
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
