import { ContactModal } from "@/components/sections/ContactModal";
import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/content/site";
import { servicePages } from "@/content/seo";
import { MotionPreference } from "@/components/providers/MotionPreference";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: "%s | HATIX" },
  description: site.description,
  keywords: site.keywords,
  applicationName: site.name,
  authors: [{ name: site.legalEntity }],
  creator: site.legalEntity,
  publisher: site.legalEntity,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: "/",
    siteName: site.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#FFFFFF", colorScheme: "light" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      serviceType: [
        "AI agent development",
        "AI workflow automation",
        "LLM application development",
        "SaaS product engineering",
      ],
      "@id": `${site.url}/#organization`,
      name: site.name,
      legalName: site.legalEntity,
      url: site.url,
      description: site.description,
      logo: `${site.url}/logo.png`,
      address: { "@type": "PostalAddress", addressCountry: "IN" },
      slogan: "Crafted for execution.",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "HATIX Catalyst services",
        itemListElement: Object.entries(servicePages).map(([name, c]) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: `HATIX ${name}`, description: c.summary },
        })),
      },
      knowsAbout: [
        "AI agents",
        "AI automation",
        "LLM applications",
        "SaaS development",
        "Product validation",
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",
          availableLanguage: "English",
        },
      ],
      sameAs: site.socials.filter((s) => s.href !== "#").map((s) => s.href),
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${site.url}/#organization` },
      inLanguage: "en",
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
        />
        <MotionPreference>
          <SmoothScroll>{children}</SmoothScroll>
          <ContactModal />
        </MotionPreference>
        <Analytics />
      </body>
    </html>
  );
}
