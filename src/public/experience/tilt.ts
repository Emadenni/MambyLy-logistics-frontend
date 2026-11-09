import { useEffect, useRef } from "react";

/**
 * A 3D lean for demo objects (cards, website frames). Writes CSS variables on the element and lets
 * CSS do the rest:
 *   --rx / --ry  the lean, in degrees (towards the pointer; on touch screens, with the place on screen)
 *   --gx / --gy  where the light falls on it, in % (for a glare layer)
 *   --hover      1 while the pointer is over it, else 0
 * Nothing moves with reduced motion. One listener per element, updates in an animation frame.
 */
export const useTilt = <T extends HTMLElement>({ max = 10, scroll = 6 }: { max?: number; scroll?: number } = {}) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let px: number | null = null;
    let py: number | null = null;
    const apply = () => {
      frame = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -100 || r.top > vh + 100) return;
      let rx: number;
      let ry: number;
      let gx: number;
      let gy: number;
      if (px !== null && py !== null) {
        const x = (px - r.left) / r.width - 0.5;
        const y = (py - r.top) / r.height - 0.5;
        rx = -y * max;
        ry = x * max;
        gx = (x + 0.5) * 100;
        gy = (y + 0.5) * 100;
      } else {
        // no pointer: the object leans with its place on the screen, the light follows
        const pos = (r.top + r.height / 2 - vh / 2) / vh;
        rx = pos * scroll;
        ry = 0;
        gx = 30;
        gy = 50 + pos * 80;
      }
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      el.style.setProperty("--gx", `${gx.toFixed(1)}%`);
      el.style.setProperty("--gy", `${gy.toFixed(1)}%`);
    };
    const ask = () => (frame ||= requestAnimationFrame(apply));
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      px = e.clientX;
      py = e.clientY;
      el.style.setProperty("--hover", "1");
      ask();
    };
    const leave = () => {
      px = py = null;
      el.style.setProperty("--hover", "0");
      ask();
    };
    apply();
    el.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("pointerleave", leave);
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
    };
  }, [max, scroll]);
  return ref;
};

/** Adds "is-seen" to an element the first time it comes into view (CSS entrances). */
export const useSeen = <T extends HTMLElement>(threshold = 0.2) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-seen");
        seen.disconnect();
      },
      { threshold },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, [threshold]);
  return ref;
};
