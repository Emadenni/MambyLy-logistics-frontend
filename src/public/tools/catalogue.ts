import type { Lang } from "../experience/routes";

/**
 * MambyLy Tools: the product line. Every tool is a kind of page a physical tag (NFC/QR) opens; an
 * active tool has its own page, the coming ones are shown switched off. Adding a tool = a line here
 * (and, when it goes live, its template like tools/stay).
 */
/** The line's logo (public/brand): green for the cream pages, white for the green panels. */
export const TOOLS_LOGO = { green: "/brand/mambyly-tools-verde.svg", white: "/brand/mambyly-tools-bianco.svg" };

export type ToolId = "stay" | "reviews" | "menu" | "booking" | "guide" | "origin";

export type Tool = {
  id: ToolId;
  name: string;
  status: "active" | "soon";
  /** the tool's drawn logo (light, for a dark plate), in /public/brand; none yet = its wordmark is composed (ToolMark) */
  logo?: { src: string; width: number; height: number };
  /** the colour of the script name in a composed wordmark: on a pale plate, on a dark one (none = the line's gold) */
  accent?: { pale: string; dark: string };
  /** what it does, in a few words */
  line: Record<Lang, string>;
  /** who it is for */
  who: Record<Lang, string>;
};

export const TOOLS: Tool[] = [
  {
    id: "stay",
    name: "MambyLy Stay",
    status: "active",
    logo: { src: "/brand/mambyly-stay.png", width: 1409, height: 483 },
    line: {
      sv: "Digital concierge för ditt boende, på gästens språk.",
      en: "A digital concierge for your rental, in the guest's language.",
    },
    who: {
      sv: "För dig som hyr ut stugor och lägenheter – perfekt om du hyr ut via Airbnb eller Booking.",
      en: "For hosts of cottages and flats – perfect if you rent out on Airbnb or Booking.",
    },
  },
  {
    id: "reviews",
    name: "MambyLy Reviews",
    status: "active",
    accent: { pale: "#c4553a", dark: "#f2906e" },
    line: {
      sv: "Från disken direkt till dina recensioner på Google.",
      en: "From the counter straight to your Google reviews.",
    },
    who: { sv: "För butiker, kaféer, salonger och verkstäder.", en: "For shops, cafés, salons and workshops." },
  },
  {
    id: "menu",
    name: "MambyLy Menu",
    status: "soon",
    line: {
      sv: "Digital meny på flera språk, alltid aktuell.",
      en: "A digital menu in several languages, always current.",
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
      sv: "Ljudguide på flera språk, tagg för tagg.",
      en: "An audio guide in several languages, tag by tag.",
    },
    who: { sv: "För museer, kyrkor och hembygdsföreningar.", en: "For museums, churches and local heritage societies." },
  },
  {
    id: "origin",
    name: "MambyLy Origin",
    status: "soon",
    line: {
      sv: "Produktens berättelse och äkthetsbevis, på varan.",
      en: "The product's story and proof of authenticity, on the item.",
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
    countActive: "tillgängligt",
    countActivePl: "tillgängliga",
    countSoon: "på väg",
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
    countActive: "available",
    countActivePl: "available",
    countSoon: "on the way",
  },
} satisfies Record<Lang, Record<string, string>>;
