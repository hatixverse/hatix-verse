"use client";
import { cn } from "@/lib/cn";

export function SpotlightCard({
  className,
  flush,
  children,
}: {
  className?: string;
  flush?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group border-line bg-surface-1 ease-house hover:border-accent/40 relative overflow-hidden rounded-2xl border transition-[border-color,box-shadow] duration-500 hover:shadow-[0_24px_60px_-30px_rgb(var(--accent-rgb)/0.45)]",
        !flush && "p-8",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(360px circle at var(--x,50%) var(--y,50%), rgb(var(--accent-rgb)/0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="via-spark pointer-events-none absolute inset-x-8 top-0 z-10 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
