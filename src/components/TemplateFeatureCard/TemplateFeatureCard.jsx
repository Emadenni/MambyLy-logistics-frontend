import React from "react";
import { Link } from "react-router-dom";
import "./TemplateFeatureCard.scss";

const TemplateFeatureCard = ({
  name,
  image,
  logo,
  description,
  comingSoon = false,
  badge = "Nyhet",
  link = "#",
}) => {
  return (
    <div className="template-feature-card-modern">
      <div className="card-image" style={{ backgroundImage: `url(${image})` }}>
        <div className="diagonal-banner">{badge}</div>
        <div className="price-badge"> Pris från 1 990 kr</div>

        <div className="card-overlay">
          <div className="card-content">
            {logo && (
              <div className="logo-inline">
                <img src={logo} alt="Template logo" />
              </div>
            )}
            <div className="text-block">
              <h3>{name}</h3>
              <p>{description}</p>
            </div>

            {comingSoon ? (
              <span className="cta-inside disabled">Snart tillgänglig</span>
            ) : (
              <Link to={link} className="cta-inside">
                Upptäck mer →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateFeatureCard;
