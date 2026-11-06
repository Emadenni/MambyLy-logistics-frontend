/**
 * Utforska as one scroll story: every timing of the page lives here, as a share of the whole story
 * (0 = top of the page, 1 = end of the last chapter). Components only read these values, so the
 * story can be retimed without touching them. World units: camera fov 30 at z 10.
 */

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/** Smoothstep of p between a and b (0 before a, 1 after b). */
export const seg = (p: number, a: number, b: number) => {
  const t = clamp((p - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** Fades in at a and out at b over `edge`; `sides` can leave out either fade. */
export const band = (p: number, a: number, b: number, edge = 0.04, sides: { in?: boolean; out?: boolean } = {}) =>
  (sides.in === false ? 1 : seg(p, a, a + edge)) * (sides.out === false ? 1 : 1 - seg(p, b - edge, b));

export type Pose = { x: number; y: number; z: number; rx: number; ry: number; rz: number; s: number };
export type Frame = [at: number, pose: Pose];

const KEYS: (keyof Pose)[] = ["x", "y", "z", "rx", "ry", "rz", "s"];

/** Pose at p: smoothstep between the two neighbouring keyframes, held before the first and after the last. */
export const kf = (p: number, frames: Frame[], out: Pose): Pose => {
  let i = 0;
  while (i < frames.length - 1 && p > frames[i + 1][0]) i++;
  const [a, from] = frames[i];
  const [b, to] = frames[Math.min(i + 1, frames.length - 1)];
  const t = b > a ? seg(p, a, b) : 0;
  for (const k of KEYS) out[k] = from[k] + (to[k] - from[k]) * t;
  return out;
};

const pose = (x: number, y: number, z: number, rx: number, ry: number, rz: number, s = 1): Pose => ({ x, y, z, rx, ry, rz, s });

/** The card: 3.4 x 2.14 world units, corner radius 0.16. On phones x = 0 and y + 1.1. */
export const CARD = { w: 3.4, h: 2.14, r: 0.16, chip: [0.95, 0.15] as const };
export const CARD_FRAMES: Frame[] = [
  [0.0, pose(0, -0.55, 0, 0.18, -0.35, 0.04)],
  [0.09, pose(0.15, -0.45, 0, 0.14, -0.55, 0.04)],
  [0.18, pose(1.55, 0, 0, 0.1, -0.5, 0.03)],
  [0.29, pose(1.55, 0, 0, 0.1, -0.45, 0.03)],
  [0.35, pose(0.75, 0.1, 0, 0.04, -0.12, 0)],
  [0.47, pose(0.75, 0.1, 0, 0.04, -0.12, 0)],
  [0.53, pose(1.0, 0.15, 0, 0.38, -1.1, -0.04)],
  [0.64, pose(1.0, 0.15, 0, 0.38, -1.25, -0.04)],
  [0.7, pose(0.9, 0, 0, 0.1, -0.4, 0.02)],
  [0.77, pose(-1.8, -1.4, -2.5, 0.3, 0.4, 0.1, 0.7)],
  [0.84, pose(-4.5, -3.2, -5, 0.5, 0.8, 0.2, 0.5)],
];
/** After this the card is out of the picture and is no longer drawn. */
export const CARD_GONE = 0.86;

/** The phone: body 1.0 x 2.06 x 0.09. On phones x * 0.45. */
export const PHONE = { w: 1.0, h: 2.06, d: 0.09 };
export const PHONE_FRAMES: Frame[] = [
  [0.0, pose(6, 0.3, 0.6, 0.05, -0.55, 0.12)],
  [0.29, pose(6, 0.3, 0.6, 0.05, -0.55, 0.12)],
  [0.35, pose(3.1, 0.2, 0.7, 0.03, -0.45, 0.14)],
  [0.39, pose(2.05, 0.18, 0.32, 0.02, -0.3, 0.08)], // touches the chip
  [0.44, pose(2.55, 0.15, 0.55, 0.02, -0.32, 0.06)],
  [0.48, pose(2.7, 0.15, 0.6, 0.02, -0.35, 0.06)],
  [0.53, pose(6.5, 0.2, 0.6, 0.02, -0.5, 0.1)],
  [0.69, pose(6.5, 0.2, 0.6, 0.02, -0.5, 0.1)],
  [0.75, pose(0, 0, 1.2, 0, 0, 0)],
  [0.8, pose(0, 0, 3.4, 0, 0, 0)],
];

/** Phone layout: the object sits higher, the text below it. */
export const MOBILE = { cardY: 1.1, phoneX: 0.45 };

export const T = {
  heroTitleOut: [0.03, 0.08],
  paperIn: [0.09, 0.17],
  paperFall: [0.21, 0.3],
  tapRings: { in: [0.37, 0.39], out: [0.44, 0.47] },
  profileIn: [0.385, 0.41],
  explode: { in: [0.5, 0.56], out: [0.64, 0.7] },
  floaters: { in: [0.52, 0.58], out: [0.64, 0.7] },
  green: { in: [0.46, 0.53], out: [0.66, 0.73], creamAbove: 55 },
  site: [0.8, 0.88],
  /** The website scrolls inside the window and the phone. */
  siteScroll: [0.84, 0.99],
  cta: [0.91, 0.97],
} as const;

/** Exploded card at p: 0 = one card, 1 = three layers apart. */
export const explode = (p: number) => seg(p, T.explode.in[0], T.explode.in[1]) * (1 - seg(p, T.explode.out[0], T.explode.out[1]));
/** Radius of the green background, in % of the viewport diagonal circle. */
export const greenRadius = (p: number) => seg(p, T.green.in[0], T.green.in[1]) * (1 - seg(p, T.green.out[0], T.green.out[1])) * 150;

export type ChapterId = "hero" | "problem" | "tap" | "inside" | "site" | "start";

/** Chapters as consecutive ranges of the story; the HTML sections take their height from them. */
export const CHAPTERS: { id: ChapterId; from: number; to: number }[] = [
  { id: "hero", from: 0, to: 0.1 },
  { id: "problem", from: 0.1, to: 0.3 },
  { id: "tap", from: 0.3, to: 0.485 },
  { id: "inside", from: 0.485, to: 0.685 },
  { id: "site", from: 0.685, to: 0.88 },
  { id: "start", from: 0.88, to: 1 },
];

/** Scroll length of the whole story, in viewport heights (the page is this plus one screen). */
export const STORY_SCREENS = 10;
export const CAPTION_EDGE = 0.04;

/** Exploded view (chapter 4): how far front and back sheets move from the core, in world units. */
export const EXPLODE_GAP = 0.95;

/** Chapter 4 floaters around the card centre: [x, y, z]. Tokens carry an icon; glass is desktop only. */
export const TOKENS: { icon: "phone" | "mail" | "pin" | "web" | "link"; at: [number, number, number] }[] = [
  { icon: "phone", at: [-2.7, 1.25, -0.6] },
  { icon: "mail", at: [2.55, 1.55, 0.4] },
  { icon: "pin", at: [2.95, -0.85, -1.2] },
  { icon: "web", at: [-2.35, -1.45, 0.8] },
  { icon: "link", at: [0.35, -2.05, -1.8] },
];
export const GLASS: [number, number, number][] = [
  [-1.35, 2.0, -1.6],
  [1.55, -1.95, 0.9],
  [3.3, 0.55, -0.4],
];
