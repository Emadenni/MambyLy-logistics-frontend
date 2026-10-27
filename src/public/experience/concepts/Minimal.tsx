import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";
import { media } from "../media";
import { ConceptFrame } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

// Bigger size = the camera comes closer to the lamp on its plinth (the picture never shrinks).
const SCALE: Record<string, number> = { s: 1, m: 1.1, l: 1.22 };

/**
 * Minimal concept: one product, a lot of air and small precise interactions. Size changes the
 * lamp on its plinth, the light changes the room, the switch lights the shade, the bag counts.
 * Nothing is sold: there are no prices and no order.
 */
const Minimal: React.FC<{ c: ConceptCopy["minimal"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [size, setSize] = useState("m");
  const [light, setLight] = useState("morning");
  const [on, setOn] = useState(false);
  const [qty, setQty] = useState(1);
  const [bag, setBag] = useState(0);
  const [toast, setToast] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(false), 3200);
    return () => window.clearTimeout(id);
  }, [toast]);

  const dims = c.sizes.find((x) => x.id === size)!.dims;

  return (
    <ConceptFrame id="minimal">
      <header className="cx-mi__head">
        <span className="cx-mi__mark">{c.wordmark}</span>
        <span className="cx-mi__bag" aria-live="polite">
          <FiShoppingBag aria-hidden="true" /> {c.bag}
          <motion.span key={bag} className="cx-mi__count" initial={reduce ? false : { scale: 1.6 }} animate={{ scale: 1 }}>
            {bag}
          </motion.span>
        </span>
      </header>

      <main id="cx-main-minimal" className="cx-mi__main">
        <div className={`cx-mi__stage cx-mi__stage--${light}${on ? " is-on" : ""}`}>
          <motion.div
            className="cx-mi__lamp"
            animate={{ scale: SCALE[size] }}
            transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}
          >
            <img src={media("site-minimal", 1600)} srcSet={`${media("site-minimal", 900)} 900w, ${media("site-minimal", 1600)} 1600w`} sizes="(min-width: 960px) 60vw, 100vw" alt="" width={1600} height={1067} decoding="async" fetchPriority="high" />
            <span className="cx-mi__glow" aria-hidden="true" />
          </motion.div>
        </div>

        <section className="cx-mi__info" aria-labelledby={`${ids}-title`}>
          <h1 id={`${ids}-title`} data-focus>
            {c.product}
          </h1>
          <p className="cx-mi__intro">{c.intro}</p>

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
              {dims}
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

          <button type="button" className={`cx-mi__switch${on ? " is-on" : ""}`} role="switch" aria-checked={on} onClick={() => setOn((v) => !v)}>
            <span className="cx-mi__track" aria-hidden="true">
              <span />
            </span>
            {c.on}
          </button>

          <div className="cx-mi__buy">
            <div className="cx-mi__qty" role="group" aria-label={c.qty}>
              <button type="button" aria-label={c.less} onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
                <FiMinus aria-hidden="true" />
              </button>
              <output aria-live="polite">{qty}</output>
              <button type="button" aria-label={c.more} onClick={() => setQty((q) => Math.min(9, q + 1))} disabled={qty >= 9}>
                <FiPlus aria-hidden="true" />
              </button>
            </div>
            <button
              type="button"
              className="cx-mi__add"
              onClick={() => {
                setBag((b) => b + qty);
                setToast(true);
              }}
            >
              {c.add}
            </button>
          </div>
          <div role="status" className="cx-mi__toast">
            <AnimatePresence>
              {toast && (
                <motion.p initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  {c.addedToast}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div className="cx-mi__details">
            {c.details.map((d, i) => (
              <div key={d.title} className="cx-mi__detail">
                <h2>
                  <button type="button" aria-expanded={open === i} aria-controls={`${ids}-d${i}`} onClick={() => setOpen(open === i ? null : i)}>
                    {d.title}
                    <span aria-hidden="true">{open === i ? "–" : "+"}</span>
                  </button>
                </h2>
                <p id={`${ids}-d${i}`} hidden={open !== i}>
                  {d.text}
                </p>
              </div>
            ))}
          </div>
          <p className="cx-mi__note">{c.note}</p>
        </section>
      </main>

      <footer className="cx-foot">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Minimal;
