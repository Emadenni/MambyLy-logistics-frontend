import React, { useState, useEffect } from "react";
import { ServicesCardProps } from "../../types/common";
import IconCards from "../IconCards/IconCards";
import "./servicesCard.scss";

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
        <div className="service_card__cta">{children}</div>
      </div>

      <div className="service_card__icons">
        <IconCards />
      </div>
    </div>
  );
};

export default ServicesCard;
