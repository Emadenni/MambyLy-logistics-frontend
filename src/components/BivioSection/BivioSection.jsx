import React from "react";
import { Link } from "react-router-dom";
import "./BivioSection.scss";

const BivioSection = () => {
  return (
    <section className="sido-bivio-section">
      <h2>Vad passar dig bäst?</h2>
      <p>Vi hjälper dig oavsett om du vill komma igång snabbt eller skapa något unikt från grunden.</p>
      <div className="bivio-options">
        <div className="bivio-card">
          <h3>🚀 Startklar och budgetvänlig</h3>
          <p>
            Testa våra färdiga mallar – perfekt för småföretag som vill komma igång snabbt och billigt.
          </p>
          <Link to="/sidoButik/mallar" className="bivio-btn sido">
            Utforska Sido Butik →
          </Link>
        </div>
        <div className="bivio-card">
          <h3>🎯 Skräddarsydd lösning</h3>
          <p>
            Behöver du något helt unikt? Vi bygger skräddarsydda lösningar anpassade till dina behov.
          </p>
          <a
            href="https://mambylysolutions.se/kontaktaOss"
            className="bivio-btn mambyly"
            target="_blank"
            rel="noreferrer"
          >
            Kontakta Mambyly →
          </a>
        </div>
      </div>
    </section>
  );
};

export default BivioSection;
