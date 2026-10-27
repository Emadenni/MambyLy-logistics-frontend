import { useLocation } from "react-router-dom";
import { copy, type Copy } from "./copy";
import { langOfPath, type Lang } from "./routes";

export type { Lang };

/** The visitor's explicit choice from the SV / EN switch (kept for later visits). */
const PREF_KEY = "mp-lang";

export function savedLang(): Lang | null {
  try {
    const v = localStorage.getItem(PREF_KEY);
    return v === "sv" || v === "en" ? v : null;
  } catch {
    return null;
  }
}

export function saveLang(lang: Lang) {
  try {
    localStorage.setItem(PREF_KEY, lang);
  } catch {
    /* storage unavailable: the choice still holds through the URL */
  }
}

/** Language of the current screen: taken from the URL (/en/… is English, the rest Swedish). */
export function useLang(): Lang {
  return langOfPath(useLocation().pathname);
}

export function useCopy(): Copy & { lang: Lang } {
  const lang = useLang();
  return { ...copy[lang], lang };
}

/** "{n} av {total}" style templates. */
export const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, k: string) => String(values[k] ?? ""));
