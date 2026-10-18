import { site, products } from "@/content/site";
import { homeFaq, productPages, servicePages } from "@/content/seo";

// A plain-text summary of the site for AI crawlers and assistants (llms.txt convention).
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `${site.name} is operated by ${site.legalEntity}. Pricing is shared on request.`,
    "",
    "## Products",
    ...products.map((p) => {
      const c = productPages[p.name];
      return `- [${p.name}](${site.url}/products/${c.slug}): ${c.summary} Status: ${p.status}.`;
    }),
    "",
    "## Services (HATIX Catalyst)",
    ...Object.entries(servicePages).map(
      ([name, c]) => `- [HATIX ${name}](${site.url}/services/${c.slug}): ${c.summary}`,
    ),
    "",
    "## Frequently asked questions",
    ...homeFaq.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Optional",
    `- [Home](${site.url}/)`,
    `- [Privacy](${site.url}/privacy)`,
    `- [Terms](${site.url}/terms)`,
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
