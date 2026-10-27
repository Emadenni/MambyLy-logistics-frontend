import type { CardConfig, CardConfigRaw } from "./types";
import { isValidSlug, validateCard } from "./validate";

/**
 * Local registry of the published cards. One folder per client:
 *   cards/<slug>/card.json   public data (see types.ts)
 *   cards/<slug>/logo.svg    optional, referenced by "logo" in card.json
 * No account, database or editor: adding a client = adding a folder.
 */
const configs = import.meta.glob<CardConfigRaw>("./cards/*/card.json", { eager: true, import: "default" });
const assets = import.meta.glob<string>("./cards/*/*.{svg,png,webp,jpg,jpeg}", {
  eager: true,
  query: "?url",
  import: "default",
});

type Lang = "sv" | "en";

const folderOf = (path: string) => path.split("/")[2];

const raws = new Map<string, { raw: CardConfigRaw; files: { logo?: string; logoBack?: string; photo?: string } }>();
const cards = new Map<string, CardConfig>();
for (const [path, raw] of Object.entries(configs)) {
  const folder = folderOf(path);
  const file = (name?: string) => (name && !name.includes("/") ? assets[`./cards/${folder}/${name}`] : undefined);
  const files = { logo: file(raw.logo), logoBack: file(raw.logoBack), photo: file(raw.photo) };
  const card = raw.slug === folder ? validateCard(raw, files) : null;
  if (card) {
    cards.set(card.slug, card);
    raws.set(card.slug, { raw, files });
  } else if (import.meta.env.DEV) console.warn(`[digital-card] Ignored invalid card configuration: ${path}`);
}

/** The card with the texts of `lang` when the card has them; otherwise the card in its own language. */
const translated = new Map<string, CardConfig>();
function inLanguage(card: CardConfig, lang?: Lang): CardConfig {
  const entry = raws.get(card.slug);
  const tr = lang && lang !== card.lang ? entry?.raw.translations?.[lang] : undefined;
  if (!entry || !tr) return card;
  const key = `${card.slug}:${lang}`;
  if (!translated.has(key)) {
    const { raw, files } = entry;
    const merged: CardConfigRaw = {
      ...raw,
      ...tr,
      lang,
      example: raw.example ? { ...raw.example, ...tr.example } : undefined,
      meta: { ...raw.meta, ...tr.meta },
    };
    translated.set(key, validateCard(merged, files) ?? card);
  }
  return translated.get(key)!;
}

/** Exact lookup only: an unknown slug never falls back to another card. */
export function getCard(slug: string | undefined, lang?: Lang): CardConfig | undefined {
  const card = isValidSlug(slug) ? cards.get(slug) : undefined;
  return card && inLanguage(card, lang);
}

/** MambyLy's own card, published at /card (not under /card/<slug>). */
export const COMPANY_CARD_SLUG = "mambyly-solutions";

export const cardPath = (slug: string) => {
  if (slug === COMPANY_CARD_SLUG) return "/card";
  return cards.get(slug)?.demo ? examplePath(slug) : `/card/${slug}`;
};

/** Demo cards presented in the gallery, in their configured order. */
export const getExamples = (lang?: Lang): CardConfig[] =>
  [...cards.values()]
    .filter((c) => c.demo && c.example)
    .sort((a, b) => a.example!.order - b.example!.order)
    .map((c) => inLanguage(c, lang));

/** Demo cards are shown at /exempel/<slug> (English: /en/examples/<slug>); /card/<slug> is only for real cards. */
export const examplePath = (slug: string, lang: Lang = "sv") => (lang === "en" ? `/en/examples/${slug}` : `/exempel/${slug}`);
