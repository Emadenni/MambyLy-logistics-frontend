import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiEdit3, FiMail, FiMessageCircle } from "react-icons/fi";
import { publicContact } from "../../contact";
import { useCopy } from "../i18n";
import { media } from "../media";
import { PATHS, pathFor } from "../routes";

/**
 * The pieces the contact card is put together from: a grid of cells, each cut along its diagonal
 * into two triangles; every piece comes from its own direction, turning in 3D, and lands in place.
 * Each shows its own part of the card's surface (background size and position from its cell).
 */
const COLS = 6;
const ROWS = 5;
const PIECES = Array.from({ length: COLS * ROWS * 2 }, (_, n) => {
  const cell = n >> 1;
  const half = n & 1;
  const col = cell % COLS;
  const row = Math.floor(cell / COLS);
  const seed = (n * 97 + 31) % 101;
  const side = col < COLS / 2 ? -1 : 1;
  // the round corners of the card: on the piece that holds each corner
  const top = row === 0;
  const bottom = row === ROWS - 1;
  const left = col === 0;
  const right = col === COLS - 1;
  const radius = [top && left && !half, top && right, bottom && right && half, bottom && left && !half]
    .map((on) => (on ? "32px" : "0"))
    .join(" ");
  return {
    col,
    row,
    half,
    radius,
    dx: side * (30 + (seed % 50)) + (col - COLS / 2) * 8,
    dy: (row - ROWS / 2) * 18 + ((seed * 7) % 60) - 30,
    rz: ((seed * 13) % 360) - 180,
    rx: ((seed * 5) % 140) - 70,
    ry: ((seed * 11) % 160) - 80,
    delay: ((Math.abs(col - (COLS - 1) / 2) + Math.abs(row - (ROWS - 1) / 2)) * 0.07 + (seed % 7) * 0.025).toFixed(3),
  };
});

/**
 * What has already made its entrance in this tab: coming back to Utforska (from a demo, with Back)
 * shows it as it was left, without playing it again ("is-done" turns its motion off).
 */
const shown = new Set<string>();
const showDone = (el: HTMLElement, name: string) => {
  if (!shown.has(name)) return false;
  el.classList.add("is-in", "is-done");
  return true;
};

/** Adds "is-in" to an element the first time it comes into view (CSS does the rest). */
const useReveal = <T extends HTMLElement>(name: string) => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || showDone(el, name)) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        shown.add(name);
        seen.disconnect();
      },
      { threshold: 0.35 },
    );
    seen.observe(el);
    return () => seen.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
};

/**
 * The end of Utforska: three steps (listen, design and build, go live) that draw in one after the
 * other, then the contact: the two services with the same weight, the written ways in (form, e-mail,
 * WhatsApp – no phone) and the way to the demos for those who want to see more first.
 */
const Closing: React.FC = () => {
  const t = useCopy();
  const st = t.story.steps;
  const c = t.story.contact;
  const contactPath = pathFor("contact", t.lang);
  const whatsapp = t.lang === "sv" ? publicContact.whatsappGreetingUrl : publicContact.whatsappUrl;
  const steps = useReveal<HTMLOListElement>("steps");
  const panel = useReveal<HTMLDivElement>("contact");
  const built = useRef(false);

  // The card puts itself together once, when it is well into the screen (read from the scroll
  // position: robust whatever contains the section).
  useEffect(() => {
    const el = panel.current;
    if (!el || showDone(el, "contact") || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (built.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.62 && r.bottom > 0) {
        built.current = true;
        shown.add("contact");
        el.classList.add("is-in");
      }
    };
    const ask = () => (frame ||= requestAnimationFrame(check));
    window.addEventListener("scroll", ask, { passive: true });
    check();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", ask);
    };
  }, []);

  return (
    <>
      <section className="mp-demos mp-howto" aria-labelledby="steps-title">
        <header className="mp-demos__head">
          <p className="mp-demos__kicker">{st.kicker}</p>
          <h2 id="steps-title" className="mp-demos__title">
            {st.title}
          </h2>
        </header>
        <ol ref={steps} className="mp-howto__list">
          {st.items.map((item, i) => (
            <li key={item.title} className="mp-howto__item" style={{ "--i": i } as React.CSSProperties}>
              <span className="mp-howto__num" aria-hidden="true">
                {i + 1}
              </span>
              <h3 className="mp-howto__title">{item.title}</h3>
              <p className="mp-howto__text">{item.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mp-close" aria-labelledby="tale-contact">
        <div ref={panel} className="mp-close__panel">
          <div className="mp-close__pieces" aria-hidden="true" style={{ "--cols": COLS, "--rows": ROWS } as React.CSSProperties}>
            {PIECES.map((p, i) => (
              <i
                key={i}
                className={`mp-close__piece mp-close__piece--${p.half ? "b" : "a"}`}
                style={
                  {
                    "--c": p.col,
                    "--r": p.row,
                    "--dx": `${p.dx}vw`,
                    "--dy": `${p.dy}vh`,
                    "--rz": `${p.rz}deg`,
                    "--rx": `${p.rx}deg`,
                    "--ry": `${p.ry}deg`,
                    "--d": `${p.delay}s`,
                    borderRadius: p.radius,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>
          <p className="mp-close__kicker">{c.kicker}</p>
          <h2 id="tale-contact" className="mp-close__title">
            {c.title}
          </h2>
          <p className="mp-close__lead">{c.lead}</p>
          <div className="mp-close__choices">
            <Link to={contactPath} state={{ service: "site" }} className="mp-close__choice">
              <span>{c.website}</span> <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to={contactPath} state={{ service: "card" }} className="mp-close__choice">
              <span>{c.card}</span> <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <p className="mp-close__write">{c.write}</p>
          <ul className="mp-close__ways">
            <li>
              <Link to={contactPath} className="mp-close__way">
                <FiEdit3 aria-hidden="true" />
                <strong>{c.form}</strong>
                <span>{c.formText}</span>
              </Link>
            </li>
            <li>
              <a href={`mailto:${publicContact.email}`} className="mp-close__way">
                <FiMail aria-hidden="true" />
                <strong>{c.email}</strong>
                <span>{publicContact.email}</span>
              </a>
            </li>
            <li>
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mp-close__way">
                <FiMessageCircle aria-hidden="true" />
                <strong>{c.whatsapp}</strong>
                <span>{c.whatsappText}</span>
              </a>
            </li>
          </ul>

          <div className="mp-close__demos">
            <p>{c.seeFirst}</p>
            <Link to={PATHS.examples[t.lang]} className="mp-close__demo">
              {t.story.cardDemos} <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to={PATHS.websites[t.lang]} className="mp-close__demo">
              {t.story.siteDemos} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="mp-close__about">
          <img src={media("people-collaboration", 720)} alt="" width={720} height={480} loading="lazy" decoding="async" />
          <Link to={PATHS.about[t.lang]} className="mp-close__aboutlink">
            {t.explore.aboutLink} <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
};

export default Closing;
