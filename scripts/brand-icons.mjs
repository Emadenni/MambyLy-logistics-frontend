// Rasterises public/brand/favicon.svg into every icon the site publishes. Local only.
//
//   node scripts/brand-icons.mjs
//
// public/favicon* keep their old file names, since browsers and crawlers ask for them directly.
import { copyFileSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { Resvg, initWasm } from "@resvg/resvg-wasm";

const require = createRequire(import.meta.url);
await initWasm(readFileSync(require.resolve("@resvg/resvg-wasm/index_bg.wasm")));

const pub = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const svg = readFileSync(join(pub, "brand/favicon.svg"), "utf8");
const glyph = svg.match(/<g[\s\S]*<\/g>/)[0];
// Maskable: full bleed, with the glyph inside the safe zone (the central 80%).
const maskable = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#103B35"/><g transform="translate(48 48) scale(0.72) translate(-48 -48)">${glyph}</g></svg>`;
const png = (source, size) => Buffer.from(new Resvg(source, { fitTo: { mode: "width", value: size } }).render().asPng());

const files = [
  ["brand/icon-192.png", svg, 192],
  ["brand/icon-512.png", svg, 512],
  ["brand/icon-maskable-192.png", maskable, 192],
  ["brand/icon-maskable-512.png", maskable, 512],
  ["favicon-16x16.png", svg, 16],
  ["favicon-32x32.png", svg, 32],
  ["favicon-192x192.png", svg, 192],
  ["favicon-512x512.png", svg, 512],
];
for (const [name, source, size] of files) writeFileSync(join(pub, name), png(source, size));

// favicon.ico: PNG images in an ICO container.
const images = [16, 32, 48].map((size) => ({ size, data: png(svg, size) }));
const head = Buffer.alloc(6 + 16 * images.length);
head.writeUInt16LE(1, 2);
head.writeUInt16LE(images.length, 4);
let offset = head.length;
images.forEach(({ size, data }, i) => {
  const at = 6 + 16 * i;
  head[at] = size;
  head[at + 1] = size;
  head.writeUInt16LE(1, at + 4);
  head.writeUInt16LE(32, at + 6);
  head.writeUInt32LE(data.length, at + 8);
  head.writeUInt32LE(offset, at + 12);
  offset += data.length;
});
writeFileSync(join(pub, "favicon.ico"), Buffer.concat([head, ...images.map((i) => i.data)]));
copyFileSync(join(pub, "brand/favicon.svg"), join(pub, "favicon.svg"));

console.log(`${files.length + 2} icons written to ${pub}`);
