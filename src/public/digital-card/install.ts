/**
 * "Add to Home Screen" for one card. The browser decides whether installing is possible, so nothing
 * here claims more than it knows: the native prompt is used only if the browser offered it for this
 * card's manifest, and every other case gets instructions.
 */
interface InstallPromptEvent extends Event {
  prompt: () => Promise<unknown>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export type PromptResult = "accepted" | "dismissed" | "unavailable" | "installed";
export type GuideKind = "ios-safari" | "ios-browser" | "in-app" | "android" | "desktop";

export const SITE_APPLE_ICON = "/brand/apple-touch-icon.png";

export const cardIconDir = (slug: string) => `/cards/${slug}`;
/** One manifest per address of the card: /en/… has its own, every other address the "sv" one. */
export const cardManifestPath = (slug: string, route: string) => `${cardIconDir(slug)}/${/^\/en(\/|$)/.test(route) ? "en" : "sv"}.webmanifest`;

const manifestHref = () => document.querySelector<HTMLLinkElement>('link[rel="manifest"]')?.getAttribute("href") ?? "";

let deferred: { event: InstallPromptEvent; manifest: string; at: number } | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());

/** The offer is for the card on screen: one reached through the router may still hold another's. */
export const hasOffer = () => !!deferred && deferred.manifest === manifestHref();
export const offerTime = () => (deferred ? Math.round(deferred.at) : null);
export function onOfferChange(listener: () => void) {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

/** Only Chromium browsers ever send the event: elsewhere there is nothing to wait for. */
export const canOffer = () => typeof window !== "undefined" && "BeforeInstallPromptEvent" in window;

/**
 * Chrome sends the event when its own checks are done, which on a phone can be after the visitor's
 * first tap. prompt() needs the tap's activation, which lasts about 5 seconds, so a tap waits a little.
 */
const OFFER_WAIT = 3500;
function waitForOffer() {
  return new Promise<boolean>((resolve) => {
    if (hasOffer()) return resolve(true);
    if (!canOffer()) return resolve(false);
    const done = (value: boolean) => {
      window.clearTimeout(timer);
      stop();
      resolve(value);
    };
    const timer = window.setTimeout(() => done(false), OFFER_WAIT);
    const stop = onOfferChange(() => {
      if (hasOffer()) done(true);
    });
  });
}

/** Chrome on Android can tell that this card is already installed (see related_applications). */
async function alreadyInstalled() {
  const nav = navigator as Navigator & { getInstalledRelatedApps?: () => Promise<unknown[]> };
  try {
    return !!nav.getInstalledRelatedApps && (await nav.getInstalledRelatedApps()).length > 0;
  } catch {
    return false;
  }
}

// Registered when the bundle loads, because the event can fire before React has mounted.
if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    const manifest = manifestHref();
    if (!manifest.startsWith("/cards/")) return;
    e.preventDefault();
    deferred = { event: e as InstallPromptEvent, manifest, at: performance.now() };
    notify();
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    notify();
  });
}

/** Must be called inside the click handler. The event is single-use once the prompt has opened. */
export async function promptInstall(): Promise<PromptResult> {
  if (!hasOffer()) {
    if (await alreadyInstalled()) return "installed";
    if (!(await waitForOffer())) return "unavailable";
  }
  const offer = deferred!;
  try {
    await offer.event.prompt();
  } catch {
    // Refused (the tap's activation ran out): the offer is still good for the next tap.
    return "unavailable";
  }
  deferred = null;
  notify();
  try {
    return (await offer.event.userChoice).outcome;
  } catch {
    return "dismissed";
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
