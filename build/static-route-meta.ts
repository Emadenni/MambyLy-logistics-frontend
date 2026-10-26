import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { validateCard } from "../src/public/digital-card/validate";
import { buildVCard, vcardFileName } from "../src/public/digital-card/vcard";
import type { CardConfigRaw } from "../src/public/digital-card/types";

/**
 * Build-only: writes dist/<route>/index.html copies of dist/index.html whose <head> already holds
 * the title, description, canonical and Open Graph/Twitter tags of that route, so social crawlers
 * that do not run JavaScript see the right preview. The copies load the same bundle; the SPA
 * router renders the route as usual. Having a real file also lets the host answer 200 (instead of
 * its 404 fallback) after it adds the trailing slash.
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

type PageMeta = { route: string; title: string; description: string; image: string; noindex?: boolean; canonical?: string };

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function renderRouteHtml(html: string, page: PageMeta): string {
  const url = `${SITE}${page.canonical ?? page.route}`;
  const image = `${SITE}${page.image}`;
  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  out = setMeta(out, "name", "description", page.description);
  out = setMeta(out, "property", "og:title", page.title);
  out = setMeta(out, "property", "og:description", page.description);
  out = setMeta(out, "property", "og:url", url);
  out = setMeta(out, "property", "og:image", image);
  out = setMeta(out, "name", "twitter:title", page.title);
  out = setMeta(out, "name", "twitter:description", page.description);
  out = setMeta(out, "name", "twitter:image", image);
  const extra = [`<link rel="canonical" href="${escapeAttr(url)}" />`, page.noindex ? `<meta name="robots" content="noindex" />` : ""]
    .filter(Boolean)
    .map((t) => `    ${t}\n`)
    .join("");
  return out.replace("</head>", `${extra}  </head>`);
}

/** Public pages of the site (titles and descriptions as in their <Helmet>). */
const sitePages: PageMeta[] = [
  {
    route: "/exempel",
    title: "Exempel på digitala visitkort | MambyLy Solutions",
    description: "Se exempel på digitala visitkort för hantverkare, säljare, fotografer och serviceföretag. Öppna ett kort, vänd på det och se hur det fungerar.",
    image: "/brand/og-exempel.png",
  },
  {
    route: "/tjänster",
    title: "Tjänster – digitala visitkort och webbplatser | MambyLy Solutions",
    description: "Digitalt visitkort med din logotyp och dina kontaktuppgifter – och en webbplats i samma stil när du behöver. Begär en offert.",
    image: DEFAULT_IMAGE,
  },
  {
    route: "/kontaktaOss",
    title: "Kontakta oss – digitala visitkort och webbplatser | MambyLy Solutions",
    description: "Berätta vad du behöver: ett digitalt visitkort, en webbplats eller båda. Vi hör av oss och tar fram en offert.",
    image: DEFAULT_IMAGE,
  },
  {
    route: "/omOss",
    title: "Om oss | MambyLy Solutions",
    description: "MambyLy Solutions är en liten studio i Linköping som gör digitala visitkort och webbplatser för småföretag.",
    image: DEFAULT_IMAGE,
  },
  {
    route: "/jobbaMedOss",
    title: "Jobba med oss – Mambyly Solutions",
    description: "Vill du jobba med oss? Se om det finns lediga tjänster eller skicka in en spontanansökan.",
    image: DEFAULT_IMAGE,
  },
  // Former card service page, now a redirect in the SPA (App.tsx).
  {
    route: "/digital-card",
    title: "Digitala visitkort | MambyLy Solutions",
    description: "Digitala visitkort med din logotyp, dina färger och dina kontaktuppgifter.",
    image: DEFAULT_IMAGE,
    canonical: "/tjänster",
    noindex: true,
  },
];

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
    const title = card.meta?.title || [card.name, card.company].filter(Boolean).join(" – ");
    const description = card.meta?.description || `Digitalt visitkort: ${card.name}`;
    const image = fs.existsSync(path.join(root, "public/cards", slug, "og.png")) ? `/cards/${slug}/og.png` : DEFAULT_IMAGE;
    if (card.demo) {
      // Demo cards are presented at /exempel/<slug>; the old /card/<slug> stays as a redirect.
      pages.push({ route: `/exempel/${slug}`, title, description, image, noindex: true });
      pages.push({ route: `/card/${slug}`, title, description, image, noindex: true, canonical: `/exempel/${slug}` });
    } else {
      pages.push({ route: slug === COMPANY_CARD_SLUG ? "/card" : `/card/${slug}`, title, description, image });
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
      for (const page of [...sitePages, ...cardPages(root, cards)]) {
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
