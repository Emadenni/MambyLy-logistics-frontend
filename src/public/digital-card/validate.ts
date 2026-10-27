import type { CardConfig, CardConfigRaw, CardLayout, CardSocialType } from "./types";

const LAYOUTS: CardLayout[] = ["classic", "craft", "split", "frame", "bold"];

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const EMAIL_PATTERN = /^[^\s@<>()"',;:]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i;
const E164_PATTERN = /^\+[1-9]\d{6,14}$/;
const COLOR_PATTERN = /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i;

const SOCIAL_HOSTS: Record<CardSocialType, string[]> = {
  whatsapp: ["wa.me"],
  instagram: ["instagram.com"],
  facebook: ["facebook.com"],
  linkedin: ["linkedin.com"],
  tiktok: ["tiktok.com"],
  youtube: ["youtube.com"],
  x: ["x.com", "twitter.com"],
};

const SOCIAL_LABELS: Record<CardSocialType, string> = {
  whatsapp: "WhatsApp",
  instagram: "Instagram",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  x: "X",
};

export const isValidSlug = (slug: unknown): slug is string =>
  typeof slug === "string" && slug.length <= 60 && SLUG_PATTERN.test(slug);

const text = (value: unknown, max = 120) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : undefined;

/** Only https: URLs; returns a normalised href or undefined. */
export function safeHttpsUrl(value: unknown): URL | undefined {
  if (typeof value !== "string") return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

const hostMatches = (url: URL, hosts: string[]) =>
  hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));

/**
 * Validates a raw card configuration. Invalid or missing optional fields are dropped (and the
 * related element is not rendered); an invalid slug, name or theme makes the whole card invalid.
 */
export function validateCard(raw: CardConfigRaw, assets: { logo?: string; logoBack?: string; photo?: string }): CardConfig | null {
  if (!raw || !isValidSlug(raw.slug) || !text(raw.name)) return null;
  const theme = raw.theme;
  if (!theme || !["front", "frontInk", "accent", "back", "backInk"].every((k) => COLOR_PATTERN.test(String(theme[k as keyof typeof theme])))) {
    return null;
  }

  const phone = typeof raw.phone === "string" && E164_PATTERN.test(raw.phone.replace(/[\s-]/g, ""))
    ? { e164: raw.phone.replace(/[\s-]/g, ""), display: text(raw.phoneDisplay, 30) || raw.phone.trim() }
    : undefined;
  const email = typeof raw.email === "string" && EMAIL_PATTERN.test(raw.email) ? raw.email : undefined;
  const site = safeHttpsUrl(raw.website);

  const socials = (Array.isArray(raw.socials) ? raw.socials : [])
    .map((s) => ({ type: s?.type, url: safeHttpsUrl(s?.url) }))
    .filter((s): s is { type: CardSocialType; url: URL } => !!s.url && s.type in SOCIAL_HOSTS && hostMatches(s.url, SOCIAL_HOSTS[s.type]))
    .map((s) => ({ type: s.type, href: s.url.href, label: SOCIAL_LABELS[s.type] }));

  const details = (Array.isArray(raw.details) ? raw.details : [])
    .map((d) => ({ label: text(d?.label, 40), value: text(d?.value, 80) }))
    .filter((d): d is { label: string; value: string } => !!d.label && !!d.value)
    .slice(0, 3);

  return {
    slug: raw.slug,
    lang: raw.lang === "en" ? "en" : "sv",
    demo: raw.demo === true,
    kind: raw.kind === "organization" ? "organization" : "person",
    name: text(raw.name)!,
    showNameOnFront: raw.showNameOnFront !== false,
    logoShape: raw.logoShape === "wide" ? "wide" : "square",
    logoBackUrl: assets.logoBack ?? (raw.logoShape === "wide" ? undefined : assets.logo),
    role: text(raw.role),
    company: text(raw.company),
    tagline: text(raw.tagline, 90),
    theme: {
      ...theme,
      backAccent: COLOR_PATTERN.test(String(theme.backAccent)) ? theme.backAccent! : theme.accent,
      style: theme.style === "solid" ? "solid" : "paper",
      layout: LAYOUTS.includes(theme.layout as CardLayout) ? (theme.layout as CardLayout) : "classic",
      font: theme.font === "serif" ? "serif" : "sans",
      background: typeof theme.background === "string" && SLUG_PATTERN.test(theme.background) ? theme.background : undefined,
    },
    phone,
    phoneDisplay: text(raw.phoneDisplay, 30),
    email,
    website: site ? { href: site.href, label: site.host.replace(/^www\./, "") + (site.pathname === "/" ? "" : site.pathname) } : undefined,
    socials,
    details,
    logoUrl: assets.logo,
    photoUrl: assets.photo,
    meta: { title: text(raw.meta?.title, 70), description: text(raw.meta?.description, 200) },
    example:
      raw.demo === true && text(raw.example?.sector, 40) && text(raw.example?.summary, 220)
        ? { sector: text(raw.example?.sector, 40)!, summary: text(raw.example?.summary, 220)!, order: Number(raw.example?.order) || 99 }
        : undefined,
  };
}
