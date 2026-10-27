import React, { useId, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { FiCheck, FiMinus, FiPlus } from "react-icons/fi";
import { fill } from "../i18n";
import { media } from "../media";
import { ConceptFrame, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

type Cat = "all" | "exhibition" | "talk" | "stage";
type Day = "fri" | "sat" | "sun";

/**
 * Typographic concept: a cultural programme where the type is the image. A strong grid, filters
 * by kind and day, events that open in place and a personal "evening" that collects them.
 */
const Typographic: React.FC<{ c: ConceptCopy["typographic"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [cat, setCat] = useState<Cat>("all");
  const [day, setDay] = useState<Day | "all">("all");
  const [open, setOpen] = useState<string | null>(null);
  const [plan, setPlan] = useState<string[]>([]);

  const items = c.items.filter((i) => (cat === "all" || i.cat === cat) && (day === "all" || i.day === day));
  const toggle = (id: string) => setPlan((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const planned = c.items.filter((i) => plan.includes(i.id));
  const spring = reduce ? { duration: 0 } : { type: "spring" as const, stiffness: 380, damping: 34 };

  return (
    <ConceptFrame id="typographic" tone="dark">
      <header className="cx-ty__head">
        <span className="cx-ty__mark">{c.wordmark}</span>
        <nav aria-label={c.wordmark}>
          <a href="#cx-ty-program" onClick={(e) => (e.preventDefault(), goTo("cx-ty-program"))}>
            {c.navProgram}
          </a>
          <a href="#cx-ty-plan" onClick={(e) => (e.preventDefault(), goTo("cx-ty-plan"))}>
            {c.navPlan} <span className="cx-ty__badge">{plan.length}</span>
          </a>
        </nav>
      </header>

      <main id="cx-main-typographic">
        <section className="cx-ty__hero">
          <img src={media("site-typographic", 1600)} srcSet={`${media("site-typographic", 900)} 900w, ${media("site-typographic", 1600)} 1600w`} sizes="100vw" alt="" width={1600} height={1067} decoding="async" fetchPriority="high" />
          <p className="cx-ty__season">{c.season}</p>
          <h1 data-focus>
            {c.titleLines.map((w, i) => (
              <span key={w} className={`cx-ty__word cx-ty__word--${i}`}>
                {w}
              </span>
            ))}
          </h1>
          <p className="cx-ty__lead">{c.lead}</p>
        </section>

        <section id="cx-ty-program" className="cx-ty__program" aria-labelledby={`${ids}-prog`}>
          <h2 id={`${ids}-prog`} className="cx-ty__h2">
            {c.navProgram}
          </h2>
          <div className="cx-ty__filters">
            <fieldset>
              <legend>{c.filterLabel}</legend>
              {(Object.keys(c.categories) as Cat[]).map((k) => (
                <label key={k} className={`cx-ty__chip${cat === k ? " is-on" : ""}`}>
                  <input type="radio" name={`${ids}-cat`} value={k} checked={cat === k} onChange={() => setCat(k)} />
                  {c.categories[k]}
                </label>
              ))}
            </fieldset>
            <fieldset>
              <legend>{c.dayLabel}</legend>
              {(["all", "fri", "sat", "sun"] as const).map((k) => (
                <label key={k} className={`cx-ty__chip cx-ty__chip--day${day === k ? " is-on" : ""}`}>
                  <input type="radio" name={`${ids}-day`} value={k} checked={day === k} onChange={() => setDay(k)} />
                  {k === "all" ? c.categories.all : c.days[k]}
                </label>
              ))}
            </fieldset>
          </div>
          <p className="cx-ty__count" aria-live="polite">
            {fill(c.count, { n: items.length })}
          </p>

          <LayoutGroup>
            <ul className="cx-ty__list">
              <AnimatePresence initial={false}>
                {items.map((i) => {
                  const isOpen = open === i.id;
                  const inPlan = plan.includes(i.id);
                  return (
                    <motion.li
                      key={i.id}
                      layout={!reduce}
                      initial={reduce ? false : { opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.15 } }}
                      transition={spring}
                      className={`cx-ty__item${isOpen ? " is-open" : ""}`}
                    >
                      <h3>
                        <button type="button" aria-expanded={isOpen} aria-controls={`${ids}-${i.id}`} onClick={() => setOpen(isOpen ? null : i.id)}>
                          <span className="cx-ty__time">
                            {c.days[i.day as Day]} {i.time}
                          </span>
                          <span className="cx-ty__title">{i.title}</span>
                          <span className="cx-ty__cat">{c.categories[i.cat as Cat]}</span>
                          <span className="cx-ty__sign" aria-hidden="true">
                            {isOpen ? <FiMinus /> : <FiPlus />}
                          </span>
                        </button>
                      </h3>
                      <div id={`${ids}-${i.id}`} className="cx-ty__more" hidden={!isOpen}>
                        <p>{i.text}</p>
                        <button type="button" className={`cx-ty__add${inPlan ? " is-on" : ""}`} aria-pressed={inPlan} onClick={() => toggle(i.id)}>
                          {inPlan ? <FiCheck aria-hidden="true" /> : <FiPlus aria-hidden="true" />} {inPlan ? c.added : c.add}
                        </button>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </LayoutGroup>
          {items.length === 0 && <p className="cx-ty__empty">{c.empty}</p>}
        </section>

        <section id="cx-ty-plan" className="cx-ty__plan" aria-labelledby={`${ids}-plan`}>
          <h2 id={`${ids}-plan`} className="cx-ty__h2">
            {c.planTitle}
          </h2>
          {planned.length === 0 ? (
            <p className="cx-ty__empty">{c.planEmpty}</p>
          ) : (
            <>
              <ol>
                {planned
                  .slice()
                  .sort((a, b) => (a.day + a.time).localeCompare(b.day + b.time))
                  .map((i) => (
                    <li key={i.id}>
                      <span>
                        {c.days[i.day as Day]} {i.time}
                      </span>
                      <strong>{i.title}</strong>
                    </li>
                  ))}
              </ol>
              <button type="button" className="cx-ty__clear" onClick={() => setPlan([])}>
                {c.planClear}
              </button>
            </>
          )}
        </section>
      </main>

      <footer className="cx-foot cx-foot--dark">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Typographic;
