import React from "react";
import { FiGrid, FiInfo, FiMonitor, FiSend } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import type { Copy } from "./copy";
import type { ScreenId, StaticScreen } from "./routes";

/**
 * The site's destinations: one list for the hub, the compact footer and the menu under MambyLy's
 * own card (/card), so they can never point to different places.
 */
export type Destination = { screen: StaticScreen; label: (t: Copy) => string; icon: React.ReactNode };

export const destinations: Destination[] = [
  { screen: "websites", label: (t) => t.nav.websites, icon: <FiMonitor /> },
  { screen: "cards", label: (t) => t.nav.cards, icon: <LuIdCard /> },
  { screen: "examples", label: (t) => t.nav.examples, icon: <FiGrid /> },
  { screen: "about", label: (t) => t.nav.about, icon: <FiInfo /> },
  { screen: "contact", label: (t) => t.nav.contact, icon: <FiSend /> },
];

/**
 * Spatial map of the screens. The hub ("Utforska") is the centre: websites lie to the right, cards
 * to the left, the story (Om oss) below and contact above. A transition always moves along the
 * vector between two places, so going back is exactly the opposite movement.
 */
export const GEOGRAPHY: Partial<Record<ScreenId, [number, number]>> = {
  home: [0, 0],
  explore: [0, 0],
  websites: [1, 0],
  method: [2, 0],
  cards: [-1, 0],
  services: [-2, 0],
  examples: [-1, 1],
  example: [-2, 1],
  about: [0, 1],
  jobs: [1, 1],
  privacy: [0, 2],
  contact: [0, -1],
};

/** Direction the new screen comes from. */
export type Enter = "right" | "left" | "below" | "above" | "fade";

export function enterFrom(from: ScreenId, to: ScreenId): Enter {
  const a = GEOGRAPHY[from];
  const b = GEOGRAPHY[to];
  if (!a || !b) return "fade";
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  // Vertical moves win: Om oss always rises from below and Kontakt always drops from above.
  if (dy > 0) return "below";
  if (dy < 0) return "above";
  if (dx > 0) return "right";
  if (dx < 0) return "left";
  return "fade";
}

/** Where "Tillbaka" leads when there is no in-app history (direct link or refresh). */
export const PARENT: Partial<Record<ScreenId, StaticScreen>> = {
  websites: "explore",
  method: "websites",
  cards: "explore",
  services: "cards",
  examples: "cards",
  example: "examples",
  about: "explore",
  contact: "explore",
  jobs: "explore",
  privacy: "explore",
  notFound: "explore",
};
