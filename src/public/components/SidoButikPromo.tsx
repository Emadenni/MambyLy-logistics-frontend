import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import logoButik from "../../assets/images/logoButik.webp";

/**
 * Home-page entry points to Sido Butik (former SidoButikBanner + BivioSection copy).
 * Rendered only when publicSiteConfig.showSidoButik is true.
 */
const SidoButikPromo: React.FC = () => (
  <section className="mp-section mp-section--tight" aria-labelledby="mp-sido-title">
    <div className="mp-container mp-split mp-sido">
      <div>
        <img src={logoButik} alt="Sido Butik logo" className="mp-sido__logo" width={120} height={120} loading="lazy" />
        <h2 id="mp-sido-title">Bygg stort. Betala smått.</h2>
        <p>
          Letar du efter ett snabbt och snyggt sätt att få en hemsida? Sido Butik erbjuder färdiga templates som du
          enkelt kan anpassa till din verksamhet.
        </p>
        <Link to="/sidoButik" className="mp-btn mp-btn--primary">
          Upptäck Sido Butik <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
      <div className="mp-grid">
        <article className="mp-card">
          <h3>Startklar och budgetvänlig</h3>
          <p>Testa våra färdiga mallar – perfekt för småföretag som vill komma igång snabbt och billigt.</p>
          <Link to="/sidoButik/mallar" className="mp-textlink mp-textlink--small">
            Utforska Sido Butik <FiArrowRight aria-hidden="true" />
          </Link>
        </article>
        <article className="mp-card">
          <h3>Skräddarsydd lösning</h3>
          <p>Behöver du något helt unikt? Vi bygger skräddarsydda lösningar anpassade till dina behov.</p>
          <Link to="/kontaktaOss" className="mp-textlink mp-textlink--small">
            Kontakta Mambyly <FiArrowRight aria-hidden="true" />
          </Link>
        </article>
      </div>
    </div>
  </section>
);

export default SidoButikPromo;
