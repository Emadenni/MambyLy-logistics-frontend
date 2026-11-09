import type { Lang } from "../experience/routes";

/**
 * MambyLy Tools: the product line. Every tool is a kind of page a physical tag (NFC/QR) opens; an
 * active tool has its own page, the coming ones are shown switched off. Adding a tool = a line here
 * (and, when it goes live, its template like tools/stay).
 */
export type ToolId = "stay" | "reviews" | "menu" | "booking" | "guide" | "origin";

export type Tool = {
  id: ToolId;
  name: string;
  status: "active" | "soon";
  /** what it does, in one sentence */
  line: Record<Lang, string>;
  /** who it is for */
  who: Record<Lang, string>;
};

export const TOOLS: Tool[] = [
  {
    id: "stay",
    name: "MambyLy Stay",
    status: "active",
    line: {
      sv: "En digital concierge för ditt boende: gästen trycker på skylten och får svar på sitt eget språk, dygnet runt.",
      en: "A digital concierge for your rental: guests tap the sign and get answers in their own language, around the clock.",
    },
    who: {
      sv: "För dig som hyr ut stugor och lägenheter – perfekt om du hyr ut via Airbnb eller Booking.",
      en: "For hosts of cottages and flats – perfect if you rent out on Airbnb or Booking.",
    },
  },
  {
    id: "reviews",
    name: "MambyLy Reviews",
    status: "soon",
    line: {
      sv: "Ett NFC-ställ vid disken som tar kunden direkt till företagets recensioner på Google.",
      en: "An NFC stand at the counter that takes customers straight to your Google reviews.",
    },
    who: { sv: "För butiker, kaféer, salonger och verkstäder.", en: "For shops, cafés, salons and workshops." },
  },
  {
    id: "menu",
    name: "MambyLy Menu",
    status: "soon",
    line: {
      sv: "Digital meny på flera språk, alltid uppdaterad.",
      en: "A digital menu in several languages, always up to date.",
    },
    who: { sv: "För restauranger, kaféer och barer.", en: "For restaurants, cafés and bars." },
  },
  {
    id: "booking",
    name: "MambyLy Booking",
    status: "soon",
    line: {
      sv: "En enkel bokningssida för dina tjänster.",
      en: "A simple booking page for your services.",
    },
    who: {
      sv: "För frisörer, hudterapeuter, konsulter och andra yrkesverksamma.",
      en: "For hairdressers, beauty therapists, consultants and other professionals.",
    },
  },
  {
    id: "guide",
    name: "MambyLy Guide",
    status: "soon",
    line: {
      sv: "Ljudguide på flera språk, med NFC-taggar vid sevärdheterna.",
      en: "A multilingual audio guide, with NFC tags at each point of interest.",
    },
    who: { sv: "För museer, kyrkor och hembygdsföreningar.", en: "For museums, churches and local heritage societies." },
  },
  {
    id: "origin",
    name: "MambyLy Origin",
    status: "soon",
    line: {
      sv: "Produktens berättelse, med NFC-tagg på varan och äkthetsbevis.",
      en: "The story of the product, with an NFC tag on the item and a certificate of authenticity.",
    },
    who: { sv: "För hantverkare och små producenter.", en: "For craftspeople and small producers." },
  },
];

/** Texts of the Tools pages. */
export const TOOLS_COPY = {
  sv: {
    meta: "MambyLy Tools – smarta sidor bakom en NFC-tagg",
    metaDesc: "MambyLy Tools: små digitala verktyg för företag, öppnade med en NFC-tagg eller QR-kod. Först ut: MambyLy Stay för uthyrare.",
    kicker: "Produktlinje",
    title: "Smarta sidor bakom en tagg.",
    lead: "Små verktyg som gör vardagen enklare för företag och deras kunder. En NFC-tagg eller QR-kod på rätt plats – och rätt information öppnas på rätt språk.",
    active: "Tillgänglig",
    soon: "Kommer snart",
    open: "Läs mer",
    who: "För vem",
    backToSite: "Till MambyLy",
    homeLabel: "MambyLy Tools – start",
    madeBy: "En produktlinje från MambyLy Solutions.",
    toolsLabel: "Verktygen",
  },
  en: {
    meta: "MambyLy Tools – smart pages behind an NFC tag",
    metaDesc: "MambyLy Tools: small digital tools for businesses, opened with an NFC tag or QR code. First out: MambyLy Stay for hosts.",
    kicker: "Product line",
    title: "Smart pages behind a tag.",
    lead: "Small tools that make everyday work easier for businesses and their customers. An NFC tag or QR code in the right place – and the right information opens in the right language.",
    active: "Available",
    soon: "Coming soon",
    open: "Find out more",
    who: "For",
    backToSite: "To MambyLy",
    homeLabel: "MambyLy Tools – home",
    madeBy: "A product line by MambyLy Solutions.",
    toolsLabel: "The tools",
  },
} satisfies Record<Lang, Record<string, string>>;
