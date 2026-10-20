import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { site } from "@/content/site";

export const metadata = {
  title: "Privacy",
  description: "Privacy for HATIX VERSE LLP.",
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  const entity = site.legalEntity;
  return (
    <PageShell>
      <div className="wrap section-pad">
        <Link href="/" className="label hover:text-text">
          ← HATIX
        </Link>
        <h1 className="h2 mt-6">Privacy</h1>
        <div className="mt-6">
          <p className="text-muted mt-4 max-w-[62ch]">{`${entity} collects only what you send through the contact form: your name, email and message. We use it to reply to you and do not sell it or share it for advertising.`}</p>
          <p className="text-muted mt-4 max-w-[62ch]">{`Messages are delivered by email through our processor, Resend. We use Vercel Analytics for privacy-friendly, aggregate traffic measurement.`}</p>
          <p className="text-muted mt-4 max-w-[62ch]">
            To ask us to access or delete your message,{" "}
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
