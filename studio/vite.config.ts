import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Video studio: a separate Vite app with its own root. It is never part of the site build
 * (`vite build` only starts from the repository's index.html) and is only served locally:
 *   npm run studio            preview in the browser
 *   npm run studio:capture    frames + MP4 into studio/out/ (see capture.mjs)
 */
export default defineConfig({
  root: fileURLToPath(new URL(".", import.meta.url)),
  // Published media (card backgrounds) resolve exactly as on the site.
  publicDir: fileURLToPath(new URL("../public", import.meta.url)),
  plugins: [react()],
  server: { host: "127.0.0.1", port: 5180 },
  build: { outDir: "out/site", emptyOutDir: true },
});
