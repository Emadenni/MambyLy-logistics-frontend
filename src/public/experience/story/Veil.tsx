import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import logoDark from "../../assets/logo-dark.svg";
import { useCopy } from "../i18n";
import LangSwitch from "../LangSwitch";
import { ChevronUp, Fingerprint } from "../icons";
import { ease, stopVeil, tweenVeil, veil } from "./veilState";
import { hasWebGL } from "./webgl";

const VeilCanvas = lazy(() => import("./VeilCanvas"));

/** Lifted further than this (share of the drag range), or flicked, = open. */
const OPEN_AT = 0.28;
const DRAG_MAX = 0.92;
const FLICK = { px: 40, ms: 300 };
const OPEN_S = 1.7;
const BACK_S = 1.1;
const LOWER_S = 0.9;
const REDUCED_S = 0.3;
/** What of the page underneath zooms in and sharpens while the veil opens (the visible screen). */
const UNDER = ".mp-under .mp-bar, .mp-under .mp-tale__backdrop, .mp-under .mp-tale__gl, .mp-under .mp-tale__chapter--hero";

/**
 * The home veil ("/" and "/en"): a cream silk with the logo that rolls up with the finger or the
 * mouse and reveals Utforska, which is already there underneath. Until the WebGL silk (VeilCanvas,
 * its own bundle) is ready, and with reduced motion, an HTML layer with the same picture stands in.
 * `home` comes from the URL: opening asks the parent to navigate, the URL then moves the veil.
 */
const Veil: React.FC<{ home: boolean; onOpen: () => void; head: React.ReactNode }> = ({ home, onOpen, head }) => {
  const t = useCopy();
  const reduce = useReducedMotion() ?? false;
  const root = useRef<HTMLDivElement>(null);
  const brand = useRef<HTMLDivElement>(null);
  const action = useRef<HTMLDivElement>(null);
  const lang = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; y0: number; t0: number; p0: number; active: boolean } | null>(null);
  const shownHome = useRef<boolean | null>(null);
  const [dragging, setDragging] = useState(false);
  const [gone, setGone] = useState(!home);
  const [glReady, setGlReady] = useState(false);
  const [wanted, setWanted] = useState(false);
  const [glShown, setGlShown] = useState(false);
  const webgl = useRef<boolean | null>(null);
  if (webgl.current === null && typeof window !== "undefined") webgl.current = !reduce && hasWebGL();
  const useGl = !!webgl.current && !reduce && !gone && wanted;

  // Until then the HTML veil (the same picture) is on screen: the first paint and the page's own
  // start are not shared with a 3D engine. A pointer, a touch or a key brings the silk.
  useEffect(() => {
    if (wanted || !webgl.current || reduce) return;
    const want = () => setWanted(true);
    const events = ["pointermove", "pointerdown", "touchstart", "wheel", "keydown", "focusin"] as const;
    events.forEach((e) => window.addEventListener(e, want, { once: true, passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, want));
  }, [wanted, reduce]);

  // The URL decides where the veil goes; a gesture only moves it there first.
  useEffect(() => {
    const moved = shownHome.current !== null && shownHome.current !== home;
    shownHome.current = home;
    if (home) {
      setGone(false);
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      if (moved) tweenVeil(0, reduce ? REDUCED_S : LOWER_S, ease.out3);
      else veil.p = 0;
    } else if (!moved) {
      veil.p = 1;
      setGone(true);
    } else {
      tweenVeil(1, reduce ? REDUCED_S : OPEN_S, reduce ? ease.out3 : ease.inOut3, () => setGone(true));
    }
    return stopVeil;
  }, [home, reduce]);

  const open = () => {
    if (!home) return;
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    onOpen();
  };

  // Every frame while the veil is up: the controls fade with the opening, the page underneath comes
  // forward (a little zoom and a blur that clears). Without WebGL the HTML veil itself moves.
  useEffect(() => {
    if (gone) return;
    const scope = root.current?.parentElement;
    const parts = () => scope?.querySelectorAll<HTMLElement>(UNDER) ?? [];
    const under = scope?.querySelector<HTMLElement>(".mp-under");
    let frame = 0;
    let rest: boolean | null = null;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      const p = veil.p;
      veil.idle = home && p === 0 && !drag.current;
      const controls = Math.max(0, 1 - p * 4).toFixed(3);
      if (action.current) action.current.style.opacity = controls;
      if (lang.current) lang.current.style.opacity = controls;
      const el = root.current;
      if (el && !glShown) {
        el.style.transform = reduce ? "" : `translate3d(0, ${(-p * 100).toFixed(2)}%, 0)`;
        el.style.opacity = reduce ? (1 - p).toFixed(3) : "";
      }
      // While the veil rests, the page under it is not seen: the browser skips laying it out and
      // painting it (and its blur); it comes forward as soon as the veil moves.
      const resting = home && p === 0;
      if (resting !== rest) {
        rest = resting;
        if (under) under.style.contentVisibility = resting ? "hidden" : "";
      }
      if (!reduce && !resting)
        parts().forEach((node) => {
          node.style.transformOrigin = "50% 50vh";
          node.style.transform = `scale(${(0.93 + 0.07 * p).toFixed(4)})`;
          node.style.filter = p < 0.995 ? `blur(${(8 * (1 - p)).toFixed(2)}px)` : "";
        });
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      if (under) under.style.contentVisibility = "";
      parts().forEach((node) => {
        node.style.transform = "";
        node.style.filter = "";
        node.style.transformOrigin = "";
      });
    };
  }, [gone, glShown, home, reduce]);

  // The WebGL silk takes over once its first frame matches the HTML one.
  useEffect(() => {
    if (!glReady) return;
    if (root.current) {
      root.current.style.transform = "";
      root.current.style.opacity = "";
    }
    setGlShown(true);
  }, [glReady]);
  useEffect(() => {
    if (useGl) return;
    setGlReady(false);
    setGlShown(false);
  }, [useGl]);

  // Wheel and trackpad open the veil (and keep the page behind from scrolling).
  useEffect(() => {
    const el = root.current;
    if (!el || !home) return;
    let sum = 0;
    let last = 0;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const now = Date.now();
      if (now - last > 250) sum = 0;
      last = now;
      sum += e.deltaY;
      if (sum > 50) open();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  // Keyboard: Enter, Space, Page Down and Arrow Down open it (controls keep their own keys).
  useEffect(() => {
    if (!home) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement | null)?.closest("button, a, input, textarea, select")) return;
      if (["Enter", " ", "PageDown", "ArrowDown"].includes(e.key)) {
        e.preventDefault();
        open();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [home]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!home || (e.pointerType === "mouse" && e.button !== 0)) return;
    if ((e.target as HTMLElement).closest(".mp-lang")) return;
    stopVeil();
    drag.current = { id: e.pointerId, y0: e.clientY, t0: e.timeStamp, p0: veil.p, active: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const lifted = d.y0 - e.clientY;
    if (!d.active && Math.abs(lifted) > 6) {
      d.active = true;
      setDragging(true);
      root.current?.setPointerCapture(e.pointerId);
    }
    if (d.active) veil.p = Math.min(DRAG_MAX, Math.max(0, d.p0 + lifted / (window.innerHeight * 0.9)));
  };

  const release = (e: React.PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    setDragging(false);
    if (root.current?.hasPointerCapture(e.pointerId)) root.current.releasePointerCapture(e.pointerId);
    if (cancelled) {
      tweenVeil(0, reduce ? REDUCED_S : BACK_S, reduce ? ease.out3 : ease.elastic);
      return;
    }
    const lifted = d.y0 - e.clientY;
    const flick = lifted > FLICK.px && e.timeStamp - d.t0 < FLICK.ms;
    if (!d.active || veil.p > OPEN_AT || flick) open();
    else tweenVeil(0, reduce ? REDUCED_S : BACK_S, reduce ? ease.out3 : ease.elastic);
  };

  return (
    <div
      ref={root}
      className={`mp-veil${dragging ? " is-dragging" : ""}${glShown ? " is-gl" : ""}`}
      style={{ visibility: gone ? "hidden" : "visible" }}
      aria-hidden={home ? undefined : true}
      {...(home ? {} : { inert: "" })}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(e) => release(e, false)}
      onPointerCancel={(e) => release(e, true)}
    >
      {home && head}
      <div className="mp-veil__silk" aria-hidden="true" />
      <div ref={brand} className="mp-veil__brand">
        <h1 className="mp-veil__logo">
          <img src={logoDark} alt="MambyLy Solutions" width={300} height={85} draggable={false} />
        </h1>
        <p className="mp-veil__tagline">{t.cover.tagline}</p>
      </div>
      {useGl && (
        <Suspense fallback={null}>
          <VeilCanvas brand={brand} onReady={() => setGlReady(true)} />
        </Suspense>
      )}
      <div ref={lang} className="mp-veil__lang">
        <LangSwitch />
      </div>
      <div ref={action} className="mp-veil__action">
        <button
          type="button"
          className="mp-cover__handle mp-veil__handle"
          data-focus={home ? "" : undefined}
          aria-label={`${t.cover.open} – ${t.cover.swipe} ${t.cover.or}`}
          onClick={(e) => {
            // the tap itself opens on pointerup; this is for the keyboard
            if (e.detail === 0) open();
          }}
        >
          <ChevronUp className="mp-cover__chevron" />
          <Fingerprint className="mp-cover__print" />
        </button>
        <p className="mp-cover__hint" aria-hidden="true">
          <span className="mp-cover__swipe">{t.cover.swipe}</span>
          <span className="mp-cover__or mp-cover__or--touch">{t.cover.or}</span>
          <span className="mp-cover__or mp-cover__or--pointer">{t.cover.orPointer}</span>
        </p>
      </div>
    </div>
  );
};

export default Veil;
