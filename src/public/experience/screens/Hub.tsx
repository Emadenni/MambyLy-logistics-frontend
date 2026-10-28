import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import logoDark from "../../assets/logo-dark.svg";
import { CardPreview } from "../../digital-card/DigitalCard";
import { COMPANY_CARD_SLUG, getCard } from "../../digital-card/registry";
import { cardStrings } from "../../digital-card/strings";
import { useCopy } from "../i18n";
import LangSwitch from "../LangSwitch";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS, pathFor, resolvePath } from "../routes";
import { useUi } from "../ui";
import { ChevronUp, Fingerprint, LinkMark } from "../icons";
import { media } from "../media";

const EASE = [0.22, 0.75, 0.18, 1] as const;
/** Lifted further than this share of the screen (or flicked) = open. */
const OPEN_AT = 0.26;
const FLICK = 0.45; // px per ms

/**
 * "/" and "/utforska" (English "/en", "/en/explore"): the home cover lies on top of Utforska.
 * Lifting the cover (drag, wheel, tap, Enter or Space) reveals the page that is already there and
 * then moves the URL to /utforska; Back or the logo lowers the cover again.
 */
const Hub: React.FC = () => {
  const t = useCopy();
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion() ?? false;
  const isHome = resolvePath(location.pathname).screen === "home";
  const setCoverShown = useUi((s) => s.setCoverShown);

  // 0 = cover down, 1 = cover lifted.
  const progress = useMotionValue(isHome ? 0 : 1);
  const [gone, setGone] = useState(!isHome);
  const [dragging, setDragging] = useState(false);
  const [pressed, setPressed] = useState(false);
  const cover = useRef<HTMLDivElement>(null);
  const handle = useRef<HTMLButtonElement>(null);
  const exploreTitle = useRef<HTMLHeadingElement>(null);
  const drag = useRef<{ id: number; y0: number; y: number; t: number; v: number; h: number; active: boolean } | null>(null);
  const quietWheelUntil = useRef(0);
  // A drag that started on the round control must not also count as a tap.
  const swallowClick = useRef(false);
  const firstRun = useRef(true);

  // The page behind stays still: the cover opens from the centre towards both sides, as far as
  // the finger has travelled. A soft edge keeps the opening from looking like a cut.
  const mask = useTransform(progress, (v) => {
    if (v <= 0) return "none";
    const half = Math.min(50, v * 50);
    const soft = Math.min(6, 2 + v * 8);
    return `linear-gradient(90deg, #000 calc(${(50 - half).toFixed(2)}% - ${soft}%), transparent ${(50 - half).toFixed(2)}%, transparent ${(50 + half).toFixed(2)}%, #000 calc(${(50 + half).toFixed(2)}% + ${soft}%))`;
  });
  // A thin ring grows out of the fingerprint with the gesture.
  const ringScale = useTransform(progress, (v) => 1 + v * 2.4);
  const ringOpacity = useTransform(progress, (v) => (v <= 0 ? 0 : Math.max(0, 0.9 - v * 1.1)));
  useMotionValueEvent(progress, "change", (v) => setGone(v >= 0.999));

  const explorePath = pathFor("explore", t.lang);
  const homePath = pathFor("home", t.lang);

  const open = () => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    quietWheelUntil.current = Date.now() + 800;
    if (isHome) navigate(explorePath);
  };

  // The URL decides where the cover goes; the gesture only moves it there first.
  useEffect(() => {
    setCoverShown(isHome);
    const target = isHome ? 0 : 1;
    const wasFirst = firstRun.current;
    firstRun.current = false;
    if (progress.get() !== target) {
      if (reduce || wasFirst) progress.set(target);
      else animate(progress, target, { duration: 0.46, ease: EASE });
    }
    if (wasFirst) return;
    const focus = window.setTimeout(() => (isHome ? handle.current : exploreTitle.current)?.focus({ preventScroll: true }), reduce ? 0 : 480);
    return () => window.clearTimeout(focus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome]);

  useEffect(() => () => setCoverShown(false), [setCoverShown]);

  // Wheel / trackpad on the cover lifts it (and keeps the page behind from scrolling).
  useEffect(() => {
    const el = cover.current;
    if (!el) return;
    let sum = 0;
    let lastAt = 0;
    const onWheel = (e: WheelEvent) => {
      if (!isHome) return;
      if (el.scrollHeight > el.clientHeight + 2 && el.scrollTop + el.clientHeight < el.scrollHeight - 2) return; // let a tall cover scroll first
      e.preventDefault();
      const now = Date.now();
      if (now - lastAt > 250) sum = 0;
      lastAt = now;
      sum += e.deltaY;
      if (sum > 50) open();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome]);

  // Trackpad momentum right after opening must not scroll Utforska.
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (Date.now() < quietWheelUntil.current) e.preventDefault();
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, []);

  // Keyboard on the cover: Space / PageDown / ArrowDown also open it.
  useEffect(() => {
    if (!isHome) return;
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      const onControl = el?.closest("button, a, input, textarea, select");
      if (onControl) return;
      if (e.key === " " || e.key === "PageDown" || e.key === "ArrowDown") {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isHome || (e.pointerType === "mouse" && e.button !== 0)) return;
    const el = cover.current!;
    const tall = el.scrollHeight > el.clientHeight + 2;
    // On a cover that has to scroll (very low screens), only the round control drags.
    if (tall && !(e.target as HTMLElement).closest(".mp-cover__handle")) return;
    if ((e.target as HTMLElement).closest(".mp-lang")) return;
    swallowClick.current = false;
    setPressed(true);
    drag.current = { id: e.pointerId, y0: e.clientY, y: e.clientY, t: e.timeStamp, v: 0, h: el.clientHeight || window.innerHeight, active: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dt = Math.max(1, e.timeStamp - d.t);
    d.v = (d.y - e.clientY) / dt;
    d.y = e.clientY;
    d.t = e.timeStamp;
    const lifted = d.y0 - e.clientY;
    if (!d.active && Math.abs(lifted) > 6) {
      d.active = true;
      swallowClick.current = true;
      setDragging(true);
      cover.current?.setPointerCapture(e.pointerId);
    }
    if (d.active) progress.set(Math.min(1, Math.max(0, lifted / d.h)));
  };

  const release = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setPressed(false);
    if (!d.active) return;
    // The click that may follow this pointerup is the end of the drag, not a tap; later ones are.
    window.setTimeout(() => (swallowClick.current = false), 0);
    setDragging(false);
    if (cover.current?.hasPointerCapture(e.pointerId)) cover.current.releasePointerCapture(e.pointerId);
    const p = progress.get();
    if (!cancelled && (p > OPEN_AT || (d.v > FLICK && p > 0.04))) {
      open();
    } else {
      animate(progress, 0, reduce ? { duration: 0 } : { duration: 0.36, ease: EASE });
    }
  };


  const card = getCard(COMPANY_CARD_SLUG, t.lang);
  const cs = cardStrings[card?.lang ?? t.lang];

  return (
    <>
      <motion.div
        ref={cover}
        className={`mp-cover${dragging ? " is-dragging" : ""}${pressed ? " is-pressed" : ""}`}
        style={{ WebkitMaskImage: mask, maskImage: mask, visibility: gone ? "hidden" : "visible" }}
        aria-hidden={isHome ? undefined : true}
        {...(isHome ? {} : { inert: "" })}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={(e) => release(e, false)}
        onPointerCancel={(e) => release(e, true)}
      >
        {isHome && <ScreenHead lang={t.lang} title={t.meta.home.title} description={t.meta.home.description} screen="home" />}
        <div className="mp-cover__top">
          <LinkMark className="mp-cover__mark" />
          <LangSwitch className="mp-cover__lang" />
        </div>
        <div className="mp-cover__brand">
          <h1 className="mp-cover__logo">
            <img src={logoDark} alt="MambyLy Solutions" width={300} height={85} />
          </h1>
          <p className="mp-cover__tagline">{t.cover.tagline}</p>
        </div>
        <div className="mp-cover__action">
          <button
            ref={handle}
            type="button"
            className="mp-cover__handle"
            data-focus={isHome ? "" : undefined}
            aria-label={`${t.cover.open} – ${t.cover.swipe} ${t.cover.or}`}
            onClick={() => {
              if (swallowClick.current) {
                swallowClick.current = false;
                return;
              }
              open();
            }}
          >
            <motion.span className="mp-cover__ring" style={{ scale: ringScale, opacity: ringOpacity }} aria-hidden="true" />
            <ChevronUp className="mp-cover__chevron" />
            <Fingerprint className="mp-cover__print" />
          </button>
          <p className="mp-cover__hint" aria-hidden="true">
            <span className="mp-cover__swipe">{t.cover.swipe}</span>
            <span className="mp-cover__or mp-cover__or--touch">{t.cover.or}</span>
            <span className="mp-cover__or mp-cover__or--pointer">{t.cover.orPointer}</span>
          </p>
        </div>
      </motion.div>

      <div
        className="mp-under"
        aria-hidden={isHome ? true : undefined}
        {...(isHome ? { inert: "" } : {})}
      >
        <Screen
          id="explore"
          head={isHome ? null : <ScreenHead lang={t.lang} title={t.meta.explore.title} description={t.meta.explore.description} screen="explore" />}
          bar={<TopBar crumbs={[{ label: t.nav.explore }]} logoTo={homePath} />}
          withAdmin
        >
          <h1 className="mp-sr" ref={exploreTitle} tabIndex={-1} data-focus={isHome ? undefined : ""}>
            {t.explore.title}
          </h1>
          <div className="mp-hub">
            <article className="mp-hub__panel mp-hub__panel--web">
              <h2 className="mp-hub__title">
                <Link to={PATHS.websites[t.lang]} className="mp-stretch">
                  {t.nav.websites} <FiArrowRight aria-hidden="true" className="mp-hub__arrow" />
                </Link>
              </h2>
              <div className="mp-hub__copy">
                <p className="mp-hub__lead">{t.explore.websitesLead}</p>
                <p className="mp-hub__text mp-hub__text--wide">{t.explore.websitesText}</p>
                <span className="mp-xbtn mp-xbtn--solid mp-hub__more" aria-hidden="true">
                  {t.explore.more} <FiArrowRight />
                </span>
              </div>
              {/* Real screenshots of the editorial design concept (desktop and phone). */}
              <div className="mp-hub__visual mp-hub__visual--web" aria-hidden="true">
                <div className="mp-browser mp-hub__desk">
                  <span className="mp-browser__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <img
                    src={media("preview-architecture-desktop", 640)}
                    srcSet={`${media("preview-architecture-desktop", 640)} 640w, ${media("preview-architecture-desktop", 1280)} 1280w`}
                    sizes="(min-width: 960px) 400px, 45vw"
                    alt=""
                    width={640}
                    height={400}
                    loading={isHome ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <img className="mp-hub__phone" src={media("preview-restaurant-mobile", 390)} alt="" width={390} height={844} loading={isHome ? "eager" : "lazy"} decoding="async" />
              </div>
            </article>

            <article className="mp-hub__panel mp-hub__panel--cards">
              <h2 className="mp-hub__title">
                <Link to={PATHS.cards[t.lang]} className="mp-stretch">
                  {t.nav.cards} <FiArrowRight aria-hidden="true" className="mp-hub__arrow" />
                </Link>
              </h2>
              <div className="mp-hub__copy">
                <p className="mp-hub__text">{t.explore.cardsText}</p>
                <span className="mp-xbtn mp-xbtn--solid mp-hub__more" aria-hidden="true">
                  {t.explore.more} <FiArrowRight />
                </span>
              </div>
              {card && (
                <div className="mp-hub__visual mp-hub__visual--cards" aria-hidden="true">
                  <div className="mp-hub__card mp-hub__card--back">
                    <CardPreview card={card} t={cs} />
                  </div>
                  <div className="mp-hub__card mp-hub__card--front">
                    <CardPreview card={card} t={cs} />
                  </div>
                </div>
              )}
            </article>
          </div>

          <div className="mp-hub__foot">
            <img
              className="mp-hub__people"
              src={media("people-collaboration", 720)}
              alt=""
              width={720}
              height={480}
              loading="lazy"
              decoding="async"
            />
            <Link to={PATHS.about[t.lang]} className="mp-hub__about">
              {t.explore.aboutLink} <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </Screen>
      </div>
    </>
  );
};

export default Hub;
