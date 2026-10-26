import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useParams } from "react-router-dom";
import { FiArrowRight, FiGrid, FiList, FiMonitor, FiSend } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import CardExperience, { cardUrlFor, type CardMenuItem } from "../digital-card/CardExperience";
import { COMPANY_CARD_SLUG, examplePath, getCard } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import logoDark from "../assets/logo-dark.svg";
import "../styles/public.scss";

/** Under MambyLy's own card: the main destinations of the site (same tab). */
const companyMenu: CardMenuItem[] = [
  { to: "/exempel", label: "Exempel", icon: <FiGrid /> },
  { to: "/#sa-funkar-det", label: "Så funkar det", icon: <FiList /> },
  { to: "/#webbplats", label: "Webbplatser", icon: <FiMonitor /> },
  { to: "/kontaktaOss", label: "Kontakt", icon: <FiSend /> },
];

/**
 * /card – MambyLy's own card; /card/:slug – the shareable page of one client card.
 * Unknown slugs never fall back to another card; demo cards live under /exempel/:slug.
 */
const PublicCard: React.FC = () => {
  const { slug } = useParams();
  const card = getCard(slug ?? COMPANY_CARD_SLUG);

  if (slug === COMPANY_CARD_SLUG) return <Navigate to="/card" replace />;
  if (card?.demo) return <Navigate to={examplePath(card.slug)} replace />;
  const isCompanyCard = card?.slug === COMPANY_CARD_SLUG;

  if (!card) {
    return (
      <PublicShell>
        <Helmet>
          <title>Visitkortet hittades inte | MambyLy Solutions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="mp-section mp-notfound">
          <div className="mp-container">
            <div className="mp-card mp-notfound__card">
              <h1>Visitkortet hittades inte</h1>
              <p className="mp-muted">Länken kan vara felskriven, eller så finns kortet inte längre.</p>
              <div className="mp-actions mp-actions--center">
                <Link to="/exempel" className="mp-btn mp-btn--primary">
                  Se exempel på visitkort <FiArrowRight aria-hidden="true" />
                </Link>
                <Link to="/" className="mp-textlink">
                  Till startsidan
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  const t = cardStrings[card.lang];
  const title = card.meta?.title || `${card.name}${card.company ? ` – ${card.company}` : ""}`;
  const description = card.meta?.description || `${t.cardLabel}: ${card.name}`;
  const url = cardUrlFor(card.slug);

  return (
    <div className="mambyly-public mp-cardpage" lang={card.lang}>
      <Helmet>
        <html lang={card.lang} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${window.location.origin}/cards/${card.slug}/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <main id="mp-main" className="mp-cardpage__main">
        <CardExperience card={card} headingLevel="h1" intro menu={isCompanyCard ? companyMenu : undefined} />
      </main>

      <footer className="mp-cardpage__footer">
        <Link to="/" className="mp-cardpage__brand">
          <span>{isCompanyCard ? "Till webbplatsen" : t.createdBy}</span>
          <img src={logoDark} alt="MambyLy Solutions" width={104} height={30} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicCard;
