import React from "react";
import { ServicesCardProps } from "../../types/common";
import "./servicesCard.scss";

const ServicesCard: React.FC<ServicesCardProps> = ({
  title,
  shortDescription,
  image,
  id,
  children,
}) => {
  return (
    <div className="service_card">
      <div className="service_card__background" style={{ backgroundImage: `url(${image})` }}></div>

      <div className="service_card__content">
        <h3>{title}</h3>
        <p>{shortDescription}</p>
        <div className="service_card__cta">{children}</div>
      </div>
    </div>
  );
};

export default ServicesCard;
