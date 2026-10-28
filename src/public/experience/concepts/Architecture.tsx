import React, { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowDown, FiX } from "react-icons/fi";
import { media } from "../media";
import { ConceptFrame, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

const IMG = media("site-architecture", 1536);
const IMG_SMALL = media("site-architecture", 900);

/** Where each room sits in the master picture (background-position) and on the plan. */
const ROOMS: Record<string, { pos: string; plan: string }> = {
  terrass: { pos: "78% 78%", plan: "M40 150 C 110 178, 220 176, 282 128 L 282 150 C 220 196, 110 198, 40 172 Z" },
  vardagsrum: { pos: "90% 58%", plan: "M150 70 L 282 70 L 282 124 C 240 150, 190 158, 150 156 Z" },
  pool: { pos: "52% 92%", plan: "M24 100 L 140 100 L 140 146 C 90 146, 54 140, 24 128 Z" },
  bibliotek: { pos: "96% 30%", plan: "M190 18 L 282 18 L 282 64 L 190 64 Z" },
};

/**
 * Architecture (kept from the earlier gallery): one project told as a feature story. Serif type,
 * generous columns, a plan whose rooms open a detail panel, materials and a viewing request that
 * stays in the browser. The section links are always visible (no hamburger).
 */
const Architecture: React.FC<{ c: ConceptCopy["architecture"]; s: ConceptCopy["shared"] }> = ({ c, s }) => {
  const reduce = useReducedMotion() ?? false;
  const [room, setRoom] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const ids = useId();
  const current = c.rooms.find((r) => r.id === room);

  const nav = (id: string) => goTo(`cx-ed-${id}`);

  return (
    <ConceptFrame id="architecture">
      <header className="cx-ed__head">
        <button type="button" className="cx-ed__mark" onClick={() => window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" })}>
          {c.wordmark}
        </button>
        <nav className="cx-ed__nav" aria-label={c.wordmark}>
          <ul>
            {c.nav.map((n) => (
              <li key={n.id}>
                <a href={`#cx-ed-${n.id}`} onClick={(e) => (e.preventDefault(), nav(n.id))}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="cx-main-architecture">
        <section className="cx-ed__hero">
          <img src={IMG} srcSet={`${IMG_SMALL} 900w, ${IMG} 1536w`} sizes="100vw" alt="" width={1536} height={1024} decoding="async" fetchPriority="high" />
          <div className="cx-ed__herotext">
            <p className="cx-ed__kicker">{c.kicker}</p>
            <h1 data-focus>{c.title}</h1>
            <p className="cx-ed__lead">{c.lead}</p>
            <a className="cx-ed__read" href="#cx-ed-huset" onClick={(e) => (e.preventDefault(), nav("huset"))}>
              {c.readTime} <FiArrowDown aria-hidden="true" />
            </a>
          </div>
        </section>

        <section id="cx-ed-huset" className="cx-ed__story" aria-label={c.nav[0].label}>
          <div className="cx-ed__columns">
            {c.intro.map((p, i) => (
              <p key={i} className={i === 0 ? "cx-ed__drop" : undefined}>
                {p}
              </p>
            ))}
          </div>
          <blockquote className="cx-ed__quote">
            <p>{c.quote}</p>
            <footer>— {c.quoteBy}</footer>
          </blockquote>
        </section>

        <section id="cx-ed-rummen" className="cx-ed__rooms" aria-labelledby={`${ids}-rooms`}>
          <div className="cx-ed__roomshead">
            <h2 id={`${ids}-rooms`}>{c.roomsTitle}</h2>
            <p>{c.roomsLead}</p>
          </div>
          <div className="cx-ed__roomsgrid">
            <svg className="cx-ed__plan" viewBox="0 0 300 200" role="img" aria-label={c.planLabel}>
              <path className="cx-ed__planwall" d="M16 92 C 16 40, 60 12, 120 12 L 290 12 L 290 156 C 220 204, 100 206, 16 176 Z" />
              {c.rooms.map((r) => (
                <path
                  key={r.id}
                  d={ROOMS[r.id].plan}
                  className={`cx-ed__planroom${room === r.id ? " is-on" : ""}`}
                  onClick={() => setRoom(r.id)}
                >
                  <title>{r.name}</title>
                </path>
              ))}
            </svg>
            <ul className="cx-ed__roomlist">
              {c.rooms.map((r, i) => (
                <li key={r.id}>
                  <button
                    type="button"
                    aria-expanded={room === r.id}
                    aria-controls={`${ids}-detail`}
                    className={room === r.id ? "is-on" : undefined}
                    onClick={() => setRoom(room === r.id ? null : r.id)}
                  >
                    <span className="cx-ed__no">{String(i + 1).padStart(2, "0")}</span>
                    <span>{r.name}</span>
                    <span className="cx-ed__area">{r.area}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div id={`${ids}-detail`} className="cx-ed__detailwrap" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              {current && (
                <motion.article
                  key={current.id}
                  className="cx-ed__detail"
                  initial={reduce ? { opacity: 1 } : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: reduce ? 0 : 0.36 } }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -8, transition: { duration: 0.18 } }}
                >
                  <div className="cx-ed__crop" style={{ backgroundImage: `url(${IMG_SMALL})`, backgroundPosition: ROOMS[current.id].pos }} role="presentation" />
                  <div className="cx-ed__detailtext">
                    <h3>{current.name}</h3>
                    <p>{current.text}</p>
                    <dl>
                      <div>
                        <dt>{c.facts.area}</dt>
                        <dd>{current.area}</dd>
                      </div>
                      <div>
                        <dt>{c.facts.light}</dt>
                        <dd>{current.light}</dd>
                      </div>
                      <div>
                        <dt>{c.facts.material}</dt>
                        <dd>{current.material}</dd>
                      </div>
                    </dl>
                    <button type="button" className="cx-ed__close" onClick={() => setRoom(null)}>
                      <FiX aria-hidden="true" /> {s.close}
                    </button>
                  </div>
                </motion.article>
              )}
            </AnimatePresence>
          </div>
        </section>

        <section id="cx-ed-material" className="cx-ed__materials" aria-labelledby={`${ids}-mat`}>
          <h2 id={`${ids}-mat`}>{c.materialsTitle}</h2>
          <ul>
            {c.materials.map((m, i) => (
              <li key={m.name}>
                <span className={`cx-ed__swatch cx-ed__swatch--${i}`} aria-hidden="true" />
                <strong>{m.name}</strong>
                <span>{m.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id="cx-ed-visning" className="cx-ed__visit" aria-labelledby={`${ids}-visit`}>
          <h2 id={`${ids}-visit`}>{c.visitTitle}</h2>
          <p>{c.visitLead}</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label>
              <span>{c.name}</span>
              <input name="cx-name" autoComplete="off" required />
            </label>
            <label>
              <span>{c.date}</span>
              <input name="cx-date" type="date" required />
            </label>
            <button type="submit">{c.send}</button>
            <p role="status" className="cx-ed__sent">
              {sent ? s.demoSent : ""}
            </p>
          </form>
        </section>
      </main>
    </ConceptFrame>
  );
};

export default Architecture;
