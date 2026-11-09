import { useEffect } from "react";

/**
 * Special effects for the website demos, added from outside the demos' own markup (nothing in a
 * demo's React tree is rewritten, so its state and language switches stay safe). All of it is CSS
 * driven by classes and variables set here; with reduced motion nothing is set.
 *
 * - reveal: below the first screen, blocks rise and clear in as they come into view, in sequence
 *   among their siblings; headings open with a wipe.
 * - parallax: chosen pictures move slower than the page (--fx-y).
 * - pointer: the demo knows where the pointer is (--fx-mx / --fx-my, 0..1) for lights and leans.
 * - progress: the demo's reading progress (--fx-read, 0..1) for its progress line.
 * - magnetic: chosen buttons lean a little towards the pointer.
 */
type FxConfig = { reveal: string; parallax?: string; magnetic?: string };

// the sections of sites.ts reveal item by item (their inner wrapper itself does not)
const SITE_REVEAL =
  ".cx-sx__head, .cx-sx__text > div > :not(.cx-sx__head), .cx-sx__pic, .cx-sx__stats > div, .cx-sx__cards > li, .cx-sx__groups > div, .cx-sx__gallery > li, .cx-sx__quotes > li, .cx-sx__faq > details, .cx-sx__info > div";
const BASE_REVEAL = "main section > :is(h2, h3, p, ul, ol, figure, form, div, dl, blockquote):not(.cx-sx__in), main section :is(h2, h3), " + SITE_REVEAL;

export const FX: Record<string, FxConfig> = {
  architecture: { reveal: BASE_REVEAL + ", .cx-ed__materials li, .cx-ed__roomlist li", parallax: ".cx-ed__hero img", magnetic: ".cx-ed__read, .cx-ed__visit button" },
  restaurant: { reveal: BASE_REVEAL + ", .cx-re__info > *", parallax: ".cx-re__catword", magnetic: ".cx-re__book" },
  photographer: { reveal: BASE_REVEAL + ", .cx-ph__tile", magnetic: ".cx-ph__send, .cx-ph__open" },
  logistics: { reveal: BASE_REVEAL + ", .cx-lo__card, .cx-lo__loads > *", parallax: ".cx-lo__route img", magnetic: ".cx-lo__cta" },
  painter: { reveal: BASE_REVEAL + ", .cx-pa__steps > *, .cx-pa__work > *", magnetic: ".cx-pa__cta" },
  lighting: { reveal: BASE_REVEAL + ", .cx-mi__collection > *, .cx-mi__details > *", magnetic: ".cx-mi__cta, .cx-mi__send" },
  typographic: { reveal: BASE_REVEAL + ", .cx-ty__list > *", magnetic: ".cx-ty__more" },
};

export const useConceptFx = (root: React.RefObject<HTMLElement>, id: string) => {
  useEffect(() => {
    const el = root.current;
    const cfg = FX[id];
    if (!el || !cfg || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("fx-on");

    // reveal: only what starts below the first screen (nothing already seen is hidden)
    const seen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const t = e.target as HTMLElement;
          t.classList.add("fx-in");
          seen.unobserve(t);
        }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    const marked = new Set<HTMLElement>();
    const mark = () => {
      const limit = window.innerHeight * 0.92;
      el.querySelectorAll<HTMLElement>(cfg.reveal).forEach((n) => {
        if (marked.has(n) || n.closest(".fx, [role=dialog]") || n.getBoundingClientRect().top < limit) return;
        marked.add(n);
        // a little later than the sibling before it, so a row arrives in sequence
        const sibs = n.parentElement ? [...n.parentElement.children].filter((c) => marked.has(c as HTMLElement)) : [];
        n.style.setProperty("--fx-delay", `${Math.min(sibs.indexOf(n), 6) * 70}ms`);
        n.classList.add("fx", /^H[1-3]$/.test(n.tagName) ? "fx--wipe" : "fx--rise");
        seen.observe(n);
      });
    };
    mark();
    // content that appears later (panels, pages of a list) gets the same treatment
    const grow = new MutationObserver(() => mark());
    grow.observe(el, { childList: true, subtree: true });

    // parallax, pointer and progress in one frame loop, only when something changed
    const par = cfg.parallax ? [...el.querySelectorAll<HTMLElement>(cfg.parallax)] : [];
    const mag = cfg.magnetic ? [...el.querySelectorAll<HTMLElement>(cfg.magnetic)] : [];
    let frame = 0;
    let mx = 0.5;
    let my = 0.5;
    let px = -1;
    let py = -1;
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight;
      const max = Math.max(1, document.documentElement.scrollHeight - vh);
      el.style.setProperty("--fx-read", (window.scrollY / max).toFixed(4));
      el.style.setProperty("--fx-mx", mx.toFixed(3));
      el.style.setProperty("--fx-my", my.toFixed(3));
      par.forEach((n) => {
        const r = n.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const pos = (r.top + r.height / 2 - vh / 2) / vh;
        n.style.setProperty("--fx-y", `${(pos * -60).toFixed(1)}px`);
      });
      mag.forEach((n) => {
        const r = n.getBoundingClientRect();
        const dx = px - (r.left + r.width / 2);
        const dy = py - (r.top + r.height / 2);
        const near = px >= 0 && Math.hypot(dx, dy) < Math.max(120, r.width);
        n.style.setProperty("--fx-mag-x", near ? `${(dx * 0.18).toFixed(1)}px` : "0px");
        n.style.setProperty("--fx-mag-y", near ? `${(dy * 0.25).toFixed(1)}px` : "0px");
      });
    };
    const ask = () => (frame ||= requestAnimationFrame(tick));
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX / window.innerWidth;
      my = e.clientY / window.innerHeight;
      px = e.clientX;
      py = e.clientY;
      ask();
    };
    tick();
    const stopSignature = signature(el, id);
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      stopSignature();
      seen.disconnect();
      grow.disconnect();
      window.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
      window.removeEventListener("pointermove", move);
      el.classList.remove("fx-on");
    };
  }, [root, id]);
};

/** Sets a React-controlled input's value as the visitor would (React sees an ordinary input event). */
const setInput = (input: HTMLInputElement, value: string) => {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
};

/**
 * One behaviour of its own per demo (the rest of each signature is CSS in _fx.scss). Returns the
 * cleanup. Painter: the before/after slider sweeps across once by itself, to show what it does,
 * unless the visitor touches it first.
 */
const signature = (el: HTMLElement, id: string) => {
  if (id !== "painter") return () => undefined;
  const timers: number[] = [];
  let frame = 0;
  let stopped = false;
  const stop = () => {
    stopped = true;
    cancelAnimationFrame(frame);
  };
  el.addEventListener("pointerdown", stop, { once: true });
  el.addEventListener("keydown", stop, { once: true });
  timers.push(
    window.setTimeout(() => {
      const range = el.querySelector<HTMLInputElement>(".cx-pa__range");
      if (!range || stopped) return;
      const keys = [50, 88, 12, 50];
      const legs = 3;
      const leg = 900;
      const start = performance.now();
      const step = (now: number) => {
        if (stopped) return;
        const t = Math.min(1, (now - start) / (leg * legs));
        const i = Math.min(legs - 1, Math.floor(t * legs));
        const k = t * legs - i;
        const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
        setInput(range, String(Math.round(keys[i] + (keys[i + 1] - keys[i]) * e)));
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    }, 900),
  );
  return () => {
    stop();
    timers.forEach((t) => window.clearTimeout(t));
    el.removeEventListener("pointerdown", stop);
    el.removeEventListener("keydown", stop);
  };
};
