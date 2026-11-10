import type { Texts, ToolLang } from "../shared/engine";

/**
 * One place of MambyLy Guide, as stored in its own data file (public/guide-data/<slug>/place.json).
 * The file is the whole record of the place – texts, hours, the points of the walk in order, and for
 * each point its photo and audio – so a future panel only has to edit this one shape.
 */
export type GuideLang = ToolLang;

/** The drawn scenes a point can show when it has no photo (the demo's). */
export type ArtName = "house" | "forge" | "barn" | "well" | "mill" | "school" | "path";

export type Point = {
  /** the last part of the address: /guide/<place>/<id> (lowercase letters, digits, dashes) */
  id: string;
  name: Texts;
  /** a few sentences, in each language the place has */
  text: Texts;
  /** a photo (a file in public/guide-data/<slug>/…, or an address) – or a drawn scene; none = no picture */
  photo?: { src?: string; art?: ArtName; alt?: Texts };
  /** an uploaded recording per language (mp3); where there is none the phone reads the text aloud */
  audio?: Partial<Record<GuideLang, string>>;
};

export type Place = {
  slug: string;
  demo?: boolean;
  name: string;
  /** where it is, one line */
  place: Texts;
  /** languages the place has written its texts in; the visitor's phone picks among them */
  languages: GuideLang[];
  welcome: Texts;
  hours?: Texts;
  contact?: { email?: string; phone?: string };
  /** the walk, in order */
  points: Point[];
};
