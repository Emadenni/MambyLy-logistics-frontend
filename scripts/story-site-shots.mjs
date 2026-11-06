// Full-page screenshots of MambyLy's own architecture demo, saved as WebP for the scrolling website
// of the explore story (chapter 5). Start a local dev server (npx vite --port 5190) in another
// terminal, then: node scripts/story-site-shots.mjs
// Only requests to that server are let through; nothing leaves the machine.
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
const { chromium } = createRequire(import.meta.url)("playwright");
const OUT = fileURLToPath(new URL("../public/media/mambyly", import.meta.url));
const BASE = process.env.STORY_SHOTS_BASE || "http://127.0.0.1:5190";
const pages = {
  sv: "/webbplatser/koncept/arkitektur",
  en: "/en/websites/concepts/architecture",
};
const shots = [
  { kind: "desktop", w: 1280, h: 800, mobile: false, widths: [1280, 640] },
  { kind: "mobile", w: 390, h: 844, mobile: true, widths: [390] },
];

const b = await chromium.launch({ channel: "chrome" });
for (const shot of shots) {
  const c = await b.newContext({ viewport: { width: shot.w, height: shot.h }, isMobile: shot.mobile, hasTouch: shot.mobile, deviceScaleFactor: 1 });
  await c.addInitScript(() => {
    try {
      localStorage.setItem("cookieConsent", '{"essential":true,"analytics":false,"marketing":false}');
    } catch {}
  });
  await c.route("**/*", (r) => (r.request().method() === "GET" && r.request().url().startsWith(BASE) ? r.continue() : r.abort()));
  const p = await c.newPage();
  for (const [lang, path] of Object.entries(pages)) {
    await p.goto(BASE + path, { waitUntil: "networkidle" });
    await p.addStyleTag({ content: ".mp-exit{display:none!important} *{scroll-behavior:auto!important}" });
    // walk down the page so everything that appears on scroll has appeared, then back to the top
    const height = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y <= height; y += Math.round(shot.h * 0.6)) {
      await p.evaluate((v) => window.scrollTo(0, v), y);
      await p.waitForTimeout(250);
    }
    await p.evaluate(() => window.scrollTo(0, 0));
    await p.waitForTimeout(900);
    const png = await p.screenshot({ fullPage: true, type: "png" });
    for (const width of shot.widths) {
      const webp = await p.evaluate(
        async ([src, width]) => {
          const img = new Image();
          img.src = src;
          await img.decode();
          const h = Math.round((img.height * width) / img.width);
          const cv = document.createElement("canvas");
          cv.width = width;
          cv.height = h;
          const x = cv.getContext("2d");
          x.imageSmoothingQuality = "high";
          x.drawImage(img, 0, 0, width, h);
          return [cv.toDataURL("image/webp", 0.8), h];
        },
        ["data:image/png;base64," + png.toString("base64"), width],
      );
      const file = `${OUT}/scroll-${lang}-architecture-${shot.kind}-${width}.webp`;
      fs.writeFileSync(file, Buffer.from(webp[0].split(",")[1], "base64"));
      console.log(file.split("/").pop(), `${width}x${webp[1]}`, Math.round(fs.statSync(file).size / 1024) + " KB");
    }
  }
  await c.close();
}
await b.close();
