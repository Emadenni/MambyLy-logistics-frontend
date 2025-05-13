import React from "react";
import { Link } from "react-router-dom";
import CTA from "../Cta/Cta";
import "./promoModal.scss";
import Logo from "../Logo/Logo";

const PromoModal = ({ onClose }: { onClose: () => void }) => {
  // Funzione per chiudere il modal
  const handleLinkClick = () => {
    onClose(); // Chiude il modal
  };

  return (
    <div className="promo-modal-overlay">
      <div className="promo-modal-content">
        <div className="logo-container">
          <Logo size="small" />
        </div>

        <h2>Exklusivt Erbjudande</h2>
        <p>
         Få en snabb, modern och grundläggande hemsida för ditt företag designad med React JS. Perfekt för att växa online!
        </p>
        <ul>
          <li>Fullt responsiv design som ser fantastisk ut på alla enheter</li>
          <li>Optimera din synlighet med SEO för att ranka högre på nätet</li>
          <li>Integration av sociala medier, Google Maps och mer</li>
          <li>Modulär och skalbar, redo att utvecklas i framtiden</li>
        </ul>
        <p className="offer-price">
          Allt detta för endast <strong>5950 kr!</strong>
          <br />
        </p>

        <p className="footer-text">
          Detta erbjudande är en perfekt start för ditt företag online, med en lösning som är både kraftfull och
          flexibel. <br /> Kom ihåg: Erbjudandet gäller under en begränsad tid.
        </p>

        <p>
          Är du intresserad? Tveka inte att kontakta oss och nämna detta specialerbjudande när du skickar ditt
          meddelande!
        </p>

        {/* Link to Kontakta Oss page */}
        <Link to="/kontaktaOss" onClick={handleLinkClick}>
          <CTA
            className="cta_button"
            text="KONTAKTA OSS"
            backgroundColor="#DBD714"
            color="#045D17"
            hoverBackgroundColor="darkgreen"
            hoverColor="#DBD714"
          />
        </Link>

        {/* Close button */}
        <button onClick={onClose} className="close-button">
          Stäng
        </button>
      </div>
    </div>
  );
};

export default PromoModal;
