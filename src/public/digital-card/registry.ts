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

const folderOf = (path: string) => path.split("/")[2];

const cards = new Map<string, CardConfig>();
for (const [path, raw] of Object.entries(configs)) {
  const folder = folderOf(path);
  const file = (name?: string) => (name && !name.includes("/") ? assets[`./cards/${folder}/${name}`] : undefined);
  const card = raw.slug === folder ? validateCard(raw, { logo: file(raw.logo), logoBack: file(raw.logoBack), photo: file(raw.photo) }) : null;
  if (card) cards.set(card.slug, card);
  else if (import.meta.env.DEV) console.warn(`[digital-card] Ignored invalid card configuration: ${path}`);
}

/** Exact lookup only: an unknown slug never falls back to another card. */
export function getCard(slug: string | undefined): CardConfig | undefined {
  return isValidSlug(slug) ? cards.get(slug) : undefined;
}

export const DEMO_CARD_SLUG = "exempelbageriet";

/** MambyLy's own card, published at /card (not under /card/<slug>). */
export const COMPANY_CARD_SLUG = "mambyly-solutions";

export const cardPath = (slug: string) => (slug === COMPANY_CARD_SLUG ? "/card" : `/card/${slug}`);
