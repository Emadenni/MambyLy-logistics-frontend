import React, { useState, useEffect, } from "react";
import { Link } from "react-router-dom";
import { ServicesCardProps } from "../../types/common";
import IconCards from "../IconCards/IconCards";
import "./servicesCard.scss";
import CTA from "../Cta/Cta";

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
        <p>{shortDescription}</p>
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
      </div>

      <div className="service_card__icons">
        <IconCards />
      </div>
    </div>
  );
};

export default ServicesCard;
