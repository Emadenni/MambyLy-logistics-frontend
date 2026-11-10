import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import type { WebGLRenderer } from "three";

/**
 * Keeps a 3D layer alive where phones are hard on it.
 * - When the browser takes the GPU context away (memory pressure, a reload that overlaps the old
 *   page's contexts, the app coming back from the background) and later gives it back, the layer is
 *   built again (`onRestore`): its pictures (cards, screens) are drawn again instead of staying blank.
 * - When the page is left for good (reload, navigation) the contexts are let go at once, so the next
 *   page does not start while the old one still holds the GPU.
 */
export function guardContext(gl: WebGLRenderer, onRestore: () => void) {
  const canvas = gl.domElement;
  // without this the browser never offers the context back
  const lost = (e: Event) => e.preventDefault();
  const leave = (e: PageTransitionEvent) => {
    if (e.persisted) return; // kept for Back / Forward: it is checked again on pageshow
    gl.dispose();
    gl.forceContextLoss();
  };
  const back = (e: PageTransitionEvent) => {
    if (e.persisted) onRestore();
  };
  canvas.addEventListener("webglcontextlost", lost);
  canvas.addEventListener("webglcontextrestored", onRestore);
  window.addEventListener("pagehide", leave);
  window.addEventListener("pageshow", back);
  return () => {
    canvas.removeEventListener("webglcontextlost", lost);
    canvas.removeEventListener("webglcontextrestored", onRestore);
    window.removeEventListener("pagehide", leave);
    window.removeEventListener("pageshow", back);
  };
}

/** Inside a <Canvas>: guards its renderer (see guardContext). */
export const ContextGuard: React.FC<{ onRestore: () => void }> = ({ onRestore }) => {
  const gl = useThree((s) => s.gl);
  useEffect(() => guardContext(gl, onRestore), [gl, onRestore]);
  return null;
};
