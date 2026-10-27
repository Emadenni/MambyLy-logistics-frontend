import React, { useId, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiLink, FiShare2, FiSmartphone, FiUserPlus } from "react-icons/fi";
import { TbQrcode } from "react-icons/tb";
import CardShowcase from "../../components/CardShowcase";
import { COMPANY_CARD_SLUG, examplePath, getCard } from "../../digital-card/registry";
import { cardUrlFor } from "../../digital-card/CardExperience";
import { qrSvg } from "../../digital-card/qr";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { CARD_PATH, PATHS } from "../routes";
import { media } from "../media";

/** The example shown on this screen (fictitious person and company, see cards/fjardvik-agentur). */
const DEMO_SLUG = "fjardvik-agentur";

type Tab = "card" | "share";

/**
 * /digital-card – the commercial page of the digital business cards. The card on it is the real,
 * interactive component with an example's (fictitious) data; MambyLy's own card stays at /card.
 */
const Cards: React.FC = () => {
  const t = useCopy();
  const c = t.cards;
  const [tab, setTab] = useState<Tab>("card");
  const ids = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const demo = getCard(DEMO_SLUG, t.lang);
  const ownUrl = cardUrlFor(COMPANY_CARD_SLUG);
  const qr = useMemo(() => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrSvg(ownUrl))}`, [ownUrl]);
  const order: Tab[] = ["card", "share"];

  const onTabKey = (e: React.KeyboardEvent, i: number) => {
    const to = e.key === "ArrowRight" ? i + 1 : e.key === "ArrowLeft" ? i - 1 : e.key === "Home" ? 0 : e.key === "End" ? order.length - 1 : null;
    if (to === null) return;
    e.preventDefault();
    const next = (to + order.length) % order.length;
    setTab(order[next]);
    tabs.current[next]?.focus();
  };

  const shareIcons = [<FiLink key="l" />, <TbQrcode key="q" />, <FiUserPlus key="s" />];

  return (
    <Screen
      id="cards"
      tone="ivory"
      head={<ScreenHead lang={t.lang} title={t.meta.cards.title} description={t.meta.cards.description} screen="cards" />}
      bar={<TopBar crumbs={[{ label: t.nav.cards }]} back={{ screen: "explore", label: t.common.explore }} service="card" />}
    >
      <div className="mp-col mp-cards">
        <h1 className="mp-display mp-cards__title" data-focus>
          {c.title}
        </h1>
        <p className="mp-cards__lead">{c.lead}</p>
      </div>

      <section className="mp-try" aria-labelledby={`${ids}-eyebrow`}>
        <p id={`${ids}-eyebrow`} className="mp-try__eyebrow">
          {c.eyebrow}
        </p>
        <div className="mp-try__tabs" role="tablist" aria-label={c.tabsLabel}>
          {order.map((key, i) => (
            <button
              key={key}
              ref={(el) => (tabs.current[i] = el)}
              id={`${ids}-tab-${key}`}
              type="button"
              role="tab"
              aria-selected={tab === key}
              aria-controls={`${ids}-panel-${key}`}
              tabIndex={tab === key ? 0 : -1}
              className="mp-try__tab"
              onClick={() => setTab(key)}
              onKeyDown={(e) => onTabKey(e, i)}
            >
              {c.tabs[key]}
            </button>
          ))}
        </div>

        <div id={`${ids}-panel-card`} role="tabpanel" aria-labelledby={`${ids}-tab-card`} hidden={tab !== "card"} className="mp-try__panel">
          {demo && <CardShowcase card={demo} className="mp-try__card" />}
          <p className="mp-try__note">{c.demoNote}</p>
          <Link to={examplePath(DEMO_SLUG, t.lang)} className="mp-xbtn mp-xbtn--solid">
            {c.openDemo} <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>

        <div id={`${ids}-panel-share`} role="tabpanel" aria-labelledby={`${ids}-tab-share`} hidden={tab !== "share"} className="mp-try__panel">
          <ol className="mp-share">
            {c.share.map((s, i) => (
              <li key={s.title} className="mp-share__step">
                <span className="mp-share__icon" aria-hidden="true">
                  {shareIcons[i]}
                </span>
                <span>
                  <strong>{s.title}</strong>
                  <span>{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
          <figure className="mp-share__qr">
            <img src={qr} alt={`QR: ${ownUrl}`} width={132} height={132} />
            <figcaption>
              {c.qrCaption}
              <br />
              <Link to={CARD_PATH[t.lang]}>{ownUrl.replace(/^https?:\/\//, "")}</Link>
            </figcaption>
          </figure>
        </div>
      </section>

      <ul className="mp-col mp-cards__features">
        <li>
          <span className="mp-cards__ficon" aria-hidden="true">
            <FiShare2 />
          </span>
          {c.features[0]}
        </li>
        <li>
          <span className="mp-cards__ficon" aria-hidden="true">
            <FiSmartphone />
          </span>
          {c.features[1]}
        </li>
      </ul>

      <section className="mp-cards__end">
        <img className="mp-cards__people" src={media("people-contact-exchange", 900)} alt="" width={900} height={600} loading="lazy" decoding="async" />
        <div className="mp-cards__cta">
          <h2 className="mp-cards__bottom">{c.bottomTitle}</h2>
          <Link to={PATHS.contact[t.lang]} state={{ service: "card" }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
            {c.cta} <FiArrowUpRight aria-hidden="true" />
          </Link>
          <p className="mp-cards__ctanote">{c.ctaNote}</p>
          <p className="mp-cards__links">
            <Link to={`${PATHS.services[t.lang]}#visitkort`} className="mp-underline mp-underline--small">
              {c.included} <FiArrowUpRight aria-hidden="true" />
            </Link>
            <Link to={PATHS.examples[t.lang]} className="mp-underline mp-underline--small">
              {c.moreExamples} <FiArrowRight aria-hidden="true" />
            </Link>
            <Link to={CARD_PATH[t.lang]} className="mp-underline mp-underline--small">
              {c.ourCard} <FiArrowRight aria-hidden="true" />
            </Link>
          </p>
        </div>
      </section>
    </Screen>
  );
};

export default Cards;
