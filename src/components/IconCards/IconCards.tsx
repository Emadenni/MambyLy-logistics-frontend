import React, { useEffect, useState } from "react";
import "./iconCards.scss";
import { FaCogs, FaHeart, FaRocket } from "react-icons/fa";

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
    { icon: <FaCogs />, info: "Funzione 1" },
    { icon: <FaHeart />, info: "Funzione 2" },
    { icon: <FaRocket />, info: "Funzione 3" },
    { icon: <FaRocket />, info: "Funzione 4" },
    { icon: <FaRocket />, info: "Funzione 5" },
    { icon: <FaHeart />, info: "Funzione 6" },
    { icon: <FaRocket />, info: "Funzione 7" },
    { icon: <FaRocket />, info: "Funzione 8" },
    { icon: <FaCogs />, info: "Funzione 9" },
  ];

  return (
    <div className="icons-container">
      {icons.map((item, index) => (
        <IconCard key={index} icon={item.icon} info={item.info} animated={animated} />
      ))}
    </div>
  );
};

export default IconCards;
