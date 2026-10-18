"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, MessageCircle, X } from "lucide-react";
import { nav } from "@/content/site";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => {
    const ids = [...nav.map((n) => n.href.split("#")[1]), "principles"];
    const map: Record<string, string> = { principles: "/#about" };
    const io = new IntersectionObserver(
      (es) => {
        for (const e of es) if (e.isIntersecting) setActive(map[e.target.id] ?? `/#${e.target.id}`);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);
  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-500",
        solid || open ? "border-line bg-void/90 backdrop-blur" : "border-transparent",
      )}
    >
      <div className="wrap flex h-16 items-center justify-between">
        <Link href="/" aria-label="HATIX home" className="text-[#111823]">
          <Logo className="h-8 w-auto sm:h-9" />
        </Link>
        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              aria-current={active === n.href ? "true" : undefined}
              className={cn(
                "border-b-2 py-1 text-sm transition-colors",
                active === n.href
                  ? "border-spark text-text"
                  : "text-muted hover:text-text border-transparent",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <Button href="/#contact" className="!px-4 !py-2 !text-sm whitespace-nowrap">
            <MessageCircle size={16} aria-hidden />
            <span className="sm:hidden">Let&rsquo;s talk</span>
            <span className="hidden sm:inline">Start a conversation</span>
          </Button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="border-line text-text grid size-10 place-items-center rounded-full border md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-menu"
          aria-label="Mobile"
          className="wrap border-line bg-void/95 flex flex-col border-t pb-5 backdrop-blur md:hidden"
        >
          {nav.map((n) => (
            <a
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              className={cn(
                "border-line border-b py-4 text-lg",
                active === n.href ? "text-text font-medium" : "text-muted",
              )}
            >
              {n.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
