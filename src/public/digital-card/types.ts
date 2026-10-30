/** Raw configuration of one digital business card: src/public/digital-card/cards/<slug>/card.json */
export type CardSocialType = "whatsapp" | "instagram" | "facebook" | "linkedin" | "tiktok" | "youtube" | "x";

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
  /** Composition of the faces (see _digital-card.scss); default "classic" */
  layout?: CardLayout;
  /** Type family of the card: the site's sans (default) or a system serif */
  font?: "sans" | "serif";
  /**
   * Optional picture behind the front: the name of a published image
   * (public/media/mambyly/card-<name>-1300.webp). Text stays real HTML on top of it.
   */
  background?: string;
};

export type CardLayout = "classic" | "craft" | "split" | "frame" | "bold";

/** The six premium demo designs (StyleCard.tsx): each has its own structure, type and material. */
export const CARD_DESIGNS = ["ivory", "velvet", "white", "oxblood", "graphite", "expressive"] as const;
export type CardDesign = (typeof CARD_DESIGNS)[number];

export type CardConfigRaw = {
  slug: string;
  lang?: "sv" | "en";
  /** Demo cards use fictitious data: contact actions only show a notice. */
  demo?: boolean;
  /** Premium demo design rendered by StyleCard instead of the flip card. */
  design?: CardDesign;
  /** "organization": the card (and its vCard) represents a company, not a person. */
  kind?: "person" | "organization";
  name: string;
  /** false: the name is not repeated on the front (e.g. when the logo is a wordmark). */
  showNameOnFront?: boolean;
  role?: string;
  company?: string;
  tagline?: string;
  /** File name inside the card folder, e.g. "logo.svg" */
  logo?: string;
  /** "wide" for a horizontal wordmark on the front (default: square mark) */
  logoShape?: "square" | "wide";
  /** Optional small square mark for the back (defaults to logo when square) */
  logoBack?: string;
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
  /**
   * Demo cards only: the fictitious person's own pages, opened as small panels from the icon row
   * under the card (work / profile / contact). Never real contact data.
   */
  profile?: CardProfile;
  /** Demo cards shown in the gallery (/exempel): sector label, short description and order. */
  example?: { sector: string; summary: string; order?: number };
  /** Texts in another language, merged over the card when the site is shown in that language. */
  translations?: Partial<Record<"sv" | "en", CardTranslation>>;
};

/** Translatable texts of a card (contact details, names and logos never change with the language). */
export type CardTranslation = Partial<Pick<CardConfigRaw, "role" | "tagline" | "details" | "meta" | "profile">> & {
  example?: { sector?: string; summary?: string };
};

/** Validated card, only with safe and present fields. */
export type CardConfig = Omit<CardConfigRaw, "phone" | "email" | "website" | "socials" | "logo" | "logoBack" | "photo" | "translations"> & {
  lang: "sv" | "en";
  demo: boolean;
  kind: "person" | "organization";
  showNameOnFront: boolean;
  logoShape: "square" | "wide";
  logoBackUrl?: string;
  phone?: { e164: string; display: string };
  phoneDisplay?: string;
  email?: string;
  website?: { href: string; label: string };
  socials: { type: CardSocialType; href: string; label: string }[];
  logoUrl?: string;
  photoUrl?: string;
  theme: CardTheme & { backAccent: string; style: "paper" | "solid"; layout: CardLayout; font: "sans" | "serif" };
  example?: { sector: string; summary: string; order: number };
};

/** The fictitious person's pages on a demo card. */
export type CardProfile = {
  /** Title of the work panel and its icon: "services" (Tjänster) or "work" (Projekt / Uppdrag). */
  work: { kind: "services" | "work"; title: string; items: { title: string; text: string }[] };
  /** A few sentences about the person. */
  about: string;
  /** Where and when: e.g. "Göteborg · svarar inom en arbetsdag" (no real address). */
  availability: string;
};
