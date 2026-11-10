import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { useCopy } from "../i18n";
import { PATHS, STAY_DEMO_BASE } from "../routes";
import { TOOLS_LOGO } from "../../tools/catalogue";

const COPY = {
  sv: {
    label: "MambyLy Tools",
    news: "Nyhet",
    title: "Smarta sidor bakom en tagg.",
    text: "En NFC-tagg eller QR-kod på rätt plats – och rätt information öppnas, på rätt språk. Först ut: MambyLy Stay, en digital concierge för dig som hyr ut.",
    discover: "Upptäck MambyLy Tools",
    demo: "Prova Stay-demon",
    sign: "MambyLy Stay-skylten på ett bord i boendet, med NFC-tagg och QR-kod",
  },
  en: {
    label: "MambyLy Tools",
    news: "New",
    title: "Smart pages behind a tag.",
    text: "An NFC tag or QR code in the right place – and the right information opens, in the right language. First out: MambyLy Stay, a digital concierge for hosts.",
    discover: "Discover MambyLy Tools",
    demo: "Try the Stay demo",
    sign: "The MambyLy Stay sign on a table in the rental, with NFC tag and QR code",
  },
};

/**
 * Utforska's banner for MambyLy Tools: one deep green band across the page, the line's logo, the
 * Stay sign in a house, and the two ways in. It comes in once, when it reaches the screen.
 */
const ToolsBanner: React.FC = () => {
  const t = useCopy();
  const c = COPY[t.lang];
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        el.classList.add("is-in");
        seen.disconnect();
      },
      { threshold: 0.25 },
    );
    seen.observe(el);
    return () => seen.disconnect();
  }, []);

  return (
    <section ref={ref} className="mp-toolsband" aria-label={c.label}>
      <div className="mp-toolsband__in">
        <div className="mp-toolsband__text">
          <p className="mp-toolsband__news">{c.news}</p>
          <img className="mp-toolsband__logo" src={TOOLS_LOGO.white} alt="MambyLy Tools" width={584} height={199} loading="lazy" />
          <h2 className="mp-toolsband__title">{c.title}</h2>
          <p className="mp-toolsband__lead">{c.text}</p>
          <div className="mp-toolsband__actions">
            <Link to={PATHS.tools[t.lang]} className="mp-toolsband__btn mp-toolsband__btn--solid">
              {c.discover} <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to={`${STAY_DEMO_BASE}/stuga`} className="mp-toolsband__btn">
              {c.demo} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
        {/* the tag itself: the Stay sign, in a house */}
        <figure className="mp-toolsband__sign">
          <img src="/tools/stay-stand.jpg" alt={c.sign} width={1200} height={900} loading="lazy" decoding="async" />
        </figure>
      </div>
    </section>
  );
};

export default ToolsBanner;
