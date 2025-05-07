import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ServicesCardProps } from "../../types/common";
import IconCards from "../IconCards/IconCards";
import "./servicesCard.scss";
import CTA from "../Cta/Cta";

const ServicesCard: React.FC<ServicesCardProps> = ({ title, shortDescription, id, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`service_card ${isVisible ? "service_card--visible" : ""}`}>
      <div className="service_card__background"></div>

      <div className="service_card__content">
        <img src="/assets/images/serviceImg.webp" alt="" style={{ display: "none" }} loading="lazy" />
        <h3>{title}</h3>
        <p className="service_card__content__p">{shortDescription}</p>
        <div>{children}</div>
        <Link to="/kontaktaOss">
          <CTA
            text="KONTAKTA OSS"
            backgroundColor="#5bb4b1de"
            color=" rgb(3, 38, 4)"
            hoverBackgroundColor="#fff"
            hoverColor="darkgreen"
          />
        </Link>
        <p className="service_card__content__extra">
        Kolla om du tillhör något av de här scenarierna och upptäck våra tjänster. Om du inte gör det, ingen fara – vi kan sannolikt hjälpa dig ändå.
        </p>
      </div>

      <div className="service_card__icons">
        <IconCards />
      </div>
    </div>
  );
};

export default ServicesCard;
