import { STAY_LANGS, type House, type StayLang } from "./types";

/**
 * Where a house's data lives: one file per house outside the site's code,
 *   public/stay-data/<slug>/<key>.json
 * The key is the secret part of the link on the house's NFC tag and QR code
 * (/stay/<slug>?k=<key>): without it the file, and so the key box code and the Wi-Fi password,
 * cannot be found. Nothing about the houses is in the site's JavaScript. The demos use the public
 * key "demo" and made-up details.
 */
export const DEMOS = {
  stuga: { slug: "sjostugan-vid-roxen", key: "demo" },
  lagenhet: { slug: "stadsvaningen-linkoping", key: "demo" },
} as const;
export type DemoId = keyof typeof DEMOS;

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const KEY = /^[A-Za-z0-9_-]{4,64}$/;

/** The smallest checks that keep a broken file from breaking the page. */
const valid = (h: Partial<House>, slug: string): h is House =>
  h.slug === slug &&
  (h.template === "stuga" || h.template === "city") &&
  typeof h.name === "string" &&
  !!h.host?.phone &&
  !!h.arrival?.wifi &&
  Array.isArray(h.sections) &&
  Array.isArray(h.answers) &&
  Array.isArray(h.languages) &&
  h.languages.every((l) => STAY_LANGS.includes(l));

export type Loaded = { state: "ok"; house: House } | { state: "missing" } | { state: "error" };

export async function loadHouse(slug: string | undefined, key: string | null | undefined): Promise<Loaded> {
  if (!slug || !key || !SLUG.test(slug) || !KEY.test(key)) return { state: "missing" };
  try {
    const res = await fetch(`/stay-data/${slug}/${encodeURIComponent(key)}.json`, { cache: "no-cache" });
    // a single-page host answers unknown paths with the page itself: only JSON counts
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return { state: "missing" };
    const data = (await res.json()) as Partial<House>;
    return valid(data, slug) ? { state: "ok", house: data } : { state: "error" };
  } catch {
    return { state: "error" };
  }
}

/** The guest's language: the phone's first language the house has, else the house's first. */
export function phoneLang(available: StayLang[]): StayLang {
  const wanted = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const tag of wanted) {
    const l = tag.slice(0, 2).toLowerCase() as StayLang;
    if (available.includes(l)) return l;
  }
  // nordic neighbours read Swedish; everyone else gets English when the house has it
  if (wanted.some((t) => /^(nb|nn|no|da)\b/i.test(t)) && available.includes("sv")) return "sv";
  return available.includes("en") ? "en" : available[0];
}
