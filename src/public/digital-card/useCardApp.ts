import { useEffect } from "react";
import type { CardConfig } from "./types";
import { SITE_APPLE_ICON, SITE_MANIFEST, cardIconDir, cardManifestPath, isStandalone } from "./install";

const setHeadTag = (selector: string, create: () => HTMLElement, attr: string, value: string) => {
  let el = document.head.querySelector<HTMLElement>(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  // Unchanged stays untouched: a new manifest address restarts Chrome's install checks.
  if (el.getAttribute(attr) !== value) el.setAttribute(attr, value);
};

const metaTag = (name: string) => () => {
  const meta = document.createElement("meta");
  meta.name = name;
  return meta;
};

const shortAppName = (card: CardConfig) => {
  if (card.kind === "organization") return card.name.split(/\s+/)[0];
  if (card.name.length <= 12) return card.name;
  const [first, ...rest] = card.name.split(/\s+/);
  return rest.length ? `${first[0]}. ${rest.join(" ")}` : card.name;
};

/**
 * The page's manifest and Apple tags follow the card, also when it was reached through the router
 * (the card's static HTML already has them). Leaving the card hands them back to the site.
 */
export function useCardHead(card: CardConfig) {
  useEffect(() => {
    setHeadTag('link[rel="manifest"]', () => Object.assign(document.createElement("link"), { rel: "manifest" }), "href", cardManifestPath(card.slug, window.location.pathname));
    setHeadTag('link[rel="apple-touch-icon"]', () => Object.assign(document.createElement("link"), { rel: "apple-touch-icon" }), "href", `${cardIconDir(card.slug)}/apple-touch-icon.png`);
    setHeadTag('meta[name="apple-mobile-web-app-capable"]', metaTag("apple-mobile-web-app-capable"), "content", "yes");
    setHeadTag('meta[name="apple-mobile-web-app-title"]', metaTag("apple-mobile-web-app-title"), "content", shortAppName(card));
    return () => {
      document.head.querySelector('link[rel="manifest"]')?.setAttribute("href", SITE_MANIFEST);
      document.head.querySelector('link[rel="apple-touch-icon"]')?.setAttribute("href", SITE_APPLE_ICON);
      document.head.querySelector('meta[name="apple-mobile-web-app-capable"]')?.remove();
      document.head.querySelector('meta[name="apple-mobile-web-app-title"]')?.remove();
    };
  }, [card]);
}

/**
 * Installed, the card has no Back button: links that leave the card open in the browser, and the
 * app stays on the card. External links already open a new tab; the contact file is not a page.
 */
export function useLinksOutOfApp() {
  useEffect(() => {
    if (!isStandalone()) return;
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.<HTMLAnchorElement>("a[href]");
      if (!a || a.target) return;
      const to = new URL(a.href, window.location.href);
      if (to.origin !== window.location.origin || to.pathname === window.location.pathname || to.pathname.endsWith(".vcf")) return;
      e.preventDefault();
      e.stopPropagation();
      window.open(to.href, "_blank", "noopener");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
}
