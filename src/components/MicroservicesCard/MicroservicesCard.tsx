import React from 'react'
import "./microservicesCards.scss";
import { MicroserviceCardProps } from '../../types/common';
import { Microservices } from '../data/microservices';



const MicroserviceCard: React.FC<MicroserviceCardProps> = ({title, description, type, id, image}) => {
    return (
        <div className={`microservice_card microservice_card--${type}`} id={id}>
          {image && <img src={image} alt={title} className="microservice_card__image" />}
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      );
}

export default MicroserviceCard;