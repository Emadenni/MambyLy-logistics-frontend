import React from "react";
import { useNavigate } from "react-router-dom";
import "./servicesCard.scss";
import { ServicesCardProps } from "../../types/components";

const ServicesCard: React.FC<ServicesCardProps> = ({
  title,
  shortDescription,
  image,
  color,
  background_color,
  id, // Usa direttamente l'id
  children,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`#${id}`);
  };

  return (
    <div
      className="service_item"
      style={{ backgroundColor: background_color, color: color }}
      onClick={handleClick}
      data-testid={`service-card-${id}`}
    >
      <img src={image} alt={title} className="service_item__image" />
      <h3>{title}</h3>
      <p>{shortDescription}</p>
      {children}
    </div>
  );
};

export default ServicesCard;
