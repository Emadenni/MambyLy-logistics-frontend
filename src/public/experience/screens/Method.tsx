import React, { useId, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiCalendar, FiCheck, FiDatabase, FiEye } from "react-icons/fi";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { Wireframe } from "../icons";
import { media } from "../media";

type Mode = "show" | "book";
const EASE = [0.22, 0.75, 0.18, 1] as const;

/**
 * /webbplatser/vart-satt – "Enkelt på ytan. Möjligheter på djupet."
 * The three moments of the collaboration sit around one picture; the selector only changes that
 * picture and its sentence on this screen (nothing is sent, nothing is bought).
 */
const Method: React.FC = () => {
  const t = useCopy();
  const m = t.method;
  const reduce = useReducedMotion() ?? false;
  const [mode, setMode] = useState<Mode>("book");
  const name = useId();
  const pop = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 14, scale: 0.96 },
        animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.38, ease: EASE } },
        exit: { opacity: 0, y: 10, scale: 0.97, transition: { duration: 0.22 } },
      };

  return (
    <Screen
      id="method"
      head={<ScreenHead lang={t.lang} title={t.meta.method.title} description={t.meta.method.description} screen="method" />}
      bar={
        <TopBar
          crumbs={[{ label: t.nav.websites, to: PATHS.websites[t.lang] }, { label: t.nav.method }]}
          back={{ screen: "websites", label: t.common.back }}
          service="site"
        />
      }
    >
      <div className="mp-col mp-method">
        <h1 className="mp-display mp-method__title" data-focus>
          {m.title}
        </h1>
        <p className="mp-method__lead">{m.lead}</p>
      </div>

      <div className="mp-way">
        <ol className="mp-way__steps">
          {m.steps.map((s, i) => (
            <li key={s.title} className={`mp-way__step mp-way__step--${i + 1}`}>
              <span className="mp-way__dot" aria-hidden="true" />
              <strong>{s.title}</strong>
              <span>{s.sub}</span>
              <small>{s.text}</small>
            </li>
          ))}
        </ol>

        <svg className="mp-way__path" viewBox="0 0 400 460" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <path d="M36 52 C 6 110, 40 150, 92 150" />
          <path d="M318 200 C 360 210, 380 260, 340 300" />
          <path d="M70 380 C 40 330, 60 280, 110 262" />
          <path d="M150 410 C 220 440, 300 430, 330 380" />
        </svg>

        <div className="mp-way__picture" role="img" aria-label={mode === "book" ? m.previewBook : m.previewShow}>
          <Wireframe className="mp-way__wire" />
          <div className="mp-browser mp-way__site" aria-hidden="true">
            <span className="mp-browser__dots">
              <i />
              <i />
              <i />
            </span>
            <img src={media("preview-architecture-mobile", 390)} alt="" width={390} height={844} loading="lazy" decoding="async" draggable={false} />
          </div>
          <AnimatePresence initial={false}>
            {mode === "book" && (
              <motion.div key="booking" className="mp-way__widget mp-way__widget--booking" aria-hidden="true" {...pop}>
                <p className="mp-way__wtitle">
                  {m.booking.title} <FiCalendar />
                </p>
                <span className="mp-way__field">
                  {m.booking.date} <FiCalendar />
                </span>
                <span className="mp-way__send">
                  {m.booking.send} <FiArrowRight />
                </span>
              </motion.div>
            )}
            {mode === "book" && (
              <motion.div key="connect" className="mp-way__widget mp-way__widget--connect" aria-hidden="true" {...pop}>
                <FiDatabase className="mp-way__db" />
                <div>
                  <p className="mp-way__wtitle">{m.connect.title}</p>
                  <ul>
                    {m.connect.items.map((item) => (
                      <li key={item}>
                        <FiCheck /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mp-col mp-method__choose">
        <fieldset className="mp-segment">
          <legend className="mp-method__question">{m.question}</legend>
          {(["show", "book"] as Mode[]).map((key) => (
            <label key={key} className={`mp-segment__opt${mode === key ? " is-on" : ""}`}>
              <input type="radio" name={name} value={key} checked={mode === key} onChange={() => setMode(key)} />
              {key === "show" ? <FiEye aria-hidden="true" /> : <FiCalendar aria-hidden="true" />}
              <span>{m.modes[key].label}</span>
            </label>
          ))}
        </fieldset>
        <p className="mp-method__mode" aria-live="polite">
          {m.modes[mode].text}
        </p>
        <p className="mp-method__note">{m.modeNote}</p>

        <Link to={PATHS.contact[t.lang]} state={{ service: "site" }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
          {m.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
        <p className="mp-method__ctanote">{m.ctaNote}</p>
        <Link to={`${PATHS.services[t.lang]}#webbplats`} className="mp-underline mp-underline--small">
          {m.included} <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </Screen>
  );
};

export default Method;
