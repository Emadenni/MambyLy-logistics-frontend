import React from "react";
import "./pricingPackages.scss";
import { Link } from "react-router-dom";

const PricingPackages = () => {
  return (
    <section className="pricingSection">
      <h2 className="heading">Supportpaket efter lansering</h2>
      <div className="packages">
        <div className="card">
          <h3>Litet paket</h3>
          <p className="price">1 200 kr/månad</p>
          <ul>
            <li>Säkerhetsuppdateringar en gång i månaden</li>
            <li>Mindre tekniska justeringar (upp till 2 timmar/mån)</li>
            <li>E-postsupport (svar inom 48h)</li>
          </ul>
          <Link to="/kontaktaOss">
            <button>Kontakta oss</button>
          </Link>
        </div>

        <div className="card featured">
          <div className="badge">Rekommenderad</div>
          <h3>Standardpaket</h3>
          <p className="price">2 100 kr/månad</p>
          <ul>
            <li>Alla tjänster i Litet paket</li>
            <li>Säkerhetsuppdateringar varje vecka</li>
            <li>Innehållsuppdateringar (upp till 4 timmar/mån)</li>
            <li>Prioriterad support (svar inom 24h)</li>
            <li>Månatlig teknisk översyn och rapport</li>
          </ul>
          <Link to="/kontaktaOss">
            <button>Kontakta oss</button>
          </Link>
        </div>

        <div className="card">
          <h3>Skräddarsytt paket</h3>
          <h4>Behöver du mer eller mindre?</h4>
          <p className="price">?</p>
          
          <ul>
            <li>Anpassas efter dina behov</li>
            <li>Löpande utveckling och API-integration</li>
            <li>Personlig rådgivning & support enligt avtal</li>
          </ul>
          <Link to="/kontaktaOss">
            <button>Kontakta oss</button>
          </Link>
        </div>
      </div>

      <div className="note">
        <p>
          <strong>OBS!</strong> Ett <strong>månad av full support</strong> efter lansering ingår alltid i alla projekt.
        </p>
      </div>
    </section>
  );
};

export default PricingPackages;
