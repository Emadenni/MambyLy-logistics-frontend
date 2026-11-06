/**
 * Utforska as one scroll story: every timing of the 3D part of the page lives here, as a share of
 * that part (0 = top of the page, 1 = end of the last 3D chapter; demos, steps and contact follow
 * as ordinary sections). Components only read these values, so the story can be retimed without
 * touching them. World units: camera fov 30 at z 10.
 *
 * The story: website, phone and card float together as one ecosystem (hero), join into one
 * identity, then each shows what it is made of: the website (chapter 3), the card (chapter 4).
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

export type ChapterId = "hero" | "identity" | "websites" | "cards";

/** Chapters as consecutive ranges of the 3D part; the HTML sections take their height from them. */
export const CHAPTERS: { id: ChapterId; from: number; to: number }[] = [
  { id: "hero", from: 0, to: 0.14 },
  { id: "identity", from: 0.14, to: 0.34 },
  { id: "websites", from: 0.34, to: 0.58 },
  { id: "cards", from: 0.58, to: 1 },
];

/** Scroll length of the 3D part, in viewport heights (the part is this plus one screen). */
export const STORY_SCREENS = 8;
export const CAPTION_EDGE = 0.04;

// -------------------------------------------------------------------------------------------------
// Objects and their keyframes (desktop). Phones: see toPhone().
// -------------------------------------------------------------------------------------------------

/** The card: 3.4 x 2.14 world units, corner radius 0.16. */
export const CARD = { w: 3.4, h: 2.14, r: 0.16, chip: [0.95, 0.15] as const };
/** The phone: body 1.0 x 2.06 x 0.09. */
export const PHONE = { w: 1.0, h: 2.06, d: 0.09 };
/** The browser window: 3.2 x 2.16 (bar 0.16 included), 0.06 deep. */
export const BROWSER = { w: 3.2, h: 2.16, d: 0.06, bar: 0.16, r: 0.07 };

export const CARD_FRAMES: Frame[] = [
  // 1 hero: in front, a little left of centre, the smallest of the three
  [0.0, pose(0.45, -1.3, 0.9, 0.22, -0.32, 0.05, 0.62)],
  [0.12, pose(0.4, -1.2, 0.9, 0.2, -0.38, 0.05, 0.62)],
  // 2 identity: first in the row card -> phone -> website
  [0.2, pose(-0.05, -0.4, 0, 0.06, 0.22, 0, 0.42)],
  [0.32, pose(-0.05, -0.4, 0, 0.06, 0.22, 0, 0.42)],
  // 3 websites: leaves the picture to the lower right while the website opens
  [0.38, pose(7.5, -5.5, -3.2, 0.25, -0.4, 0.08, 0.42)],
  [0.56, pose(7.5, -5.5, -3.2, 0.25, -0.4, 0.08, 0.42)],
  // 4 cards: comes to the front (exploded view and the QR follow in step 4 of the work)
  [0.62, pose(1.0, 0.15, 0, 0.38, -1.1, -0.04, 1)],
  [0.7, pose(1.0, 0.15, 0, 0.38, -1.25, -0.04, 1)],
  [0.76, pose(0.9, 0, 0, 0.1, -0.4, 0.02, 1)],
  [0.84, pose(0.9, 0, 0, 0.1, -0.4, 0.02, 1)],
  [0.9, pose(-2.6, -2.2, -3.5, 0.4, 0.6, 0.15, 0.6)],
];
/** After this the card is out of the picture and is no longer drawn. */
export const CARD_GONE = 0.93;

export const PHONE_FRAMES: Frame[] = [
  // 1 hero: right of centre
  [0.0, pose(2.35, -0.55, 0.35, 0.05, -0.36, 0.07)],
  [0.12, pose(2.3, -0.5, 0.35, 0.05, -0.42, 0.07)],
  // 2 identity: the middle of the row
  [0.2, pose(1.45, 0.05, 0.25, 0.02, -0.06, 0, 0.72)],
  [0.32, pose(1.45, 0.05, 0.25, 0.02, -0.06, 0, 0.72)],
  // 3 websites: leaves the picture to the upper right
  [0.38, pose(7.0, 3.2, -3.0, 0.05, -0.5, 0.1, 0.6)],
  [0.56, pose(7.0, 3.2, -3.0, 0.05, -0.5, 0.1, 0.6)],
  // 4 cards: waits aside, then comes to the card (the scan is refined in step 4 of the work)
  [0.66, pose(6.5, 0.2, 0.6, 0.02, -0.5, 0.1)],
  [0.72, pose(6.5, 0.2, 0.6, 0.02, -0.5, 0.1)],
  [0.77, pose(2.6, 0.15, 0.6, 0.02, -0.32, 0.06)],
  [0.84, pose(2.7, 0.15, 0.6, 0.02, -0.35, 0.06)],
  // the phone comes to the centre; its screen becomes the website window (HTML)
  [0.88, pose(0, 0, 1.2, 0, 0, 0)],
  [0.92, pose(0, 0, 3.4, 0, 0, 0)],
];
/** The phone is drawn only between these moments. */
export const PHONE_SHOWN = [0, 0.92] as const;

export const BROWSER_FRAMES: Frame[] = [
  // 1 hero: left and behind, the largest
  [0.0, pose(-1.55, -0.6, -0.7, 0.05, 0.34, -0.02, 0.86)],
  [0.12, pose(-1.5, -0.55, -0.7, 0.05, 0.3, -0.02, 0.86)],
  // 2 identity: last in the row
  [0.2, pose(3.25, 0.3, -0.2, 0.02, -0.26, 0, 0.48)],
  [0.32, pose(3.25, 0.3, -0.2, 0.02, -0.26, 0, 0.48)],
  // 3 websites: in front, right of the text; turns to show its layers, then faces you again
  [0.38, pose(1.45, 0.0, 0.6, 0.05, -0.2, 0, 1.0)],
  [0.44, pose(1.35, 0.05, 0.2, 0.32, -0.72, 0.06, 0.92)],
  [0.5, pose(1.35, 0.05, 0.2, 0.3, -0.8, 0.06, 0.92)],
  [0.54, pose(1.45, 0.0, 0.6, 0.04, -0.14, 0, 1.0)],
  [0.56, pose(1.45, 0.0, 0.6, 0.04, -0.14, 0, 1.0)],
  // 4 cards: leaves backwards and up
  [0.62, pose(-3.8, 2.4, -4.5, 0.2, 0.5, -0.05, 0.6)],
];
export const BROWSER_GONE = 0.64;

/** Larger screens: in the hero the objects stand right of the title and its text. */
export const heroDeskShift = (p: number) => 1.05 * (1 - seg(p, 0.1, 0.2));
export const heroDeskScale = (p: number) => 1 - 0.2 * (1 - seg(p, 0.1, 0.2));

/**
 * Phones: objects higher (the text sits below) and closer together. Keyframes stay the desktop
 * ones; this moves them for narrow screens. In chapter 2 the row gets its own compact layout.
 */
export const toPhone = (p: Pose, overrides: PhonePose[] = [], at = 0) => {
  p.x *= 0.42;
  p.y = p.y * 0.75 + 1.05;
  for (const [pose, weight] of overrides) {
    const w = weight(at);
    if (w > 0) for (const k of KEYS) p[k] += (pose[k] - p[k]) * w;
  }
  return p;
};
/** A pose of its own on phones, and how much of it applies at p. */
export type PhonePose = [Pose, (p: number) => number];

/** Chapter 2 on phones: card, phone and website side by side, small, above the text. */
export const PHONE_ROW = {
  card: pose(-1.3, 1.35, 0, 0.05, 0.25, 0, 0.36),
  phone: pose(0, 1.3, 0.3, 0.02, 0, 0, 0.62),
  browser: pose(1.32, 1.35, -0.1, 0.02, -0.25, 0, 0.4),
};
/** How much of the phone row applies at p (in for chapter 2, out after it). */
export const identityRow = (p: number) => seg(p, 0.16, 0.21) * (1 - seg(p, 0.33, 0.37));

/** Chapter 3 on phones: the website centred above the text (turned for its layers in between). */
const websitesOnPhone = (p: number) => seg(p, 0.35, 0.39) * (1 - seg(p, 0.56, 0.6));
const PHONE_SITE: PhonePose = [pose(0, 1.2, 0.4, 0.05, -0.18, 0, 0.84), websitesOnPhone];
const PHONE_SITE_TURNED: PhonePose = [pose(0.25, 1.25, 0.1, 0.3, -0.7, 0.05, 0.72), (p) => websitesOnPhone(p) * seg(p, 0.4, 0.44) * (1 - seg(p, 0.5, 0.54))];

/** Every object's own poses on phones. */
export const PHONE_POSES: Record<"card" | "phone" | "browser", PhonePose[]> = {
  card: [[PHONE_ROW.card, identityRow]],
  phone: [[PHONE_ROW.phone, identityRow]],
  browser: [[PHONE_ROW.browser, identityRow], PHONE_SITE, PHONE_SITE_TURNED],
};

// -------------------------------------------------------------------------------------------------
// Effects, by moment
// -------------------------------------------------------------------------------------------------

export const T = {
  heroTitleOut: [0.09, 0.14],
  /** chapter 2: one identity. Lines draw on, a light runs along them, the brand follows it. */
  links: {
    cardPhone: { draw: [0.2, 0.24], pulse: [0.225, 0.27] },
    phoneSite: { draw: [0.24, 0.28], pulse: [0.265, 0.31] },
    out: [0.32, 0.35],
  },
  /** the gold foil of the card catches the light as the brand sets off */
  glint: [0.205, 0.225, 0.26],
  /** the phone shows MambyLy's profile; the website shows a MambyLy page */
  brandPhone: [0.255, 0.28],
  brandSite: [0.295, 0.32],
  /** chapter 3: the website comes apart in layers, glass tokens around it, then real demos */
  siteLayers: { in: [0.41, 0.46], out: [0.49, 0.53] },
  floaters: { in: [0.4, 0.46], out: [0.52, 0.57] },
  demos: [0.52, 0.58],
  /** chapter 4 */
  green: { in: [0.58, 0.64], out: [0.84, 0.9], creamAbove: 85 },
  /** the hero opens on deep green, which closes into the objects as chapter 2 begins */
  heroGreen: [0.1, 0.17],
  explode: { in: [0.62, 0.66], out: [0.68, 0.72] },
  /** chapter 4: the profile opens again after the scan */
  profileIn: [0.77, 0.8],
  /** the phone screen becomes the website window */
  site: [0.9, 0.97],
  siteScroll: [0.93, 1],
} as const;

/** How much of a line is drawn (0..1), and its opacity, at p. */
export const linkDraw = (p: number, which: "cardPhone" | "phoneSite") => seg(p, T.links[which].draw[0], T.links[which].draw[1]);
export const linksOpacity = (p: number) => seg(p, T.links.cardPhone.draw[0], T.links.cardPhone.draw[0] + 0.02) * (1 - seg(p, T.links.out[0], T.links.out[1]));
/** Where the light is along a line (0..1), or -1 when it is not running. */
export const linkPulse = (p: number, which: "cardPhone" | "phoneSite") => {
  const [a, b] = T.links[which].pulse;
  return p < a || p > b ? -1 : (p - a) / (b - a);
};
/** Glint of the card's foil (0..1). */
export const glint = (p: number) => seg(p, T.glint[0], T.glint[1]) * (1 - seg(p, T.glint[1], T.glint[2]));
/** The phone shows the profile (MambyLy's brand) in chapter 2 and after the scan in chapter 4. */
export const profileShown = (p: number) =>
  Math.max(seg(p, T.brandPhone[0], T.brandPhone[1]) * (1 - seg(p, 0.6, 0.64)), seg(p, T.profileIn[0], T.profileIn[1]));
/** The website shows the MambyLy page in chapter 2, real demos before and after. */
export const brandSiteShown = (p: number) => seg(p, T.brandSite[0], T.brandSite[1]) * (1 - seg(p, 0.36, 0.4));

/** Exploded website at p: 0 = one page, 1 = its layers apart. */
export const siteLayers = (p: number) => seg(p, T.siteLayers.in[0], T.siteLayers.in[1]) * (1 - seg(p, T.siteLayers.out[0], T.siteLayers.out[1]));
/** The real demos the website shows one after the other at the end of chapter 3. */
export const SITE_DEMOS = ["architecture", "restaurant", "lighting", "photographer"] as const;
/** Which demo the website shows at p, as a position in SITE_DEMOS (fractions are crossfades). */
export const siteDemoAt = (p: number) => clamp((p - T.demos[0]) / (T.demos[1] - T.demos[0])) * (SITE_DEMOS.length - 1);

/** Exploded card at p: 0 = one card, 1 = three layers apart. */
export const explode = (p: number) => seg(p, T.explode.in[0], T.explode.in[1]) * (1 - seg(p, T.explode.out[0], T.explode.out[1]));
/** Radius of the green background, in % of the viewport diagonal circle. */
export const greenRadius = (p: number) =>
  Math.max(1 - seg(p, T.heroGreen[0], T.heroGreen[1]), seg(p, T.green.in[0], T.green.in[1]) * (1 - seg(p, T.green.out[0], T.green.out[1]))) * 150;

/** Exploded view (chapter 4): how far front and back sheets move from the core, in world units. */
export const EXPLODE_GAP = 0.95;

/** Chapter 3 floaters around the website: [x, y, z] from its centre: glass tokens with an icon of
 * what a website gathers, and small glass cubes (larger screens only). */
export const TOKENS: { icon: "phone" | "mail" | "pin" | "web" | "link"; at: [number, number, number] }[] = [
  { icon: "phone", at: [-2.4, 1.35, -0.6] },
  { icon: "mail", at: [2.25, 1.55, 0.4] },
  { icon: "pin", at: [2.6, -0.95, -1.2] },
  { icon: "web", at: [-2.2, -1.4, 0.8] },
  { icon: "link", at: [0.35, -1.85, -1.8] },
];
export const GLASS: [number, number, number][] = [
  [-1.35, 1.85, -1.6],
  [1.55, -1.75, 0.9],
  [3.0, 0.55, -0.4],
];
