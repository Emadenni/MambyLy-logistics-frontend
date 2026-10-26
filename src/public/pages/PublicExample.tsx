import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import CardShowcase from "../components/CardShowcase";
import { examplePath, getCard, getExamples } from "../digital-card/registry";
import type { ContactState } from "../digital-card/service";
import logoDark from "../assets/logo-dark.svg";
import "../styles/public.scss";

const SITE = "https://www.mambylysolutions.se";

/**
 * /exempel/:slug – one example card on a clean page that can be shown to a client.
 * Fictitious data: contact rows only show a notice; there is no share or contact file here.
 */
const PublicExample: React.FC = () => {
  const { slug } = useParams();
  const card = getCard(slug);
  const examples = getExamples();

  if (!card || !card.demo || !card.example) {
    return (
      <PublicShell>
        <Helmet>
          <title>Exemplet hittades inte | MambyLy Solutions</title>
          <meta name="robots" content="noindex" />
        </Helmet>
        <section className="mp-section mp-notfound">
          <div className="mp-container">
            <div className="mp-card mp-notfound__card">
              <h1>Exemplet hittades inte</h1>
              <p className="mp-muted">Länken kan vara felskriven, eller så finns exemplet inte längre.</p>
              <div className="mp-actions mp-actions--center">
                <Link to="/exempel" className="mp-btn mp-btn--primary">
                  Alla exempel <FiArrowRight aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </PublicShell>
    );
  }

  const index = examples.findIndex((c) => c.slug === card.slug);
  const next = examples.length > 1 ? examples[(index + 1) % examples.length] : undefined;
  const title = card.meta?.title || `Exempel: ${card.company || card.name}`;
  const description = card.meta?.description || card.example.summary;
  const url = `${SITE}${examplePath(card.slug)}`;
  const request: ContactState = { service: "card", example: card.slug };

  return (
    <div className="mambyly-public mp-xpage" lang="sv">
      <Helmet>
        <html lang="sv" />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta name="robots" content="noindex" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`${SITE}/cards/${card.slug}/og.png`} />
      </Helmet>

      <header className="mp-xpage__bar">
        <Link to="/exempel" className="mp-xpage__back">
          <FiArrowLeft aria-hidden="true" /> Alla exempel
        </Link>
        <p className="mp-pill">Exempel · påhittade uppgifter</p>
      </header>

      <main id="mp-main" className="mp-xpage__main">
        <div className="mp-xpage__head">
          <p className="mp-eyebrow">{card.example.sector}</p>
          <h1 className="mp-xpage__title">{card.company || card.name}</h1>
        </div>

        <CardShowcase card={card} className="mp-xpage__card" />

        <p className="mp-xpage__summary">{card.example.summary}</p>

        <div className="mp-xpage__actions">
          <Link to="/kontaktaOss" state={request} className="mp-btn mp-btn--primary mp-btn--lg">
            Jag vill ha ett kort som det här <FiArrowUpRight aria-hidden="true" />
          </Link>
          {next && (
            <Link to={examplePath(next.slug)} className="mp-textlink">
              Nästa exempel: {next.company || next.name} <FiArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </main>

      <footer className="mp-cardpage__footer">
        <Link to="/" className="mp-cardpage__brand">
          <span>Digitala visitkort av</span>
          <img src={logoDark} alt="MambyLy Solutions" width={104} height={30} />
        </Link>
      </footer>
    </div>
  );
};

export default PublicExample;
