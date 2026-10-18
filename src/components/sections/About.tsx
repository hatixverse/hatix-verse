import { about } from "@/content/site";
import { Section } from "@/components/layout/Section";
import { SplitText } from "@/components/ui/SplitText";
import { AboutVisual } from "./AboutVisual";

export function About() {
  return (
    <Section id="about" label="About">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:items-stretch lg:gap-16">
        <div>
          <p className="label label-dot">{about.eyebrow}</p>
          <h2 className="h2 mt-4">
            <SplitText text={about.heading} />
          </h2>
          <div className="text-muted mt-8 max-w-[56ch] space-y-5 text-lg">
            {about.body.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </div>
          <dl className="divide-line border-line mt-10 divide-y border-y">
            {about.commitments.map((c, i) => (
              <div
                key={c.label}
                className="grid gap-2 py-5 sm:grid-cols-[120px_1fr] sm:items-baseline"
              >
                <dt className="label label-dot flex items-center gap-3">
                  <span className="text-faint">0{i + 1}</span>
                  <span className="text-text">{c.label}</span>
                </dt>
                <dd className="text-muted">{c.text}</dd>
              </div>
            ))}
          </dl>
        </div>

        <AboutVisual src={about.image.src} alt={about.image.alt} />
      </div>
    </Section>
  );
}
