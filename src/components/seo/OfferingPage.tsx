import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { JsonLd } from "@/components/seo/JsonLd";
import { FaqList, faqSchema } from "@/components/seo/FaqList";
import { PageShell } from "@/components/layout/PageShell";
import { Tag } from "@/components/ui/Tag";
import { site } from "@/content/site";
import type { PageCopy } from "@/content/seo";

type Props = {
  kind: "product" | "service";
  name: string;
  copy: PageCopy;
  status?: string;
  audience?: string;
  problem?: string;
  points: string[];
  pointsLabel: string;
  path: string;
};

export function OfferingPage({
  kind,
  name,
  copy,
  status,
  audience,
  problem,
  points,
  pointsLabel,
  path,
}: Props) {
  const url = `${site.url}${path}`;
  const orgRef = { "@id": `${site.url}/#organization` };
  const crumbs = [
    { name: "HATIX", url: site.url },
    {
      name: kind === "product" ? "Products" : "Services",
      url: `${site.url}/#${kind === "product" ? "products" : "journey"}`,
    },
    { name, url },
  ];
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      kind === "product"
        ? {
            "@type": "SoftwareApplication",
            name,
            description: copy.summary,
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            url,
            publisher: orgRef,
          }
        : {
            "@type": "Service",
            name: `HATIX ${name}`,
            serviceType: copy.descriptor,
            description: copy.summary,
            url,
            provider: orgRef,
          },
      faqSchema(copy.faqs),
      {
        "@type": "BreadcrumbList",
        itemListElement: crumbs.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: c.name,
          item: c.url,
        })),
      },
    ],
  };
  return (
    <PageShell>
      <JsonLd data={schema} />
      <article className="wrap section-pad">
        <nav aria-label="Breadcrumb" className="label flex flex-wrap items-center gap-2">
          <Link href="/" className="hover:text-text">
            HATIX
          </Link>
          <span aria-hidden>/</span>
          <Link
            href={`/#${kind === "product" ? "products" : "journey"}`}
            className="hover:text-text"
          >
            {kind === "product" ? "Products" : "Services"}
          </Link>
          <span aria-hidden>/</span>
          <span className="text-text">{name}</span>
        </nav>

        <header className="mt-8 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <Tag tone="accent">{kind === "product" ? "Product" : "Service"}</Tag>
            {status && <Tag tone="lime">{status}</Tag>}
          </div>
          <h1 className="mt-6">
            <span className="display block !text-[clamp(2.5rem,6vw,5rem)]">
              {kind === "service" && <span className="text-faint">HATIX </span>}
              {name}
            </span>
            <span className="text-text mt-4 block text-2xl font-medium">{copy.descriptor}</span>
          </h1>
          <p className="text-muted mt-5 max-w-[62ch] text-lg">{copy.summary}</p>
          <Link
            href="/#contact"
            className="bg-accent hover:bg-lime mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-white transition-colors hover:text-[#111823]"
          >
            {kind === "product" ? "Join the waitlist" : `Talk to us about ${name}`}
            <ArrowUpRight size={18} aria-hidden />
          </Link>
        </header>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <div className="space-y-12">
            {problem && (
              <section>
                <h2 className="h2 !text-3xl">The problem</h2>
                <p className="text-muted mt-4 max-w-[62ch] text-lg">{problem}</p>
              </section>
            )}
            <section>
              <h2 className="h2 !text-3xl">
                {kind === "product" ? "What it does" : "What this service is"}
              </h2>
              <div className="text-muted mt-4 max-w-[62ch] space-y-4 text-lg">
                {copy.long.map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
            </section>
            <section>
              <h2 className="h2 !text-3xl">{pointsLabel}</h2>
              <ul className="mt-5 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex gap-3">
                    <span className="bg-lime mt-1 grid size-5 shrink-0 place-items-center rounded-full text-[#111823]">
                      <Check size={12} strokeWidth={3} aria-hidden />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="border-line bg-surface-1 h-fit rounded-2xl border p-7">
            <h2 className="label">Who it is for</h2>
            <ul className="mt-5 space-y-3">
              {copy.who.map((w) => (
                <li key={w} className="flex gap-3">
                  <span aria-hidden className="bg-spark mt-2.5 size-1.5 shrink-0 rounded-full" />
                  {w}
                </li>
              ))}
            </ul>
            {audience && <p className="label border-line mt-6 border-t pt-5">{audience}</p>}
          </aside>
        </div>

        <section className="mt-20 max-w-4xl">
          <h2 className="h2">Frequently asked questions</h2>
          <div className="mt-8">
            <FaqList items={copy.faqs} />
          </div>
        </section>
      </article>
    </PageShell>
  );
}
