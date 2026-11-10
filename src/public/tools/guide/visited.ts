import { TOOL_LANGS } from "../shared/engine";
import type { GuideLang } from "./types";

/**
 * What the visitor's own phone remembers: the points already seen on this place's walk and the
 * language chosen. Only in the browser (localStorage) – nothing is sent anywhere. Every read and
 * write is guarded: with storage blocked the page simply forgets.
 */
const seenKey = (slug: string) => `mp-guide-seen:${slug}`;
const LANG_KEY = "mp-guide-lang";

export function readSeen(slug: string): string[] {
  try {
    const v = JSON.parse(localStorage.getItem(seenKey(slug)) ?? "[]");
    return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

/** The seen list with `id` added (in the order first seen). */
export function markSeen(slug: string, id: string): string[] {
  const seen = readSeen(slug);
  if (seen.includes(id)) return seen;
  const next = [...seen, id];
  try {
    localStorage.setItem(seenKey(slug), JSON.stringify(next));
  } catch {
    /* storage blocked: the page forgets */
  }
  return next;
}

export function clearSeen(slug: string) {
  try {
    localStorage.removeItem(seenKey(slug));
  } catch {
    /* nothing to clear */
  }
}

export function savedGuideLang(available: GuideLang[]): GuideLang | null {
  try {
    const l = localStorage.getItem(LANG_KEY) as GuideLang | null;
    return l && TOOL_LANGS.includes(l) && available.includes(l) ? l : null;
  } catch {
    return null;
  }
}

export function saveGuideLang(lang: GuideLang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* storage blocked */
  }
}
