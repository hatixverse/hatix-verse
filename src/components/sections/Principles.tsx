import { principles } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { SplitText } from "@/components/ui/SplitText";

export function Principles() {
  return (
    <Section id="principles" label="Principles" tint>
      <p className="label label-dot">What guides us</p>
      <h2 className="h2 mt-4">
        <SplitText text="Our principles." />
      </h2>
      <ol className="divide-line border-line mt-12 divide-y border-y">
        {principles.map((p, i) => (
          <li
            key={p.title}
            className="grid gap-3 py-8 md:grid-cols-[72px_1.4fr_1fr] md:items-start md:gap-8 md:py-10"
          >
            <span className="label label-dot pt-2">0{i + 1}</span>
            <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">
              <SplitText text={p.title} />
            </h3>
            <p className="text-muted max-w-[62ch] md:pt-2">{p.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}
