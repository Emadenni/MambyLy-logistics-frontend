// MambyLy Stay: adds a real house. Creates public/stay-data/<slug>/<key>.json from a demo (to be
// filled in with the host's details) with a new secret key, and prints the link for the NFC tag
// and the QR code. See docs/MAMBYLY-TOOLS.md.
//   node scripts/stay-new-house.mjs <slug> [stuga|city]
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [slug, template = "stuga"] = process.argv.slice(2);
if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: node scripts/stay-new-house.mjs <slug> [stuga|city]   (slug: lowercase letters, digits and dashes)");
  process.exit(1);
}
if (!["stuga", "city"].includes(template)) {
  console.error('Template must be "stuga" or "city".');
  process.exit(1);
}
const dir = path.join(root, "public", "stay-data", slug);
if (fs.existsSync(dir)) {
  console.error(`public/stay-data/${slug} already exists.`);
  process.exit(1);
}

// 18 random bytes → 24 characters, letters, digits, - and _ (fits the page's key check)
const key = crypto.randomBytes(18).toString("base64url");
const demo = template === "city" ? "stadsvaningen-linkoping" : "sjostugan-vid-roxen";
const house = JSON.parse(fs.readFileSync(path.join(root, "public", "stay-data", demo, "demo.json"), "utf8"));
house.slug = slug;
delete house.demo;
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, `${key}.json`), JSON.stringify(house, null, 2) + "\n");

console.log(`Created public/stay-data/${slug}/${key}.json (copied from the ${template} demo: replace its texts and details).`);
console.log(`Link for the NFC tag and the QR code:\n  https://www.mambylysolutions.se/stay/${slug}?k=${key}`);
