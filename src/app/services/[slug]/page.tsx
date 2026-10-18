import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OfferingPage } from "@/components/seo/OfferingPage";
import { cortex, journey } from "@/content/site";
import { servicePages } from "@/content/seo";

type Params = { slug: string };
const find = (slug: string) => {
  const entry = Object.entries(servicePages).find(([, c]) => c.slug === slug);
  return entry ? { name: entry[0], copy: entry[1] } : null;
};

export function generateStaticParams() {
  return Object.values(servicePages).map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const hit = find((await params).slug);
  if (!hit) return {};
  const title = `HATIX ${hit.name}: ${hit.copy.descriptor}`;
  return {
    title,
    description: hit.copy.summary,
    alternates: { canonical: `/services/${hit.copy.slug}` },
    openGraph: {
      title,
      description: hit.copy.summary,
      url: `/services/${hit.copy.slug}`,
      type: "website",
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const hit = find((await params).slug);
  if (!hit) notFound();
  const { name, copy } = hit;
  const stage = journey.stages.find((s) => s.name === name);
  const points = stage ? stage.gets : cortex.kinds;
  return (
    <OfferingPage
      kind="service"
      name={name}
      copy={copy}
      points={points}
      pointsLabel={stage ? "What we do for you" : "What Cortex covers"}
      path={`/services/${copy.slug}`}
    />
  );
}
