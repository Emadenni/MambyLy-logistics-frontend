// Single frames of a copione, for a quick look without rendering the video.
//
//   npm run stills -- reel-storia <output folder> 45 120 300
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";

const here = dirname(fileURLToPath(import.meta.url));
const [name, out, ...frames] = process.argv.slice(2);
const copione = join(here, "copioni", `${name}.json`);
const script = JSON.parse(readFileSync(copione, "utf8"));
copyFileSync(copione, join(here, "public", script.id, "script.json"));
if (script.recording) copyFileSync(join(here, "copioni", `${script.recording}.json`), join(here, "public", script.recording, "script.json"));
mkdirSync(out, { recursive: true });

const serveUrl = await bundle({ entryPoint: join(here, "src/index.ts"), publicDir: join(here, "public") });
const inputProps = { name: script.id };
const composition = await selectComposition({ serveUrl, id: "Story", inputProps });
let n = 0;
for (const frame of frames) {
  await renderStill({ composition, serveUrl, inputProps, frame: Number(frame), output: join(out, `${String(n++).padStart(2, "0")}.png`), imageFormat: "png", scale: 0.4 });
}
console.log(`${n} stills → ${out}`);
