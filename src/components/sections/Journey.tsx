"use client";
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Clock,
  FlaskConical,
  Hammer,
  Rocket,
  Sparkles,
} from "lucide-react";
import { journey } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { SplitText } from "@/components/ui/SplitText";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { servicePages } from "@/content/seo";
import { Cortex } from "./Cortex";
import { useMotionPref } from "@/components/providers/MotionPreference";
import { cn } from "@/lib/cn";

const icons = { lab: FlaskConical, build: Hammer, launch: Rocket };

export function Journey() {
  const { reduced } = useMotionPref();
  const ref = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);
  const [hot, setHot] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0,
      rootMargin: "0px 0px -12% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const on = seen || reduced;

  return (
    <Section id="journey" label="How we help" tint>
      <div className="grid gap-6 md:grid-cols-[1fr_1fr] md:items-end">
        <div>
          <p className="label label-dot">{journey.eyebrow}</p>
          <h2 className="h2 mt-4">
            <SplitText text={journey.heading} />
          </h2>
        </div>
        <p className="text-muted max-w-[48ch] md:justify-self-end">{journey.intro}</p>
      </div>

      <div ref={ref} className="relative mt-16">
        {/* the path: fills as the section arrives, with a signal travelling along it */}
        <div
          aria-hidden
          className="bg-line absolute top-[22px] right-[16%] left-[16%] hidden h-px lg:block"
        >
          <div
            className="bg-accent h-full origin-left"
            style={{
              transform: on ? "scaleX(1)" : "scaleX(0)",
              transition: reduced ? "none" : "transform 2.2s var(--ease-house) 0.3s",
            }}
          />
          {on && !reduced && <span className="travel bg-lime -top-[3px] size-[7px] rounded-full" />}
        </div>

        <ol className="grid gap-5 lg:grid-cols-3">
          {journey.stages.map((s, i) => {
            const Icon = icons[s.icon];
            const active = hot === i;
            return (
              <li
                key={s.name}
                onPointerEnter={() => setHot(i)}
                onPointerLeave={() => setHot(null)}
                onFocus={() => setHot(i)}
                onBlur={() => setHot(null)}
                className="relative flex flex-col"
                style={{
                  opacity: on ? 1 : 0,
                  transform: on ? "none" : "translateY(28px)",
                  transition: reduced
                    ? "none"
                    : `opacity 0.8s var(--ease-house) ${0.2 + i * 0.25}s, transform 0.9s var(--ease-house) ${0.2 + i * 0.25}s`,
                }}
              >
                {/* node on the path */}
                <div className="mb-6 flex items-center gap-3 lg:justify-center">
                  <span
                    className={cn(
                      "bg-void relative grid size-11 place-items-center rounded-full border transition-colors duration-500",
                      active ? "border-lime bg-lime text-[#111823]" : "border-accent text-accent",
                    )}
                  >
                    <Icon size={20} strokeWidth={1.75} aria-hidden />
                  </span>
                  <span className="label lg:hidden">{s.verb}</span>
                </div>

                <article
                  tabIndex={0}
                  className={cn(
                    "group bg-void ease-house relative flex flex-1 flex-col rounded-2xl border p-7 outline-offset-4 transition-[border-color,box-shadow,transform] duration-500",
                    active
                      ? "border-accent/60 -translate-y-1 shadow-[0_28px_60px_-36px_rgb(var(--accent-rgb)/0.55)]"
                      : "border-line",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="flex items-center gap-2">
                      <span className="border-accent/40 text-accent rounded-full border px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase">
                        {journey.kind}
                      </span>
                      <span className="label hidden !text-[10px] lg:inline">
                        0{i + 1} · {s.verb}
                      </span>
                    </p>
                    <p className="label inline-flex items-center gap-1.5 !text-[10px]">
                      <Clock size={12} aria-hidden /> {s.typical}
                    </p>
                  </div>
                  <h3 className="mt-6 text-3xl font-semibold tracking-tight">
                    <span className="text-faint">HATIX </span>
                    {s.name}
                  </h3>
                  <p className="text-text mt-3 text-[13px] font-medium">{journey.byline}</p>
                  <p className="text-muted mt-2 text-[15px]">{s.line}</p>

                  <a
                    href="#contact"
                    onClick={() =>
                      window.dispatchEvent(
                        new CustomEvent("hatix:prefill", { detail: s.offer.message }),
                      )
                    }
                    className="group/offer text-muted hover:text-text mt-4 flex items-start gap-2 text-xs transition-colors"
                  >
                    <span aria-hidden className="bg-spark mt-1 size-1.5 shrink-0 rounded-full" />
                    <span className="decoration-line group-hover/offer:decoration-accent underline underline-offset-4">
                      {s.offer.line}
                    </span>
                    <ArrowUpRight
                      size={13}
                      aria-hidden
                      className="mt-px shrink-0 transition-transform duration-300 group-hover/offer:translate-x-0.5 group-hover/offer:-translate-y-0.5"
                    />
                  </a>

                  <p className="label mt-6">{journey.getsLabel}</p>
                  <ul className="mt-4 flex-1 space-y-2.5 text-sm">
                    {s.gets.map((p) => (
                      <li key={p} className="flex gap-2.5">
                        <span className="bg-lime mt-0.5 grid size-4 shrink-0 place-items-center rounded-full text-[#111823]">
                          <Check size={10} strokeWidth={3} aria-hidden />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <div className="border-line bg-surface-1 mt-6 rounded-xl border p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="bg-lime inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-[#111823]">
                        <Sparkles size={12} aria-hidden /> {journey.aiLabel}
                      </span>
                    </div>
                    <p className="text-muted mt-3 text-[13px] leading-snug">{s.ai.line}</p>
                    <a
                      href="#contact"
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("hatix:prefill", { detail: s.ai.message }),
                        )
                      }
                      className="text-accent mt-3 inline-flex items-center gap-1 text-xs font-medium hover:underline"
                    >
                      Add AI to {s.name} <ArrowUpRight size={13} aria-hidden />
                    </a>
                  </div>
                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <a
                      href="#contact"
                      aria-label={`${journey.cta2} ${s.name}`}
                      onClick={() =>
                        window.dispatchEvent(
                          new CustomEvent("hatix:prefill", {
                            detail: `Hi, I'm interested in HATIX ${s.name}. Could we talk about how it would work for us?`,
                          }),
                        )
                      }
                      className="text-accent inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                    >
                      Talk to us <ArrowUpRight size={16} aria-hidden />
                    </a>
                    <Link
                      href={`/services/${servicePages[s.name].slug}`}
                      aria-label={`See details about HATIX ${s.name}`}
                      className="border-line hover:border-accent hover:text-accent inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors"
                    >
                      See details <ArrowRight size={14} aria-hidden />
                    </Link>
                  </div>
                </article>
              </li>
            );
          })}
        </ol>

        <div className="border-line bg-void mt-6 flex flex-col items-start justify-between gap-5 rounded-2xl border p-6 sm:flex-row sm:items-center">
          <p className="text-lg font-medium">{journey.cta.text}</p>
          <Button href="#contact">
            {journey.cta.button} <ArrowUpRight size={18} aria-hidden />
          </Button>
        </div>

        <div className="mt-12 md:mt-16">
          <Cortex />
        </div>
      </div>
    </Section>
  );
}
