import React, { useEffect, useState } from "react";
import "./iconCards.scss";
import InfoPopup from "../InfoPopup/InfoPopup";
import { iconData } from "../../components/data/iconData";
import * as FaIcons from "react-icons/fa";

const IconCards: React.FC = () => {
  const [animated, setAnimated] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
    services: string[];
    image: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 2000);
    return () => clearTimeout(timer);
  }, []);

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
              className={`icon-card ${animated ? "animated" : ""}`}
              data-info={info}
              onClick={() => handleCardClick(title, description, services, image)} // Pass the actual image here
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
