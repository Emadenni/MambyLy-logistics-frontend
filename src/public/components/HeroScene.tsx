import React, { useEffect, useLayoutEffect, useRef } from "react";
import { FiBell, FiCalendar, FiCheck, FiChevronRight, FiHome, FiMessageSquare, FiPackage, FiSearch, FiSettings, FiTag, FiUsers } from "react-icons/fi";
import heroFallback from "../assets/hero-organizer.webp";

/**
 * Decorative hero illustration: a sticky note, an order receipt and a customer message
 * get organised into three modules (Bokningar, Beställningar, Kundförfrågningar).
 *
 * Purely presentational: local, illustrative copy only, no data fetching, no shared state.
 * Motion states (data-motion on the root):
 *   (none)  → final composition. This is what renders without JS and with reduced motion.
 *   armed   → initial positions, set before the first paint.
 *   play    → the one-off entrance sequence (≈1.7 s), started when the scene enters the viewport.
 *   done    → final composition again, animations removed.
 */

const SEQUENCE_MS = 1800;

const HeroScene: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") return;

    let doneTimer: number | undefined;
    let started = false;

    const start = () => {
      if (started || document.hidden) return;
      started = true;
      root.dataset.motion = "play";
      doneTimer = window.setTimeout(() => {
        root.dataset.motion = "done";
      }, SEQUENCE_MS);
    };

    const onVisibility = () => {
      root.dataset.paused = document.hidden ? "true" : "false";
      if (!document.hidden && root.dataset.inView === "true") start();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        root.dataset.inView = "true";
        observer.disconnect();
        start();
      },
      { threshold: 0.25 }
    );

    root.dataset.motion = "armed";
    observer.observe(root);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearTimeout(doneTimer);
      delete root.dataset.motion;
      delete root.dataset.inView;
      delete root.dataset.paused;
    };
  }, []);

  // Subtle pointer response (max 4 px), only for fine pointers and when motion is allowed.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const allowed = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!allowed.matches) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        root.style.setProperty("--mp-px", `${(x * 8).toFixed(2)}px`);
        root.style.setProperty("--mp-py", `${(y * 8).toFixed(2)}px`);
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      root.style.setProperty("--mp-px", "0px");
      root.style.setProperty("--mp-py", "0px");
    };

    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="mp-scene" ref={rootRef} aria-hidden="true">
      <img
        className="mp-scene__fallback"
        src={heroFallback}
        alt=""
        width={1536}
        height={1024}
        loading="lazy"
        decoding="async"
      />

      <div className="mp-scene__stage">
        <span className="mp-scene__sheet mp-scene__sheet--forest" />
        <span className="mp-scene__sheet mp-scene__sheet--yellow" />

        <div className="mp-scene__input mp-scene__input--note">
          <span className="mp-hand">Anna</span>
          <span className="mp-hand mp-hand--big">14:00</span>
        </div>

        <div className="mp-scene__input mp-scene__input--receipt">
          <strong>Ny beställning</strong>
          <span className="mp-receipt__line">
            <FiPackage /> <span className="mp-hand">1 × Doftljus</span>
          </span>
          <span className="mp-hand mp-receipt__sub">1 × Presentinslagning</span>
          <span className="mp-receipt__rule" />
        </div>

        <div className="mp-scene__input mp-scene__input--bubble">
          <span>Har ni öppet på lördag?</span>
          <small>10:24</small>
        </div>

        <svg className="mp-scene__links" viewBox="0 0 1000 800" focusable="false">
          <path className="mp-link mp-link--1" pathLength={1} d="M140 238 C140 292 370 270 372 334" />
          <path className="mp-link mp-link--2" pathLength={1} d="M452 246 C452 292 618 282 620 334" />
          <path className="mp-link mp-link--3" pathLength={1} d="M800 182 C800 250 866 262 866 334" />
          <path className="mp-link-head mp-link-head--1" d="M362 322 L372 336 L382 322" />
          <path className="mp-link-head mp-link-head--2" d="M610 322 L620 336 L630 322" />
          <path className="mp-link-head mp-link-head--3" d="M856 322 L866 336 L876 322" />
        </svg>

        <span className="mp-scene__check mp-scene__check--1"><FiCheck /></span>
        <span className="mp-scene__check mp-scene__check--2"><FiCheck /></span>
        <span className="mp-scene__check mp-scene__check--3"><FiCheck /></span>

        <div className="mp-app">
          <div className="mp-app__chrome">
            <i /><i /><i />
          </div>
          <div className="mp-app__top">
            <span className="mp-app__mark">m</span>
            <strong>Min verksamhet</strong>
            <span className="mp-app__tools">
              <FiSearch /> <FiBell /> <span className="mp-app__avatar">M</span>
            </span>
          </div>
          <div className="mp-app__body">
            <ul className="mp-app__side">
              <li className="is-current"><FiHome /> Hem</li>
              <li><FiCalendar /> Bokningar</li>
              <li><FiPackage /> Beställningar</li>
              <li><FiMessageSquare /> Kundförfrågningar</li>
              <li className="mp-app__side-gap"><FiUsers /> Kunder</li>
              <li><FiTag /> Produkter</li>
              <li><FiSettings /> Inställningar</li>
            </ul>

            <div className="mp-module mp-module--1">
              <div className="mp-module__title"><FiCalendar /> Bokningar <FiChevronRight /></div>
              <div className="mp-module__label">Denna vecka</div>
              <ul className="mp-module__rows">
                <li className="is-extra"><span>Mån</span><span>10:00</span><span>Klippning</span></li>
                <li className="mp-module__incoming"><span>Tis</span><span>14:00</span><span>Anna</span></li>
                <li className="is-extra"><span>Ons</span><span>11:00</span><span>Färgning</span></li>
                <li className="is-extra"><span>Tor</span><span>16:00</span><span>Klippning</span></li>
                <li className="is-extra"><span>Fre</span><span>13:00</span><span>Konsultation</span></li>
              </ul>
              <span className="mp-chip"><FiCheck /> Inbokad</span>
            </div>

            <div className="mp-module mp-module--2">
              <div className="mp-module__title"><FiPackage /> Beställningar <FiChevronRight /></div>
              <div className="mp-module__label">Senaste</div>
              <div className="mp-module__incoming mp-order">
                <span className="mp-order__thumb" />
                <span className="mp-order__text">
                  <b>Doftljus</b>
                  <small>1 × Doftljus</small>
                  <small className="is-extra">1 × Presentinslagning</small>
                </span>
              </div>
              <span className="mp-chip"><FiCheck /> Bekräftad</span>
              <span className="mp-skeleton is-extra" />
              <span className="mp-skeleton mp-skeleton--short is-extra" />
            </div>

            <div className="mp-module mp-module--3">
              <div className="mp-module__title"><FiMessageSquare /> Kundförfrågningar <FiChevronRight /></div>
              <div className="mp-module__label">Senaste</div>
              <div className="mp-module__incoming mp-inquiry">
                <span>Har ni öppet på lördag?</span>
                <small>10:24</small>
              </div>
              <span className="mp-chip"><FiCheck /> Besvarad</span>
              <span className="mp-skeleton is-extra" />
              <span className="mp-skeleton mp-skeleton--short is-extra" />
            </div>
          </div>
        </div>

        <div className="mp-scene__toast">
          <span><FiCheck /></span> Allt på ett ställe.
        </div>
        <span className="mp-scene__label">Illustrativt exempel</span>
      </div>
    </div>
  );
};

export default HeroScene;
