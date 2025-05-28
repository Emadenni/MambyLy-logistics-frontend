// MicroserviceCard.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./microservicesCards.scss";
import { MicroserviceCardProps } from "../../types/common";


const MicroserviceCard: React.FC<MicroserviceCardProps> = ({ title, description, type, id, image, onSelect }) => {
  return (
    <div
      className={`microservice_card microservice_card--${type}`}
      id={id}
      data-testid={`microservice-card-${id}`}
      onClick={onSelect}
    >
      <h4>{title}</h4>
      <p>{description}</p>
     
      <Link to="/kontaktaOss" state={{ subject: title }}>
        <button className="microservice_card__button">Fråga Oss</button>
      </Link>
    </div>
  );
};

export default MicroserviceCard;
