// All copy and data live here. Anything marked TBC is a [TO CONFIRM] placeholder.
// Review markers show in development only. Set NEXT_PUBLIC_SHOW_TBC=1 to force them on.
export const SHOW_TBC =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_TBC === "1";
export const TBC = SHOW_TBC ? "[TO CONFIRM]" : "";

export const site = {
  name: "HATIX",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "HATIX | Product Development & Technology Company",
  shortTitle: "HATIX",
  tagline: "Next-gen technology products",
  description:
    "Turn your idea into a real product. HATIX validates demand, builds your MVP and launches it, and also runs focused technology products of its own.",
  keywords: [
    "product development",
    "product validation",
    "MVP development",
    "go-to-market",
    "startup idea validation",
    "business automation",
    "technology company",
    "HATIX",
  ],
  legalEntity: "HATIX VERSE LLP",
  email: "contact@hatixverse.com",
  // [TO CONFIRM] Replace each "#" with the real profile URL. Entries with "#" render as inactive.
  socials: [
    { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/hatixverse" },
    { id: "facebook", label: "Facebook", href: "https://www.facebook.com/hatixverse/" },
  ] as {
    id: "linkedin" | "facebook" | "x" | "instagram";
    label: string;
    href: string;
  }[],
};

export const nav = [
  { label: "Products", href: "/#products" },
  { label: "Build with us", href: "/#journey" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export const hero = {
  eyebrow: "HATIX — Crafted for execution.",
  headline: "Turn your idea into a real product.",
  highlight: ["idea", "product."],
  sub: "Skip the guesswork. We validate, build and launch it with you.",
  primary: { label: "Build with us", href: "/#journey" },
  secondary: { label: "Explore products", href: "#products" },
  // True today: products and services are counted from this site's own content.
  signals: [
    { label: "Products in development", value: "3" },
    { label: "Services, one path", value: "4" },
    { label: "Evidence before we build", value: "100%" },
  ],
};

export const purpose = {
  eyebrow: "Why we exist",
  vision: {
    label: "Vision",
    keys: ["frictionless", "purposeful"],
    text: "To create a frictionless world where businesses and consumers thrive through purposeful technology.",
  },
  mission: {
    label: "Mission",
    keys: ["intuitive", "domain-specific", "unlock"],
    text: "To engineer intuitive, domain-specific technology products that solve complex problems and unlock new possibilities for businesses and individuals.",
  },
};

export const trust = [
  "We run what we build",
  "Your data stays yours",
  "You stay in control",
  "One team, start to finish",
];

// DRAFT: product services path. Names and copy are proposals pending approval.
export const journey = {
  eyebrow: "Services · HATIX Catalyst",
  kind: "Service",
  byline: "Done for you by the HATIX team",
  getsLabel: "What we do for you",
  cta2: "Talk to us about",
  heading: "We build with you, from idea to launch.",
  intro:
    "Hands-on services for founders and businesses. Our own products were built on this path, so we know it well. Start at the stage you are in.",
  // MOCK / INDICATIVE: timings and deliverables are placeholders pending approval.
  aiLabel: "AI add-on",
  stages: [
    {
      icon: "lab",
      verb: "Validate",
      name: "Radar",
      ai: {
        line: "AI market and competitor research, simulated customer interviews and early demand signals.",
        message:
          "Hi, I'm interested in HATIX Radar with the AI boost. Could you share details and the best price?",
      },
      offer: {
        line: "Curious what this costs? Ask for a quote.",
        message:
          "Hi, I'm interested in HATIX Radar. Could you share pricing and any offers available?",
      },
      line: "Test your product idea and get real-world validation, with expert guidance.",
      typical: "2 to 4 weeks",
      gets: [
        "Customer and problem discovery",
        "Assumption map and validation plan",
        "Clickable prototype or fake-door test",
        "Demand evidence report",
        "Go, pivot or stop recommendation",
        "Guidance sessions with a HATIX product lead",
      ],
    },
    {
      icon: "build",
      verb: "Build",
      name: "Genesis",
      ai: {
        line: "AI built into your product: agents, copilots, search, recommendations, forecasting, voice or vision.",
        message:
          "Hi, I'm interested in HATIX Genesis with the AI boost. Could you share details and the best price?",
      },
      offer: {
        line: "Every build is scoped to you. Ask for your price.",
        message:
          "Hi, I'm interested in HATIX Genesis. Could you share pricing and any offers available?",
      },
      line: "Have your product built from scratch, and launched.",
      typical: "8 to 12 weeks",
      gets: [
        "Product scope and UX design",
        "Full-stack build, web and mobile as needed",
        "Cloud setup, security and analytics",
        "QA and performance testing",
        "Launch support and handover documentation",
        "30 days of post-launch support",
      ],
    },
    {
      icon: "launch",
      verb: "Launch",
      name: "Ascend",
      ai: {
        line: "AI for growth: content and campaign automation, personalisation, pricing and ad optimisation.",
        message:
          "Hi, I'm interested in HATIX Ascend with the AI boost. Could you share details and the best price?",
      },
      offer: {
        line: "Ask what a plan looks like for your product.",
        message:
          "Hi, I'm interested in HATIX Ascend. Could you share pricing and any offers available?",
      },
      line: "Take your product to market with the right go-to-market plan.",
      typical: "3 months minimum",
      gets: [
        "Positioning, pricing and messaging",
        "Go-to-market plan and channel strategy",
        "Launch assets: site, content and creative",
        "Campaign setup and tracking",
        "Monthly performance review",
        "Ongoing iteration on what converts",
      ],
    },
  ] as {
    icon: "lab" | "build" | "launch";
    verb: string;
    name: string;
    line: string;
    offer: { line: string; message: string };
    ai: { line: string; message: string };
    typical: string;
    gets: string[];
  }[],
  cta: { text: "Not sure where to start?", button: "Tell us about your idea" },
};

// DRAFT: standalone AI offer. Name and copy are proposals pending approval.
export const cortex = {
  eyebrow: "Or start here",
  kind: "Service",
  name: "Cortex",
  headline: "Put AI to work across your business.",
  body: "Already running a business? Our team finds where AI pays off, then builds and runs it for you: the right tool for each problem, with a human in control.",
  kinds: [
    "Agents",
    "Copilots",
    "Workflow automation",
    "Forecasting",
    "Documents and language",
    "Voice and vision",
    "Recommendations",
    "Analytics",
  ],
  nodes: ["Agents", "Forecast", "Docs", "Voice", "Vision", "Insights"],
  quoteLine: "Every setup is scoped to your business. Ask for a quote.",
  cta: "Ask about Cortex",
  message:
    "Hi, I'm interested in HATIX Cortex. Could you tell me how AI could help our business, and share the best price?",
};

export type ProductStatus = "Live" | "Building" | "Concept" | "In development";
export const products: {
  name: string;
  category: string;
  status: ProductStatus;
  description: string;
  audience: string;
  problem: string;
  cta: string;
  href?: string;
  art: "agents" | "site" | "dunk";
  logo?: { src: string; outline?: string; ratio: number };
}[] = [
  // MOCK DATA: statuses are placeholders until approved for public display.
  {
    name: "Dunk Tank",
    art: "dunk",
    category: "AI / Game",
    audience: "For founders and sales teams",
    problem: "Nobody tells you the truth about your pitch until the investor or customer says no.",
    cta: "Join the waitlist",
    status: "Concept",
    description:
      "An AI heckler roasts your pitch until you back it up with evidence. Dunk him in the tank to win.",
  },
  {
    name: "Wassabi",
    art: "agents",
    logo: {
      src: "/images/wassabi-logo.png",
      outline: "/images/wassabi-logo-outline.png",
      ratio: 5.307,
    },
    category: "AI / SaaS",
    audience: "For independent hotels",
    problem: "Guests message at all hours, and nobody is there to answer.",
    cta: "Request early access",
    status: "Building",
    description: "WhatsApp-native multi-agent operations layer for independent hotels.",
  },
  {
    name: "Argus",
    art: "site",
    category: "AI / SaaS",
    audience: "For construction contractors",
    problem: "Delays and cost overruns hide in photos, calls and notebooks until it is too late.",
    cta: "Join the waitlist",
    status: "Concept",
    description: "An AI site supervisor. Send photos and voice notes; ask your site anything.",
  },
];

// Illustrative interface content for the product showcase. MOCK DATA: not real customers or metrics.
export const ecosystem = {
  eyebrow: "Our products",
  heading: "Built, owned and run by HATIX.",
  intro: "Focused products for real businesses, each built to do one job well.",
  assurances: ["We build, own and run it ourselves", "Your data stays yours"],
  note: "Illustrative interface. Details change as products develop.",
  autoAdvanceMs: 11000,
  points: {
    Wassabi: [
      "Answers guests on WhatsApp, day and night",
      "Handles bookings and requests end to end",
      "Hands over to staff when a human is needed",
    ],
    "Dunk Tank": [
      "Roasts your deck, site or sales pitch, deadpan and desi",
      "Every answer you back with evidence lands a hit",
      "Ends with a shareable report card and the fixes that matter",
    ],
    Argus: [
      "Turns daily photos and voice notes into a live site log",
      "Warns you about delays and shortages early",
      'Answers "why is this late?" in plain language',
    ],
  } as Record<string, string[]>,
  wassabi: {
    hotel: "Hotel Aurora",
    role: "Concierge agent · online",
    chat: [
      { from: "guest", text: "Hi, any rooms free 12 to 14 Nov?" },
      { from: "agent", text: "Yes. A Deluxe King is available. Shall I hold it for you?" },
      { from: "guest", text: "Please do." },
      { from: "agent", text: "Held for 15 minutes. Payment link sent." },
    ] as { from: "guest" | "agent"; text: string }[],
    chips: [
      { k: "Booking held", v: "Deluxe King · 2 nights" },
      { k: "First reply", v: "8 seconds" },
    ],
  },
  dunk: {
    roasts: [
      "Your TAM is bigger than India's population. Bold.",
      "Revenue: zero. But the logo is really nice.",
      "Okay, those numbers are real. This is awkward.",
    ],
    down: "*blub blub*",
    evidence: ["38 paying customers", "₹12L annual revenue", "3 hotels signed an LOI"],
    hint: "Throw evidence at the target",
    meter: "Roaster's smugness",
    card: {
      title: "Report card",
      rows: [
        ["Market", "B+"],
        ["Money", "A−"],
        ["Moat", "C"],
      ] as [string, string][],
      remark: "Could do better. Hasn't tried yet.",
      stamp: "DUNKED",
    },
  },
  argus: {
    title: "Site 14 · Tower B",
    floors: [
      { label: "Foundation", p: 100 },
      { label: "Level 1", p: 100 },
      { label: "Level 2", p: 100 },
      { label: "Level 3", p: 82 },
      { label: "Level 4", p: 46 },
      { label: "Level 5", p: 0 },
    ],
    detect: "Rebar · Level 4 · 72%",
    question: "Why is Level 4 running late?",
    answer: "Cement delivery slipped two days, and three crew members were absent on Tuesday.",
    chips: [
      { k: "Early warning", v: "Level 4 · 2 days behind", warn: true },
      { k: "Daily report", v: "Ready to send" },
    ],
  },
};

export const principles = [
  { title: "Evidence over opinion.", body: "Decisions follow data and direct user contact." },
  { title: "Small bets, fast learning.", body: "Smallest test that can change our mind." },
  {
    title: "AI-native, human-accountable.",
    body: "Automation with evaluation, oversight and clear ownership.",
  },
  { title: "Own the stack.", body: "Architecture and quality we can stand behind." },
];

export const about = {
  eyebrow: "About HATIX",
  // Draft copy derived from the brief. [TO CONFIRM: founder review and sign-off]
  heading: "Fail Fast. Scale Right.",
  body: [
    "HATIX is a product and technology company. We build intuitive, domain-specific products, and the technology that powers them.",
    "Every idea starts as a hypothesis, earns its next stage with evidence, and is stopped, changed or scaled by an explicit decision. The result is fewer, better products, built to last.",
  ],
  commitments: [
    { label: "Prove", text: "Demand and willingness to pay come before engineering effort." },
    { label: "Build", text: "AI-native products with evaluation, oversight and clear ownership." },
    {
      label: "Decide",
      text: "Each gate ends in Kill, Pivot or Persevere, with the evidence recorded.",
    },
  ],
  image: {
    src: "/images/about-sphere.jpg",
    alt: "Dark sphere wrapped in a copper wireframe, orbited by metallic spheres",
  },
};

export const contact = {
  replyNote: "We read every message and reply within one working day.", // MOCK
  heading: "Start a conversation.",
};

export const footer = {
  descriptor: "A technology company building focused products, and helping others build theirs.",
  cta: "Have an AI problem worth solving?",
};
