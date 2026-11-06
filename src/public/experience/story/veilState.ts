/**
 * Opening of the home veil: 0 = down, 1 = rolled up. Written by Veil (gesture and tweens), read
 * every frame by VeilCanvas. `idle` lets the silk breathe while nobody touches it.
 */
export const veil = { p: 0, idle: false };

type Ease = (t: number) => number;

export const ease = {
  inOut3: ((t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)) as Ease,
  out3: ((t) => 1 - Math.pow(1 - t, 3)) as Ease,
  // elastic.out(1, 0.55): a small bounce when the veil falls back
  elastic: ((t) => {
    if (t <= 0 || t >= 1) return t <= 0 ? 0 : 1;
    const period = 0.55;
    const shift = period / 4;
    return Math.pow(2, -10 * t) * Math.sin(((t - shift) * 2 * Math.PI) / period) + 1;
  }) as Ease,
};

let running = 0;

/** Moves veil.p to `to`; a new call replaces the running one. */
export const tweenVeil = (to: number, seconds: number, curve: Ease, done?: () => void) => {
  cancelAnimationFrame(running);
  const from = veil.p;
  if (seconds <= 0 || from === to) {
    veil.p = to;
    done?.();
    return;
  }
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / (seconds * 1000));
    veil.p = from + (to - from) * curve(t);
    if (t < 1) running = requestAnimationFrame(step);
    else {
      veil.p = to;
      done?.();
    }
  };
  running = requestAnimationFrame(step);
};

export const stopVeil = () => cancelAnimationFrame(running);
