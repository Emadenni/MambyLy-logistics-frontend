// Records the real site frame by frame, following a copione. Local only, read-only on the site.
//
//   npm run record -- reel-storia
//
// A copione has one take (its own start/actions) or several ("takes"). Output in public/<id>/
// (with takes: public/<id>/<take>/): frames/00000.jpg … and timeline.json (time and coordinates of
// every action, colours of the screen's top and bottom edge).
// Time is controlled as in studio/capture.mjs: Playwright's clock drives timers and rAF, every CSS
// transition/animation is paused at the frame's time. Only GET requests to the site itself pass:
// no analytics, no form can reach the backend. The cookie choice is "only necessary", stored in this
// throwaway browser context before the page loads.
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const name = process.argv[2] ?? "reel-storia";
const only = process.argv[3];
const script = JSON.parse(readFileSync(join(here, "copioni", `${name}.json`), "utf8"));
/** The page: a 390 × 844 screen minus the drawn status bar (54) and address bar (70). */
const VIEWPORT = { width: 390, height: 720 };
const SCALE = 3;

const beatMs = 60000 / script.bpm;
const frameOf = (beat) => Math.round((beat * beatMs * script.fps) / 1000);
const dt = 1000 / script.fps;
const site = new URL(script.site);

const chrome = [process.env.STUDIO_CHROME, chromium.executablePath(), "C:/Program Files/Google/Chrome/Application/chrome.exe"].find((p) => p && existsSync(p));
const browser = await chromium.launch({ executablePath: chrome, args: ["--hide-scrollbars", "--font-render-hinting=none"] });
const blocked = [];

/** Colours of the page's edges in a JPEG: the drawn bars continue them. */
async function edges(file) {
  const page = await browser.newPage();
  const data = `data:image/jpeg;base64,${readFileSync(file).toString("base64")}`;
  const result = await page.evaluate(async (src) => {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement("canvas");
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    const x = c.getContext("2d");
    x.drawImage(img, 0, 0);
    const at = (py) => {
      const [r, g, b] = x.getImageData(c.width >> 1, py, 1, 1).data;
      return { color: `rgb(${r},${g},${b})`, ink: 0.299 * r + 0.587 * g + 0.114 * b > 140 ? "#103b35" : "#f6f4ee" };
    };
    return { top: at(2), bottom: at(c.height - 3) };
  }, data);
  await page.close();
  return result;
}

async function recordTake(take, outDir) {
  const total = frameOf(take.beats);
  const framesDir = join(outDir, "frames");
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });

  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: SCALE, isMobile: true, hasTouch: true, locale: "sv-SE", colorScheme: "light", reducedMotion: "no-preference" });
  await context.addInitScript(() => localStorage.setItem("cookieConsent", JSON.stringify({ essential: true, analytics: false, marketing: false })));
  const page = await context.newPage();
  await page.route("**/*", (route) => {
    const req = route.request();
    const url = new URL(req.url());
    if (url.hostname === site.hostname && req.method() === "GET") return route.continue();
    if (!url.protocol.startsWith("data")) blocked.push(`${req.method()} ${url.origin}`);
    return route.abort();
  });
  page.on("pageerror", (e) => console.error("[page]", e.message));

  // Warm the browser cache and use up the card's one-time intro: no half-loaded page in the take.
  for (const path of [...(take.warm ?? []), take.start]) {
    await page.goto(script.site + path, { waitUntil: "networkidle" });
  }
  await page.clock.install({ time: new Date("2026-01-05T09:00:00Z") });
  await page.goto(script.site + take.start, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    await document.fonts.ready;
    // A lazy image out of view never finishes decoding: all of them load now.
    for (const img of document.images) img.loading = "eager";
  });
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => Promise.all([...document.images].filter((img) => img.complete).map((img) => img.decode().catch(() => undefined))));
  // The grey/blue rectangle of Chrome's emulated tap: the video draws its own touch.
  await page.addStyleTag({ content: `* { -webkit-tap-highlight-color: transparent !important; } ${take.css ?? ""}` });
  await page.clock.pauseAt((await page.evaluate(() => Date.now())) + 3000);

  const cdp = await context.newCDPSession(page);
  const touch = (type, points = []) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints: points });
  const rectOf = (selector) =>
    page.locator(selector).first().evaluate((el) => {
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    });

  const timeline = [];
  const swipes = [];
  const scrolls = [];
  const pending = (take.actions ?? []).map((a) => ({ ...a, frame: frameOf(a.beat) }));

  for (let f = 0; f < total; f++) {
    if (f > 0) await page.clock.runFor(dt);

    for (const a of pending.filter((p) => p.frame === f)) {
      if (a.do === "scroll") {
        scrolls.push({ start: f, frames: frameOf(a.beats ?? 2), dy: a.dy, done: 0 });
        timeline.push({ id: a.id, type: "scroll", frame: f, timeMs: Math.round(f * dt), x: 195, y: 360, rect: { x: 0, y: 0, width: 390, height: 720 } });
        continue;
      }
      await page.locator(a.target).first().waitFor({ state: "attached", timeout: 15000 });
      const rect = await rectOf(a.target);
      const x = rect.x + rect.width / 2;
      const y = rect.y + rect.height / 2;
      const entry = { id: a.id, type: a.do, frame: f, timeMs: Math.round(f * dt), x, y, rect };
      if (a.do === "tap") {
        await touch("touchStart", [{ x, y }]);
        await touch("touchEnd");
        // A panel empties while it fades out: cut on the beat, its backdrop still fades (as in the studio).
        if (a.cut) await page.locator(a.cut).first().evaluate((el) => (el.style.visibility = "hidden"));
        if (a.wait) {
          // The route or dialog appears in real time here (React's own work is not on the fake clock).
          await page.clock.runFor(dt);
          await page.locator(a.wait).first().waitFor({ state: "attached", timeout: 15000 });
        }
      } else if (a.do === "swipe") {
        const frames = Math.round(frameOf(a.beats ?? 1) * 0.6);
        const from = { x: x + (a.dx < 0 ? 90 : -90), y };
        entry.x = from.x;
        entry.path = { dx: a.dx, dy: 0, frames };
        swipes.push({ from, dx: a.dx, start: f, frames });
        await touch("touchStart", [from]);
      }
      timeline.push(entry);
      console.log(`  ${a.id} @${entry.timeMs} ms (${Math.round(entry.x)}, ${Math.round(entry.y)})`);
    }

    // A swipe moves on every frame and ends with its last one.
    for (const s of swipes.filter((s) => f > s.start && f <= s.start + s.frames)) {
      const p = (f - s.start) / s.frames;
      await touch("touchMove", [{ x: s.from.x + s.dx * p, y: s.from.y }]);
      if (p >= 1) await touch("touchEnd");
    }
    // A scroll follows a soft curve, frame by frame.
    for (const s of scrolls.filter((s) => f > s.start && f <= s.start + s.frames)) {
      const p = (f - s.start) / s.frames;
      const to = s.dy * (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
      await page.evaluate((by) => document.scrollingElement.scrollBy({ top: by, behavior: "instant" }), to - s.done);
      s.done = to;
    }

    await page.evaluate(async () => {
      // React effects run in MessageChannel tasks, which the clock does not fake.
      const settle = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
      await settle();
      await settle();
      const now = performance.now();
      const births = (window.__births ??= new WeakMap());
      for (const a of document.getAnimations()) {
        if (!births.has(a)) births.set(a, now);
        const timing = a.effect?.getComputedTiming();
        const elapsed = now - births.get(a);
        a.pause();
        if (timing && Number.isFinite(timing.endTime) && elapsed >= timing.endTime) a.finish();
        else a.currentTime = elapsed;
      }
    });
    await page.screenshot({ path: join(framesDir, `${String(f).padStart(5, "0")}.jpg`), type: "jpeg", quality: 95, animations: "allow", caret: "hide" });
  }
  await context.close();
  const bar = await edges(join(framesDir, "00000.jpg"));
  writeFileSync(join(outDir, "timeline.json"), JSON.stringify({ viewport: VIEWPORT, fps: script.fps, frames: total, bar, actions: timeline }, null, 2));
  console.log(`  ${total} frames`);
}

const t0 = Date.now();
const root = join(here, "public", script.id);
try {
  if (script.takes) {
    for (const take of script.takes) {
      if (only && !only.split(",").includes(take.id)) continue;
      console.log(`take ${take.id}: ${take.start}`);
      await recordTake(take, join(root, take.id));
    }
  } else {
    await recordTake({ ...script, beats: script.outro.beat + 0.5 }, root);
  }
} finally {
  await browser.close();
}
console.log(`${((Date.now() - t0) / 1000).toFixed(0)} s → ${root}`);
console.log(`blocked requests: ${blocked.length}${blocked.length ? `\n  ${[...new Set(blocked)].join("\n  ")}` : ""}`);
