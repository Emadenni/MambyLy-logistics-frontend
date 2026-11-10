// MambyLy Guide: adds a real place. Creates public/guide-data/<slug>/place.json from the demo (to be
// filled in with the place's own texts) and prints the address of each point, to write on its NFC
// tag and encode in its QR code. See docs/MAMBYLY-TOOLS.md.
//   node scripts/guide-new-place.mjs <slug>
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: node scripts/guide-new-place.mjs <slug>   (slug: lowercase letters, digits and dashes)");
  process.exit(1);
}
const dir = path.join(root, "public", "guide-data", slug);
if (fs.existsSync(dir)) {
  console.error(`public/guide-data/${slug} already exists.`);
  process.exit(1);
}

const place = JSON.parse(fs.readFileSync(path.join(root, "public", "guide-data", "hembygdsgard", "place.json"), "utf8"));
place.slug = slug;
delete place.demo;
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, "place.json"), JSON.stringify(place, null, 2) + "\n");

console.log(`Created public/guide-data/${slug}/place.json (copied from the demo: replace its name, texts, hours and points).`);
console.log(`Start page: https://www.mambylysolutions.se/guide/${slug}`);
console.log("Address of each point, for its NFC tag and QR code (change the ids when you change the points):");
for (const p of place.points) console.log(`  https://www.mambylysolutions.se/guide/${slug}/${p.id}`);
console.log("Photos and recordings: put the files in the same folder and refer to them as /guide-data/<slug>/<file> (photo.src, audio.sv…).");
