import React from "react";
import { useNavigate } from "react-router-dom"; 
import "./servicesCard.scss";
import { ServicesCardProps } from "../../types/components";
import CTA from "../Cta/Cta";


const ServicesCard: React.FC<ServicesCardProps> = ({
  title,
  shortDescription,
  image,
  color,
  background_color,
  onClick,
  id,
  path
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(path); 
  };
  return (
    <div className="service_item" style={{ backgroundColor: background_color, color: color }}  onClick={handleClick}>
      <img src={image} alt={title} className="service_item__image" />
      <h3>{title}</h3>
      <p>{shortDescription} </p>

      <CTA text="LÄS MER" backgroundColor="#0B770B" color="#DBD714" hoverBackgroundColor="#fff" hoverColor="#0B770B" />
    </div>
  );
};



export default ServicesCard;
