import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiRotateCcw } from "react-icons/fi";
import { fill } from "../i18n";
import { media } from "../media";
import { ConceptFrame } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

type Choice = { tempo: "calm" | "lively"; colour: "blue" | "coral" | "green"; shape: "soft" | "sharp" };
const START: Choice = { tempo: "calm", colour: "blue", shape: "soft" };

/** What each answer does to the page: hue of the sculpture, accent colour, corners, type weight. */
const HUE = { blue: 0, coral: 150, green: -78 };
const ACCENT = { blue: "#1f47c8", coral: "#c9442c", green: "#2c6a4c" };
const TINT = { blue: "#eef2fc", coral: "#fcf0ec", green: "#edf4ef" };

/**
 * Interactive concept: a short path of choices. Every answer changes something you can see at
 * once – the sculpture's motion and colour, the page's accent, corners and type – and the text
 * that sums the combination up.
 */
const Interactive: React.FC<{ c: ConceptCopy["interactive"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [choice, setChoice] = useState<Choice>(START);
  const [changed, setChanged] = useState("");

  const set = (q: keyof Choice, value: string, label: string) => {
    setChoice((v) => ({ ...v, [q]: value }));
    setChanged(fill(c.changed, { what: label }));
  };

  const lively = choice.tempo === "lively";
  const float = reduce
    ? {}
    : {
        animate: lively ? { y: [0, -22, 0, 14, 0], rotate: [0, 6, -4, 3, 0] } : { y: [0, -10, 0], rotate: [0, 1.5, 0] },
        transition: { duration: lively ? 2.6 : 7, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <ConceptFrame
      id="interactive"
      className={`cx-in--${choice.shape} cx-in--${choice.tempo}`}
    >
      <div
        className="cx-in__page"
        style={{ "--cx-accent": ACCENT[choice.colour], "--cx-tint": TINT[choice.colour] } as React.CSSProperties}
      >
        <header className="cx-in__head">
          <span className="cx-in__mark">{c.wordmark}</span>
          <button type="button" className="cx-in__reset" onClick={() => (setChoice(START), setChanged(""))}>
            <FiRotateCcw aria-hidden="true" /> {c.reset}
          </button>
        </header>

        <main id="cx-main-interactive" className="cx-in__main">
          <div className="cx-in__visual" aria-hidden="true">
            <motion.img
              key={choice.tempo}
              src={media("site-interactive", 1600)}
              srcSet={`${media("site-interactive", 900)} 900w, ${media("site-interactive", 1600)} 1600w`}
              sizes="(min-width: 960px) 55vw, 100vw"
              alt=""
              width={1600}
              height={1067}
              decoding="async"
              fetchPriority="high"
              style={{ filter: `hue-rotate(${HUE[choice.colour]}deg)` }}
              {...float}
            />
          </div>

          <div className="cx-in__text">
            <p className="cx-in__kicker">{c.kicker}</p>
            <h1 data-focus>{c.title}</h1>
            <p className="cx-in__lead">{c.lead}</p>

            {c.questions.map((q, qi) => (
              <fieldset key={q.id} className="cx-in__q">
                <legend>
                  <span className="cx-in__qno">{qi + 1}</span> {q.q}
                </legend>
                <div className="cx-in__opts">
                  {q.options.map((o) => {
                    const on = choice[q.id as keyof Choice] === o.id;
                    return (
                      <label key={o.id} className={on ? "is-on" : undefined}>
                        <input type="radio" name={`${ids}-${q.id}`} value={o.id} checked={on} onChange={() => set(q.id as keyof Choice, o.id, o.label)} />
                        <strong>{o.label}</strong>
                        <small>{o.effect}</small>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
            ))}

            <section className="cx-in__result" aria-labelledby={`${ids}-r`}>
              <h2 id={`${ids}-r`}>{c.resultTitle}</h2>
              <p className="cx-in__headline">{c.headlines[choice.tempo]}</p>
              <p>
                {fill(c.resultText, {
                  colour: c.colourWords[choice.colour],
                  shape: c.shapeWords[choice.shape],
                  tempo: c.tempoWords[choice.tempo],
                })}
              </p>
            </section>
            <p className="mp-sr" aria-live="polite">
              {changed}
            </p>
          </div>
        </main>

        <footer className="cx-foot">{s.footer}</footer>
      </div>
    </ConceptFrame>
  );
};

export default Interactive;
