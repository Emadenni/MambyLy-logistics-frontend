// Frame-by-frame capture of a studio format, then an MP4 with ffmpeg-static. Local only.
//
//   npm run studio:capture -- --format fran-papper-till-digitalt --variant all|reel|story|… [--from ms --to ms]
//
// Output in studio/out/<format>/: <variant>.mp4, <variant>-sheet.png (one frame every 0.5 s,
// left to right), cover.png (format.cover) and the PNG frames in frames/<variant>/.
//
// Time is controlled, not recorded: Playwright's clock drives timers and requestAnimationFrame,
// and every CSS transition/animation on the page (document.getAnimations()) is paused and set
// to the exact time of the frame. Same config → same frames, none dropped or doubled.
// Every request that does not go to the local studio server is blocked.
import { spawn } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { createServer } from "vite";
import { chromium } from "playwright";
import ffmpeg from "ffmpeg-static";

const here = dirname(fileURLToPath(import.meta.url));
const { values: args } = parseArgs({
  options: {
    format: { type: "string", default: "fran-papper-till-digitalt" },
    variant: { type: "string", default: "all" },
    from: { type: "string", default: "0" },
    to: { type: "string" },
  },
});

const HOST = "studio.localhost";

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

function run(argv) {
  return new Promise((resolve, reject) => {
    const p = spawn(ffmpeg, ["-y", "-loglevel", "error", ...argv], { stdio: "inherit" });
    p.on("error", reject);
    p.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg exited with ${code}`))));
  });
}

/** H.264 High, yuv420p, BT.709, no audio track: what Instagram and TikTok expect. */
const encode = (framesDir, fps, file) =>
  run([
    "-framerate", String(fps), "-i", join(framesDir, "%05d.png"),
    "-vf", "scale=out_color_matrix=bt709:out_range=tv,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-profile:v", "high", "-level", "4.2",
    "-colorspace", "bt709", "-color_primaries", "bt709", "-color_trc", "bt709",
    "-r", String(fps), "-movflags", "+faststart", "-an",
    file,
  ]);

/** One frame every half second (a beat at 120 BPM), as one picture to review. */
function contactSheet(video, fps, frames, file) {
  const step = Math.round(fps / 2);
  const cols = 8;
  const rows = Math.ceil(frames / step / cols);
  return run(["-i", video, "-vf", `select='not(mod(n\\,${step}))',scale=270:480,tile=${cols}x${rows}:padding=4`, "-frames:v", "1", "-fps_mode", "passthrough", file]);
}

const server = await createServer({ configFile: join(here, "vite.config.ts"), server: { port: 5181, strictPort: false }, logLevel: "warn" });
await server.listen();
const { port } = server.httpServer.address();
const browser = await chromium.launch({
  executablePath: browserPath(),
  // studio.localhost, so the card does not show its "running on localhost" note.
  args: [`--host-resolver-rules=MAP ${HOST} 127.0.0.1`, "--hide-scrollbars", "--font-render-hinting=none"],
});

async function capture(variant) {
  const context = await browser.newContext({ deviceScaleFactor: 2, locale: "sv-SE", colorScheme: "light", reducedMotion: "no-preference" });
  const page = await context.newPage();
  const blocked = [];
  await page.route("**/*", (route) => {
    const url = new URL(route.request().url());
    if (url.hostname === HOST) return route.continue();
    blocked.push(url.href);
    return route.abort();
  });
  page.on("pageerror", (e) => console.error("[page]", e.message));

  await page.clock.install({ time: new Date("2026-01-05T09:00:00Z") });
  const query = new URLSearchParams({ format: args.format, variant, capture: "1" });
  await page.goto(`http://${HOST}:${port}/?${query}`);
  await page.waitForFunction(() => !!window.studio);
  const meta = await page.evaluate(() => ({ ...window.studio.format, layers: undefined, actions: undefined }));
  await page.setViewportSize({ width: meta.width, height: meta.height });
  await page.evaluate(() => window.studio.ready());
  const start = await page.evaluate(() => Date.now());
  await page.clock.pauseAt(start + 1000);

  const fps = meta.fps;
  const dt = 1000 / fps;
  const total = Math.round((meta.duration * fps) / 1000);
  const first = Math.round((Number(args.from) * fps) / 1000);
  const last = args.to ? Math.round((Number(args.to) * fps) / 1000) : total;
  const name = first > 0 || last < total ? `${variant}-${args.from}-${args.to}ms` : variant;
  const outDir = join(here, "out", meta.id);
  const framesDir = join(outDir, "frames", name);
  rmSync(framesDir, { recursive: true, force: true });
  mkdirSync(framesDir, { recursive: true });
  const cover = meta.cover?.variant === variant ? Math.round((meta.cover.at * fps) / 1000) : -1;

  const t0 = Date.now();
  for (let f = 0; f < last; f++) {
    if (f > 0) await page.clock.runFor(dt);
    await page.evaluate(async (t) => {
      // React effects run in MessageChannel tasks, which the clock does not fake.
      const settle = () => new Promise((r) => { const c = new MessageChannel(); c.port1.onmessage = () => r(); c.port2.postMessage(0); });
      window.studio.seek(t);
      await settle();
      await settle();
      // Every running CSS transition/animation: paused at the frame's own time.
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
    }, f * dt);
    if (f >= first) {
      const png = join(framesDir, `${String(f - first).padStart(5, "0")}.png`);
      await page.screenshot({ path: png, animations: "allow", caret: "hide" });
      if (f === cover) copyFileSync(png, join(outDir, "cover.png"));
    }
    if (f % 30 === 0) process.stdout.write(`\r${variant}: frame ${f}/${last}`);
  }
  process.stdout.write(`\r${variant}: ${last - first} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s\n`);
  await context.close();

  const file = join(outDir, `${name}.mp4`);
  await encode(framesDir, fps, file);
  await contactSheet(file, fps, last - first, join(outDir, `${name}-sheet.png`));
  console.log(`video  ${file}`);
  console.log(`blocked requests: ${blocked.length}${blocked.length ? `\n  ${blocked.join("\n  ")}` : ""}`);
  if (blocked.length) process.exitCode = 1;
}

/** The variant names of the format (for --variant all). */
async function variantsOf(format) {
  const page = await browser.newPage();
  await page.route("**/*", (route) => (new URL(route.request().url()).hostname === HOST ? route.continue() : route.abort()));
  await page.goto(`http://${HOST}:${port}/?format=${encodeURIComponent(format)}&capture=1`);
  await page.waitForFunction(() => !!window.studio);
  const list = await page.evaluate(() => Object.keys(window.studio.format.variants));
  await page.close();
  return list;
}

try {
  const variants = args.variant === "all" ? await variantsOf(args.format) : [args.variant];
  for (const v of variants) await capture(v);
} finally {
  await browser.close();
  await server.close();
}
