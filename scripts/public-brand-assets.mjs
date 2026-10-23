// Generates static brand assets for the public site into public/ (outputs are committed, so the
// production build does not need Chrome):
//   public/brand/favicon.svg, favicon-32.png, apple-touch-icon.png   restyle icons (admin keeps the old ones)
//   public/brand/digital-card-og.png                                 1200×630 preview for /digital-card
//   public/cards/<slug>/og.png                                       1200×630 preview for each /card/<slug>
// Run: node scripts/public-brand-assets.mjs   (uses a local Chrome/Edge, set CHROME=... if needed)
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, readFileSync, copyFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const chrome = [
  process.env.CHROME,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
].find((p) => p && existsSync(p));
if (!chrome) throw new Error("No Chrome/Edge found (set CHROME=...)");

const tmp = mkdtempSync(join(tmpdir(), "mp-assets-"));
const font = (w) => pathToFileURL(resolve(`src/assets/Poppins/Poppins-${w}.ttf`)).href;
const fontFaces = ["Regular:400", "SemiBold:600", "Bold:700"]
  .map((f) => f.split(":"))
  .map(([n, w]) => `@font-face{font-family:P;src:url(${font(n)});font-weight:${w}}`)
  .join("");

function shot(html, out, width, height, transparent = false) {
  const page = join(tmp, `p${Math.random().toString(36).slice(2)}.html`);
  writeFileSync(page, `<!doctype html><meta charset="utf-8"><style>${fontFaces}html,body{margin:0;width:${width}px;height:${height}px;overflow:hidden}</style>${html}`);
  execFileSync(chrome, [
    "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${width},${height}`, `--screenshot=${resolve(out)}`, "--virtual-time-budget=2000",
    ...(transparent ? ["--default-background-color=00000000"] : []),
    pathToFileURL(page).href,
  ], { stdio: "ignore" });
  console.log("✓", out);
}

mkdirSync("public/brand", { recursive: true });
const icon = readFileSync("src/public/assets/brand-icon.svg", "utf8");
copyFileSync("src/public/assets/brand-icon.svg", "public/brand/favicon.svg");
console.log("✓ public/brand/favicon.svg");
for (const [size, file] of [[32, "favicon-32.png"], [180, "apple-touch-icon.png"]]) {
  shot(`<div style="width:${size}px;height:${size}px">${icon.replace("<svg ", `<svg width="${size}" height="${size}" `)}</div>`, `public/brand/${file}`, size, size, true);
}

const logo = readFileSync("src/public/assets/logo-dark.svg", "utf8").replace("<svg ", '<svg width="230" ');

// Card front, same proportions (85 × 55) and colours as the live component.
const cardFront = (card, logoSvg, width) => {
  const t = card.theme;
  return `<div style="position:relative;width:${width}px;aspect-ratio:85/55;box-sizing:border-box;border-radius:${width * 0.045}px;padding:${width * 0.065}px ${width * 0.07}px;display:flex;flex-direction:column;justify-content:space-between;background:${t.front};color:${t.frontInk};font-family:P,sans-serif;box-shadow:0 40px 70px -30px rgba(16,59,53,.55),0 14px 24px -14px rgba(16,59,53,.4)">
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div style="width:${width * 0.17}px;height:${width * 0.17}px">${logoSvg.replace("<svg ", '<svg width="100%" height="100%" ')}</div>
      ${card.demo ? `<span style="padding:${width * 0.01}px ${width * 0.024}px;border:1px dashed ${t.accent};border-radius:99px;color:${t.accent};font-size:${width * 0.03}px;font-weight:700;letter-spacing:.12em">DEMO</span>` : ""}
    </div>
    <div>
      ${card.company ? `<div style="color:${t.accent};font-size:${width * 0.034}px;font-weight:700;letter-spacing:.14em;text-transform:uppercase">${card.company}</div>` : ""}
      <div style="margin-top:${width * 0.012}px;font-size:${width * 0.076}px;font-weight:700;letter-spacing:-.03em;line-height:1.05">${card.name}</div>
      ${card.role ? `<div style="margin-top:${width * 0.01}px;font-size:${width * 0.04}px;font-weight:600;opacity:.85">${card.role}</div>` : ""}
    </div>
  </div>`;
};

const cardsDir = "src/public/digital-card/cards";
const cards = readdirSync(cardsDir).map((slug) => {
  const card = JSON.parse(readFileSync(join(cardsDir, slug, "card.json"), "utf8"));
  const logoSvg = card.logo ? readFileSync(join(cardsDir, slug, card.logo), "utf8") : "<svg></svg>";
  return { slug, card, logoSvg };
});

const background = "background:radial-gradient(circle at 70% 20%,#fffefa 0,#f6f4ee 55%,#ece8dd 100%)";

for (const { slug, card, logoSvg } of cards) {
  mkdirSync(`public/cards/${slug}`, { recursive: true });
  shot(`<div style="width:1200px;height:630px;display:grid;place-items:center;perspective:1600px;${background}">
    <div style="transform:rotateY(-10deg) rotateX(6deg) rotateZ(-1.5deg)">${cardFront(card, logoSvg, 620)}</div>
  </div>`, `public/cards/${slug}/og.png`, 1200, 630);
}

const demo = cards.find((c) => c.card.demo) ?? cards[0];
shot(`<div style="width:1200px;height:630px;box-sizing:border-box;padding:70px 80px;display:grid;grid-template-columns:1fr 520px;align-items:center;gap:40px;font-family:P,sans-serif;color:#103b35;${background}">
  <div>
    ${logo}
    <div style="margin-top:56px;font-size:20px;font-weight:700;letter-spacing:.18em;color:#247b67">DIGITALA VISITKORT</div>
    <div style="margin-top:14px;font-size:60px;font-weight:700;letter-spacing:-.045em;line-height:1.04">Ditt visitkort,<br>alltid med dig.</div>
    <div style="margin-top:22px;font-size:24px;color:#52645e;line-height:1.4">Egen länk och QR-kod. Öppnas i webbläsaren – utan app.</div>
  </div>
  <div style="perspective:1400px"><div style="transform:rotateY(-14deg) rotateX(6deg) rotateZ(2deg)">${cardFront(demo.card, demo.logoSvg, 500)}</div></div>
</div>`, "public/brand/digital-card-og.png", 1200, 630);

rmSync(tmp, { recursive: true, force: true });
