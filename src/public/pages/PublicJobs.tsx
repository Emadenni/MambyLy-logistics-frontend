import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { FiUsers } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import ContactForm from "../../components/ContactForm/ContactForm";

const PublicJobs: React.FC = () => {
  // Kept from WorkWithUs: the application form receives the selected position id (none by default).
  const [selectedJobId] = useState<string | null>(null);

  return (
    <PublicShell>
      <Helmet>
        <title>Jobba med oss – Mambyly Solutions</title>
        <meta
          name="description"
          content="Vill du jobba med oss? Se om det finns lediga tjänster eller skicka in en spontanansökan."
        />
        <meta name="author" content="Mambyly Solutions" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Jobba med oss</p>
            <h1 className="mp-display mp-display--page">
              Bra lösningar börjar
              <br />
              med bra människor.
            </h1>
            <p className="mp-lead">Kolla de lediga tjänsterna eller skicka in en spontanansökan.</p>
          </div>
          <p className="mp-note-card" aria-hidden="true">
            Tillsammans
            <br />
            gör vi
            <br />
            skillnad.
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top">
        <div className="mp-container mp-contact">
          <div>
            {/* Same content as the previous page: there is no public position list in the current site. */}
            <div className="mp-card mp-card--mint mp-jobs-status">
              <span className="mp-icon-badge" aria-hidden="true"><FiUsers /></span>
              <h2>Just nu har vi inga lediga tjänster.</h2>
              <p>
                Men du är varmt välkommen att skicka in en spontanansökan! Vi letar ofta efter konsulter inom IT, till
                exempel:
              </p>
              <ul className="mp-tags mp-tags--static">
                <li>UX/UI Designer</li>
                <li>SEO Expert</li>
                <li>Blockchain Consultant</li>
                <li>Fullstack Developer</li>
                <li>Cloud Architect</li>
              </ul>
              <p>Skicka in ditt CV och berätta lite om dig själv – vi hör gärna från dig!</p>
            </div>
          </div>

          <div className="mp-card mp-form-card">
            <h2>Skicka spontanansökan</h2>
            <p className="mp-muted">Berätta om dig själv och vad du kan bidra med.</p>
            <div className="mp-form">
              <ContactForm subjectFromCard={selectedJobId || ""} isJobApplication={true} />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
};

export default PublicJobs;
