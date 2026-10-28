import React, { useId, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FiArrowDown } from "react-icons/fi";
import { fill } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

// Bigger size = the camera comes closer to the lamp on its plinth (the picture never shrinks).
const SCALE: Record<string, number> = { s: 1, m: 1.1, l: 1.22 };

/**
 * Lighting (kept from the earlier gallery, without the shop): one product page with a lot of air.
 * Size brings the lamp closer, the light changes the room, Tänd/Släck lights the shade, the details
 * open in place; the collection and the question form are showcase parts. Nothing is sold and the
 * question never leaves the browser.
 */
const Lighting: React.FC<{ c: ConceptCopy["lighting"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [size, setSize] = useState("m");
  const [light, setLight] = useState("morning");
  const [on, setOn] = useState(false);
  const [open, setOpen] = useState<number | null>(0);
  const [ask, setAsk] = useState({ name: "", question: "" });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);

  const sizeLabel = c.sizes.find((x) => x.id === size)!;
  const askOk = ask.name.trim().length > 1 && ask.question.trim().length > 2;

  return (
    <ConceptFrame id="lighting">
      <header className="cx-mi__head">
        <span className="cx-mi__mark">{c.wordmark}</span>
        <nav aria-label={c.wordmark} className="cx-mi__nav">
          <a href="#cx-mi-collection" onClick={(e) => (e.preventDefault(), goTo("cx-mi-collection"))}>
            {c.collectionNav}
          </a>
          <a href="#cx-mi-ask" onClick={(e) => (e.preventDefault(), goTo("cx-mi-ask"))}>
            {c.askNav}
          </a>
        </nav>
      </header>

      <main id="cx-main-lighting" className="cx-mi__main">
        <div className={`cx-mi__stage cx-mi__stage--${light}${on ? " is-on" : ""}`}>
          <motion.div className="cx-mi__lamp" animate={{ scale: SCALE[size] }} transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}>
            <img
              src={media("site-lighting", 1536)}
              srcSet={`${media("site-lighting", 900)} 900w, ${media("site-lighting", 1536)} 1536w`}
              sizes="(min-width: 960px) 560px, 100vw"
              alt=""
              width={1536}
              height={1024}
              decoding="async"
              fetchPriority="high"
            />
            <span className="cx-mi__glow" aria-hidden="true" />
          </motion.div>
        </div>

        <section className="cx-mi__info" aria-labelledby={`${ids}-title`}>
          <p className="cx-mi__kicker">{c.kicker}</p>
          <h1 id={`${ids}-title`} data-focus>
            {c.title}
          </h1>
          <h2 className="cx-mi__product">{c.product}</h2>
          <p className="cx-mi__intro">{c.intro}</p>

          <div className="cx-mi__switch" role="group" aria-label={c.lampLabel}>
            <button type="button" aria-pressed={on} className={on ? "is-on" : undefined} onClick={() => setOn(true)}>
              {c.on}
            </button>
            <button type="button" aria-pressed={!on} className={!on ? "is-on" : undefined} onClick={() => setOn(false)}>
              {c.off}
            </button>
          </div>

          <fieldset className="cx-mi__group">
            <legend>{c.size}</legend>
            <div className="cx-mi__sizes">
              {c.sizes.map((x) => (
                <label key={x.id} className={size === x.id ? "is-on" : undefined}>
                  <input type="radio" name={`${ids}-size`} value={x.id} checked={size === x.id} onChange={() => setSize(x.id)} />
                  {x.label}
                </label>
              ))}
            </div>
            <p className="cx-mi__dims" aria-live="polite">
              {sizeLabel.dims}
            </p>
          </fieldset>

          <fieldset className="cx-mi__group">
            <legend>{c.light}</legend>
            <div className="cx-mi__lights">
              {c.lights.map((x) => (
                <label key={x.id} className={light === x.id ? "is-on" : undefined}>
                  <input type="radio" name={`${ids}-light`} value={x.id} checked={light === x.id} onChange={() => setLight(x.id)} />
                  <span className={`cx-mi__dot cx-mi__dot--${x.id}`} aria-hidden="true" />
                  {x.label}
                </label>
              ))}
            </div>
          </fieldset>

          <a className="cx-mi__cta" href="#cx-mi-ask" onClick={(e) => (e.preventDefault(), goTo("cx-mi-ask"))}>
            {c.askNav} <FiArrowDown aria-hidden="true" />
          </a>

          <div className="cx-mi__details">
            {c.details.map((d, i) => (
              <div key={d.title} className="cx-mi__detail">
                <h3>
                  <button type="button" aria-expanded={open === i} aria-controls={`${ids}-d${i}`} onClick={() => setOpen(open === i ? null : i)}>
                    {d.title}
                    <span aria-hidden="true">{open === i ? "–" : "+"}</span>
                  </button>
                </h3>
                <p id={`${ids}-d${i}`} hidden={open !== i}>
                  {d.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="cx-mi-collection" className="cx-mi__collection" aria-labelledby={`${ids}-col`}>
          <h2 id={`${ids}-col`}>{c.collectionTitle}</h2>
          <p className="cx-mi__intro">{c.collectionLead}</p>
          <ul>
            {c.collection.map((item, i) => (
              <li key={item.name} className={item.current ? "is-current" : undefined}>
                <span className="cx-mi__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{item.name}</strong>
                <span>{item.text}</span>
                {item.current && <em>{c.current}</em>}
              </li>
            ))}
          </ul>
        </section>

        <section id="cx-mi-ask" className="cx-mi__ask" aria-labelledby={`${ids}-ask`}>
          <h2 id={`${ids}-ask`}>{c.askTitle}</h2>
          <p className="cx-mi__intro">{c.askLead}</p>
          {sent ? (
            <DemoNote onAgain={() => (setSent(false), setAsk({ name: "", question: "" }), setTried(false))} />
          ) : (
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault();
                setTried(true);
                if (askOk) setSent(true);
              }}
            >
              <p className="cx-mi__about">{fill(c.askSize, { size: `${sizeLabel.label} · ${c.product}` })}</p>
              <label htmlFor={`${ids}-n`}>{c.askName}</label>
              <input id={`${ids}-n`} autoComplete="off" value={ask.name} onChange={(e) => setAsk({ ...ask, name: e.target.value })} aria-invalid={tried && ask.name.trim().length < 2 ? true : undefined} />
              <label htmlFor={`${ids}-q`}>{c.askQuestion}</label>
              <textarea id={`${ids}-q`} rows={3} value={ask.question} onChange={(e) => setAsk({ ...ask, question: e.target.value })} aria-invalid={tried && ask.question.trim().length < 3 ? true : undefined} />
              <p role="alert" className="cx-mi__err">
                {tried && !askOk ? c.askError : ""}
              </p>
              <button type="submit" className="cx-mi__send">
                {c.askSend}
              </button>
            </form>
          )}
          <p className="cx-mi__note">{c.note}</p>
        </section>
      </main>

      <footer className="cx-foot">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Lighting;
