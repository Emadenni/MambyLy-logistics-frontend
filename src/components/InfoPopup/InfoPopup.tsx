import React from "react";
import "./infoPopup.scss";

interface InfoPopupProps {
  title: string;
  description: string;
  services: string[];
  image: string;
  onClose: () => void;
}

const InfoPopup: React.FC<InfoPopupProps> = ({ title, description, services, image, onClose }) => {
  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>×</button>

        <div className="image-container">
          <img src={image} alt={title} />
          <div className="text-overlay">
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        <ul>
          {services.map((service, i) => (
            <li key={i}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};


export default InfoPopup;
