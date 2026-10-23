/** Raw configuration of one digital business card: src/public/digital-card/cards/<slug>/card.json */
export type CardSocialType = "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "x";

export type CardTheme = {
  /** Front background */
  front: string;
  /** Text on the front */
  frontInk: string;
  /** Accent (role, icons, details) */
  accent: string;
  /** Back background */
  back: string;
  /** Text on the back */
  backInk: string;
  /** Accent on the back (defaults to accent) */
  backAccent?: string;
  /** Visual style of the card */
  style?: "paper" | "solid";
};

export type CardConfigRaw = {
  slug: string;
  lang?: "sv" | "en";
  /** Demo cards use fictitious data: contact actions only show a notice. */
  demo?: boolean;
  name: string;
  role?: string;
  company?: string;
  tagline?: string;
  /** File name inside the card folder, e.g. "logo.svg" */
  logo?: string;
  /** Optional portrait, file name inside the card folder */
  photo?: string;
  theme: CardTheme;
  phone?: string;
  /** Shown instead of a real number on demo cards (not actionable). */
  phoneDisplay?: string;
  email?: string;
  website?: string;
  socials?: { type: CardSocialType; url: string }[];
  /** Extra lines for the back, e.g. opening hours */
  details?: { label: string; value: string }[];
  meta?: { title?: string; description?: string };
};

/** Validated card, only with safe and present fields. */
export type CardConfig = Omit<CardConfigRaw, "phone" | "email" | "website" | "socials" | "logo" | "photo"> & {
  lang: "sv" | "en";
  demo: boolean;
  phone?: { e164: string; display: string };
  phoneDisplay?: string;
  email?: string;
  website?: { href: string; label: string };
  socials: { type: CardSocialType; href: string; label: string }[];
  logoUrl?: string;
  photoUrl?: string;
};
