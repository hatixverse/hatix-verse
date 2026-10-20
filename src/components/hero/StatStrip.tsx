"use client";
import { useEffect, useRef, useState } from "react";
import { useMotionPref } from "@/components/providers/MotionPreference";

type Stat = { label: string; value: string };

// "100%" -> { n: 100, suffix: "%" }; "3" -> { n: 3, suffix: "" }
const parse = (v: string) => {
  const m = v.match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : null;
};

function Cell({ stat, index, play }: { stat: Stat; index: number; play: boolean }) {
  const p = parse(stat.value);
  const [shown, setShown] = useState(p?.n ?? 0);

  useEffect(() => {
    if (!p || !play) return;
    let raf = 0;
    const start = performance.now() + index * 140;
    const dur = 1100;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / dur));
      setShown(Math.round(p.n * (1 - Math.pow(1 - t, 3))));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [play, p?.n, index]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="group relative flex flex-col-reverse justify-end gap-2 border-l border-white/70 p-4 transition-colors first:border-l-0 hover:bg-white/40 sm:gap-3 sm:p-6">
      <span
        aria-hidden
        className="bg-lime absolute top-0 left-4 h-0.5 w-8 transition-[width] duration-500 group-hover:w-14 sm:left-6"
      />
      <dt className="label !text-[10px] leading-snug sm:!text-[11px]">{stat.label}</dt>
      <dd className="text-text text-3xl font-semibold tracking-[-0.03em] tabular-nums sm:text-5xl">
        {p ? shown : stat.value}
        {p && p.suffix && <span className="text-accent">{p.suffix}</span>}
      </dd>
    </div>
  );
}

export function StatStrip({ stats }: { stats: Stat[] }) {
  const { reduced } = useMotionPref();
  const ref = useRef<HTMLDListElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setPlay(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div className="relative mt-14 sm:mt-16">
      {/* colour behind the glass, so the blur has something to refract */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
        <span className="bg-accent/35 absolute -top-6 left-[8%] size-32 rounded-full blur-2xl sm:size-44" />
        <span className="bg-lime/60 absolute right-[10%] -bottom-8 size-28 rounded-full blur-2xl sm:size-40" />
        <span className="bg-accent/25 absolute top-1/2 left-[46%] size-24 -translate-y-1/2 rounded-full blur-2xl" />
      </div>
      <dl
        ref={ref}
        className="relative grid grid-cols-3 overflow-hidden rounded-2xl border border-white/70 bg-white/40 shadow-[0_24px_60px_-24px_rgb(var(--accent-rgb)/0.45),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-transparent"
        />
        {stats.map((s, i) => (
          <Cell key={s.label} stat={s} index={i} play={play} />
        ))}
      </dl>
    </div>
  );
}
