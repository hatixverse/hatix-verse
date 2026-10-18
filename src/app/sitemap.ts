import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { productPages, servicePages } from "@/content/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const page = (path: string, priority: number, changeFrequency: "monthly" | "yearly") => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  });
  return [
    page("", 1, "monthly"),
    ...Object.values(productPages).map((p) => page(`/products/${p.slug}`, 0.8, "monthly")),
    ...Object.values(servicePages).map((p) => page(`/services/${p.slug}`, 0.8, "monthly")),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];
}
