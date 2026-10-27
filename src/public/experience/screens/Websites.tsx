import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { fill, useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { useSwipe } from "../useSwipe";
import { media } from "../media";

const COVERS = ["gallery-norden", "gallery-atelje", "gallery-volt"];
const EASE = [0.22, 0.75, 0.18, 1] as const;

// Kept while the tab is open, so Back from "Se vad vi erbjuder" returns to the same concept.
let remembered = 0;

/** /webbplatser – one editorial composition: the question, a gallery of design concepts, the way on. */
const Websites: React.FC = () => {
  const t = useCopy();
  const reduce = useReducedMotion() ?? false;
  const slides = t.websites.slides;
  const n = slides.length;
  const [index, setIndexState] = useState(remembered);
  const setIndex = (i: number) => {
    remembered = (i + n) % n;
    setIndexState(remembered);
  };
  const prev = () => setIndex(index - 1);
  const next = () => setIndex(index + 1);
  const { offset, handlers } = useSwipe({ onPrev: prev, onNext: next });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    }
  };

  const pad = (i: number) => String(i).padStart(2, "0");

  return (
    <Screen
      id="websites"
      head={<ScreenHead lang={t.lang} title={t.meta.websites.title} description={t.meta.websites.description} screen="websites" />}
      bar={<TopBar crumbs={[{ label: t.nav.websites }]} back={{ screen: "explore", label: t.common.explore }} service="site" />}
    >
      <div className="mp-col mp-web">
        <h1 className="mp-display mp-web__title" data-focus>
          {t.websites.title}
        </h1>
        <p className="mp-web__lead">{t.websites.lead}</p>
      </div>

      <section
        className="mp-carousel"
        aria-roledescription="carousel"
        aria-label={t.websites.galleryLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <motion.div className="mp-carousel__track" style={{ x: offset }} {...handlers}>
          {slides.map((s, i) => {
            // Circular position relative to the current slide: -1, 0 or 1.
            const rel = ((i - index + n + 1) % n) - 1;
            const current = rel === 0;
            return (
              <motion.figure
                key={s.name}
                className={`mp-carousel__slide${current ? " is-current" : ""}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${fill(t.websites.position, { i: i + 1, n })}: ${s.name}`}
                aria-hidden={current ? undefined : true}
                initial={false}
                animate={{
                  x: `${rel * 74}%`,
                  scale: current ? 1 : 0.84,
                  opacity: current ? 1 : 0.7,
                  zIndex: current ? 2 : 1,
                }}
                transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE }}
                onClick={current ? undefined : () => setIndex(i)}
                {...(current ? {} : { inert: "" })}
              >
                <div className="mp-browser">
                  <span className="mp-browser__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <img
                    src={media(COVERS[i], 560)}
                    srcSet={`${media(COVERS[i], 560)} 560w, ${media(COVERS[i], 1086)} 1086w`}
                    sizes="(min-width: 960px) 400px, 66vw"
                    alt={s.alt}
                    width={560}
                    height={747}
                    loading={i === index ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                  />
                </div>
                <figcaption className="mp-carousel__caption">
                  <strong>{s.name}</strong> {s.caption}
                </figcaption>
              </motion.figure>
            );
          })}
        </motion.div>

        <div className="mp-carousel__controls">
          <button type="button" className="mp-round" aria-label={t.websites.prev} onClick={prev}>
            <FiArrowLeft aria-hidden="true" />
          </button>
          <p className="mp-carousel__count" aria-live="polite" aria-atomic="true">
            <span className="mp-sr">{slides[index].name}, </span>
            <span aria-hidden="true">
              {pad(index + 1)} <span className="mp-carousel__of">/ {pad(n)}</span>
            </span>
            <span className="mp-sr">{fill(t.websites.position, { i: index + 1, n })}</span>
          </p>
          <button type="button" className="mp-round" aria-label={t.websites.next} onClick={next}>
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
        <p className="mp-carousel__note">{t.websites.conceptNote}</p>
      </section>

      <div className="mp-col mp-web__end">
        <p className="mp-web__tagline">{t.websites.tagline}</p>
        <Link to={PATHS.method[t.lang]} className="mp-underline">
          {t.websites.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
        <p className="mp-web__foot" aria-hidden="true">
          {t.websites.foot}
        </p>
      </div>
    </Screen>
  );
};

export default Websites;
