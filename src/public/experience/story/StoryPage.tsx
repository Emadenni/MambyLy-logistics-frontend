import React, { Suspense, lazy, startTransition, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronDown } from "react-icons/fi";
import { publicContact } from "../../contact";
import { PATHS, pathFor } from "../routes";
import { useCopy } from "../i18n";
import { media } from "../media";
import logoLight from "../../assets/logo-light.svg";
import {
  CAPTION_EDGE,
  CHAPTERS,
  HERO_PANEL,
  STORY_SCREENS,
  T,
  band,
  clamp,
  greenRadius,
  heroGreen,
  linkDraw,
  linkPulse,
  linksOpacity,
  seg,
  type ChapterId,
} from "./storyTimeline";
import { story } from "./progress";
import { hasWebGL } from "./webgl";
import Demos from "./Demos";
import Closing from "./Closing";
import ToolsBanner from "./ToolsBanner";
import { CardPreview } from "../../digital-card/DigitalCard";
import { COMPANY_CARD_SLUG, getCard } from "../../digital-card/registry";
import { cardStrings } from "../../digital-card/strings";

// The 3D scene is a separate bundle, loaded once the page is on screen.
const StoryCanvas = lazy(() => import("./StoryCanvas"));

/** If the scene cannot load (network, a blocked file, WebGL lost), the page stays, without it. */
class SceneGuard extends React.Component<{ children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const MOBILE_QUERY = "(max-width: 759px)";

/** Height of the browser bar of the website window (chapter 5), px. */
const BAR = 26;
const DESK_RATIO = 1280 / 800;
const PHONE_RATIO = 390 / 844; // the phone frame's screen

/**
 * Where the website window ends up: right of the text column on larger screens, across the top on
 * phones (the text sits below), so captions never lie over the website's own text.
 */
const windowRect = (vw: number, vh: number) => {
  if (vw >= 760) {
    const w = Math.min(vw * 0.46, 720);
    const h = w / DESK_RATIO + BAR;
    return { x: Math.min(vw * 0.45, vw - w - 110), y: (vh - h) / 2 + 24, w, h };
  }
  const w = vw - 40;
  return { x: 20, y: Math.max(96, vh * 0.13), w, h: w / DESK_RATIO + BAR };
};
/** A soft arc between two points of the page (the chapter 2 lines). */
const arc = (a: { x: number; y: number }, b: { x: number; y: number }) => {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2 - Math.hypot(b.x - a.x, b.y - a.y) * 0.18;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
};
const PULSE = 0.08; // length of the light that runs along a line, as a share of it

const showDebug = () => import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

/** What of Utforska has been drawn in this tab (see rest / near below). */
const drawn = { rest: false, near: false };

/**
 * Utforska: MambyLy's digital world told while scrolling – website, digital business card and
 * profile as one. The 3D part is ordinary HTML text in the page flow (one section per chapter, as
 * tall as its share of the story) over a fixed scene that follows the same progress; the contact
 * section follows as an ordinary section. `active` is false while the home cover lies on top.
 */
const StoryPage: React.FC<{ active: boolean }> = ({ active }) => {
  const t = useCopy();
  const s = t.story;
  const motion = !(useReducedMotion() ?? false);
  // Without motion or without WebGL the story is a plain page with the same text and pictures.
  const [still] = useState(() => !motion || !hasWebGL());
  const reduce = still;
  const root = useRef<HTMLDivElement>(null);
  const debug = useRef<HTMLDivElement>(null);
  const green = useRef<HTMLDivElement>(null);
  const site = useRef<HTMLDivElement>(null);
  const profile = useRef<HTMLCanvasElement>(null);
  const phone = useRef<HTMLDivElement>(null);
  const links = useRef<SVGSVGElement>(null);
  const [gl, setGl] = useState(false);
  // Demos, steps and contact are drawn right after the first paint, in an interruptible render, so
  // they never hold up the page's start (they are still in the page for everyone, search included).
  // Once drawn in this tab they are drawn at once on a return (from a demo, with Back), so the
  // page has its full length and content in its first frame.
  const [rest, setRest] = useState(drawn.rest);
  useEffect(() => {
    drawn.rest = true;
    startTransition(() => setRest(true));
  }, []);
  const [near, setNear] = useState(drawn.near);
  const nearMark = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = nearMark.current;
    // not under the home veil: there the page is hidden and would count as near
    if (!el || near || !active) return;
    const seen = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        drawn.near = true;
        startTransition(() => setNear(true));
      },
      { rootMargin: "150% 0px" },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, [rest, near, active]);
  // The 3D scene and the smooth scroll start with the visitor's first gesture: a page that is only
  // looked at (or measured) carries no 3D engine. Until the scene draws, a poster stands in.
  const [moved, setMoved] = useState(false);
  const poster = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // only gestures on the story itself: the touch that opens the home veil must not start the 3D
    // engine in the middle of the veil's own motion
    if (still || moved || !active) return;
    const go = () => setMoved(true);
    const events = ["pointerdown", "touchstart", "wheel", "keydown", "scroll"] as const;
    const mouse = (e: PointerEvent) => e.pointerType === "mouse" && go();
    events.forEach((e) => window.addEventListener(e, go, { once: true, passive: true }));
    window.addEventListener("pointermove", mouse, { passive: true });
    return () => {
      events.forEach((e) => window.removeEventListener(e, go));
      window.removeEventListener("pointermove", mouse);
    };
  }, [still, moved, active]);

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
    if (!moved && !reduce)
      return () => {
        window.removeEventListener("scroll", native);
      };
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
  }, [active, reduce, moved]);

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
    const heroFoot = el.querySelector<HTMLElement>("[data-hero-foot]");
    const arch = el.querySelector<HTMLElement>("[data-arch]");
    const dots = [...el.querySelectorAll<HTMLElement>("[data-dot]")];
    const dotsNav = el.querySelector<HTMLElement>(".mp-tale__dots");
    const nudge = el.querySelector<HTMLElement>(".mp-tale__nudge");
    let nudging = false;
    let current = "";
    const screen = el.closest<HTMLElement>(".mp-screen");
    let dark = false;
    let split = false;
    let copied: HTMLCanvasElement | null = null;
    const profileLayer = site.current?.querySelector<HTMLElement>("[data-layer=profile]");
    const webLayer = site.current?.querySelector<HTMLElement>("[data-layer=web]");
    const webPage = webLayer?.querySelector<HTMLElement>("img");
    const phonePage = phone.current?.querySelector<HTMLElement>("img");
    // a full-page picture moved up inside its frame, as if someone were scrolling the website
    const scrollPage = (page: HTMLElement | null | undefined, frame: HTMLElement | null | undefined, amount: number) => {
      if (!page || !frame) return;
      const travel = Math.max(0, page.offsetHeight - frame.clientHeight);
      page.style.transform = `translate3d(0, ${(-travel * amount).toFixed(1)}px, 0)`;
    };
    const bar = site.current?.querySelector<HTMLElement>("[data-bar]");
    const lines = (["cardPhone", "phoneSite"] as const).map((id) => ({
      id,
      paths: [...(links.current?.querySelectorAll<SVGPathElement>(`[data-link="${id}"]`) ?? [])],
      pulse: links.current?.querySelector<SVGPathElement>(`[data-pulse="${id}"]`),
      nodes: [...(links.current?.querySelectorAll<SVGCircleElement>(`[data-node="${id}"]`) ?? [])],
    }));
    let frames = 0;
    let since = performance.now();
    let fps = 0;
    let frame = 0;
    let past: boolean | null = null;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      // Below the story (the demos, the contact): its fixed layers (the green, the poster, the
      // scene) are off whatever the progress says; on a return to the page the progress is not
      // known yet for a frame and would draw the opening for a moment.
      const isPast = el.getBoundingClientRect().bottom <= 0;
      if (isPast !== past) {
        past = isPast;
        el.classList.toggle("is-past", isPast);
      }
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
      // phones: the arrow that says there is more, after the hero's own hint and until the end
      const wantNudge = !reduce && el.getBoundingClientRect().bottom > window.innerHeight * 1.2;
      if (nudge && wantNudge !== nudging) {
        nudging = wantNudge;
        nudge.classList.toggle("is-on", nudging);
      }
      // the chapter dots belong to the 3D part: they leave with it
      if (dotsNav) {
        const gone = el.getBoundingClientRect().bottom < window.innerHeight * 0.6;
        dotsNav.style.opacity = gone ? "0" : "";
        dotsNav.style.visibility = gone ? "hidden" : "";
      }
      // the poster gives way once the scene is drawing (and with the hero, whatever happens)
      const pst = poster.current;
      if (pst) {
        const out = story.scene ? 1 : seg(p, 0.04, 0.1);
        pst.style.opacity = (1 - out).toFixed(3);
        pst.style.visibility = out > 0.99 ? "hidden" : "";
      }
      const here = CHAPTERS.find((c) => p >= c.from && p < c.to)?.id ?? "cards";
      if (here !== current) {
        current = here;
        dots.forEach((d) => (d.dataset.dot === here ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current")));
      }
      if (heroTitle && !reduce) heroTitle.style.opacity = (1 - seg(p, T.heroTitleOut[0], T.heroTitleOut[1])).toFixed(3);
      // the light behind the objects fades with the hero's green
      if (arch && !reduce) {
        const out = seg(p, 0.05, 0.13);
        arch.style.opacity = (1 - out).toFixed(3);
        arch.style.transform = `scale(${(1 - out * 0.12).toFixed(4)})`;
        arch.style.visibility = out > 0.99 ? "hidden" : "";
      }
      if (heroFoot && !reduce) {
        const out = seg(p, 0.02, 0.08);
        heroFoot.style.opacity = (1 - out).toFixed(3);
        heroFoot.style.transform = `translate3d(0, ${(out * 24).toFixed(1)}px, 0)`;
        heroFoot.style.visibility = out > 0.99 ? "hidden" : "";
      }
      // Chapter 4: the green opens behind the card, at the moment the scene is showing.
      const shown = story.scene ? story.shown : p;
      // Larger screens: the hero's green is a panel on the left that slides out; phones: a full
      // green that closes as a circle into the objects.
      const panel = !reduce && !story.mobile ? heroGreen(shown) : 0;
      const radius = reduce ? 0 : greenRadius(shown, story.mobile);
      const g = green.current;
      if (g) {
        g.style.visibility = radius > 0.05 || panel > 0.002 ? "visible" : "hidden";
        // the photo in the green belongs to the hero only
        g.classList.toggle("is-hero", shown < 0.3);
        if (panel > 0.002 && radius <= 0.05) {
          g.style.setProperty("--fx", "18%");
          g.style.setProperty("--fy", "45%");
          g.style.clipPath = `inset(0 ${(100 - HERO_PANEL * 100 * panel).toFixed(2)}% 0 0)`;
        } else if (radius > 0.05) {
          const early = shown < 0.3;
          const fx = story.scene ? story.focus.x.toFixed(1) : early ? "55" : "62";
          const fy = story.scene ? story.focus.y.toFixed(1) : early ? "55" : "45";
          g.style.setProperty("--fx", `${fx}%`);
          g.style.setProperty("--fy", `${fy}%`);
          g.style.clipPath = `circle(${radius.toFixed(2)}% at ${fx}% ${fy}%)`;
        }
      }
      if (radius > T.green.creamAbove !== dark) {
        dark = !dark;
        screen?.classList.toggle("is-dark", dark);
      }
      if (panel > 0.5 !== split) {
        split = !split;
        screen?.classList.toggle("is-split", split);
      }
      // Chapter 2: thin lines join card -> phone -> website; a light runs along each, and the brand
      // follows it (the scene switches the screens at the same moments).
      const svg = links.current;
      if (svg) {
        const o = story.scene ? linksOpacity(shown) : 0;
        svg.style.opacity = o.toFixed(3);
        svg.style.visibility = o > 0.01 ? "visible" : "hidden";
        if (o > 0.01) {
          const ends = { cardPhone: [story.links.card, story.links.phoneLeft], phoneSite: [story.links.phoneRight, story.links.site] } as const;
          lines.forEach(({ id, paths, pulse, nodes }) => {
            const [a, b] = ends[id];
            const d = arc(a, b);
            const drawn = linkDraw(shown, id);
            paths.forEach((path) => {
              path.setAttribute("d", d);
              path.style.strokeDashoffset = (1 - drawn).toFixed(4);
            });
            if (pulse) {
              const at = linkPulse(shown, id);
              pulse.setAttribute("d", d);
              pulse.style.opacity = at < 0 ? "0" : Math.min(1, Math.min(at, 1 - at) * 8).toFixed(3);
              pulse.style.strokeDashoffset = (PULSE - at * (1 + PULSE)).toFixed(4);
            }
            nodes.forEach((node, i) => {
              const at = i === 0 ? a : b;
              node.setAttribute("cx", at.x.toFixed(1));
              node.setAttribute("cy", at.y.toFixed(1));
              node.style.opacity = (i === 0 ? Math.min(1, drawn * 4) : seg(drawn, 0.85, 1)).toFixed(3);
            });
          });
        }
      }
      // End of chapter 4: the phone screen grows into a browser window. The box starts on the screen's
      // rectangle (projected by the scene) and moves to the window's place; a phone with the
      // mobile version joins it at the lower right.
      const box = site.current;
      const hand = phone.current;
      if (box) {
        const m = story.scene ? seg(shown, T.site[0], T.site[1]) : 0;
        const on = story.scene && shown >= T.site[0] - 0.002 && story.screen.w > 0;
        box.style.visibility = on ? "visible" : "hidden";
        if (on) {
          if (story.profile && copied !== story.profile && profile.current) {
            copied = story.profile;
            profile.current.width = copied.width;
            profile.current.height = copied.height;
            profile.current.getContext("2d")?.drawImage(copied, 0, 0);
          }
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const a = story.screen;
          const b = windowRect(vw, vh);
          const mix = (from: number, to: number) => (from + (to - from) * m).toFixed(1);
          box.style.left = `${mix(a.x, b.x)}px`;
          box.style.top = `${mix(a.y, b.y)}px`;
          box.style.width = `${mix(a.w, b.w)}px`;
          box.style.height = `${mix(a.h, b.h)}px`;
          box.style.borderRadius = `${mix((a.w * 0.11) / 0.92, 14)}px`;
          if (profileLayer) profileLayer.style.opacity = (1 - seg(m, 0.2, 0.6)).toFixed(3);
          if (webLayer) webLayer.style.opacity = seg(m, 0.3, 0.85).toFixed(3);
          if (bar) bar.style.opacity = seg(m, 0.4, 0.9).toFixed(3);
          const read = seg(shown, T.siteScroll[0], T.siteScroll[1]);
          scrollPage(webPage, webLayer, read);
          scrollPage(phonePage, hand, read);
          // Past the end of the 3D part the window leaves with the page (the next sections follow).
          const past = clamp((vh - el.getBoundingClientRect().bottom) / (vh * 0.6));
          const room = 1 - past;
          box.style.opacity = room.toFixed(3);
          box.style.translate = `0 ${(-past * vh * 0.25).toFixed(1)}px`;
          if (hand) {
            const show = seg(m, 0.55, 1) * room;
            const ph = b.h * (vw >= 760 ? 0.78 : 0.92);
            const pw = ph * PHONE_RATIO;
            // clear of the chapter dots on the right edge (larger screens)
            const left = Math.min(b.x + b.w - pw * 0.72, vw - pw - (vw >= 760 ? 52 : 12));
            const top = b.y + b.h - ph * 0.78;
            hand.style.width = `${pw.toFixed(1)}px`;
            hand.style.height = `${ph.toFixed(1)}px`;
            hand.style.transform = `translate3d(${left.toFixed(1)}px, ${(top + (1 - show) * 40 - past * vh * 0.25).toFixed(1)}px, 0)`;
            hand.style.opacity = show.toFixed(3);
          }
        }
        if (hand) hand.style.visibility = on ? "visible" : "hidden";
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
      screen?.classList.remove("is-dark", "is-split");
    };
  }, [reduce]);

  // The scene loads after the first paint, when the browser is idle, and only once the story is on
  // screen: under the home veil it waits until the veil starts to open.
  useEffect(() => {
    if (reduce || !active || gl || !moved) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setGl(true), { timeout: 1500 });
    return () => cancel(id);
  }, [reduce, active, gl, moved]);

  useEffect(() => {
    const move = (e: PointerEvent) => {
      story.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      story.pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", move, { passive: true });
    return () => window.removeEventListener("pointermove", move);
  }, []);

  // Chapter dots: a move to the start of a chapter (its caption fully in).
  const goTo = (from: number) => {
    const el = root.current;
    if (!el) return;
    const end = el.offsetTop + el.offsetHeight - window.innerHeight;
    const y = Math.round(el.offsetTop + Math.min(1, from + (from > 0 ? CAPTION_EDGE + 0.01 : 0)) * (end - el.offsetTop));
    if (story.scrollTo && !reduce) story.scrollTo(y);
    else window.scrollTo({ top: y, behavior: "auto" });
  };
  const contactPath = pathFor("contact", t.lang);
  const whatsapp = t.lang === "sv" ? publicContact.whatsappGreetingUrl : publicContact.whatsappUrl;

  const card = getCard(COMPANY_CARD_SLUG, t.lang);
  const stillCard = still && card && (
    <div className="mp-tale__still mp-tale__still--card" aria-hidden="true">
      <CardPreview card={card} t={cardStrings[card.lang ?? t.lang]} />
    </div>
  );
  const stillSite = still && (
    <div className="mp-tale__still mp-tale__still--site" aria-hidden="true">
      <div className="mp-tale__still-window">
        <span className="mp-tale__still-bar">
          <i />
          <i />
          <i />
        </span>
        <img src={media(`preview-${t.lang}-architecture-desktop`, 640)} alt="" width={640} height={400} loading="lazy" decoding="async" />
      </div>
      <img className="mp-tale__still-phone" src={media(`scroll-${t.lang}-architecture-mobile`, 390)} alt="" width={390} height={2889} loading="lazy" decoding="async" />
    </div>
  );

  const caption = (id: ChapterId, title: string, text: string, more?: { to: string; label: string }) => (
    <div className="mp-tale__caption" data-caption={id}>
      <h2 className="mp-tale__title">{title}</h2>
      <p className="mp-tale__text">{text}</p>
      {more && (
        <Link to={more.to} className="mp-tale__more">
          {more.label} <FiArrowRight aria-hidden="true" />
        </Link>
      )}
    </div>
  );
  const cardDemos = { to: PATHS.examples[t.lang], label: s.cardDemos };
  const siteDemos = { to: PATHS.websites[t.lang], label: s.siteDemos };

  return (
    <>
      <div ref={root} className={`mp-tale${reduce ? " is-static" : ""}`} style={{ "--story-screens": STORY_SCREENS } as React.CSSProperties}>
        <div className="mp-tale__backdrop" aria-hidden="true" />
        {!still && <div ref={green} className="mp-tale__green" aria-hidden="true" />}
        {/* hero: until the 3D scene draws, the same three objects as a light HTML picture */}
        {!still && (
          <div ref={poster} className="mp-tale__poster" aria-hidden="true">
            <div className="mp-tale__poster-site">
              <span className="mp-tale__poster-bar">
                <i />
                <i />
                <i />
              </span>
              <img src={media(`preview-${t.lang}-architecture-desktop`, 640)} alt="" width={640} height={400} decoding="async" />
            </div>
            <div className="mp-tale__poster-phone">
              <img src={media(`preview-${t.lang}-architecture-mobile`, 390)} alt="" width={390} height={844} decoding="async" />
            </div>
            {card && (
              // a light picture of the card (the full card component is too heavy for a stand-in)
              <div className="mp-tale__poster-card">
                <img src={logoLight} alt="" width={440} height={125} />
                <span>{card.role}</span>
              </div>
            )}
          </div>
        )}
        {/* hero: a soft cream light in the green, behind the objects */}
        {!still && <div className="mp-tale__arch" data-arch="" aria-hidden="true" />}
        {gl && (
          <SceneGuard>
            <Suspense fallback={null}>
              <StoryCanvas lang={t.lang} />
            </Suspense>
          </SceneGuard>
        )}

        {/* chapter 2: the lines that join card, phone and website (ends projected by the scene) */}
        {!still && (
          <svg ref={links} className="mp-tale__links" aria-hidden="true">
            {(["cardPhone", "phoneSite"] as const).map((id) => (
              <g key={id}>
                <path data-link={id} className="mp-tale__link-glow" pathLength={1} />
                <path data-link={id} className="mp-tale__link" pathLength={1} />
                <path data-pulse={id} className="mp-tale__link-pulse" pathLength={1} strokeDasharray={`${PULSE} 2`} />
                <circle data-node={id} className="mp-tale__link-node" r={3.5} />
                <circle data-node={id} className="mp-tale__link-node" r={3.5} />
              </g>
            ))}
          </svg>
        )}

        {/* end of chapter 4: the phone screen grows into a browser window with a website, joined by a
            phone with the same website; both scroll (full-page pictures of the architecture demo) */}
        {!still && (
          <>
            <div ref={site} className="mp-tale__site" aria-hidden="true">
              <div className="mp-tale__site-bar" data-bar="">
                <i />
                <i />
                <i />
              </div>
              <div className="mp-tale__site-layer mp-tale__site-web" data-layer="web">
                <img
                  // only once the scene runs: this window belongs to it
                  src={gl ? media(`scroll-${t.lang}-architecture-desktop`, 1280) : undefined}
                  srcSet={gl ? `${media(`scroll-${t.lang}-architecture-desktop`, 640)} 640w, ${media(`scroll-${t.lang}-architecture-desktop`, 1280)} 1280w` : undefined}
                  sizes="(min-width: 760px) 50vw, 100vw"
                  alt=""
                  width={1280}
                  height={2233}
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <canvas ref={profile} className="mp-tale__site-layer mp-tale__site-profile" data-layer="profile" />
            </div>
            <div ref={phone} className="mp-tale__site-phone" aria-hidden="true">
              <img src={gl ? media(`scroll-${t.lang}-architecture-mobile`, 390) : undefined} alt="" width={390} height={2889} loading="lazy" decoding="async" />
            </div>
          </>
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
                  {stillCard}
                </div>
              )}
              {c.id === "hero" && (
                <div className="mp-tale__hero-foot" data-hero-foot="">
                  <p className="mp-tale__hero-sub">{s.hero.sub}</p>
                  <div className="mp-tale__hero-links">
                    <Link to={PATHS.websites[t.lang]} className="mp-tale__chip">
                      <span>{s.hero.websites}</span> <FiArrowRight aria-hidden="true" />
                    </Link>
                    <Link to={PATHS.cards[t.lang]} className="mp-tale__chip">
                      <span>{s.hero.cards}</span> <FiArrowRight aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              )}
              {c.id === "identity" && caption("identity", s.identity.title, s.identity.text)}
              {c.id === "websites" && caption("websites", s.websites.title, s.websites.text, siteDemos)}
              {c.id === "websites" && stillSite}
              {c.id === "cards" && caption("cards", s.cards.title, s.cards.text, cardDemos)}
            </div>
          </section>
        ))}

        {!reduce && (
          <nav className="mp-tale__dots" aria-label={s.chaptersLabel}>
            <ol>
              {CHAPTERS.map((c) => (
                <li key={c.id}>
                  <button type="button" data-dot={c.id} aria-label={s.dots[c.id]} onClick={() => goTo(c.from)}>
                    <span aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ol>
          </nav>
        )}

        {!reduce && (
          <span className="mp-tale__nudge" aria-hidden="true">
            <FiChevronDown />
          </span>
        )}

        {showDebug() && <div ref={debug} className="mp-tale__debug" aria-hidden="true" />}
      </div>

      {/* MambyLy Tools: the new line, one band right after the story */}
      {rest && <ToolsBanner />}

      {/* the demos are drawn as they come near (a tall stand-in keeps the page's length) */}
      {rest && (near ? <Demos still={still} /> : <div ref={nearMark} className="mp-demos-wait" aria-hidden="true" />)}

      {rest && <Closing />}
    </>
  );
};

export default StoryPage;
