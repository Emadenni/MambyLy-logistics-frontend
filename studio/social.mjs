// Still PNGs of the real card for social media, into studio/out/social/. Local only.
//
//   npm run studio:social
//
// Every request that does not go to the local studio server is blocked.
import { existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "vite";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, "out", "social");
const HOST = "studio.localhost";
const MAKLARE = "demo-maklare";
const DESIGNS = { "alex-lind": "ivory", "sam-berg": "velvet", "robin-ek": "white", "kim-dahl": "oxblood", "charlie-holm": "graphite", "jamie-lund": "expressive" };
const SIDES = ["front", "back"];

/**
 * width × output = 1600 px for the images of one card; a mockup is 1080 × 1350. Layers in perspective
 * or under a scale are not re-rasterised for it: those are captured larger (scale) and reduced.
 */
const shots = [
  ...Object.entries(DESIGNS).flatMap(([card, design]) =>
    SIDES.map((side) => ({ name: `${card}-${design}-${side}`, query: { scene: "card", card }, side, width: 400, height: 300, scale: 4, output: 4 })),
  ),
  ...SIDES.map((side) => ({ name: `${MAKLARE}-${side}`, query: { scene: "card", card: MAKLARE }, side, width: 400, height: 300, scale: 4, output: 4 })),
  ...SIDES.map((side) => ({ name: `${MAKLARE}-tilt-${side}`, query: { scene: "tilt", card: MAKLARE }, side, width: 800, height: 550, scale: 4, output: 2 })),
  ...[["ivory", "#f6f4ee"], ["green", "#103b35"]].map(([name, bg]) => ({ name: `${MAKLARE}-phone-${name}`, query: { scene: "phone", bg, card: MAKLARE }, side: "front", width: 1080, height: 1350, scale: 3, output: 1 })),
];

/** Playwright's own Chromium when installed, otherwise a local Chrome (STUDIO_CHROME overrides). */
function browserPath() {
  const candidates = [
    process.env.STUDIO_CHROME,
    chromium.executablePath(),
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ];
  const found = candidates.find((p) => p && existsSync(p));
  if (!found) throw new Error("No Chromium found: run `npx playwright install chromium` or set STUDIO_CHROME.");
  return found;
}

mkdirSync(outDir, { recursive: true });
const server = await createServer({ configFile: join(here, "vite.config.ts"), server: { port: 5182, strictPort: false }, logLevel: "warn" });
await server.listen();
const { port } = server.httpServer.address();
const browser = await chromium.launch({
  executablePath: browserPath(),
  args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1`, "--hide-scrollbars", "--font-render-hinting=none"],
});

const blocked = [];
try {
  for (const shot of shots) {
    const context = await browser.newContext({
      viewport: { width: shot.width, height: shot.height },
      deviceScaleFactor: shot.scale,
      locale: "sv-SE",
      colorScheme: "light",
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.route("**/*", (route) => {
      const url = new URL(route.request().url());
      if (url.hostname === HOST) return route.continue();
      blocked.push(url.href);
      return route.abort();
    });
    page.on("pageerror", (e) => console.error("[page]", e.message));
    await page.goto(`http://${HOST}:${port}/social.html?${new URLSearchParams(shot.query)}`);

    // The real controls, clicked from script: no pointer, so no hover tilt and no focus ring.
    const press = (frame, selector) => frame.locator(selector).first().evaluate((el) => el.click());
    const frame = shot.query.scene === "phone" ? page.frameLocator("iframe") : page;
    await frame.locator(".dc__stage").first().waitFor();
    if (shot.query.scene === "phone") {
      await press(frame, ".dc-full__opener button");
      await frame.locator(".dc-experience.is-full").waitFor();
    }
    if (shot.side === "back") await press(frame, ".dc-actions [aria-pressed]");
    await page.waitForTimeout(900);
    if (shot.query.scene === "phone") await frame.locator(".dc-full__close").evaluate((el) => el.blur());
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
    });

    // Whole CSS pixels (85 × 55 at 400 px is 258.8 high): rounded up, or the card's bottom edge is cut.
    const box = shot.query.scene === "card" ? await page.locator(".dc__stage").first().boundingBox() : null;
    const clip = box ? { x: box.x, y: box.y, width: box.width, height: Math.ceil(box.height) } : undefined;
    const path = join(outDir, `${shot.name}.png`);
    const png = await page.screenshot({ path: shot.scale === shot.output ? path : undefined, clip, omitBackground: true, animations: "disabled", caret: "hide" });
    await context.close();
    if (shot.scale !== shot.output) {
      // Reduced by the browser: it scales with premultiplied alpha, so no dark fringe on the card's edge.
      const small = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: shot.output });
      const view = await small.newPage();
      await view.setContent(`<!doctype html><body style="margin:0;background:transparent"><img style="display:block;width:${shot.width}px;height:${shot.height}px" src="data:image/png;base64,${png.toString("base64")}">`);
      await view.locator("img").evaluate((img) => img.decode());
      await view.screenshot({ path, omitBackground: true });
      await small.close();
    }
    console.log(path);
  }
} finally {
  await browser.close();
  await server.close();
}
console.log(`blocked requests: ${blocked.length}${blocked.length ? `\n  ${[...new Set(blocked)].join("\n  ")}` : ""}`);
if (blocked.length) process.exitCode = 1;
