import React, { useEffect } from "react"; // aggiungi useEffect
import { Link } from "react-router-dom";
import CTA from "../Cta/Cta";
import "./promoModal.scss";
import Logo from "../Logo/Logo";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

const PromoModal = ({ onClose }: { onClose: () => void }) => {
  const handleLinkClick = () => {
    onClose();
  };

  const copyPromoText = () => {
    navigator.clipboard.writeText("specialerbjudande 5950");
  };

  useEffect(() => {
    // Blocca lo scroll quando il modal è aperto
    document.body.style.overflow = "hidden";

    // Ripristina lo scroll quando il modal viene chiuso
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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
        </p>

        <p className="footer-text">
          Erbjudandet gäller under en begränsad tid och är perfekt för dig som vill komma igång snabbt online.
        </p>

        <div className="promo-copy-block">
          <p>
            Är du intresserad? Kopiera koden nedan och klistra in den i <em>ämnesraden</em> i ditt meddelande eller i ett WhatsApp-meddelande:
          </p>

          <div className="copy-box" onClick={copyPromoText}>
            <span className="promo-code">specialerbjudande 5950</span>
            <ContentCopyIcon className="copy-icon" />
          </div>
        </div>

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

        <button onClick={onClose} className="close-button">
          Stäng
        </button>
      </div>
    </div>
  );
};

export default PromoModal;
