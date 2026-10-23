import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import CardExperience, { cardUrlFor } from "../digital-card/CardExperience";
import { getCard } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import logoDark from "../assets/logo-dark.svg";
import "../styles/public.scss";

/** /card/:slug – the shareable page of one card. Unknown slugs never fall back to another card. */
const PublicCard: React.FC = () => {
  const { slug } = useParams();
  const card = getCard(slug);

  if (!card) {
    return (
      <PublicShell>
        <Helmet>
          <title>Visitkortet hittades inte | Mambyly Solutions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="mp-section mp-notfound">
          <div className="mp-container">
            <div className="mp-card mp-notfound__card">
              <h1>Visitkortet hittades inte</h1>
              <p className="mp-muted">Länken kan vara felskriven, eller så finns kortet inte längre.</p>
              <div className="mp-actions mp-actions--center">
                <Link to="/digital-card" className="mp-btn mp-btn--primary">
                  Om digitala visitkort <FiArrowRight aria-hidden="true" />
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
        {card.demo && <meta name="robots" content="noindex" />}
      </Helmet>

      {card.demo && (
        <p className="mp-cardpage__demo">
          <strong>Demo</strong> – företaget och personen är påhittade.{" "}
          <Link to="/digital-card">Läs om tjänsten</Link>
        </p>
      )}

      <main id="mp-main" className="mp-cardpage__main">
        <CardExperience card={card} headingLevel="h1" />
      </main>

      <footer className="mp-cardpage__footer">
        <Link to="/digital-card" className="mp-cardpage__brand">
          <span>{t.createdBy}</span>
          <img src={logoDark} alt="MambyLy Solutions" width={104} height={30} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicCard;
