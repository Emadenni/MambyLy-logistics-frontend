import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import ExampleTile from "../components/ExampleTile";
import { getExamples } from "../digital-card/registry";
import type { ContactState } from "../digital-card/service";

/** /exempel – gallery of the demo cards (fictitious companies), each opening its own page. */
const PublicExamples: React.FC = () => {
  const examples = getExamples();

  return (
    <PublicShell>
      <Helmet>
        <title>Exempel på digitala visitkort | MambyLy Solutions</title>
        <meta
          name="description"
          content="Se exempel på digitala visitkort för hantverkare, säljare, fotografer och serviceföretag. Öppna ett kort, vänd på det och se hur det fungerar."
        />
        <link rel="canonical" href="https://www.mambylysolutions.se/exempel" />
      </Helmet>

      <section className="mp-intro mp-gallery-intro" aria-labelledby="mp-gallery-title">
        <div className="mp-container">
          <p className="mp-eyebrow">Exempel</p>
          <h1 id="mp-gallery-title" className="mp-display mp-display--page">
            Samma idé.
            <br />
            Helt olika kort.
          </h1>
          <p className="mp-lead">
            Varje kort formas efter verksamheten: logotyp, färger, typsnitt och vad som står på baksidan. Öppna ett
            exempel för att vända och luta det.
          </p>
          <p className="mp-gallery-intro__note">
            <span className="mp-pill">Exempel</span> Alla företag, personer och uppgifter här är påhittade.
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top" aria-label="Exempel på visitkort">
        <div className="mp-container mp-gallery">
          {examples.map((c) => (
            <ExampleTile key={c.slug} card={c} detailed headingLevel="h2" />
          ))}
        </div>
      </section>

      <section className="mp-container mp-cta" aria-labelledby="mp-gallery-cta">
        <div>
          <h2 id="mp-gallery-cta">Ditt företag, ditt kort.</h2>
          <p>Vi utgår från din logotyp och dina färger – eller från ett av exemplen.</p>
        </div>
        <Link to="/kontaktaOss" state={{ service: "card" } satisfies ContactState} className="mp-btn mp-btn--light mp-btn--lg">
          Begär ditt visitkort <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicExamples;
