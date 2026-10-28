import React, { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Navigate, useLocation, useNavigationType, useOutlet } from "react-router-dom";
import { AnimatePresence, motion, useIsPresent, useReducedMotion, type Variants } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { enterFrom, type Enter } from "./nav";
import { conceptOfSlug, resolvePath, translatePath, type Resolved } from "./routes";
import { savedLang } from "./i18n";
import { recordVisit } from "./visits";
import ConsentBanner from "./ConsentBanner";
import "../styles/public.scss";

/** Screens that share one mounted component (the home cover lies on top of Utforska). */
const layerKey = (r: Resolved) => {
  if (r.screen === "home" || r.screen === "explore") return "hub";
  if (r.screen === "example" || r.screen === "card") return `${r.screen}:${r.slug ?? ""}`;
  // Same concept in both languages: switching language is not a move to another place.
  if (r.screen === "concept") return `concept:${conceptOfSlug(r.slug, r.lang)}`;
  return r.screen;
};

type Move = { enter: Enter; reduce: boolean; fix: number; vw: number; vh: number };

const EASE = [0.22, 0.75, 0.18, 1] as const;
const DURATION = 0.46;
const PUSH_BACK = 0.18; // how far the old screen steps back, as a share of the viewport

const variants: Variants = {
  initial: (m: Move) => {
    if (m.reduce) return { opacity: 1 };
    switch (m.enter) {
      case "right":
        return { x: m.vw, opacity: 1 };
      case "left":
        return { x: -m.vw, opacity: 1 };
      case "below":
        return { y: m.vh, opacity: 1 };
      case "above":
        return { y: -m.vh, opacity: 1 };
      default:
        return { opacity: 0 };
    }
  },
  enter: (m: Move) => ({
    x: 0,
    y: 0,
    opacity: 1,
    transition: m.reduce ? { duration: 0 } : { duration: DURATION, ease: EASE },
  }),
  // The leaving screen is pinned where the visitor was looking (`fix` compensates the scroll reset
  // of the new screen), then steps back slightly in the direction of travel.
  exit: (m: Move) => {
    if (m.reduce) return { opacity: 0, transition: { duration: 0 } };
    const t = { duration: DURATION, ease: EASE };
    const by = (n: number) => Math.round(n * PUSH_BACK);
    switch (m.enter) {
      case "right":
        return { x: [0, -by(m.vw)], y: [m.fix, m.fix], opacity: [1, 0.55], transition: t };
      case "left":
        return { x: [0, by(m.vw)], y: [m.fix, m.fix], opacity: [1, 0.55], transition: t };
      case "below":
        return { y: [m.fix, m.fix - by(m.vh)], opacity: [1, 0.55], transition: t };
      case "above":
        return { y: [m.fix, m.fix + by(m.vh)], opacity: [1, 0.55], transition: t };
      default:
        return { y: [m.fix, m.fix], opacity: [1, 0], transition: { duration: 0.28 } };
    }
  },
};

/** One screen in the stage: the leaving one is inert and stays under the arriving one. */
const Layer: React.FC<{ id: string; move: Move; children: React.ReactNode }> = ({ id, move, children }) => {
  const present = useIsPresent();
  return (
    <motion.div
      className={`mp-layer${present ? "" : " is-leaving"}`}
      data-layer={id}
      variants={variants}
      custom={move}
      initial="initial"
      animate="enter"
      exit="exit"
      aria-hidden={present ? undefined : true}
      {...(present ? {} : { inert: "" })}
    >
      {children}
    </motion.div>
  );
};

/** Scroll positions per history entry, restored on browser Back / Forward. */
const scrolls = new Map<string, number>();

/**
 * Layout route of the public site: renders the current screen and moves between screens along
 * the site's geography (see nav.tsx). Also owns scroll restoration, focus after a change of
 * screen, the <html lang> attribute, the saved language preference and the cookie banner.
 */
const Stage: React.FC = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const outlet = useOutlet();
  const reduce = useReducedMotion() ?? false;
  const resolved = resolvePath(location.pathname);
  const key = layerKey(resolved);

  const last = useRef<{ key: string; locKey: string; screen: Resolved["screen"] } | null>(null);
  // Scroll position of the screen being left, read during render, before the DOM changes: once the
  // leaving screen is out of the flow the page may get shorter and the browser clamps the scroll.
  const leftAt = useRef(0);
  const currentKey = useRef(location.key);
  const first = last.current === null;

  // Computed during render, read by the leaving layer's exit variant.
  const move = useMemo<Move>(() => {
    const prev = last.current;
    const vw = typeof window === "undefined" ? 1280 : window.innerWidth;
    const vh = typeof window === "undefined" ? 800 : window.innerHeight;
    if (!prev || prev.key === key) return { enter: "fade", reduce, fix: 0, vw, vh };
    const from = window.scrollY;
    leftAt.current = from;
    const to = navType === "POP" ? scrolls.get(location.key) ?? 0 : 0;
    return { enter: enterFrom(prev.screen, resolved.screen), reduce, fix: to - from, vw, vh };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    return () => {
      if ("scrollRestoration" in history) history.scrollRestoration = "auto";
    };
  }, []);

  useLayoutEffect(() => {
    const prev = last.current;
    last.current = { key, locKey: location.key, screen: resolved.screen };
    currentKey.current = location.key;
    recordVisit(location.key, resolved.screen, navType);
    if (!prev || prev.key === key) return;
    scrolls.set(prev.locKey, leftAt.current);
    const to = navType === "POP" ? scrolls.get(location.key) ?? 0 : 0;
    window.scrollTo({ top: to, left: 0, behavior: "instant" as ScrollBehavior });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Remember the position of the current entry too (for Forward after Back).
  useEffect(() => {
    // Only for the entry on screen: a clamped scroll during a change must not overwrite the old one.
    const save = () => currentKey.current === location.key && scrolls.set(location.key, window.scrollY);
    window.addEventListener("scroll", save, { passive: true });
    return () => window.removeEventListener("scroll", save);
  }, [location.key]);

  // Focus the heading of the new screen (not on the first load, so the page starts at the top).
  useEffect(() => {
    if (first) return;
    const id = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>(`[data-layer="${CSS.escape(key)}"]:not(.is-leaving) [data-focus]`);
      if (!target) return;
      if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    }, 30);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Saved language: applied on arrival on an unprefixed (Swedish) URL and on Back / Forward to an
  // entry in the other language. An explicit /en/… link always opens in English. Rendered as a
  // <Navigate>, so the router is already listening when the address changes.
  const pref = savedLang();
  // A demo or example link is explicit about its language (its address is the language): it is
  // never switched by a preference saved earlier.
  const explicit = ["card", "concept", "example"].includes(resolved.screen);
  const langRedirect =
    pref && pref !== resolved.lang && !explicit && (first ? resolved.lang === "sv" : navType === "POP")
      ? translatePath(location.pathname, pref) + location.search + location.hash
      : null;

  return (
    <div className="mambyly-public mp-x">
      <Helmet htmlAttributes={{ lang: resolved.lang }} />
      {langRedirect ? (
        <Navigate to={langRedirect} replace state={location.state} />
      ) : (
        <div className="mp-stage">
          <AnimatePresence initial={false} custom={move}>
            <Layer key={key} id={key} move={move}>
              {outlet}
            </Layer>
          </AnimatePresence>
        </div>
      )}
      <ConsentBanner />
    </div>
  );
};

export default Stage;
