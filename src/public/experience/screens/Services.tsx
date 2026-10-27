import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiArrowUpRight, FiCheck, FiMonitor } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";

/** Scrolls to #visitkort / #webbplats once the screen has arrived. */
export function useAnchor(delay = 480) {
  const { hash, key } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const id = window.setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!el) return;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }, delay);
    return () => window.clearTimeout(id);
  }, [hash, key, delay]);
}

/** /tjänster – what each service includes, and what is still decided in the quote. */
const Services: React.FC = () => {
  const t = useCopy();
  const s = t.services;
  useAnchor();

  return (
    <Screen
      id="services"
      tone="mist"
      head={<ScreenHead lang={t.lang} title={t.meta.services.title} description={t.meta.services.description} screen="services" />}
      bar={<TopBar crumbs={[{ label: t.nav.cards, to: PATHS.cards[t.lang] }, { label: t.nav.services }]} back={{ screen: "cards", label: t.common.back }} />}
    >
      <div className="mp-col mp-incl">
        <h1 className="mp-display mp-incl__title" data-focus>
          {s.title}
        </h1>
        <p className="mp-incl__lead">{s.lead}</p>

        <section id="visitkort" className="mp-incl__block" aria-labelledby="mp-incl-card">
          <h2 id="mp-incl-card" className="mp-incl__h">
            <LuIdCard aria-hidden="true" /> {s.card.title}
          </h2>
          <ul className="mp-checks">
            {s.card.items.map((item) => (
              <li key={item}>
                <FiCheck aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <Link to={PATHS.contact[t.lang]} state={{ service: "card" }} className="mp-xbtn mp-xbtn--solid">
            {s.card.cta} <FiArrowUpRight aria-hidden="true" />
          </Link>
        </section>

        <section id="webbplats" className="mp-incl__block" aria-labelledby="mp-incl-site">
          <h2 id="mp-incl-site" className="mp-incl__h">
            <FiMonitor aria-hidden="true" /> {s.site.title}
          </h2>
          <ul className="mp-checks">
            {s.site.items.map((item) => (
              <li key={item}>
                <FiCheck aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
          <Link to={PATHS.contact[t.lang]} state={{ service: "site" }} className="mp-xbtn mp-xbtn--solid">
            {s.site.cta} <FiArrowUpRight aria-hidden="true" />
          </Link>
        </section>

        <section className="mp-incl__block mp-incl__block--terms" aria-labelledby="mp-incl-terms">
          <h2 id="mp-incl-terms" className="mp-incl__h">
            {s.terms.title}
          </h2>
          <ul className="mp-dots">
            {s.terms.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mp-incl__nfc">{s.terms.nfc}</p>
        </section>
      </div>
    </Screen>
  );
};

export default Services;
