/**
 * "Add to Home Screen" for one card. The browser decides whether installing is possible, so nothing
 * here claims more than it knows: the native prompt is used only if the browser offered it for this
 * card's manifest, and every other case gets instructions. There is no reliable "already installed"
 * check, so none is made.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<unknown>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type PromptResult = "accepted" | "dismissed" | "unavailable";
export type GuideKind = "ios-safari" | "ios-browser" | "in-app" | "android" | "desktop";

export const SITE_MANIFEST = "/manifest.json";
export const SITE_APPLE_ICON = "/brand/apple-touch-icon.png";

export const cardIconDir = (slug: string) => `/cards/${slug}`;
/** One manifest per address of the card: /en/… has its own, every other address the "sv" one. */
export const cardManifestPath = (slug: string, route: string) => `${cardIconDir(slug)}/${/^\/en(\/|$)/.test(route) ? "en" : "sv"}.webmanifest`;

const manifestHref = () => document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.getAttribute("href") ?? "";

let deferred: { event: InstallPromptEvent; manifest: string } | null = null;

// Registered when the bundle loads, because the event can fire before React has mounted. The site's
// own manifest keeps the browser's default behaviour: only a card's prompt waits for our button.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    const manifest = manifestHref();
    if (!manifest.startsWith("/cards/")) return;
    e.preventDefault();
    deferred = { event: e as InstallPromptEvent, manifest };
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
  });
}

/** Must be called inside the click handler. The event is single-use, so it is always cleared. */
export async function promptInstall(): Promise<PromptResult> {
  const offer = deferred;
  // An offer made for another card (reached through the router) would install the wrong one.
  if (!offer || offer.manifest !== manifestHref()) return "unavailable";
  deferred = null;
  try {
    await offer.event.prompt();
    return (await offer.event.userChoice).outcome;
  } catch {
    return "unavailable";
  }
}

export function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  const iosStandalone = (navigator as Navigator & { standalone?: boolean }).standalone === true;
  return iosStandalone || !!window.matchMedia?.("(display-mode: standalone)").matches;
}

const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|LinkedInApp|TikTok|musical_ly|Bytedance|Snapchat|Twitter|MicroMessenger|Pinterest|Line\/|GSA\/|; wv\)/i;

export function guideKind(ua = navigator.userAgent, platform = navigator.platform, touchPoints = navigator.maxTouchPoints): GuideKind {
  // iPadOS reports itself as a Mac, but Macs have no multi-touch screen.
  const ios = /iPad|iPhone|iPod/.test(ua) || (platform === "MacIntel" && touchPoints > 1);
  // On iOS a real browser always has the Safari token; embedded web views do not.
  if (IN_APP.test(ua) || (ios && !/Safari\//.test(ua))) return "in-app";
  if (ios) return /CriOS|FxiOS|EdgiOS|OPiOS|OPT\/|Ddg\//.test(ua) ? "ios-browser" : "ios-safari";
  return /Android/i.test(ua) ? "android" : "desktop";
}
