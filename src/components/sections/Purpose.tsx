"use client";
import { useEffect, useRef, useState } from "react";
import { purpose } from "@/content/site";
import { darkTokens } from "@/lib/darkTokens";
import { cn } from "@/lib/cn";

const norm = (w: string) => w.toLowerCase().replace(/[^a-z-]/g, "");

function Statement({
  text,
  keys,
  className,
  id,
}: {
  text: string;
  keys: string[];
  className: string;
  id: string;
}) {
  return (
    <p data-s={id} className={className}>
      {text.split(" ").map((w, i) => (
        <span key={i} className={cn(keys.includes(norm(w)) && "pw-key")}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

export function Purpose() {
  const ref = useRef<HTMLElement>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.3,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="purpose"
      aria-label="Vision and mission"
      style={{ ...darkTokens, ["--lit" as string]: seen ? 1 : 0 }}
      className="bg-void text-text section-pad relative overflow-hidden"
    >
      <div aria-hidden className="grid-overlay absolute inset-0 !opacity-[0.04]" />
      <div
        aria-hidden
        className="via-accent-hi/60 absolute top-0 left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent to-transparent"
      />
      <div
        aria-hidden
        className="bg-accent/20 absolute top-[-200px] left-1/2 size-[520px] -translate-x-1/2 rounded-full blur-[140px]"
      />

      <div className="wrap relative grid gap-10 md:grid-cols-[200px_1fr] md:gap-16">
        <h2 className="label !text-muted flex items-start gap-2 pt-2">
          <span aria-hidden className="bg-spark mt-1 size-1.5 rounded-full" />
          {purpose.eyebrow}
        </h2>

        <div>
          <p className="label mb-5">{purpose.vision.label}</p>
          <Statement
            id="vision"
            text={purpose.vision.text}
            keys={purpose.vision.keys}
            className="text-text max-w-4xl text-[clamp(1.9rem,4vw,3.5rem)] leading-[1.1] font-semibold tracking-[-0.03em]"
          />

          <div className="bg-line my-12 h-px w-full md:my-16" />

          <p className="label mb-5">{purpose.mission.label}</p>
          <Statement
            id="mission"
            text={purpose.mission.text}
            keys={purpose.mission.keys}
            className="text-muted max-w-3xl text-[clamp(1.25rem,2.1vw,1.75rem)] leading-[1.45]"
          />
        </div>
      </div>
    </section>
  );
}
