/**
 * Screens of the public site and their URLs in both languages.
 *
 * Swedish keeps the existing, unprefixed URLs (/, /omOss, /kontaktaOss, /tjänster, /exempel, /card,
 * /digital-card …); English lives under /en with English slugs. Every screen has exactly one URL per
 * language, so the language switch, canonical and hreflang can always map one to the other.
 */
export type Lang = "sv" | "en";
export const LANGS: Lang[] = ["sv", "en"];

export type ScreenId =
  | "home"
  | "explore"
  | "websites"
  | "method"
  | "cards"
  | "services"
  | "examples"
  | "example"
  | "concept"
  | "about"
  | "contact"
  | "jobs"
  | "privacy"
  | "card"
  | "notFound";

/** Screens with a fixed path (no parameters). */
export type StaticScreen = Exclude<ScreenId, "example" | "concept" | "card" | "notFound">;

export const PATHS: Record<StaticScreen, Record<Lang, string>> = {
  home: { sv: "/", en: "/en" },
  explore: { sv: "/utforska", en: "/en/explore" },
  websites: { sv: "/webbplatser", en: "/en/websites" },
  method: { sv: "/webbplatser/vart-satt", en: "/en/websites/our-approach" },
  cards: { sv: "/digital-card", en: "/en/digital-card" },
  services: { sv: "/tjänster", en: "/en/services" },
  examples: { sv: "/exempel", en: "/en/examples" },
  about: { sv: "/omOss", en: "/en/about" },
  contact: { sv: "/kontaktaOss", en: "/en/contact" },
  jobs: { sv: "/jobbaMedOss", en: "/en/careers" },
  privacy: { sv: "/integritet", en: "/en/privacy" },
};

export const EXAMPLE_BASE: Record<Lang, string> = { sv: "/exempel", en: "/en/examples" };
export const CARD_PATH: Record<Lang, string> = { sv: "/card", en: "/en/card" };

/** The six website demos (fullscreen, fictitious showcase sites), with their slug in each language. */
export type ConceptId = "restaurant" | "photographer" | "logistics" | "painter" | "architecture" | "lighting";
export const CONCEPTS: { id: ConceptId; slug: Record<Lang, string> }[] = [
  { id: "restaurant", slug: { sv: "restaurang", en: "restaurant" } },
  { id: "photographer", slug: { sv: "fotograf", en: "photographer" } },
  { id: "logistics", slug: { sv: "transport", en: "transport" } },
  { id: "painter", slug: { sv: "maleri", en: "painting" } },
  { id: "architecture", slug: { sv: "arkitektur", en: "architecture" } },
  { id: "lighting", slug: { sv: "belysning", en: "lighting" } },
];
/** Slugs of the earlier gallery: the two kept demos moved, the others lead back to the gallery. */
export const RETIRED_CONCEPTS: Record<string, ConceptId | null> = {
  redaktionell: "architecture",
  editorial: "architecture",
  minimal: "lighting",
  typografisk: null,
  typographic: null,
  visuell: null,
  visual: null,
  interaktiv: null,
  interactive: null,
};
export const CONCEPT_BASE: Record<Lang, string> = { sv: "/webbplatser/koncept", en: "/en/websites/concepts" };
export const conceptPath = (id: ConceptId, lang: Lang) => `${CONCEPT_BASE[lang]}/${CONCEPTS.find((c) => c.id === id)!.slug[lang]}`;
export const conceptOfSlug = (slug: string | undefined, lang: Lang) => CONCEPTS.find((c) => c.slug[lang] === slug?.toLowerCase())?.id;

export const pathFor = (screen: StaticScreen, lang: Lang) => PATHS[screen][lang];

/** Paths that belong to the untouched parts of the app (admin, login, Sido Butik). */
export const isLegacyPath = (pathname: string) => /^\/(admin|login|sidobutik)(\/|$)/i.test(pathname);

const normalise = (pathname: string) => {
  let p = pathname;
  try {
    p = decodeURI(pathname);
  } catch {
    /* keep it as it is */
  }
  return p.length > 1 ? p.replace(/\/+$/, "") : p;
};

export const langOfPath = (pathname: string): Lang => (/^\/en(\/|$)/.test(pathname) ? "en" : "sv");

export type Resolved = { screen: ScreenId; lang: Lang; slug?: string };

/** Which screen a pathname shows (used for transitions, the language switch and metadata). */
export function resolvePath(pathname: string): Resolved {
  const p = normalise(pathname);
  const lang = langOfPath(p);
  for (const [screen, paths] of Object.entries(PATHS) as [StaticScreen, Record<Lang, string>][]) {
    if (paths[lang].toLowerCase() === p.toLowerCase()) return { screen, lang };
  }
  const ex = p.match(lang === "en" ? /^\/en\/examples\/([^/]+)$/ : /^\/exempel\/([^/]+)$/);
  if (ex) return { screen: "example", lang, slug: ex[1] };
  const concept = p.match(lang === "en" ? /^\/en\/websites\/concepts\/([^/]+)$/i : /^\/webbplatser\/koncept\/([^/]+)$/i);
  if (concept && conceptOfSlug(concept[1], lang)) return { screen: "concept", lang, slug: concept[1].toLowerCase() };
  if (p === CARD_PATH[lang]) return { screen: "card", lang };
  const card = lang === "sv" ? p.match(/^\/card\/([^/]+)$/) : null;
  if (card) return { screen: "card", lang, slug: card[1] };
  return { screen: "notFound", lang };
}

/** The same screen in the other language (client cards under /card/<slug> have one URL only). */
export function translatePath(pathname: string, to: Lang): string {
  const r = resolvePath(pathname);
  if (r.screen === "example" && r.slug) return `${EXAMPLE_BASE[to]}/${r.slug}`;
  if (r.screen === "concept" && r.slug) return conceptPath(conceptOfSlug(r.slug, r.lang)!, to);
  if (r.screen === "card") return r.slug ? pathname : CARD_PATH[to];
  if (r.screen === "notFound") return PATHS.explore[to];
  return PATHS[r.screen as StaticScreen][to];
}
