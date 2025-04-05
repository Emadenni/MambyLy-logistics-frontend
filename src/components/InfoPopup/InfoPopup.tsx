
import React from "react";
import "./infoPopup.scss";
import { FaTimes } from "react-icons/fa";

interface InfoPopupProps {
  isOpen: boolean;
  closePopup: () => void;
  title: string;
  description: string;
  services: string[];
}

const InfoPopup: React.FC<InfoPopupProps> = ({ isOpen, closePopup, title, description, services }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <button className="close-btn" onClick={closePopup}>
          <FaTimes />
        </button>
        <h2>{title}</h2>
        <p>{description}</p>
        <ul>
          {services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InfoPopup;
