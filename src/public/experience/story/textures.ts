import * as THREE from "three";
import logoLight from "../../assets/logo-light.svg";
import { encodeQr } from "../../digital-card/qr";
import { getCard, COMPANY_CARD_SLUG } from "../../digital-card/registry";
import type { Lang } from "../routes";
import { CARD } from "./storyTimeline";

/**
 * Card graphics drawn on 2D canvases (after the fonts are ready), after MambyLy's real card (/card):
 * green front with the logo top left and role + tagline below, cream back with the contact details.
 * The front logo is not printed: it is a mask for the gold foil layer. Max 2048 px per side.
 */

const W = 2048;
const H = Math.round((W * CARD.h) / CARD.w);
const PX = W / 440; // the real card is drawn 440 px wide
const SANS = '"MP Poppins", Poppins, system-ui, sans-serif';

const C = {
  green: "#103b35",
  cream: "#f6f4ee",
  teal: "#247b67",
  muted: "#5d6b66",
};

const canvas = (w = W, h = H) => {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
};

const texture = (c: HTMLCanvasElement, srgb = true) => {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
};

let fontsReady: Promise<unknown> | null = null;
const fonts = () =>
  (fontsReady ??= Promise.all([
    document.fonts.load(`600 40px ${SANS}`),
    document.fonts.load(`400 40px ${SANS}`),
    document.fonts.load(`italic 400 40px ${SANS}`),
  ]).then(() => document.fonts.ready));

const image = (src: string) =>
  new Promise<HTMLImageElement>((ok, fail) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = fail;
    img.src = src;
  });

const LOGO = { x: 35 * PX, y: 40 * PX, w: 180 * PX };

const content = (lang: Lang) => {
  const card = getCard(COMPANY_CARD_SLUG, lang);
  return {
    name: card?.name ?? "MambyLy Solutions",
    role: card?.role ?? "",
    tagline: card?.tagline ?? "",
    email: card?.email ?? "info@mambylysolutions.se",
    web: card?.website?.label ?? "mambylysolutions.se",
    url: `https://www.mambylysolutions.se${lang === "en" ? "/en/card" : "/card"}`,
  };
};

/** Front: deep green, a soft light from the top left, fine diagonal lines; role and tagline in cream. */
export const frontTexture = async (lang: Lang) => {
  await fonts();
  const [c, x] = canvas();
  const g = x.createLinearGradient(0, 0, W, H);
  // a little darker than the brand green: the studio light brings it back to #103b35 on screen
  g.addColorStop(0, "#164a41");
  g.addColorStop(0.55, "#0d332e");
  g.addColorStop(1, "#092622");
  x.fillStyle = g;
  x.fillRect(0, 0, W, H);
  x.save();
  x.strokeStyle = "rgba(246, 244, 238, 0.045)";
  x.lineWidth = 3;
  for (let d = -H; d < W; d += 26 * PX) {
    x.beginPath();
    x.moveTo(d, H);
    x.lineTo(d + H, 0);
    x.stroke();
  }
  x.restore();
  const { role, tagline } = content(lang);
  x.fillStyle = "rgba(246, 244, 238, 0.92)";
  x.font = `600 ${18 * PX}px ${SANS}`;
  x.fillText(role, 32 * PX, 230 * PX);
  x.fillStyle = "rgba(246, 244, 238, 0.78)";
  x.font = `italic 400 ${15 * PX}px ${SANS}`;
  x.fillText(tagline, 32 * PX, 252 * PX);
  return texture(c);
};

/** Mask of the foil: the logo in white on black, where the front card shows gold. */
export const foilMask = async () => {
  const [c, x] = canvas();
  x.fillStyle = "#000";
  x.fillRect(0, 0, W, H);
  const img = await image(logoLight);
  const h = (LOGO.w * img.naturalHeight) / img.naturalWidth || (LOGO.w * 125) / 440;
  x.filter = "brightness(2)";
  x.drawImage(img, LOGO.x, LOGO.y, LOGO.w, h);
  return texture(c, false);
};

/** Back: cream, the company in green, e-mail and website, a QR code to the digital card. */
export const backTexture = async (lang: Lang) => {
  await fonts();
  const [c, x] = canvas();
  x.fillStyle = C.cream;
  x.fillRect(0, 0, W, H);
  const { name, role, email, web, url } = content(lang);
  x.fillStyle = C.green;
  x.font = `600 ${22 * PX}px ${SANS}`;
  x.fillText(name, 32 * PX, 62 * PX);
  x.fillStyle = C.teal;
  x.font = `600 ${11.5 * PX}px ${SANS}`;
  if ("letterSpacing" in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${1.2 * PX}px`;
  x.fillText(role.toUpperCase(), 32 * PX, 82 * PX);
  if ("letterSpacing" in x) (x as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "0px";
  x.fillStyle = C.green;
  x.font = `400 ${15 * PX}px ${SANS}`;
  x.fillText(email, 32 * PX, 196 * PX);
  x.fillText(web, 32 * PX, 224 * PX);
  x.fillStyle = C.teal;
  x.fillRect(32 * PX, 160 * PX, 28 * PX, 2 * PX);

  const qr = encodeQr(url);
  const size = 128 * PX;
  const left = W - 34 * PX - size;
  const top = H - 30 * PX - size;
  const cell = size / qr.size;
  x.fillStyle = C.green;
  qr.modules.forEach((row, r) =>
    row.forEach((on, col) => {
      if (on) x.fillRect(left + col * cell, top + r * cell, Math.ceil(cell), Math.ceil(cell));
    }),
  );
  return texture(c);
};

/** Generic white paper cards for chapter 2: grey bars where a name and lines would be. */
export const paperTexture = (variant: number) => {
  const w = 512;
  const h = Math.round((w * CARD.h) / CARD.w);
  const [c, x] = canvas(w, h);
  x.fillStyle = "#fdfdfb";
  x.fillRect(0, 0, w, h);
  const bar = (bx: number, by: number, bw: number, bh: number, a: number) => {
    x.fillStyle = `rgba(60, 64, 62, ${a})`;
    x.fillRect(bx, by, bw, bh);
  };
  if (variant === 0) {
    bar(40, 52, 210, 22, 0.55);
    bar(40, 88, 140, 12, 0.28);
    [220, 244, 268].forEach((y, i) => bar(40, y, 170 - i * 24, 9, 0.22));
  } else if (variant === 1) {
    x.fillStyle = "rgba(60, 64, 62, 0.18)";
    x.beginPath();
    x.arc(w / 2, 110, 38, 0, Math.PI * 2);
    x.fill();
    bar(w / 2 - 110, 172, 220, 18, 0.5);
    bar(w / 2 - 70, 204, 140, 10, 0.25);
  } else {
    bar(w - 260, 60, 220, 20, 0.5);
    bar(w - 180, 94, 140, 10, 0.26);
    [228, 252].forEach((y) => bar(40, y, 190, 9, 0.22));
    bar(40, 52, 54, 54, 0.15);
  }
  return texture(c);
};
