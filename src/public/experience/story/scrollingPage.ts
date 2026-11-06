import { useEffect, useState } from "react";
import * as THREE from "three";

/**
 * A full-page website picture shown through a screen: the texture repeats only the part of the page
 * that fits the screen, and `scrollPage` moves that window down the page and back, slowly, with a
 * pause at the top and at the bottom, as if someone were reading it.
 */
export const useScrollingPage = (src: string, page: { w: number; h: number }, screenAspect: number) => {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    new THREE.TextureLoader().load(src, (t) => {
      if (!live) return t.dispose();
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      t.repeat.set(1, Math.min(1, page.w / screenAspect / page.h));
      t.offset.set(0, 1 - t.repeat.y);
      setMap((old) => {
        old?.dispose();
        return t;
      });
    });
    return () => {
      live = false;
    };
  }, [src, page.w, page.h, screenAspect]);
  useEffect(() => () => map?.dispose(), [map]);
  return map;
};

/** Seconds for one way down the page; the pauses at both ends are a share of it. */
const DOWN = 14;
const PAUSE = 0.18;

/** Moves the visible window of the page (0 = top) at time `t`, starting a little later with `delay`. */
export const scrollPage = (map: THREE.Texture | null, t: number, delay = 0) => {
  if (!map) return;
  const cycle = (Math.max(0, t - delay) / DOWN) % 2;
  const leg = cycle < 1 ? cycle : 2 - cycle;
  const eased = Math.min(1, Math.max(0, (leg - PAUSE) / (1 - 2 * PAUSE)));
  const smooth = eased * eased * (3 - 2 * eased);
  map.offset.y = (1 - map.repeat.y) * (1 - smooth);
};
