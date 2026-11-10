/**
 * What the tag pages of MambyLy Tools share: a tag (NFC or QR) opens a page whose content is one
 * JSON file outside the site's code, shown in the visitor's phone language. Stay (a house) and
 * Guide (a place with points) are two kinds of page on this one engine.
 */
export type ToolLang = "sv" | "en" | "de";
export const TOOL_LANGS: ToolLang[] = ["sv", "en", "de"];

/** A text in each language (a missing language falls back to Swedish, then English). */
export type Texts = Partial<Record<ToolLang, string>>;

/** The text of `t` in `lang`, else Swedish, else English, else any. */
export const pick = (t: Texts | undefined, lang: ToolLang) => (t ? t[lang] ?? t.sv ?? t.en ?? Object.values(t)[0] ?? "" : "");

/** A slug in an address: lowercase letters, digits and single dashes. */
export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** The visitor's language: the phone's first language the page has, else its first. */
export function phoneLang(available: ToolLang[]): ToolLang {
  const wanted = typeof navigator === "undefined" ? [] : navigator.languages ?? [navigator.language];
  for (const tag of wanted) {
    const l = tag.slice(0, 2).toLowerCase() as ToolLang;
    if (available.includes(l)) return l;
  }
  // nordic neighbours read Swedish; everyone else gets English when the page has it
  if (wanted.some((t) => /^(nb|nn|no|da)\b/i.test(t)) && available.includes("sv")) return "sv";
  return available.includes("en") ? "en" : available[0];
}

/**
 * Fetches a data file. A single-page host answers unknown paths with the page itself, so only a
 * JSON answer counts: anything else is "missing".
 */
export async function fetchJson<T>(url: string): Promise<{ state: "ok"; data: T } | { state: "missing" } | { state: "error" }> {
  try {
    const res = await fetch(url, { cache: "no-cache" });
    if (!res.ok || !(res.headers.get("content-type") ?? "").includes("json")) return { state: "missing" };
    return { state: "ok", data: (await res.json()) as T };
  } catch {
    return { state: "error" };
  }
}
