"use client";
import { useRef } from "react";
import { cn } from "@/lib/cn";
import { useMotionPref } from "@/components/providers/MotionPreference";

type Props = {
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
  children: React.ReactNode;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className">;

export function Button({ href, variant = "primary", className, children, ...rest }: Props) {
  const ref = useRef<HTMLElement>(null);
  const { reduced } = useMotionPref();
  const move = (e: React.PointerEvent) => {
    if (reduced || !ref.current || e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    const dx = Math.max(-8, Math.min(8, (e.clientX - (r.left + r.width / 2)) * 0.2));
    const dy = Math.max(-8, Math.min(8, (e.clientY - (r.top + r.height / 2)) * 0.2));
    ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };
  const cls = cn(
    "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-base font-medium transition-[transform,background-color,box-shadow] duration-500 ease-house",
    variant === "primary"
      ? "bg-accent text-white hover:bg-lime hover:text-[#111823] hover:shadow-[0_0_32px_-4px_var(--color-lime)]"
      : "border border-line text-text hover:border-spark hover:bg-surface-2",
    className,
  );
  const common = { onPointerMove: move, onPointerLeave: reset, className: cls };
  return href ? (
    <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} {...common}>
      {children}
    </a>
  ) : (
    <button ref={ref as React.Ref<HTMLButtonElement>} {...rest} {...common}>
      {children}
    </button>
  );
}
