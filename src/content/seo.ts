// Search and answer-engine content: dedicated page copy and FAQs.
// Written in plain, quotable sentences on purpose. Concept and in-development products are labelled as such.

export type Faq = { q: string; a: string };

export type PageCopy = {
  slug: string;
  descriptor: string; // what it is, in plain words (used in titles and headings)
  summary: string; // one self-contained sentence a search or AI engine can quote
  long: string[];
  who: string[];
  faqs: Faq[];
};

export const productPages: Record<string, PageCopy> = {
  "Dunk Tank": {
    slug: "dunk-tank",
    descriptor: "AI pitch roaster for founders and sales teams",
    summary:
      "Dunk Tank is a concept AI product from HATIX that roasts your startup pitch or sales pitch like a deadpan comedian, then lets you win by answering with evidence.",
    long: [
      "Dunk Tank is a concept AI product that roasts your startup pitch, sales pitch or website copy the way a deadpan comedian would, and then makes you earn the win.",
      "An AI heckler challenges every weak claim. Each time you answer with real evidence, such as paying customers, revenue or signed commitments, you land a hit. After enough hits the heckler is dunked in the tank, and you get a report card with marks and the fixes that matter most.",
    ],
    who: [
      "First-time founders preparing to pitch investors",
      "Sales teams rehearsing for tough buyers",
      "Anyone who wants honest feedback before the real meeting",
    ],
    faqs: [
      {
        q: "What is Dunk Tank?",
        a: "Dunk Tank is a concept AI product from HATIX that roasts your pitch and asks for evidence. Answer well and the heckler is dunked in the tank. It ends with a report card and a list of fixes.",
      },
      {
        q: "Is Dunk Tank available today?",
        a: "Not yet. It is a concept that HATIX is validating. You can join the waitlist through the contact form.",
      },
      {
        q: "Is the feedback real investor advice?",
        a: "No. It is entertainment with useful pointers, not market research or financial advice. Pair it with real conversations with customers and investors.",
      },
      {
        q: "How is Dunk Tank different from other pitch roast tools?",
        a: "It turns the feedback into a game where evidence wins, uses a deadpan Indian-English voice, and ends with fixes you can act on. If you want an expert to validate the idea with you, it leads into HATIX Radar.",
      },
    ],
  },
  Wassabi: {
    slug: "wassabi",
    descriptor: "WhatsApp AI assistant for independent hotels",
    summary:
      "Wassabi is a WhatsApp-native AI assistant from HATIX that answers guest messages, handles booking requests and hands over to staff when a human is needed.",
    long: [
      "Wassabi is a WhatsApp-native, multi-agent operations layer for independent hotels. It answers guest messages at any hour, handles booking enquiries and requests end to end, and hands over to staff when a human is needed.",
      "Hotels already live on WhatsApp. Wassabi works inside that channel, so guests do not need an app and staff do not need to learn a new tool.",
    ],
    who: [
      "Owners and managers of independent hotels",
      "Front desk teams that get messages around the clock",
      "Small properties without a 24-hour desk",
    ],
    faqs: [
      {
        q: "What is Wassabi?",
        a: "Wassabi is a WhatsApp-native AI assistant for independent hotels. It replies to guests, handles booking requests and passes conversations to staff when needed.",
      },
      {
        q: "Which hotels is Wassabi built for?",
        a: "Independent hotels and small properties that handle guest enquiries on WhatsApp and do not have round-the-clock staff.",
      },
      {
        q: "Does Wassabi replace hotel staff?",
        a: "No. It handles routine messages and hands over to your team whenever a person is needed. Humans stay in control.",
      },
      {
        q: "Is Wassabi available now?",
        a: "Wassabi is in development. You can request early access through the contact form.",
      },
    ],
  },
  Argus: {
    slug: "argus",
    descriptor: "AI site supervisor for construction contractors",
    summary:
      "Argus is a concept AI supervisor from HATIX that turns daily site photos and voice notes into a live site log and warns contractors about delays early.",
    long: [
      "Argus is a concept AI supervisor for construction sites. Workers send daily photos and voice notes, and Argus turns them into a live site log, compares progress with the plan, and warns about delays and shortages early.",
      "Managers can ask questions in plain language, such as why a level is running late, and get answers based on what the site actually reported.",
    ],
    who: [
      "Construction contractors and small builders",
      "Site managers who coordinate crews, materials and deliveries",
      "Project owners who want clearer progress reports",
    ],
    faqs: [
      {
        q: "What is Argus?",
        a: "Argus is a concept AI site supervisor. It builds a live site log from photos and voice notes, flags delays early, and answers questions about the site in plain language.",
      },
      {
        q: "Does Argus need special hardware?",
        a: "No. The idea is that it works from photos and voice notes sent from an ordinary phone.",
      },
      {
        q: "How does Argus spot delays?",
        a: "It compares reported progress with the plan and highlights gaps early. As a concept, its accuracy is still to be proven with real sites.",
      },
      {
        q: "Is Argus available?",
        a: "Not yet. It is a concept that HATIX is validating. You can join the waitlist through the contact form.",
      },
    ],
  },
};

export const servicePages: Record<string, PageCopy> = {
  Radar: {
    slug: "radar",
    descriptor: "Startup idea validation service",
    summary:
      "HATIX Radar is a done-for-you validation service that tests demand for a product idea with real customers before you spend on building.",
    long: [
      "HATIX Radar is a validation service for founders and businesses with a product idea. The HATIX team tests demand with real customers before you spend on building.",
      "You get customer and problem discovery, a validation plan, a prototype or fake-door test, a demand evidence report, and a clear recommendation to go, pivot or stop.",
    ],
    who: [
      "First-time founders with an idea they have not tested",
      "Business owners exploring a new product line",
      "Teams that must justify a build with evidence",
    ],
    faqs: [
      {
        q: "What is HATIX Radar?",
        a: "HATIX Radar is a service where the HATIX team validates your product idea with real customers and gives you an evidence-based go, pivot or stop recommendation.",
      },
      {
        q: "How long does validation take?",
        a: "Typically two to four weeks, depending on the idea and how quickly we can reach customers.",
      },
      {
        q: "What do I get at the end?",
        a: "A demand evidence report, a tested prototype or fake-door result, and a clear recommendation on what to do next.",
      },
      {
        q: "How much does HATIX Radar cost?",
        a: "Pricing depends on the idea and the scope. Contact HATIX for a quote.",
      },
    ],
  },
  Genesis: {
    slug: "genesis",
    descriptor: "Product development and MVP build service",
    summary:
      "HATIX Genesis is a done-for-you service that designs, builds and launches your product from scratch, with analytics and support included.",
    long: [
      "HATIX Genesis is a product development service. The HATIX team scopes, designs and builds your product from scratch, then launches it.",
      "Work covers UX design, full-stack engineering for web and mobile as needed, cloud setup and security, analytics, testing, and launch support with documentation and a period of post-launch support.",
    ],
    who: [
      "Founders with a validated idea who need it built",
      "Businesses that want to launch a new digital product",
      "Teams without an in-house product and engineering group",
    ],
    faqs: [
      {
        q: "What is HATIX Genesis?",
        a: "HATIX Genesis is a service where the HATIX team builds and launches your product from scratch, from design and engineering to analytics and launch support.",
      },
      {
        q: "How long does a build take?",
        a: "A typical build takes eight to twelve weeks, depending on scope.",
      },
      {
        q: "Do you build both web and mobile products?",
        a: "Yes, as the product needs. Scope is agreed up front so you know what will be delivered.",
      },
      {
        q: "How much does HATIX Genesis cost?",
        a: "Every build is scoped to your product. Contact HATIX for a quote.",
      },
    ],
  },
  Ascend: {
    slug: "ascend",
    descriptor: "Go-to-market and product launch service",
    summary:
      "HATIX Ascend is a done-for-you go-to-market service that sets positioning, pricing, channels and a launch plan, then measures early traction.",
    long: [
      "HATIX Ascend is a go-to-market service for products that are ready to reach customers. The HATIX team defines positioning, pricing and messaging, plans channels and the launch, and measures early traction.",
      "It covers launch assets such as site, content and creative, campaign setup and tracking, a monthly performance review, and ongoing iteration on what converts.",
    ],
    who: [
      "Founders preparing to launch a product",
      "Businesses whose product is built but not selling",
      "Teams that need a repeatable route to their first customers",
    ],
    faqs: [
      {
        q: "What is HATIX Ascend?",
        a: "HATIX Ascend is a go-to-market service. The HATIX team plans your positioning, pricing, channels and launch, then measures and improves early traction.",
      },
      {
        q: "How long is an Ascend engagement?",
        a: "It is an ongoing engagement with a three-month minimum, so there is time to learn from real results.",
      },
      {
        q: "Do I need a finished product first?",
        a: "Ideally yes, or a working prototype. Ascend works best once there is something customers can try.",
      },
      {
        q: "How much does HATIX Ascend cost?",
        a: "Pricing depends on your product and goals. Contact HATIX for a quote.",
      },
    ],
  },
  Cortex: {
    slug: "cortex",
    descriptor: "AI automation and consulting for businesses",
    summary:
      "HATIX Cortex is a done-for-you service that finds where AI pays off in a business, then builds and runs it: agents, copilots, automation, forecasting, documents, voice and vision.",
    long: [
      "HATIX Cortex is for businesses that already run and want AI working across their operations. The HATIX team finds where AI pays off, then builds and runs the right tool for each problem, with a human in control.",
      "Solutions can include agents and copilots, workflow automation, forecasting and analytics, document and language AI, voice and vision, and recommendations.",
    ],
    who: [
      "Business owners with repetitive, manual work",
      "Operations leaders who want measurable savings from AI",
      "Teams that want AI built and run for them, not just advised",
    ],
    faqs: [
      {
        q: "What is HATIX Cortex?",
        a: "HATIX Cortex is a service where the HATIX team finds the best places to use AI in your business, then builds and runs it for you.",
      },
      {
        q: "What kinds of AI does Cortex cover?",
        a: "Agents and copilots, workflow automation, forecasting and analytics, document and language AI, voice and vision, and recommendations.",
      },
      {
        q: "Will AI replace my team?",
        a: "The goal is to take over repetitive work so people can focus on decisions. Humans stay in control of the results.",
      },
      {
        q: "How much does HATIX Cortex cost?",
        a: "Every setup is scoped to your business. Contact HATIX for a quote.",
      },
    ],
  },
};

// Home page FAQ: written as direct answers that search and AI engines can quote.
export const homeFaq: Faq[] = [
  {
    q: "What is HATIX?",
    a: "HATIX is a technology company that builds focused software products for specific industries, and also helps founders and businesses validate, build and launch their own products. The legal entity is HATIX VERSE LLP.",
  },
  {
    q: "What products does HATIX build?",
    a: "HATIX builds focused products. Current products include Dunk Tank, an AI pitch roaster for founders and sales teams, Wassabi, a WhatsApp AI assistant for independent hotels, and Argus, an AI site supervisor for construction contractors. Dunk Tank and Argus are concepts, and Wassabi is in development.",
  },
  {
    q: "What services does HATIX offer?",
    a: "HATIX Catalyst is the services arm. It includes Radar for idea validation, Genesis for building products from scratch, Ascend for go-to-market and launch, and Cortex for AI automation in existing businesses.",
  },
  {
    q: "Can HATIX help me validate my startup idea?",
    a: "Yes. HATIX Radar tests demand for your idea with real customers and ends with an evidence-based recommendation to go, pivot or stop. It typically takes two to four weeks.",
  },
  {
    q: "Can HATIX build my product from scratch?",
    a: "Yes. HATIX Genesis designs, builds and launches products, including UX design, engineering, cloud setup, analytics and launch support.",
  },
  {
    q: "How can AI help my business?",
    a: "HATIX Cortex finds where AI pays off in your business, such as customer messaging, document handling, forecasting or workflow automation, and then builds and runs the solution with a human in control.",
  },
  {
    q: "How does HATIX decide what to build?",
    a: "Every idea starts as a hypothesis and earns its next stage with evidence. HATIX stops, changes or scales each idea through an explicit decision, so fewer, better products are built.",
  },
  {
    q: "How do I contact HATIX?",
    a: "Use the contact form on the website. HATIX aims to reply to every message within two business days.",
  },
];

export const productSlugs = Object.entries(productPages).map(([name, p]) => ({
  name,
  slug: p.slug,
}));
export const serviceSlugs = Object.entries(servicePages).map(([name, p]) => ({
  name,
  slug: p.slug,
}));
