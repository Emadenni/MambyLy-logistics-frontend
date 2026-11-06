// Edits a recorded copione with Remotion: MP4, cover and two review sheets. Local only.
//
//   npm run render -- reel-navigazione
//
// Output in studio/out/: the names in the copione's "output", and <id>-sheet.png (one frame every 0.5 s).
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bundle } from "@remotion/bundler";
import { renderMedia, renderStill, selectComposition } from "@remotion/renderer";

const here = dirname(fileURLToPath(import.meta.url));
const name = process.argv[2] ?? "reel-navigazione";
const copione = join(here, "copioni", `${name}.json`);
const script = JSON.parse(readFileSync(copione, "utf8"));
const out = join(here, "..", "out");
const repo = join(here, "..", "..");

// The brand's own files: the Poppins of the site and the real logo.
const brand = join(here, "public", "brand");
mkdirSync(brand, { recursive: true });
for (const w of ["Medium", "SemiBold", "Bold"]) copyFileSync(join(repo, "src/assets/Poppins", `Poppins-${w}.ttf`), join(brand, `Poppins-${w}.ttf`));
for (const logo of ["logo-dark.svg", "logo-light.svg"]) copyFileSync(join(repo, "src/public/assets", logo), join(brand, logo));
copyFileSync(join(repo, "src/public/assets/fonts/newsreader-latin-wght-normal.woff2"), join(brand, "newsreader.woff2"));
mkdirSync(join(here, "public", script.id), { recursive: true });
copyFileSync(copione, join(here, "public", script.id, "script.json"));
if (script.recording) copyFileSync(join(here, "copioni", `${script.recording}.json`), join(here, "public", script.recording, "script.json"));

const serveUrl = await bundle({ entryPoint: join(here, "src/index.ts"), publicDir: join(here, "public") });
const inputProps = { name: script.id };
const composition = await selectComposition({ serveUrl, id: script.scenes ? "Story" : "Reel", inputProps });

const video = join(out, script.output.video);
let last = -1;
await renderMedia({
  composition,
  serveUrl,
  inputProps,
  codec: "h264",
  crf: 16,
  x264Preset: "slow",
  pixelFormat: "yuv420p",
  colorSpace: "bt709",
  muted: true,
  enforceAudioTrack: false,
  imageFormat: "jpeg",
  jpegQuality: 96,
  concurrency: Number(process.env.REEL_CONCURRENCY) || null,
  outputLocation: video,
  onProgress: ({ progress }) => {
    const p = Math.floor(progress * 10);
    if (p !== last) console.log(`${p * 10}%`);
    last = p;
  },
});
await renderStill({ composition, serveUrl, inputProps, output: join(out, script.output.cover), frame: Math.round((script.coverBeat * 60 * script.fps) / script.bpm), imageFormat: "png" });

const ffmpeg = join(repo, "node_modules/ffmpeg-static/ffmpeg.exe");
const step = Math.round((60 * script.fps) / script.bpm);
spawnSync(ffmpeg, ["-y", "-loglevel", "error", "-i", video, "-vf", `select='not(mod(n\\,${step}))',scale=216:384,tile=9x${Math.ceil(script.beats / 9)}:padding=4`, "-frames:v", "1", "-fps_mode", "passthrough", join(out, `${script.id}-sheet.png`)], { stdio: "inherit" });
console.log(video);
