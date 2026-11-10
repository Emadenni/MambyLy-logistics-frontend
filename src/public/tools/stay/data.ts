import { fetchJson, phoneLang, SLUG } from "../shared/engine";
import { STAY_LANGS, type House } from "./types";

export { phoneLang };

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
  const r = await fetchJson<Partial<House>>(`/stay-data/${slug}/${encodeURIComponent(key)}.json`);
  if (r.state !== "ok") return r;
  return valid(r.data, slug) ? { state: "ok", house: r.data } : { state: "error" };
}
