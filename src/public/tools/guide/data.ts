import { fetchJson, SLUG, TOOL_LANGS } from "../shared/engine";
import type { Place } from "./types";

/**
 * Where a place's data lives: one file per place outside the site's code,
 *   public/guide-data/<slug>/place.json
 * Unlike Stay there is no secret in the link: a place's texts are for everyone who stands at its
 * signs. The demo is a made-up place.
 */
export const GUIDE_DEMO = "hembygdsgard";

/** The smallest checks that keep a broken file from breaking the page. */
export const validPlace = (p: Partial<Place> | undefined, slug: string): p is Place =>
  !!p &&
  p.slug === slug &&
  typeof p.name === "string" &&
  !!p.place &&
  !!p.welcome &&
  Array.isArray(p.languages) &&
  p.languages.length > 0 &&
  p.languages.every((l) => TOOL_LANGS.includes(l)) &&
  Array.isArray(p.points) &&
  p.points.length > 0 &&
  p.points.every((pt) => typeof pt?.id === "string" && SLUG.test(pt.id) && !!pt.name && !!pt.text) &&
  new Set(p.points.map((pt) => pt.id)).size === p.points.length;

export type Loaded = { state: "ok"; place: Place } | { state: "missing" } | { state: "error" };

export async function loadPlace(slug: string | undefined): Promise<Loaded> {
  if (!slug || !SLUG.test(slug)) return { state: "missing" };
  const r = await fetchJson<Partial<Place>>(`/guide-data/${slug}/place.json`);
  if (r.state !== "ok") return r;
  return validPlace(r.data, slug) ? { state: "ok", place: r.data } : { state: "error" };
}
