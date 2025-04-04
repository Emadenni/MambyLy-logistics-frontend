import React, { useEffect, useState } from "react";
import "./iconCards.scss";
import {
  FaStore,
  FaBox,
  FaHotel,
  FaBuilding,
  FaDumbbell,
  FaLaptopCode,
  FaWarehouse,
  FaBullhorn,
  FaTruck,
} from "react-icons/fa";

interface IconCardProps {
  icon: React.ReactNode;
  info: string;
  animated: boolean;
}

const IconCard: React.FC<IconCardProps> = ({ icon, info, animated }) => {
  return (
    <div className={`icon-card ${animated ? "animated" : ""}`} data-info={info}>
      {icon}
    </div>
  );
};

const IconCards: React.FC = () => {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // Attiva l'animazione dopo 2 secondi
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const icons = [
    { icon: <FaStore />, info: "Är du en Pizzeria, Restaurang eller Fast Food?" },
    { icon: <FaStore />, info: "Är du en liten butik?" },
    { icon: <FaHotel />, info: "Har du ett hotell eller rum för uthyrning?" },
    { icon: <FaTruck />, info: "Är du ett transportföretag eller logistikleverantör?" },
    { icon: <FaBuilding />, info: "Är du ett byggföretag eller professionell tjänst?" },
    { icon: <FaDumbbell />, info: "Har du ett gym eller wellnesscenter?" },
    { icon: <FaLaptopCode />, info: "Är du frilansare inom tech eller kreativt arbete?" },
    { icon: <FaWarehouse />, info: "Är du ett lager eller leverantör för B2B?" },
    { icon: <FaBullhorn />, info: "Är du en kommunikationsbyrå eller webbyrå?" },
  ];

  return (
    <div className="icons-container-wrapper">
      <div className="icons-container">
        {icons.map((item, index) => (
          <IconCard key={index} icon={item.icon} info={item.info} animated={animated} />
        ))}
      </div>
    </div>
  );
};

export default IconCards;
