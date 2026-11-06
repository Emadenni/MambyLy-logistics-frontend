import * as THREE from "three";
import logoLight from "../../assets/logo-light.svg";
import logoDark from "../../assets/logo-dark.svg";
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
    document.fonts.load(`500 40px ${SANS}`),
    document.fonts.load(`700 40px ${SANS}`),
    document.fonts.load(`400 40px "MP Newsreader"`),
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

// -------------------------------------------------------------------------------------------------
// Phone screens
// -------------------------------------------------------------------------------------------------

export const SCREEN = { w: 0.92, h: 1.96, r: 0.11 };
const SW = 900;
const SH = Math.round((SW * SCREEN.h) / SCREEN.w);
const SERIF = '"MP Newsreader", Georgia, serif';

const roundRect = (x: CanvasRenderingContext2D, left: number, top: number, w: number, h: number, r: number) => {
  x.beginPath();
  x.roundRect(left, top, w, h, r);
};

/** The digital profile that opens: green banner, round mark, name, role and three buttons. */
export const profileTexture = async (lang: Lang, labels: { save: string; email: string; website: string }) => {
  await fonts();
  const [c, x] = canvas(SW, SH);
  const { name, role } = content(lang);
  x.fillStyle = C.cream;
  x.fillRect(0, 0, SW, SH);
  const banner = 560;
  const g = x.createLinearGradient(0, 0, SW, banner);
  g.addColorStop(0, "#1d5047");
  g.addColorStop(1, C.green);
  x.fillStyle = g;
  x.fillRect(0, 0, SW, banner);
  x.strokeStyle = "rgba(246, 244, 238, 0.06)";
  x.lineWidth = 3;
  for (let d = -banner; d < SW; d += 60) {
    x.beginPath();
    x.moveTo(d, banner);
    x.lineTo(d + banner, 0);
    x.stroke();
  }
  // avatar: the "m" mark on a cream ring
  const cx = SW / 2;
  const cy = banner;
  x.fillStyle = C.cream;
  x.beginPath();
  x.arc(cx, cy, 150, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = C.green;
  x.beginPath();
  x.arc(cx, cy, 132, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = "#eadcb8";
  x.textAlign = "center";
  x.font = `700 ${170}px ${SANS}`;
  x.fillText("m", cx, cy + 58);
  x.fillStyle = C.green;
  x.font = `400 ${78}px ${SERIF}`;
  x.fillText(name, cx, cy + 290);
  x.fillStyle = C.muted;
  x.font = `400 ${38}px ${SANS}`;
  x.fillText(role, cx, cy + 360);
  const button = (label: string, top: number, solid: boolean) => {
    roundRect(x, 90, top, SW - 180, 120, 60);
    if (solid) {
      x.fillStyle = C.green;
      x.fill();
    } else {
      x.lineWidth = 4;
      x.strokeStyle = "rgba(16, 59, 53, 0.35)";
      x.stroke();
    }
    x.fillStyle = solid ? C.cream : C.green;
    x.font = `600 ${42}px ${SANS}`;
    x.fillText(label, SW / 2, top + 76);
  };
  button(labels.save, cy + 470, true);
  button(labels.email, cy + 620, false);
  button(labels.website, cy + 770, false);
  return texture(c);
};

// -------------------------------------------------------------------------------------------------
// Token icons (chapter 3): thin green line icons, on clear (inside glass tokens)
// -------------------------------------------------------------------------------------------------

export type TokenIcon = "phone" | "mail" | "pin" | "web" | "link";

export const iconTexture = (icon: TokenIcon) => {
  const S = 256;
  const [c, x] = canvas(S, S);
  x.strokeStyle = C.green;
  x.fillStyle = C.green;
  x.lineWidth = 12;
  x.lineCap = "round";
  x.lineJoin = "round";
  x.translate(S / 2, S / 2);
  x.beginPath();
  if (icon === "phone") {
    x.roundRect(-34, -56, 68, 112, 14);
    x.stroke();
    x.beginPath();
    x.moveTo(-10, 38);
    x.lineTo(10, 38);
  } else if (icon === "mail") {
    x.roundRect(-58, -40, 116, 80, 10);
    x.stroke();
    x.beginPath();
    x.moveTo(-56, -36);
    x.lineTo(0, 6);
    x.lineTo(56, -36);
  } else if (icon === "pin") {
    x.moveTo(0, 60);
    x.bezierCurveTo(-30, 20, -46, -2, -46, -22);
    x.arc(0, -22, 46, Math.PI, 0);
    x.bezierCurveTo(46, -2, 30, 20, 0, 60);
    x.stroke();
    x.beginPath();
    x.arc(0, -22, 15, 0, Math.PI * 2);
  } else if (icon === "web") {
    x.arc(0, 0, 56, 0, Math.PI * 2);
    x.stroke();
    x.beginPath();
    x.ellipse(0, 0, 24, 56, 0, 0, Math.PI * 2);
    x.moveTo(-56, 0);
    x.lineTo(56, 0);
  } else {
    x.rotate(-Math.PI / 4);
    x.roundRect(-60, -20, 64, 40, 20);
    x.roundRect(-4, -20, 64, 40, 20);
  }
  x.stroke();
  return texture(c);
};

// -------------------------------------------------------------------------------------------------
// The MambyLy page on the website screen (chapter 2: one style on every surface)
// -------------------------------------------------------------------------------------------------

const BRAND_PAGE: Record<Lang, { nav: string[]; title: string; lead: string; button: string }> = {
  sv: {
    nav: ["Webbplatser", "Visitkort", "Om oss", "Kontakt"],
    title: "Enklare digitalt.",
    lead: "Webbplatser och digitala visitkort, i samma stil.",
    button: "Kontakta oss",
  },
  en: {
    nav: ["Websites", "Business cards", "About", "Contact"],
    title: "Simpler digital.",
    lead: "Websites and digital business cards, in one style.",
    button: "Contact us",
  },
};

/** A website page in MambyLy's own look: cream, the logo, a serif headline, the card in green. */
export const brandPageTexture = async (lang: Lang) => {
  await fonts();
  const PW = 1280;
  const PH = 800;
  const [c, x] = canvas(PW, PH);
  const page = BRAND_PAGE[lang];
  x.fillStyle = C.cream;
  x.fillRect(0, 0, PW, PH);
  const glow = x.createRadialGradient(PW * 0.78, PH * 1.05, 0, PW * 0.78, PH * 1.05, PW * 0.7);
  glow.addColorStop(0, "rgba(36, 123, 103, 0.22)");
  glow.addColorStop(1, "rgba(36, 123, 103, 0)");
  x.fillStyle = glow;
  x.fillRect(0, 0, PW, PH);

  const logo = await image(logoDark);
  x.drawImage(logo, 64, 34, 150, (150 * 125) / 440);
  x.fillStyle = C.green;
  x.font = `500 19px ${SANS}`;
  x.textAlign = "right";
  let right = PW - 64;
  for (const item of [...page.nav].reverse()) {
    x.fillText(item, right, 64);
    right -= x.measureText(item).width + 40;
  }
  x.textAlign = "left";
  x.fillStyle = "rgba(16, 59, 53, 0.12)";
  x.fillRect(64, 108, PW - 128, 1.5);

  x.fillStyle = C.green;
  x.font = `400 96px ${SERIF}`;
  x.fillText(page.title, 64, 330);
  x.fillStyle = C.muted;
  x.font = `400 26px ${SANS}`;
  x.fillText(page.lead, 66, 390);
  roundRect(x, 64, 440, x.measureText(page.button).width + 120, 64, 32);
  x.fillStyle = C.green;
  x.fill();
  x.fillStyle = C.cream;
  x.font = `600 22px ${SANS}`;
  x.fillText(page.button, 104, 480);

  // the card, as on every MambyLy surface
  x.save();
  x.translate(980, 470);
  x.rotate(-0.12);
  x.shadowColor = "rgba(16, 59, 53, 0.28)";
  x.shadowBlur = 40;
  x.shadowOffsetY = 18;
  roundRect(x, -210, -132, 420, 264, 22);
  const g = x.createLinearGradient(-210, -132, 210, 132);
  g.addColorStop(0, "#1d5047");
  g.addColorStop(1, "#0c312c");
  x.fillStyle = g;
  x.fill();
  x.shadowColor = "transparent";
  const light = await image(logoLight);
  x.filter = "sepia(1) saturate(0.6) brightness(1.05)";
  x.drawImage(light, -176, -100, 170, (170 * 125) / 440);
  x.filter = "none";
  x.restore();
  return texture(c);
};

// -------------------------------------------------------------------------------------------------
// Chapter 4: the camera that reads the card's QR code, and the share sheet
// -------------------------------------------------------------------------------------------------

const CAMERA_FOUND: Record<Lang, string> = { sv: "Öppna mambylysolutions.se", en: "Open mambylysolutions.se" };

/** The camera: the card's back seen close (cream, the QR code), corner marks, the link found. */
export const cameraTexture = async (lang: Lang) => {
  await fonts();
  const [c, x] = canvas(SW, SH);
  const g = x.createLinearGradient(0, 0, 0, SH);
  g.addColorStop(0, "#3b3f3c");
  g.addColorStop(1, "#1b1e1c");
  x.fillStyle = g;
  x.fillRect(0, 0, SW, SH);
  // the card, close and slightly turned
  x.save();
  x.translate(SW / 2, SH * 0.44);
  x.rotate(-0.05);
  roundRect(x, -390, -300, 780, 600, 30);
  x.fillStyle = C.cream;
  x.fill();
  const { url } = content(lang);
  const qr = encodeQr(url);
  const size = 420;
  const cell = size / qr.size;
  x.fillStyle = C.green;
  qr.modules.forEach((row, rr) =>
    row.forEach((on, col) => {
      if (on) x.fillRect(-size / 2 + col * cell, -size / 2 + rr * cell, Math.ceil(cell), Math.ceil(cell));
    }),
  );
  x.restore();
  // corner marks of the viewfinder
  x.strokeStyle = "rgba(246, 244, 238, 0.95)";
  x.lineWidth = 12;
  x.lineCap = "round";
  const half = 290;
  const cy = SH * 0.44;
  for (const [sx, sy] of [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ]) {
    x.beginPath();
    x.moveTo(SW / 2 + sx * half, cy + sy * (half - 80));
    x.lineTo(SW / 2 + sx * half, cy + sy * half);
    x.lineTo(SW / 2 + sx * (half - 80), cy + sy * half);
    x.stroke();
  }
  // the link that was found
  x.font = `500 ${40}px ${SANS}`;
  const label = CAMERA_FOUND[lang];
  const w = x.measureText(label).width + 90;
  roundRect(x, (SW - w) / 2, SH * 0.74, w, 92, 46);
  x.fillStyle = "rgba(246, 244, 238, 0.94)";
  x.fill();
  x.fillStyle = C.green;
  x.textAlign = "center";
  x.fillText(label, SW / 2, SH * 0.74 + 60);
  return texture(c);
};

const SHARE: Record<Lang, { title: string; copy: string; mail: string; message: string; more: string }> = {
  sv: { title: "Dela kontakt", copy: "Kopiera", mail: "E-post", message: "Meddelande", more: "Mer" },
  en: { title: "Share contact", copy: "Copy", mail: "Email", message: "Message", more: "More" },
};

/** The share sheet that slides up over the profile: the link, ways to send it, the QR code. */
export const shareTexture = async (lang: Lang) => {
  await fonts();
  const H2 = Math.round(SH * 0.56);
  const [c, x] = canvas(SW, H2);
  const t = SHARE[lang];
  const { url } = content(lang);
  roundRect(x, 0, 0, SW, H2 + 60, 60);
  x.fillStyle = "#fbfaf6";
  x.fill();
  x.fillStyle = "rgba(16, 59, 53, 0.18)";
  roundRect(x, SW / 2 - 60, 26, 120, 12, 6);
  x.fill();
  x.fillStyle = C.green;
  x.font = `600 ${46}px ${SANS}`;
  x.fillText(t.title, 70, 130);
  // link field
  roundRect(x, 70, 175, SW - 140, 110, 30);
  x.fillStyle = "rgba(16, 59, 53, 0.06)";
  x.fill();
  x.fillStyle = C.green;
  x.font = `400 ${34}px ${SANS}`;
  x.fillText(url.replace(/^https:\/\/(www\.)?/, ""), 105, 243);
  x.font = `600 ${34}px ${SANS}`;
  x.textAlign = "right";
  x.fillText(t.copy, SW - 105, 243);
  x.textAlign = "center";
  // ways to send it
  const items = [t.message, t.mail, t.more];
  items.forEach((label, i) => {
    const cx = 190 + i * 260;
    x.beginPath();
    x.arc(cx, 400, 62, 0, Math.PI * 2);
    x.fillStyle = i === 0 ? C.green : "rgba(16, 59, 53, 0.1)";
    x.fill();
    x.strokeStyle = i === 0 ? C.cream : C.green;
    x.lineWidth = 7;
    x.lineCap = "round";
    x.lineJoin = "round";
    x.beginPath();
    if (i === 0) {
      x.roundRect(cx - 30, 378, 60, 40, 10);
      x.moveTo(cx - 12, 418);
      x.lineTo(cx - 20, 432);
      x.lineTo(cx, 418);
    } else if (i === 1) {
      x.rect(cx - 30, 382, 60, 40);
      x.moveTo(cx - 30, 384);
      x.lineTo(cx, 404);
      x.lineTo(cx + 30, 384);
    } else {
      [-20, 0, 20].forEach((dx) => {
        x.moveTo(cx + dx + 4, 400);
        x.arc(cx + dx, 400, 4, 0, Math.PI * 2);
      });
    }
    x.stroke();
    x.fillStyle = C.muted;
    x.font = `400 ${30}px ${SANS}`;
    x.fillText(label, cx, 510);
  });
  // the QR code to show in person
  const qr = encodeQr(url);
  const size = 300;
  const cell = size / qr.size;
  const left = (SW - size) / 2;
  const top = 580;
  x.fillStyle = C.green;
  qr.modules.forEach((row, rr) =>
    row.forEach((on, col) => {
      if (on) x.fillRect(left + col * cell, top + rr * cell, Math.ceil(cell), Math.ceil(cell));
    }),
  );
  return texture(c);
};
