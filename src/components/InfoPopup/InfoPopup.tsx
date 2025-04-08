import React from 'react';
import { Modal } from '@mui/material';
import './InfoPopup.scss';

const InfoPopup: React.FC<{
  title: string;
  description: string;
  services: string[];
  image: string;
  onClose: () => void;
}> = ({ title, description, services, image, onClose }) => {
  return (
    <Modal open={true} onClose={onClose}>
      <div className="info-popup">
        <button className="info-popup__close" onClick={onClose}>
          ✕
        </button>
        <h2 className="info-popup__title">{title}</h2>
        <p className="info-popup__description">{description}</p>
        {image && <img className="info-popup__image" src={image} alt={title} />}
        <ul className="info-popup__services">
          {services.map((service, index) => (
            <li key={index}>{service}</li>
          ))}
        </ul>
      </div>
    </Modal>
  );
};

export default InfoPopup;
