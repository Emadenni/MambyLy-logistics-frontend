import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { fill, useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { useSwipe } from "../useSwipe";
import { media } from "../media";

const IMAGES = ["about-people", "about-rethink", "about-build"];
const EASE = [0.22, 0.75, 0.18, 1] as const;

let remembered = 0;

/**
 * /omOss – the idea of MambyLy in three manual slides (no autoplay, no names or portraits).
 * The pictures are illustrative; the last slide leads to the contact wizard.
 */
const About: React.FC = () => {
  const t = useCopy();
  const a = t.about;
  const reduce = useReducedMotion() ?? false;
  const n = a.slides.length;
  const [index, setIndexState] = useState(remembered);
  const direction = useRef(1);
  const go = (i: number) => {
    if (i < 0 || i >= n || i === index) return;
    direction.current = i > index ? 1 : -1;
    remembered = i;
    setIndexState(i);
  };
  const { offset, handlers } = useSwipe({ onPrev: () => go(index - 1), onNext: () => go(index + 1), canPrev: index > 0, canNext: index < n - 1 });
  const slide = a.slides[index];
  const last = index === n - 1;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  const pad = (i: number) => String(i).padStart(2, "0");
  const slideMotion = reduce
    ? { initial: false as const }
    : {
        initial: { opacity: 0, x: 40 * direction.current },
        animate: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
        exit: { opacity: 0, x: -40 * direction.current, transition: { duration: 0.24 } },
      };

  return (
    <Screen
      id="about"
      head={<ScreenHead lang={t.lang} title={t.meta.about.title} description={t.meta.about.description} screen="about" />}
      bar={<TopBar crumbs={[{ label: t.nav.about }]} back={{ screen: "explore", label: t.common.explore }} />}
    >
      <h1 className="mp-sr" data-focus>
        {a.title}
      </h1>
      <section
        className="mp-story"
        aria-roledescription="carousel"
        aria-label={a.regionLabel}
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <motion.div className="mp-story__viewport" style={{ x: offset }} {...handlers}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={index}
              className="mp-story__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={fill(a.slideLabel, { i: index + 1, n })}
              {...slideMotion}
            >
              <h2 className="mp-display mp-story__title">{slide.title}</h2>
              <img
                className="mp-story__img"
                src={media(IMAGES[index], 720)}
                srcSet={`${media(IMAGES[index], 720)} 720w, ${media(IMAGES[index], 1200)} 1200w`}
                sizes="(min-width: 960px) 640px, 100vw"
                alt={`${t.common.illustrative}: ${slide.alt}`}
                width={720}
                height={540}
                decoding="async"
                draggable={false}
              />
              <p className="mp-story__text">{slide.text}</p>
              {last && (
                <Link to={PATHS.contact[t.lang]} className="mp-xbtn mp-xbtn--solid">
                  {a.cta} <FiArrowUpRight aria-hidden="true" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        <div className="mp-story__controls">
          <button type="button" className="mp-round" aria-label={a.prev} onClick={() => go(index - 1)} aria-disabled={index === 0}>
            <FiArrowLeft aria-hidden="true" />
          </button>
          <p className="mp-story__count" aria-live="polite">
            <span aria-hidden="true">{fill(a.position, { i: pad(index + 1), n: pad(n) })}</span>
            <span className="mp-sr">{fill(a.slideLabel, { i: index + 1, n })}</span>
          </p>
          <button type="button" className="mp-round" aria-label={a.next} onClick={() => go(index + 1)} aria-disabled={last}>
            <FiArrowRight aria-hidden="true" />
          </button>
        </div>
        <ol className="mp-story__dots" aria-hidden="true">
          {a.slides.map((s, i) => (
            <li key={s.title} className={i === index ? "is-on" : undefined} />
          ))}
        </ol>
        {!last && <p className="mp-story__hint">{a.hint}</p>}
      </section>
    </Screen>
  );
};

export default About;
