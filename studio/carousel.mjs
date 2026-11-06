// Screens of the real card interface for an Instagram carousel, into studio/out/carousel/. Local only.
//
//   npm run studio:carousel
//
// From the published site, so that the QR code holds the real address of the demo page. Read-only:
// only GET requests to the site pass, nothing is saved or sent. The cookie choice is "only
// necessary", stored in this throwaway browser context.
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "out", "carousel");
const SITE = "https://www.mambylysolutions.se";
const FLIP = ".dc-actions [aria-pressed]";
const QR = ".dc-actions [aria-haspopup='dialog']";
const PANEL = ".dc-sitenav button";

/** Keyboard focus is the button's real highlighted state (a phone has no hover). */
async function focusSave(page) {
  for (let i = 0; i < 30; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement?.classList.contains("dc-save"))) return;
  }
  throw new Error("Spara kontakt never got the focus");
}

/** The real back has no badge: the front's, with the back's colour. A tap's focus ring is left out. */
async function backWithBadge(page) {
  await page.evaluate(() => {
    document.activeElement?.blur();
    const badge = document.querySelector(".dc__face--front .dc__badge").cloneNode(true);
    badge.style.color = "var(--dc-back-accent)";
    document.querySelector(".dc__face--back").append(badge);
  });
}

const shots = [
  { name: "spara-kontakt", slug: "sam-berg", run: focusSave },
  { name: "dela-qr", slug: "sam-berg", tap: QR, wait: ".dc-qr__code" },
  { name: "fram", slug: "kim-dahl" },
  { name: "bak", slug: "kim-dahl", tap: FLIP, run: backWithBadge },
  { name: "tjanster", slug: "kim-dahl", tap: PANEL, wait: ".dc-panel" },
];

mkdirSync(outDir, { recursive: true });
const chrome = [process.env.STUDIO_CHROME, chromium.executablePath(), "C:/Program Files/Google/Chrome/Application/chrome.exe"].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: chrome, args: ["--hide-scrollbars", "--font-render-hinting=none"] });
const blocked = [];
try {
  for (const shot of shots) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true, locale: "sv-SE", colorScheme: "light" });
    await context.addInitScript(() => localStorage.setItem("cookieConsent", JSON.stringify({ essential: true, analytics: false, marketing: false })));
    const page = await context.newPage();
    await page.route("**/*", (route) => {
      const req = route.request();
      const url = new URL(req.url());
      if (url.protocol === "data:" || (url.origin === SITE && req.method() === "GET")) return route.continue();
      blocked.push(`${req.method()} ${url.origin}`);
      return route.abort();
    });
    page.on("pageerror", (e) => console.error("[page]", e.message));
    await page.goto(`${SITE}/exempel/${shot.slug}`, { waitUntil: "networkidle" });
    await page.locator(".dc__stage").waitFor();
    // Past the card's short intro tilt.
    await page.waitForTimeout(1500);
    if (shot.tap) await page.locator(shot.tap).first().tap();
    if (shot.wait) await page.locator(shot.wait).first().waitFor();
    if (shot.run) await shot.run(page);
    await page.waitForTimeout(1000);
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
    });
    const path = join(outDir, `${shot.name}.png`);
    await page.screenshot({ path, caret: "hide" });
    console.log(path);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`blocked requests: ${blocked.length}${blocked.length ? `\n  ${[...new Set(blocked)].join("\n  ")}` : ""}`);
