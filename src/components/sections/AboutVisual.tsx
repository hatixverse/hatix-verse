"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useMotionPref } from "@/components/providers/MotionPreference";

// The about image is a slow, living object: it drifts, a light sweeps across it,
// it leans toward the cursor, and it settles into place when scrolled into view.
export function AboutVisual({ src, alt }: { src: string; alt: string }) {
  const { reduced } = useMotionPref();
  const root = useRef<HTMLDivElement>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced || e.pointerType !== "mouse") return;
    const el = root.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  };
  const leave = () => {
    root.current?.style.setProperty("--px", "0");
    root.current?.style.setProperty("--py", "0");
  };

  const show = seen || reduced;
  return (
    <div
      ref={root}
      onPointerMove={move}
      onPointerLeave={leave}
      className="border-line relative min-h-[360px] overflow-hidden rounded-2xl border bg-[#1a212c] [--px:0] [--py:0] lg:min-h-full"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(28px) scale(0.97)",
        transition: "opacity 0.9s var(--ease-house), transform 1.1s var(--ease-house)",
      }}
    >
      <div
        className="absolute inset-[-3%]"
        style={{
          transform: "translate(calc(var(--px) * -22px), calc(var(--py) * -16px))",
          transition: "transform 0.5s var(--ease-house)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="about-drift object-cover"
        />
      </div>
      {/* brand light: violet bloom, lime edge, and a slow sweep */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-soft-light"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 10%, rgba(94,23,235,0.5), transparent 70%), radial-gradient(50% 50% at 90% 95%, rgba(155,209,0,0.35), transparent 70%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="about-sheen absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      </div>
    </div>
  );
}
