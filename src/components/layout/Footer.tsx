import Link from "next/link";
import { ArrowUp, ArrowUpRight, Mail } from "lucide-react";
import { footer, nav, products, site } from "@/content/site";
import { productPages, servicePages } from "@/content/seo";
import { darkTokens } from "@/lib/darkTokens";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon } from "@/components/ui/SocialIcon";

const colTitle = "label mb-5 !text-faint";
const link = "text-sm text-muted transition-colors hover:text-lime";

export function Footer() {
  return (
    <footer style={darkTokens} className="bg-void text-text">
      <div className="wrap">
        <div className="border-line flex flex-col gap-8 border-b py-12 md:flex-row md:items-end md:justify-between md:py-24">
          <div>
            <p className="label flex items-center gap-2">
              <span aria-hidden className="bg-spark size-1.5 rounded-full" />
              Get in touch
            </p>
            <p className="h2 mt-4 max-w-2xl">{footer.cta}</p>
          </div>
          <Link
            href="/#contact"
            className="bg-accent hover:bg-lime hover:text-void inline-flex w-fit shrink-0 items-center gap-2 rounded-full px-6 py-3 font-medium whitespace-nowrap text-white transition-colors"
          >
            Start a conversation <ArrowUpRight size={18} aria-hidden />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-12 sm:grid-cols-3 sm:gap-12 sm:py-16 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr_1fr]">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
            <Logo className="text-text h-12 w-auto" />
            <p className="text-muted mt-4 max-w-xs text-sm">{footer.descriptor}</p>
            <a
              href={`mailto:${site.email}`}
              className="hover:text-lime mt-6 inline-flex items-center gap-2 text-sm"
            >
              <Mail size={16} aria-hidden /> {site.email}
            </a>
          </div>

          <nav aria-label="Footer">
            <h2 className={colTitle}>Explore</h2>
            <ul className="space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className={link}>
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={colTitle}>Products</h2>
            <ul className="space-y-3">
              {products.map((p) => (
                <li key={p.name}>
                  <Link href={`/products/${productPages[p.name].slug}`} className={link}>
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={colTitle}>Services</h2>
            <ul className="space-y-3">
              {Object.entries(servicePages).map(([name, sp]) => (
                <li key={name}>
                  <Link href={`/services/${sp.slug}`} className={link}>
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className={colTitle}>Legal</h2>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className={link}>
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={link}>
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <h2 className={colTitle}>Connect</h2>
            <ul className="flex gap-3">
              {site.socials.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    aria-label={s.label}
                    {...(s.href !== "#" && { target: "_blank", rel: "noopener noreferrer" })}
                    className="border-line text-muted hover:border-lime hover:text-lime grid size-10 place-items-center rounded-full border transition-colors"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-line text-faint flex flex-col gap-4 border-t py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.legalEntity}, India. All rights reserved.
          </p>
          <a href="#top" className="hover:text-lime inline-flex items-center gap-2">
            Back to top <ArrowUp size={14} aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
