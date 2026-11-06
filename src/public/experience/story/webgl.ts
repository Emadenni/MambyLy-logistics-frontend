/** WebGL 2 is there (three.js r169 needs it). Checked once per page. */
let cached: boolean | null = null;

export const hasWebGL = () => {
  if (cached !== null) return cached;
  try {
    cached = !!document.createElement("canvas").getContext("webgl2");
  } catch {
    cached = false;
  }
  return cached;
};
