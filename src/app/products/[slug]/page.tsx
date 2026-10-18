import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferingPage } from "@/components/seo/OfferingPage";
import { ecosystem, products } from "@/content/site";
import { productPages } from "@/content/seo";

type Params = { slug: string };
const find = (slug: string) => {
  const p = products.find((x) => productPages[x.name]?.slug === slug);
  return p ? { p, copy: productPages[p.name] } : null;
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: productPages[p.name].slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const hit = find((await params).slug);
  if (!hit) return {};
  const title = `${hit.p.name}: ${hit.copy.descriptor}`;
  return {
    title,
    description: hit.copy.summary,
    alternates: { canonical: `/products/${hit.copy.slug}` },
    openGraph: {
      title,
      description: hit.copy.summary,
      url: `/products/${hit.copy.slug}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const hit = find((await params).slug);
  if (!hit) notFound();
  const { p, copy } = hit;
  return (
    <OfferingPage
      kind="product"
      name={p.name}
      copy={copy}
      status={p.status}
      audience={p.audience}
      problem={p.problem}
      points={ecosystem.points[p.name] ?? []}
      pointsLabel="How it helps"
      path={`/products/${copy.slug}`}
    />
  );
}
