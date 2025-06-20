import React from "react";
import SidoHeader from "../../components/SidoHeader/SidoHeader";
import { Link } from "react-router-dom";
import { templatesData } from "../../components/data/templateData";
import "./Templates.scss";

const Templates = () => {
  return (
    <div className="template-page">
      <SidoHeader />
      <section className="template-grid">
        {templatesData.map((tpl, i) => (
          <div
            key={tpl.id}
            className={`template-card ${tpl.comingSoon ? "disabled" : ""}`}
            style={{ animationDelay: `${i * 0.2}s` }}
          >
            <div className="template-image-wrapper">
              <div className="template-image" style={{ backgroundImage: `url(${tpl.image})` }} />
              {tpl.badge && <span className="badge">{tpl.badge}</span>}
            </div>
            <div className="template-info">
              <img src={tpl.logo} alt={tpl.name} className="template-logo" />
              <h3>{tpl.name}</h3>
              <p>{tpl.description}</p>
              {tpl.pages && (
                <ul>
                  {tpl.pages.map((page, idx) => (
                    <li key={idx}>{page}</li>
                  ))}
                </ul>
              )}
              <div className="price">{tpl.price}</div>
            </div>
            <Link to="sidoButik" className={`cta-inside ${tpl.comingSoon ? "disabled" : ""}`}>
              Upptäck demo och detaljer →
            </Link>
          </div>
        ))}
      </section>

      <footer className="sido-footer">
        <p>
          © {new Date().getFullYear()} <span>Sido Butik</span> — En del av{" "}
          <a href="https://mambylysolutions.se">Mambyly Solutions</a>
        </p>
        <Link to="/">← Tillbaka till startsidan</Link>
      </footer>
    </div>
  );
};

export default Templates;
