import React, { useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowDown, FiArrowLeft, FiArrowRight, FiMinus, FiPlus } from "react-icons/fi";
import { fill } from "../i18n";
import { media } from "../media";
import { ConceptFrame, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

const IMG = media("site-visual", 1600);
const IMG_SMALL = media("site-visual", 900);

/** A fixed, made-up month: 30 days starting on a Monday; some days are "taken" (simulated). */
const DAYS = 30;
const TAKEN = new Set([3, 4, 5, 11, 12, 18, 19, 20, 21, 27]);

/**
 * Visual concept: the photograph carries the page. A fullscreen opening, moments of the evening
 * in a horizontal strip, then a three-step booking path on explicitly simulated availability.
 */
const Visual: React.FC<{ c: ConceptCopy["visual"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [step, setStep] = useState(0);
  const [start, setStart] = useState<number | null>(null);
  const [end, setEnd] = useState<number | null>(null);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [sent, setSent] = useState(false);
  const stepTitle = useRef<HTMLHeadingElement>(null);

  const rangeFree = (a: number, b: number) => {
    for (let d = a; d < b; d++) if (TAKEN.has(d)) return false;
    return true;
  };

  const pick = (d: number) => {
    if (TAKEN.has(d)) return;
    if (start === null || end !== null || d <= start || !rangeFree(start, d)) {
      setStart(d);
      setEnd(null);
    } else {
      setEnd(d);
    }
  };

  const nights = start !== null && end !== null ? end - start : 0;
  const go = (n: number) => {
    setStep(n);
    window.setTimeout(() => stepTitle.current?.focus({ preventScroll: true }), 30);
  };
  const reset = () => {
    setStart(null);
    setEnd(null);
    setAdults(2);
    setChildren(0);
    setSent(false);
    go(0);
  };
  const date = (d: number) => `${d} ${c.month.toLowerCase()}`;

  return (
    <ConceptFrame id="visual" tone="dark">
      <header className="cx-vi__head">
        <span className="cx-vi__mark">{c.wordmark}</span>
        <a href="#cx-vi-book" className="cx-vi__booknav" onClick={(e) => (e.preventDefault(), goTo("cx-vi-book"))}>
          {c.bookNav}
        </a>
      </header>

      <main id="cx-main-visual">
        <section className="cx-vi__hero">
          <img src={IMG} srcSet={`${IMG_SMALL} 900w, ${IMG} 1600w`} sizes="100vw" alt="" width={1600} height={1067} decoding="async" fetchPriority="high" />
          <div className="cx-vi__herotext">
            <p className="cx-vi__kicker">{c.kicker}</p>
            <h1 data-focus>{c.title}</h1>
            <p>{c.lead}</p>
            <a href="#cx-vi-moments" className="cx-vi__scroll" onClick={(e) => (e.preventDefault(), goTo("cx-vi-moments"))}>
              {c.scroll} <FiArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="cx-vi-moments" className="cx-vi__moments" aria-labelledby={`${ids}-m`}>
          <h2 id={`${ids}-m`}>{c.momentsTitle}</h2>
          <ul className="cx-vi__strip">
            {c.moments.map((m) => (
              <li key={m.title}>
                <figure>
                  <div className="cx-vi__crop" style={{ backgroundImage: `url(${IMG_SMALL})`, backgroundPosition: m.pos }} role="presentation" />
                  <figcaption>
                    <strong>{m.title}</strong> {m.text}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        <section id="cx-vi-book" className="cx-vi__book" aria-labelledby={`${ids}-b`}>
          <h2 id={`${ids}-b`}>{c.bookTitle}</h2>
          <p className="cx-vi__sim">{c.simulated}</p>
          <ol className="cx-vi__steps" aria-label={c.bookTitle}>
            {c.steps.map((name, i) => (
              <li key={name} className={i === step ? "is-on" : i < step ? "is-done" : undefined} aria-current={i === step ? "step" : undefined}>
                <span aria-hidden="true">{i + 1}</span> {name}
              </li>
            ))}
          </ol>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              className="cx-vi__panel"
              initial={reduce ? { opacity: 1 } : { opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0, transition: { duration: reduce ? 0 : 0.3 } }}
              exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, x: -24, transition: { duration: 0.16 } }}
            >
              <h3 ref={stepTitle} tabIndex={-1}>
                {c.steps[step]}
              </h3>

              {step === 0 && (
                <>
                  <p className="cx-vi__hint" aria-live="polite">
                    {start === null || end !== null ? c.pickStart : c.pickEnd}
                    {nights > 0 && ` · ${nights === 1 ? c.night : fill(c.nights, { n: nights })}`}
                  </p>
                  <div className="cx-vi__cal" role="group" aria-label={c.month}>
                    <p className="cx-vi__month" aria-hidden="true">
                      {c.month}
                    </p>
                    {c.weekdays.map((w) => (
                      <span key={w} className="cx-vi__wd" aria-hidden="true">
                        {w}
                      </span>
                    ))}
                    {Array.from({ length: DAYS }, (_, i) => i + 1).map((d) => {
                      const taken = TAKEN.has(d);
                      const sel = d === start || d === end;
                      const inRange = start !== null && end !== null && d > start && d < end;
                      return (
                        <button
                          key={d}
                          type="button"
                          className={`cx-vi__day${taken ? " is-taken" : ""}${sel ? " is-sel" : ""}${inRange ? " is-range" : ""}`}
                          disabled={taken}
                          aria-pressed={sel || inRange}
                          aria-label={`${date(d)}, ${taken ? c.taken : c.free}`}
                          onClick={() => pick(d)}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                  <div className="cx-vi__nav">
                    <span />
                    <button type="button" className="cx-vi__next" disabled={nights === 0} onClick={() => go(1)}>
                      {c.nextStep} <FiArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}

              {step === 1 && (
                <>
                  {[
                    { label: c.adults, value: adults, set: setAdults, min: 1 },
                    { label: c.children, value: children, set: setChildren, min: 0 },
                  ].map((g) => (
                    <div key={g.label} className="cx-vi__counter" role="group" aria-label={g.label}>
                      <span>{g.label}</span>
                      <button type="button" aria-label={`${g.label} −`} disabled={g.value <= g.min} onClick={() => g.set(g.value - 1)}>
                        <FiMinus aria-hidden="true" />
                      </button>
                      <output aria-live="polite">{g.value}</output>
                      <button type="button" aria-label={`${g.label} +`} disabled={adults + children >= 6} onClick={() => g.set(g.value + 1)}>
                        <FiPlus aria-hidden="true" />
                      </button>
                    </div>
                  ))}
                  <div className="cx-vi__nav">
                    <button type="button" className="cx-vi__prev" onClick={() => go(0)}>
                      <FiArrowLeft aria-hidden="true" /> {c.prevStep}
                    </button>
                    <button type="button" className="cx-vi__next" onClick={() => go(2)}>
                      {c.nextStep} <FiArrowRight aria-hidden="true" />
                    </button>
                  </div>
                </>
              )}

              {step === 2 && start !== null && end !== null && (
                <>
                  <dl className="cx-vi__sum">
                    <div>
                      <dt>{c.arrive}</dt>
                      <dd>{date(start)}</dd>
                    </div>
                    <div>
                      <dt>{c.leave}</dt>
                      <dd>{date(end)}</dd>
                    </div>
                    <div>
                      <dt>{c.guests}</dt>
                      <dd>
                        {adults} {c.adults.toLowerCase()}
                        {children > 0 && `, ${children} ${c.children.toLowerCase()}`}
                      </dd>
                    </div>
                    <div>
                      <dt>{c.summary}</dt>
                      <dd>{nights === 1 ? c.night : fill(c.nights, { n: nights })}</dd>
                    </div>
                  </dl>
                  <p role="status" className="cx-vi__sent">
                    {sent ? c.sent : ""}
                  </p>
                  <div className="cx-vi__nav">
                    <button type="button" className="cx-vi__prev" onClick={sent ? reset : () => go(1)}>
                      <FiArrowLeft aria-hidden="true" /> {sent ? c.again : c.prevStep}
                    </button>
                    {!sent && (
                      <button type="button" className="cx-vi__next" onClick={() => setSent(true)}>
                        {c.request} <FiArrowRight aria-hidden="true" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </section>
      </main>

      <footer className="cx-foot cx-foot--dark">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Visual;
