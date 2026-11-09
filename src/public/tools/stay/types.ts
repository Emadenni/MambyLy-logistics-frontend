/**
 * One house of MambyLy Stay, as stored in its own data file (public/stay-data/<slug>/<key>.json).
 * The file is the whole record of the house – texts, contacts, languages, template, the manual the
 * chat answers from – so a future host panel only has to edit this one shape.
 */
export type StayLang = "sv" | "en" | "de";
export const STAY_LANGS: StayLang[] = ["sv", "en", "de"];

/** A text in each language of the house (a missing language falls back to Swedish, then English). */
export type Texts = Partial<Record<StayLang, string>>;

/** Line icons available to sections and answers (mapped to components in icons.tsx). */
export type IconName =
  | "key"
  | "wifi"
  | "clock"
  | "sauna"
  | "fire"
  | "wood"
  | "swim"
  | "canoe"
  | "recycle"
  | "parking"
  | "door"
  | "building"
  | "laundry"
  | "bus"
  | "coffee"
  | "quiet"
  | "shop"
  | "alert"
  | "checkout"
  | "info"
  | "kitchen"
  | "bed";

export type Section = { id: string; icon: IconName; title: Texts; body: Texts };

/**
 * A prepared answer of the chat: the words that call it (any language, accents and case do not
 * matter, see answer.ts), the reply, and whether it is offered as a suggested question.
 */
export type Answer = { id: string; keywords: string[]; question?: Texts; answer: Texts; suggest?: boolean };

export type House = {
  slug: string;
  /** which page layout and drawing: a cottage by the water, a city flat… */
  template: "stuga" | "city";
  demo?: boolean;
  name: string;
  place: Texts;
  /** languages the host has written the house in; the guest's phone picks among them */
  languages: StayLang[];
  host: { name: string; phone: string; welcome: Texts; photo?: string };
  arrival: {
    keyLabel: Texts;
    keyCode: string;
    keyWhere?: Texts;
    wifi: { name: string; password: string };
    checkIn: string;
    checkOut: string;
  };
  sections: Section[];
  answers: Answer[];
};
