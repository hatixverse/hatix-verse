import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { site } from "@/content/site";

export const metadata = {
  title: "Terms",
  description: "Terms for HATIX VERSE LLP.",
  alternates: { canonical: "/terms" },
};

export default function Page() {
  const entity = site.legalEntity;
  return (
    <PageShell>
      <div className="wrap section-pad">
        <Link href="/" className="label hover:text-text">
          ← HATIX
        </Link>
        <h1 className="h2 mt-6">Terms</h1>
        <div className="mt-6">
          <p className="text-muted mt-4 max-w-[62ch]">{`This site is provided for general information about ${entity} and its products. Nothing here is an offer, a warranty or professional advice.`}</p>
          <p className="text-muted mt-4 max-w-[62ch]">{`Product names and descriptions may change as products develop. All content and marks on this site belong to ${entity} unless stated otherwise.`}</p>
          <p className="text-muted mt-4 max-w-[62ch]">
            Questions about these terms?{" "}
            <a className="text-accent-hi underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </div>
      </div>
    </PageShell>
  );
}
