import React from "react";
import { Link } from "react-router-dom";
import "./microservicesCards.scss";
import { MicroserviceCardProps } from "../../types/common";
import { Microservices } from "../data/microservices";

const MicroserviceCard: React.FC<MicroserviceCardProps> = ({ title, description, type, id, image }) => {
  return (
    <div className={`microservice_card microservice_card--${type}`} id={id} data-testid={`microservice-card-${id}`}>
      <h4>{title}</h4>
      <p>{description}</p>
      <Link to="/kontaktaOss">
        <button className="microservice_card__button" >Fråga Oss</button>
      </Link>
    </div>
  );
};

export default MicroserviceCard;
