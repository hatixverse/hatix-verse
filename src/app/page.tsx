import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/hero/Hero";
import { TrustStrip } from "@/components/ui/TrustStrip";
import { Purpose } from "@/components/sections/Purpose";
import { Journey } from "@/components/sections/Journey";
import { Ecosystem } from "@/components/sections/Ecosystem";
import { Principles } from "@/components/sections/Principles";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Faq } from "@/components/sections/Faq";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqSchema } from "@/components/seo/FaqList";
import { homeFaq } from "@/content/seo";

export default function Home() {
  return (
    <>
      <a
        href="#journey"
        className="focus:bg-accent sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <JsonLd data={{ "@context": "https://schema.org", ...faqSchema(homeFaq) }} />
      <Navbar />
      <main>
        <Hero />
        <TrustStrip />
        <Ecosystem />
        <Journey />
        <Principles />
        <About />
        <Faq />
        <Purpose />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
