import type { GuideLang } from "./types";

/**
 * Reading a point aloud with the browser's own speech (Web Speech API, free): the text is cut into
 * short pieces, because some phones (Chrome on Android) stop in the middle of a long one, and the
 * voice is the phone's own voice for the language.
 */
export const SPEECH_TAG: Record<GuideLang, string> = { sv: "sv-SE", en: "en-GB", de: "de-DE" };

/** Cuts `text` at sentence ends into pieces of at most `max` characters (a long sentence at a comma or a space). */
export function splitText(text: string, max = 170): string[] {
  const sentences =
    text
      .replace(/\s+/g, " ")
      .trim()
      .match(/[^.!?…]+[.!?…]+["”)]*|[^.!?…]+$/g)
      ?.map((s) => s.trim())
      .filter(Boolean) ?? [];
  const pieces: string[] = [];
  const push = (s: string) => {
    let rest = s;
    while (rest.length > max) {
      const head = rest.slice(0, max);
      const cut = Math.max(head.lastIndexOf(", "), head.lastIndexOf(" – "), head.lastIndexOf("; "), head.lastIndexOf(" "));
      const at = cut > max * 0.4 ? cut + 1 : max;
      pieces.push(rest.slice(0, at).trim());
      rest = rest.slice(at).trim();
    }
    if (rest) pieces.push(rest);
  };
  for (const s of sentences) {
    const last = pieces[pieces.length - 1];
    if (last && last.length + 1 + s.length <= max) pieces[pieces.length - 1] = `${last} ${s}`;
    else push(s);
  }
  return pieces;
}

type VoiceLike = Pick<SpeechSynthesisVoice, "lang" | "localService">;

/** The phone's voice for `lang` (the usual region first, a voice on the phone before a network one), or none. */
export function voiceFor<T extends VoiceLike>(voices: T[], lang: GuideLang): T | null {
  const tag = (v: VoiceLike) => v.lang.replace("_", "-").toLowerCase();
  const mine = voices.filter((v) => tag(v).startsWith(lang));
  const exact = mine.filter((v) => tag(v) === SPEECH_TAG[lang].toLowerCase());
  const pool = exact.length ? exact : mine;
  return pool.find((v) => v.localService) ?? pool[0] ?? null;
}
