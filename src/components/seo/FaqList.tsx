import { Plus } from "lucide-react";
import type { Faq } from "@/content/seo";

// Native <details>: every answer stays in the page HTML (readable by crawlers and screen readers)
// while the list stays compact for people.
export function FaqList({ items }: { items: Faq[] }) {
  return (
    <div className="divide-line border-line divide-y border-y">
      {items.map((f) => (
        <details key={f.q} className="group py-5">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
            <h3 className="text-lg font-medium">{f.q}</h3>
            <Plus
              size={20}
              aria-hidden
              className="text-accent shrink-0 transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <p className="text-muted mt-3 max-w-[70ch] text-[16px] leading-relaxed">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqSchema(items: Faq[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
