import React from "react";
import { Link } from "react-router-dom";
import "./servicesCard.scss";
import { ServicesCardProps } from "../../types/components";
import { servicesData } from "../data/service";
import CTA from "../Cta/Cta";

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
      <Link to="/tjänster">
        <CTA
          text="LÄS MER"
          backgroundColor="#0B770B"
          color="#DBD714"
          hoverBackgroundColor="#fff"
          hoverColor="#0B770B"
        />
      </Link>
    </div>
  );
};

const ServicesCard: React.FC = () => {
  return (
    <div className="services_cards_container">
      {servicesData.map((service) => (
        <ServiceItem key={service.id} {...service} />
      ))}
    </div>
  );
};

export default ServicesCard;
