import fs from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { Resvg, initWasm } from "@resvg/resvg-wasm";
import type { CardConfigRaw } from "../src/public/digital-card/types";
import { cardIconDir, cardManifestPath } from "../src/public/digital-card/install";

/**
 * Build-only: what a card needs to live on a phone's home screen. dist/cards/<slug>/ gets the icons
 * (rendered with resvg's WebAssembly build: free, no native binaries, same result on every machine)
 * and one web manifest per address of the card. The icon is the card's own square mark when it has
 * one, otherwise the monogram used on the cards, on the colours of the card's theme.
 */
const require = createRequire(import.meta.url);
let ready: Promise<void> | null = null;

/** The card pages are ivory whatever the card: also the splash when the app opens. */
export const CARD_PAGE_COLOR = "#f6f4ee";
const SITE = (process.env.PUBLIC_SITE_URL || "https://www.mambylysolutions.se").replace(/\/$/, "");

const MIME: Record<string, string> = { ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg" };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const cardShortName = (card: CardConfigRaw) => {
  if (card.kind === "organization") return card.name.split(/\s+/)[0];
  if (card.name.length <= 12) return card.name;
  const [first, ...rest] = card.name.split(/\s+/);
  return rest.length ? `${first[0]}. ${rest.join(" ")}` : card.name;
};

/** The card's own mark as a data URI: logoBack, or a logo that is not a wide wordmark. */
function ownMark(root: string, card: CardConfigRaw) {
  const file = card.logoBack ?? (card.logoShape === "wide" ? undefined : card.logo);
  if (!file || file.includes("/")) return null;
  const full = path.join(root, "src/public/digital-card/cards", card.slug, file);
  const mime = MIME[path.extname(file).toLowerCase()];
  if (!mime || !fs.existsSync(full)) return null;
  return `data:${mime};base64,${fs.readFileSync(full).toString("base64")}`;
}

/** 512 × 512. `safe`: share of the icon the content may use (masks and iOS crop the corners). */
function iconSvg(card: CardConfigRaw, mark: string | null, safe: number, rounded: boolean) {
  const { front, frontInk, accent } = card.theme;
  const size = 512 * safe;
  const at = (512 - size) / 2;
  const content = mark
    ? `<image href="${mark}" x="${at}" y="${at}" width="${size}" height="${size}"/>`
    : `<g transform="translate(256 256) scale(${safe}) translate(-256 -256)">
        <text x="256" y="312" text-anchor="middle" font-family="Poppins" font-weight="600" font-size="210" letter-spacing="8" fill="${frontInk}">${initials(card.name)}</text>
        <rect x="216" y="356" width="80" height="7" rx="3.5" fill="${accent}"/>
      </g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512"><rect width="512" height="512"${rounded ? ' rx="112"' : ""} fill="${front}"/>${content}</svg>`;
}

export async function writeCardInstall(root: string, outDir: string, card: CardConfigRaw, routes: { route: string; lang: string; description: string }[]) {
  ready ??= initWasm(fs.readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm")));
  await ready;
  const font = fs.readFileSync(path.join(root, "src/assets/Poppins/Poppins-SemiBold.ttf"));
  const png = (svg: string, width: number) =>
    new Resvg(svg, { fitTo: { mode: "width", value: width }, font: { fontBuffers: [new Uint8Array(font)], defaultFontFamily: "Poppins" } }).render().asPng();

  const dir = path.join(outDir, cardIconDir(card.slug).slice(1));
  fs.mkdirSync(dir, { recursive: true });
  const mark = ownMark(root, card);
  const any = iconSvg(card, mark, mark ? 0.88 : 1, true);
  const maskable = iconSvg(card, mark, mark ? 0.72 : 0.8, false);
  const icons: [string, string, number][] = [
    ["icon-192.png", any, 192],
    ["icon-512.png", any, 512],
    ["maskable-192.png", maskable, 192],
    ["maskable-512.png", maskable, 512],
    // iOS rounds it itself and paints transparency black.
    ["apple-touch-icon.png", iconSvg(card, mark, mark ? 0.88 : 1, false), 180],
  ];
  for (const [name, svg, width] of icons) fs.writeFileSync(path.join(dir, name), png(svg, width));

  const base = cardIconDir(card.slug);
  for (const { route, lang, description } of routes) {
    // The host adds the trailing slash, so this is the address that answers without a redirect.
    const url = `${route}/`;
    const manifest = {
      id: url,
      name: card.name,
      short_name: cardShortName(card),
      description,
      lang,
      dir: "ltr",
      start_url: url,
      scope: url,
      display: "standalone",
      background_color: CARD_PAGE_COLOR,
      theme_color: CARD_PAGE_COLOR,
      prefer_related_applications: false,
      // Lets Chrome on Android tell the page that this card is already installed.
      related_applications: [{ platform: "webapp", url: `${SITE}${cardManifestPath(card.slug, route)}` }],
      icons: [
        { src: `${base}/icon-192.png`, sizes: "192x192", type: "image/png", purpose: "any" },
        { src: `${base}/icon-512.png`, sizes: "512x512", type: "image/png", purpose: "any" },
        { src: `${base}/maskable-192.png`, sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: `${base}/maskable-512.png`, sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    };
    fs.writeFileSync(path.join(outDir, cardManifestPath(card.slug, route).slice(1)), `${JSON.stringify(manifest, null, 2)}\n`);
  }
}
