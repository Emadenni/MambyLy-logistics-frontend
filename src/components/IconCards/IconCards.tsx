import React, { useState, useEffect } from "react";
import { iconData } from "../../components/data/iconData";
import * as FaIcons from "react-icons/fa";
import InfoPopup from "../InfoPopup/InfoPopup";
import "./iconCards.scss";

const IconCards: React.FC = () => {
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
    services: string[];
    image: string;
  } | null>(null);

  const handleCardClick = (title: string, description: string, services: string[], image: string) => {
    setPopupData({ title, description, services, image });
    setPopupOpen(true);
  };

  return (
    <>
      <div className="icons-container">
        {iconData.map(({ icon, info, title, description, services, image }, index) => {
          const IconComponent = FaIcons[icon as keyof typeof FaIcons];

          return (
            <div
              key={index}
              className="icon-card"
              data-info={info}
              onClick={() => handleCardClick(title, description, services, image)}
            >
              {IconComponent && <IconComponent size={40} />}
            </div>
          );
        })}
      </div>

      {popupOpen && popupData && (
        <InfoPopup
          title={popupData.title}
          description={popupData.description}
          services={popupData.services}
          image={popupData.image}
          onClose={() => setPopupOpen(false)}
        />
      )}
    </>
  );
};

export default IconCards;
