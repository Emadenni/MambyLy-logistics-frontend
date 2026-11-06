import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { useCopy } from "../i18n";
import { CAPTION_EDGE, CHAPTERS, STORY_SCREENS, T, band, greenRadius, seg, type ChapterId } from "./storyTimeline";
import { story } from "./progress";

// The 3D scene is a separate bundle, loaded once the page is on screen.
const StoryCanvas = lazy(() => import("./StoryCanvas"));

const MOBILE_QUERY = "(max-width: 759px)";
const showDebug = () => import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

/**
 * Utforska: the card's story, told while scrolling. The text is ordinary HTML in the page flow (one
 * section per chapter, as tall as its share of the story); the 3D scene sits fixed behind it and
 * follows the same progress. `active` is false while the home cover lies on top.
 */
const StoryPage: React.FC<{ active: boolean }> = ({ active }) => {
  const t = useCopy();
  const s = t.story;
  const reduce = useReducedMotion() ?? false;
  const root = useRef<HTMLDivElement>(null);
  const debug = useRef<HTMLDivElement>(null);
  const green = useRef<HTMLDivElement>(null);
  const [gl, setGl] = useState(false);

  // Until the scroll driver (scroll.ts, its own bundle) has loaded, the native scroll sets the progress.
  useEffect(() => {
    const el = root.current;
    story.active = active;
    if (!active || !el) return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    const native = () => {
      const end = el.offsetTop + el.offsetHeight - window.innerHeight;
      story.p = end > 0 ? Math.min(1, Math.max(0, window.scrollY / end)) : 0;
    };
    native();
    window.addEventListener("scroll", native, { passive: true });
    import("./scroll").then(({ startScroll }) => {
      if (cancelled) return;
      window.removeEventListener("scroll", native);
      stop = startScroll(el, !reduce);
    });
    return () => {
      cancelled = true;
      window.removeEventListener("scroll", native);
      stop?.();
    };
  }, [active, reduce]);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const set = () => (story.mobile = mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Captions follow the progress directly: fade and rise at the edges of their chapter.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const captions = CHAPTERS.map((c) => el.querySelector<HTMLElement>(`[data-caption="${c.id}"]`));
    const heroTitle = el.querySelector<HTMLElement>("[data-hero-title]");
    const screen = el.closest<HTMLElement>(".mp-screen");
    let dark = false;
    let frames = 0;
    let since = performance.now();
    let fps = 0;
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const p = story.p;
      CHAPTERS.forEach((c, i) => {
        const node = captions[i];
        if (!node) return;
        if (reduce) {
          node.style.opacity = "";
          node.style.transform = "";
          return;
        }
        const o = band(p, c.from, c.to, CAPTION_EDGE, { in: c.from > 0, out: c.to < 1 });
        const rise = (1 - seg(p, c.from, c.from + CAPTION_EDGE)) * 30 - seg(p, c.to - CAPTION_EDGE, c.to) * 30;
        node.style.opacity = o.toFixed(3);
        node.style.transform = `translate3d(0, ${(c.from > 0 ? rise : Math.min(0, rise)).toFixed(1)}px, 0)`;
        node.style.visibility = o < 0.01 ? "hidden" : "";
      });
      if (heroTitle && !reduce) heroTitle.style.opacity = (1 - seg(p, T.heroTitleOut[0], T.heroTitleOut[1])).toFixed(3);
      // Chapter 4: the green opens behind the card, at the moment the scene is showing.
      const shown = story.scene ? story.shown : p;
      const radius = reduce ? 0 : greenRadius(shown);
      const g = green.current;
      if (g) {
        g.style.visibility = radius > 0.05 ? "visible" : "hidden";
        if (radius > 0.05) {
          const fx = story.scene ? story.focus.x.toFixed(1) : "62";
          const fy = story.scene ? story.focus.y.toFixed(1) : "45";
          g.style.setProperty("--fx", `${fx}%`);
          g.style.setProperty("--fy", `${fy}%`);
          g.style.clipPath = `circle(${radius.toFixed(2)}% at ${fx}% ${fy}%)`;
        }
      }
      if (radius > T.green.creamAbove !== dark) {
        dark = !dark;
        screen?.classList.toggle("is-dark", dark);
      }
      if (debug.current) {
        frames++;
        const now = performance.now();
        if (now - since > 500) {
          fps = Math.round((frames * 1000) / (now - since));
          frames = 0;
          since = now;
        }
        const chapter = CHAPTERS.find((c) => p >= c.from && p <= c.to)?.id ?? "";
        debug.current.textContent = `p ${p.toFixed(3)}  3d ${story.shown.toFixed(3)}  ${chapter}  ${fps} fps`;
      }
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      screen?.classList.remove("is-dark");
    };
  }, [reduce]);

  // The scene loads after the first paint, when the browser is idle.
  useEffect(() => {
    if (reduce) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setGl(true), { timeout: 1500 });
    return () => cancel(id);
  }, [reduce]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      story.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  const caption = (id: ChapterId, title: string, text: string) => (
    <div className="mp-tale__caption" data-caption={id}>
      <h2 className="mp-tale__title">{title}</h2>
      <p className="mp-tale__text">{text}</p>
    </div>
  );

  return (
    <div ref={root} className={`mp-tale${reduce ? " is-static" : ""}`} style={{ "--story-screens": STORY_SCREENS } as React.CSSProperties}>
      <div ref={green} className="mp-tale__green" aria-hidden="true" />
      {gl && (
        <Suspense fallback={null}>
          <StoryCanvas lang={t.lang} />
        </Suspense>
      )}

      {CHAPTERS.map((c, i) => (
        <section
          key={c.id}
          id={`kapitel-${c.id}`}
          className={`mp-tale__chapter mp-tale__chapter--${c.id}`}
          aria-label={s.dots[c.id]}
          style={{ "--share": c.to - c.from, "--extra": i === CHAPTERS.length - 1 ? 1 : 0 } as React.CSSProperties}
        >
          <div className="mp-tale__sticky">
            {c.id === "hero" && (
              <div className="mp-tale__caption mp-tale__caption--hero" data-caption="hero">
                <h2 className="mp-tale__hero" data-hero-title>
                  {s.hero.lead} <em>{s.hero.accent}</em>
                </h2>
              </div>
            )}
            {c.id === "problem" && caption("problem", s.problem.title, s.problem.text)}
            {c.id === "tap" && caption("tap", s.tap.title, s.tap.text)}
            {c.id === "inside" && caption("inside", s.inside.title, s.inside.text)}
            {c.id === "site" && caption("site", s.site.title, s.site.text)}
            {c.id === "start" && (
              <div className="mp-tale__caption mp-tale__caption--start" data-caption="start">
                <h2 className="mp-tale__title">{s.start.title}</h2>
              </div>
            )}
          </div>
        </section>
      ))}

      {showDebug() && <div ref={debug} className="mp-tale__debug" aria-hidden="true" />}
    </div>
  );
};

export default StoryPage;
