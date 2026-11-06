import type { CardConfigRaw } from "../../src/public/digital-card/types";

/** A card shown in a video: raw configuration (validated with the site's validateCard) + files. */
export type StudioCard = { raw: CardConfigRaw; assets: { logo?: string; logoBack?: string; photo?: string } };

/**
 * All times are in milliseconds from the start of the video; positions in CSS pixels of the
 * stage (540 × 960, captured at 2× = 1080 × 1920). A layer is drawn from `from` until `to`;
 * `out` is the length of its exit, which ends at `to`.
 */
type Timed = { id: string; from: number; to: number; out?: number };

/**
 * Text on screen. `*word*` marks a keyword (yellow marker), `\n` breaks the line.
 *   reveal "none":  every word visible from the first frame (a hook is readable on frame 0)
 *   reveal "words": one word after the other, each with a small bounce (0.8 → 1, overshoot)
 *   reveal "pop":   the whole text at once, with the same bounce
 */
export type CaptionLayer = Timed & {
  kind: "caption";
  text: string;
  reveal?: "none" | "words" | "pop";
  /** Delay between two words (reveal "words"). */
  stagger?: number;
  /** "marker": ink text, yellow marker on keywords. "box": every word on its own label. */
  look?: "marker" | "box";
  /** false: keywords without the marker drawing in (e.g. a hook that must match frame 0). */
  highlight?: boolean;
  /** Distance from the top of the safe area. */
  top?: number;
  size?: "xl" | "l" | "m";
};

/**
 * A plain paper business card drawn in CSS (grey, flat, no marks). It rests at `rest` with a
 * slight sway, can drop in from above (`drop`) and fall into a bin (`fall`).
 */
export type PaperLayer = Timed & {
  kind: "paper";
  rest: { x: number; y: number };
  tilt: number;
  drop?: { at: number; ms: number };
  fall?: { at: number; ms: number; to: { x: number; y: number; scale: number; rotate: number } };
};

/** A simple bin (SVG) that enters from below, bounces when something lands in it and leaves. */
export type BinLayer = Timed & {
  kind: "bin";
  /** Centre of its opening. */
  x: number;
  y: number;
  enter: { at: number; ms: number };
  impact?: number;
  exit?: { at: number; ms: number };
};

/** The real card experience (CardExperience) with a card from the studio. */
export type CardLayer = Timed & {
  kind: "card";
  card: StudioCard;
  /** Entry with a bounce from `scale` to 1. */
  enter?: { ms: number; scale: number };
  /** A thin diagonal band of light across the front. */
  sheen?: { at: number; ms: number };
  /** Card width. */
  width?: number;
  /** Distance of the card from the top of the safe area. */
  top?: number;
};

/** A ring around a control of the live card (e.g. ".dc-save"), measured on every frame. */
export type SpotlightLayer = Timed & { kind: "spotlight"; target: string; pulse?: number[] };

/** MambyLy logo. */
export type LogoLayer = Timed & { kind: "logo"; top: number };

/** A small bouncing arrow (e.g. towards a story link sticker). */
export type ArrowLayer = Timed & { kind: "arrow"; top: number };

export type Layer = CaptionLayer | PaperLayer | BinLayer | CardLayer | SpotlightLayer | LogoLayer | ArrowLayer;

/** Something done to the live card at a moment: the real buttons are clicked, nothing is faked. */
export type Action = { at: number; do: "flip" | "open-work" | "open-profile" | "open-contact" | "close-panel" };

export type SafeArea = { top: number; right: number; bottom: number; left: number };

/** One export of a format (e.g. reel, story): its own safe area, texts, times and rhythm. */
export type Variant = {
  safe?: SafeArea;
  layers?: Record<string, Partial<Layer>>;
  /** Applied to every caption of the variant. */
  captions?: Partial<Pick<CaptionLayer, "look" | "reveal">>;
  punches?: number[];
};

export type Format = {
  id: string;
  title: string;
  width: number;
  height: number;
  fps: number;
  duration: number;
  safe: SafeArea;
  layers: Layer[];
  actions: Action[];
  /** Short zoom-ins of the whole picture (1 → 1.08 in 0.15 s, then back) on key beats. */
  punches?: number[];
  /** The exports, by name: each one is rendered to <name>.mp4. */
  variants: Record<string, Variant>;
  /** Frame saved as cover.png. */
  cover?: { variant: string; at: number };
};
