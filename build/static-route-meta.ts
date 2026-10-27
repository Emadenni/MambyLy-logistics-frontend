import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { validateCard } from "../src/public/digital-card/validate";
import { buildVCard, vcardFileName } from "../src/public/digital-card/vcard";
import type { CardConfigRaw } from "../src/public/digital-card/types";
import { copy } from "../src/public/experience/copy";
import { CARD_PATH, EXAMPLE_BASE, LANGS, PATHS, type Lang, type StaticScreen } from "../src/public/experience/routes";

/**
 * Build-only: writes dist/<route>/index.html copies of dist/index.html whose <head> already holds
 * the language, title, description, canonical, hreflang alternates and Open Graph/Twitter tags of
 * that route, so crawlers that do not run JavaScript see the right page. The copies load the same
 * bundle; the SPA router renders the route as usual. Having a real file also lets the host answer
 * 200 (instead of its 404 fallback) after it adds the trailing slash.
 *
 * Also writes dist/card/<slug>.vcf for every real (non-demo) card: the static contact file that
 * the "Spara kontakt" button opens (see src/public/digital-card/vcard.ts).
 *
 * Absolute URLs use PUBLIC_SITE_URL (default: production domain), since previews are only read
 * by crawlers on the published site.
 */
const SITE = (process.env.PUBLIC_SITE_URL || "https://www.mambylysolutions.se").replace(/\/$/, "");
const COMPANY_CARD_SLUG = "mambyly-solutions"; // see src/public/digital-card/registry.ts
const DEFAULT_IMAGE = "/brand/og-home.png";

type PageMeta = {
  route: string;
  lang: Lang;
  title: string;
  description: string;
  image: string;
  noindex?: boolean;
  canonical?: string;
  alternates?: Record<Lang, string>;
};

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const abs = (route: string) => `${SITE}${encodeURI(route)}`;
// Marks the tags as managed by react-helmet-async, which replaces them once the app runs (no duplicates
// after a change of screen or language).
const RH = `data-rh="true"`;

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" ${RH} />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function renderRouteHtml(html: string, page: PageMeta): string {
  const url = abs(page.canonical ?? page.route);
  const image = `${SITE}${page.image}`;
  let out = html.replace(/<html lang="[^"]*"/, `<html lang="${page.lang}"`);
  out = out.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "property", "og:title", page.title);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "property", "og:image", image);
  out = setMeta(out, "property", "og:locale", page.lang === "en" ? "en_GB" : "sv_SE");
  out = setMeta(out, "name", "twitter:title", page.title);
  out = setMeta(out, "name", "twitter:description", page.description);
  out = setMeta(out, "name", "twitter:image", image);
  const alt = page.alternates;
  const extra = [
    `<link rel="canonical" href="${escapeAttr(url)}" ${RH} />`,
    alt ? `<link rel="alternate" hreflang="sv" href="${escapeAttr(abs(alt.sv))}" ${RH} />` : "",
    alt ? `<link rel="alternate" hreflang="en" href="${escapeAttr(abs(alt.en))}" ${RH} />` : "",
    alt ? `<link rel="alternate" hreflang="x-default" href="${escapeAttr(abs(alt.sv))}" ${RH} />` : "",
    page.noindex ? `<meta name="robots" content="noindex" ${RH} />` : "",
  ]
    .filter(Boolean)
    .map((t) => `    ${t}\n`)
    .join("");
  return out.replace("</head>", `${extra}  </head>`);
}

const IMAGES: Partial<Record<StaticScreen, string>> = { examples: "/brand/og-exempel.png" };

/** Every screen of the site in both languages (titles and descriptions from copy.ts). */
function sitePages(): PageMeta[] {
  const pages: PageMeta[] = [];
  for (const screen of Object.keys(PATHS) as StaticScreen[]) {
    for (const lang of LANGS) {
      const meta = copy[lang].meta[screen as keyof (typeof copy)["sv"]["meta"]];
      pages.push({
        route: PATHS[screen][lang],
        lang,
        title: meta.title,
        description: meta.description,
        image: IMAGES[screen] ?? DEFAULT_IMAGE,
        alternates: PATHS[screen],
      });
    }
  }
  return pages;
}

type CardEntry = { slug: string; raw: CardConfigRaw };

function readCards(root: string): CardEntry[] {
  const dir = path.join(root, "src/public/digital-card/cards");
  return (fs.existsSync(dir) ? fs.readdirSync(dir) : [])
    .filter((slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && fs.existsSync(path.join(dir, slug, "card.json")))
    .map((slug) => ({ slug, raw: JSON.parse(fs.readFileSync(path.join(dir, slug, "card.json"), "utf8")) as CardConfigRaw }))
    .filter(({ slug, raw }) => raw.slug === slug);
}

function cardPages(root: string, cards: CardEntry[]): PageMeta[] {
  const pages: PageMeta[] = [];
  for (const { slug, raw: card } of cards) {
    const metaFor = (lang: Lang) => {
      const tr = lang !== (card.lang ?? "sv") ? card.translations?.[lang]?.meta : undefined;
      return {
        title: tr?.title || card.meta?.title || [card.name, card.company].filter(Boolean).join(" – "),
        description: tr?.description || card.meta?.description || `Digitalt visitkort: ${card.name}`,
      };
    };
    const image = fs.existsSync(path.join(root, "public/cards", slug, "og.png")) ? `/cards/${slug}/og.png` : DEFAULT_IMAGE;
    if (card.demo) {
      // Demo cards are presented at /exempel/<slug> and /en/examples/<slug>; /card/<slug> stays as a redirect.
      const alternates = { sv: `${EXAMPLE_BASE.sv}/${slug}`, en: `${EXAMPLE_BASE.en}/${slug}` };
      for (const lang of LANGS) pages.push({ route: alternates[lang], lang, ...metaFor(lang), image, noindex: true, alternates });
      pages.push({ route: `/card/${slug}`, lang: "sv", ...metaFor("sv"), image, noindex: true, canonical: alternates.sv });
    } else if (slug === COMPANY_CARD_SLUG) {
      for (const lang of LANGS) pages.push({ route: CARD_PATH[lang], lang, ...metaFor(lang), image, alternates: CARD_PATH });
    } else {
      pages.push({ route: `/card/${slug}`, lang: card.lang === "en" ? "en" : "sv", ...metaFor(card.lang === "en" ? "en" : "sv"), image });
    }
  }
  return pages;
}

export default function staticRouteMeta(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "mambyly-static-route-meta",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const indexFile = path.join(outDir, "index.html");
      if (!fs.existsSync(indexFile)) return;
      const html = fs.readFileSync(indexFile, "utf8");
      const cards = readCards(root);
      for (const page of [...sitePages(), ...cardPages(root, cards)]) {
        // "/" is dist/index.html itself, which also serves admin, login and Sido Butik: left as it is.
        if (page.route === "/") continue;
        const target = path.join(outDir, page.route.slice(1), "index.html");
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, renderRouteHtml(html, page));
      }
      // Static contact files for real cards (same generator as the in-page download).
      for (const { slug, raw } of cards) {
        const card = validateCard(raw, {});
        if (!card || card.demo) continue;
        const route = slug === COMPANY_CARD_SLUG ? "/card" : `/card/${slug}`;
        fs.mkdirSync(path.join(outDir, "card"), { recursive: true });
        fs.writeFileSync(path.join(outDir, "card", vcardFileName(card)), buildVCard(card, `${SITE}${route}`));
      }
    },
  };
}
