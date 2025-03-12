import React from "react";
import "./services_card.scss";
import { ServicesCardProps } from "../../types/components";
import { servicesData } from "../data/service";


const ServiceItem: React.FC<ServicesCardProps> = ({
  title,
  shortDescription,
  image,
  color,
  background_color,
  onClick,
  id,
}) => {
  return (
    <div className="service_item" style={{ backgroundColor: background_color, color: color }} onClick={onClick}>
      <img src={image} alt={title} className="service_item__image" />
      <h3>{title}</h3>
      <p>{shortDescription} </p>

    </div>
  );
};

const Services_card: React.FC = () => {
  return (
    <div className="services_cards_container">
      {servicesData.map((service) => (
        <ServiceItem key={service.id} {...service} />
      ))}
        
    </div>
  );
};

export default Services_card;
