import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * Build-only: writes dist/<route>/index.html copies of dist/index.html whose <head> already holds
 * the title, description, canonical and Open Graph/Twitter tags of that route, so social crawlers
 * that do not run JavaScript see the right preview. The copies load the same bundle; the SPA
 * router renders the route as usual. Routes: /digital-card and /card/<slug> for every card in
 * src/public/digital-card/cards/<slug>/card.json.
 *
 * Absolute URLs use PUBLIC_SITE_URL (default: production domain), since previews are only read
 * by crawlers on the published site.
 */
const SITE = (process.env.PUBLIC_SITE_URL || "https://www.mambylysolutions.se").replace(/\/$/, "");

type PageMeta = { route: string; title: string; description: string; image: string; noindex?: boolean };

const escapeAttr = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function setMeta(html: string, attr: "name" | "property", key: string, value: string) {
  const re = new RegExp(`<meta\\s+${attr}="${key}"\\s+content="[^"]*"\\s*/?>`);
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

export function renderRouteHtml(html: string, page: PageMeta): string {
  const url = `${SITE}${page.route}`;
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

function collectPages(root: string): PageMeta[] {
  const pages: PageMeta[] = [
    {
      route: "/digital-card",
      title: "Digitala visitkort – Mambyly Solutions",
      description: "Ett interaktivt digitalt visitkort med egen länk och QR-kod. Den som öppnar länken ser kortet direkt i webbläsaren – utan app.",
      image: "/brand/digital-card-og.png",
    },
  ];
  const dir = path.join(root, "src/public/digital-card/cards");
  for (const slug of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
    const file = path.join(dir, slug, "card.json");
    if (!fs.existsSync(file) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) continue;
    const card = JSON.parse(fs.readFileSync(file, "utf8"));
    if (card.slug !== slug) continue;
    const title = card.meta?.title || [card.name, card.company].filter(Boolean).join(" – ");
    pages.push({
      // MambyLy's own card lives at /card (see COMPANY_CARD_SLUG in src/public/digital-card/registry.ts)
      route: slug === "mambyly-solutions" ? "/card" : `/card/${slug}`,
      title,
      description: card.meta?.description || `Digitalt visitkort: ${card.name}`,
      image: fs.existsSync(path.join(root, "public/cards", slug, "og.png")) ? `/cards/${slug}/og.png` : "/brand/digital-card-og.png",
      noindex: card.demo === true,
    });
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
      for (const page of collectPages(root)) {
        const target = path.join(outDir, page.route.slice(1), "index.html");
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.writeFileSync(target, renderRouteHtml(html, page));
      }
    },
  };
}
