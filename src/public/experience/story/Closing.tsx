import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiEdit3, FiMail, FiMessageCircle } from "react-icons/fi";
import { publicContact } from "../../contact";
import { useCopy } from "../i18n";
import { media } from "../media";
import { PATHS, pathFor } from "../routes";

/** Sparks of the burst: angle, distance (share of the screen's larger side), size, delay, colour. */
const SPARKS = Array.from({ length: 90 }, (_, i) => {
  const a = (i / 90) * 360 + ((i * 47) % 13) - 6;
  const far = 0.25 + ((i * 37) % 31) / 40;
  return {
    a,
    far,
    size: 5 + ((i * 13) % 14),
    delay: ((i * 29) % 14) * 0.02,
    tone: ["#f2cc58", "#f6f4ee", "#cfdcd4", "#e4c98a", "#ffffff"][i % 5],
  };
});
const BOOM_MS = 2200;

/**
 * The moment the contact arrives: over the whole screen, a flash that fills it, waves that leave
 * its edges and sparks everywhere, from the contact's title; then it clears and the contact stays.
 */
const Boom: React.FC<{ at: { x: number; y: number }; onEnd: () => void }> = ({ at, onEnd }) => {
  useEffect(() => {
    const id = window.setTimeout(onEnd, BOOM_MS);
    return () => window.clearTimeout(id);
  }, [onEnd]);
  // inside the site (its styles live under .mambyly-public); fixed, so it covers the screen
  return (
    <div className="mp-boom" aria-hidden="true" style={{ "--x": `${at.x}px`, "--y": `${at.y}px` } as React.CSSProperties}>
      <i className="mp-boom__flash" />
      <i className="mp-boom__wave" />
      <i className="mp-boom__wave mp-boom__wave--2" />
      <i className="mp-boom__wave mp-boom__wave--3" />
      {SPARKS.map((p, i) => (
        <i
          key={i}
          className="mp-boom__spark"
          style={{ "--a": `${p.a}deg`, "--far": p.far, "--s": `${p.size}px`, "--d": `${p.delay}s`, "--c": p.tone } as React.CSSProperties}
        />
      ))}
    </div>
  );
};

/** Adds "is-in" to an element the first time it comes into view (CSS does the rest). */
const useReveal = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.classList.add("is-in");
        seen.disconnect();
      },
      { threshold: 0.35 },
    );
    seen.observe(el);
    return () => seen.disconnect();
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
  const steps = useReveal<HTMLOListElement>();
  const panel = useReveal<HTMLDivElement>();
  const title = useRef<HTMLHeadingElement>(null);
  const [boom, setBoom] = useState<{ x: number; y: number } | null>(null);
  const boomed = useRef(false);

  // The burst goes off once, when the contact's title comes up into the upper two thirds of the
  // screen (read from the scroll position: robust whatever clips or contains the section).
  useEffect(() => {
    const el = title.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const check = () => {
      frame = 0;
      if (boomed.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.7 && r.bottom > 0) {
        boomed.current = true;
        setBoom({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
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

      {boom && <Boom at={boom} onEnd={() => setBoom(null)} />}
      <section className="mp-close" aria-labelledby="tale-contact">
        <div ref={panel} className="mp-close__panel">
          <p className="mp-close__kicker">{c.kicker}</p>
          <h2 id="tale-contact" ref={title} className="mp-close__title">
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
