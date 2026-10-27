import type { ScreenId } from "./routes";

/**
 * In-app history of this tab (memory only): which screen each history entry shows and which
 * entry came before it. Lets "Tillbaka / ← Utforska" use the browser's own Back when the previous
 * entry is that very screen (scroll position and state come back), and a normal link otherwise.
 */
type Visit = { screen: ScreenId; prev?: string };

const visits = new Map<string, Visit>();
let current: string | undefined;

export function recordVisit(key: string, screen: ScreenId, navType: "POP" | "PUSH" | "REPLACE") {
  const before = current;
  const known = visits.get(key);
  if (navType === "PUSH" || !known) {
    const prev = navType === "PUSH" ? before : navType === "REPLACE" && before ? visits.get(before)?.prev : undefined;
    visits.set(key, { screen, prev });
  } else {
    known.screen = screen;
  }
  current = key;
}

/** True when browser Back would land exactly on `screen`. */
export function previousIs(screen: ScreenId): boolean {
  const prev = current ? visits.get(current)?.prev : undefined;
  return !!prev && visits.get(prev)?.screen === screen;
}

/** True when there is any earlier entry of this site in the tab. */
export function hasPrevious(): boolean {
  return !!(current && visits.get(current)?.prev);
}
