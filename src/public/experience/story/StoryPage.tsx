import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { publicContact } from "../../contact";
import { PATHS, pathFor } from "../routes";
import { useCopy } from "../i18n";
import { media } from "../media";
import { CAPTION_EDGE, CHAPTERS, STORY_SCREENS, T, band, clamp, greenRadius, seg, type ChapterId } from "./storyTimeline";
import { story } from "./progress";
import { hasWebGL } from "./webgl";
import { CardPreview } from "../../digital-card/DigitalCard";
import { COMPANY_CARD_SLUG, getCard } from "../../digital-card/registry";
import { cardStrings } from "../../digital-card/strings";

// The 3D scene is a separate bundle, loaded once the page is on screen.
const StoryCanvas = lazy(() => import("./StoryCanvas"));

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
const showDebug = () => import.meta.env.DEV || new URLSearchParams(window.location.search).has("debug");

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
    const dots = [...el.querySelectorAll<HTMLElement>("[data-dot]")];
    let current = "";
    const screen = el.closest<HTMLElement>(".mp-screen");
    let dark = false;
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
      const here = CHAPTERS.find((c) => p >= c.from && p < c.to)?.id ?? "cards";
      if (here !== current) {
        current = here;
        dots.forEach((d) => (d.dataset.dot === here ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current")));
      }
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
      screen?.classList.remove("is-dark");
    };
  }, [reduce]);

  // The scene loads after the first paint, when the browser is idle, and only once the story is on
  // screen: under the home veil it waits until the veil starts to open.
  useEffect(() => {
    if (reduce || !active || gl) return;
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    const id = idle(() => setGl(true), { timeout: 1500 });
    return () => cancel(id);
  }, [reduce, active, gl]);

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
        {gl && (
          <Suspense fallback={null}>
            <StoryCanvas lang={t.lang} />
          </Suspense>
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
                  src={media(`scroll-${t.lang}-architecture-desktop`, 1280)}
                  srcSet={`${media(`scroll-${t.lang}-architecture-desktop`, 640)} 640w, ${media(`scroll-${t.lang}-architecture-desktop`, 1280)} 1280w`}
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
              <img src={media(`scroll-${t.lang}-architecture-mobile`, 390)} alt="" width={390} height={2889} loading="lazy" decoding="async" />
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

        {showDebug() && <div ref={debug} className="mp-tale__debug" aria-hidden="true" />}
      </div>

      {/* After the 3D part: the contact, only in writing (form, e-mail, WhatsApp) */}
      <section className="mp-tale-contact" aria-labelledby="tale-contact">
        <div className="mp-tale-contact__panel">
          <h2 id="tale-contact" className="mp-tale__title">
            {s.contact.title}
          </h2>
          <div className="mp-tale__actions">
            <Link to={contactPath} state={{ service: "site" }} className="mp-xbtn mp-xbtn--solid">
              {s.contact.website} <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to={contactPath} state={{ service: "card" }} className="mp-xbtn mp-xbtn--solid">
              {s.contact.card} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
          <p className="mp-tale__write">
            {s.contact.write} <Link to={contactPath}>{s.contact.form}</Link>, <a href={`mailto:${publicContact.email}`}>{s.contact.email}</a> {s.contact.or}{" "}
            <a href={whatsapp} target="_blank" rel="noopener noreferrer">
              {s.contact.whatsapp}
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
};

export default StoryPage;
