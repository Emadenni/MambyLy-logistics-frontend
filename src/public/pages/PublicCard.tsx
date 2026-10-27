import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import CardExperience, { cardUrlFor, type CardMenuItem } from "../digital-card/CardExperience";
import { COMPANY_CARD_SLUG, examplePath, getCard } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import { copy } from "../experience/copy";
import { savedLang } from "../experience/i18n";
import { destinations } from "../experience/nav";
import { CARD_PATH, PATHS, langOfPath, type Lang } from "../experience/routes";
import LangSwitch from "../experience/LangSwitch";
import logoDark from "../assets/logo-dark.svg";

/**
 * /card – MambyLy's own card (also the NFC destination, so it never redirects); /en/card – the
 * same card in English; /card/:slug – the shareable page of one client card.
 * On /card the interface follows the language the visitor chose before (SV / EN), else the card's.
 * Unknown slugs never fall back to another card; demo cards live under /exempel/:slug.
 */
const PublicCard: React.FC = () => {
  const { slug } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const explicitEn = langOfPath(pathname) === "en";
  const isCompany = !slug || slug === COMPANY_CARD_SLUG;
  const [chosen, setChosen] = useState<Lang | null>(() => (explicitEn ? "en" : isCompany ? savedLang() : null));
  const base = getCard(slug ?? COMPANY_CARD_SLUG);
  const lang: Lang = chosen ?? base?.lang ?? "sv";
  const card = getCard(slug ?? COMPANY_CARD_SLUG, lang);

  if (slug === COMPANY_CARD_SLUG) return <Navigate to="/card" replace />;
  if (card?.demo) return <Navigate to={examplePath(card.slug, lang)} replace />;
  const t = copy[lang];

  if (!card) {
    return (
      <div className="mp-cardpage mp-cardpage--missing" lang={lang}>
        <Helmet>
          <title>{`${t.cardPage.notFound} | MambyLy Solutions`}</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <main className="mp-col mp-nf">
          <h1 className="mp-display" data-focus>
            {t.cardPage.notFound}
          </h1>
          <p>{t.cardPage.notFoundText}</p>
          <Link to={PATHS.examples[lang]} className="mp-xbtn mp-xbtn--solid">
            {t.cardPage.examples} <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to={PATHS.explore[lang]} className="mp-underline mp-underline--small">
            {t.common.toExplore}
          </Link>
        </main>
      </div>
    );
  }

  const cs = cardStrings[card.lang];
  const title = card.meta?.title || `${card.name}${card.company ? ` – ${card.company}` : ""}`;
  const description = card.meta?.description || `${cs.cardLabel}: ${card.name}`;
  const url = cardUrlFor(card.slug);
  const menu: CardMenuItem[] | undefined = isCompany
    ? destinations.map((d) => ({ to: PATHS[d.screen][lang], label: d.label(t), icon: d.icon }))
    : undefined;

  return (
    <div className="mp-cardpage" lang={card.lang} data-focus-root>
      <Helmet>
        <html lang={card.lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={isCompany ? `https://www.mambylysolutions.se${explicitEn ? CARD_PATH.en : CARD_PATH.sv}` : url} />
        {isCompany && <link rel="alternate" hrefLang="sv" href="https://www.mambylysolutions.se/card" />}
        {isCompany && <link rel="alternate" hrefLang="en" href="https://www.mambylysolutions.se/en/card" />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${window.location.origin}/cards/${card.slug}/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {isCompany && (
        <div className="mp-cardpage__top">
          <LangSwitch
            current={lang}
            onSelect={(next) => {
              setChosen(next);
              // /en/card is an explicit address: keep the URL in step with the choice there.
              if (explicitEn && next === "sv") navigate(CARD_PATH.sv, { replace: true });
            }}
          />
        </div>
      )}

      <main id="mp-main" className="mp-cardpage__main">
        <CardExperience card={card} headingLevel="h1" intro menu={menu} />
      </main>

      <footer className="mp-cardpage__footer">
        <Link to={PATHS.explore[lang]} className="mp-cardpage__brand">
          <span>{isCompany ? t.cardPage.toSite : cs.createdBy}</span>
          <img src={logoDark} alt="MambyLy Solutions" width={104} height={30} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicCard;
