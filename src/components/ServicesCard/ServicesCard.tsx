import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ServicesCardProps } from "../../types/common";
import IconCards from "../IconCards/IconCards";
import "./servicesCard.scss";
import CTA from "../Cta/Cta";
import logoIcon from "../../assets/images/iconLogo.png";

const ServicesCard: React.FC<ServicesCardProps> = ({ title, shortDescription, image, id, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`service_card ${isVisible ? "service_card--visible" : ""}`}>
      <div className="service_card__background" style={{ backgroundImage: `url(${image})` }}></div>

      <div className="service_card__content">
        <h3>{title}</h3>
        <p className="service_card__content__p">{shortDescription}</p>
        <div>{children}</div>
        <Link to="/kontaktaOss">
          <CTA
            text="KONTAKTA OSS"
            backgroundColor="#91ceee;"
            color="rgba(66, 165, 245)"
            hoverBackgroundColor="#fff"
            hoverColor="#DBD714"
          />
        </Link>
        <p className="service_card__content__extra">Kolla om du tillhör något av de här scenarierna och upptäck våra tjänster. Om du inte gör det, oroa dig inte, vi kan troligtvis hjälpa även dig</p>
      
      </div>
      


      <div className="service_card__icons">
        <IconCards />
       {/*  <img src={logoIcon} alt="logo-icon" className="logoIcon" /> */}
      </div>
    </div>
  );
};

export default ServicesCard;
