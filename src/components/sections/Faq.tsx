import { Section } from "@/components/layout/Section";
import { SplitText } from "@/components/ui/SplitText";
import { FaqList } from "@/components/seo/FaqList";
import { homeFaq } from "@/content/seo";

export function Faq() {
  return (
    <Section id="faq" label="Frequently asked questions">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <p className="label label-dot">Questions</p>
          <h2 className="h2 mt-4">
            <SplitText text="Frequently asked questions." />
          </h2>
          <p className="text-muted mt-5 max-w-[40ch]">
            Straight answers about HATIX, our products and how we work with you.
          </p>
        </div>
        <FaqList items={homeFaq} />
      </div>
    </Section>
  );
}
