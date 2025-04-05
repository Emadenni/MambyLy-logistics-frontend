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
import InfoPopup from "../InfoPopup/InfoPopup";

interface IconCardProps {
  icon: React.ReactNode;
  info: string;
  animated: boolean;
  onClick: () => void;
}

const IconCard: React.FC<IconCardProps> = ({ icon, info, animated, onClick }) => {
  return (
    <div className={`icon-card ${animated ? "animated" : ""}`} data-info={info} onClick={onClick}>
      {icon}
    </div>
  );
};

const IconCards: React.FC = () => {
  const [animated, setAnimated] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState<{
    title: string;
    description: string;
    services: string[];
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimated(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const icons = [
    {
      icon: <FaStore />,
      info: "Är du en Pizzeria, Restaurang eller Fast Food?",
      title: "Pizzeria/Restaurang/Fast Food",
      description: "Här är några av de bästa tjänsterna vi kan erbjuda för din verksamhet:",
      services: [
        "Skapa en interaktiv meny",
        "Online beställning och leveranslösningar",
        "Webbsida med enkel beställning och betalning",
        "Sociala medier marknadsföring",
      ],
    },
    {
      icon: <FaStore />,
      info: "Är du en liten butik?",
      title: "Liten Butik",
      description: "Dessa lösningar passar för att växa din butik online:",
      services: [
        "E-handelslösningar för din butik",
        "SEO och digital marknadsföring",
        "Mobilvänliga webbsidor",
        "Enkel betalningslösning",
      ],
    },
    {
      icon: <FaHotel />,
      info: "Har du ett hotell eller rum för uthyrning?",
      title: "Hotell/Rum för uthyrning",
      description: "Så här kan vi hjälpa till att förbättra din bokningstjänst:",
      services: [
        "Online bokningssystem för kunder",
        "Hemsida med information om ditt boende",
        "Förbättrad SEO för bättre synlighet",
        "Digital marknadsföring för att nå fler kunder",
      ],
    },
    {
      icon: <FaTruck />,
      info: "Är du ett transportföretag eller logistikleverantör?",
      title: "Transport/Logistik",
      description: "Dessa tjänster kan hjälpa dig att effektivisera din verksamhet:",
      services: [
        "Bokningssystem för transport",
        "Effektiva lagerhanteringslösningar",
        "Logistiksystem för spårning i realtid",
        "Automatisering av kundkommunikation",
      ],
    },
    {
      icon: <FaBuilding />,
      info: "Är du ett byggföretag eller professionell tjänst?",
      title: "Byggföretag/Professionell Tjänst",
      description: "Vi erbjuder följande tjänster för din bransch:",
      services: [
        "Anpassade webbsidor för byggprojekt",
        "Projektledningssystem för dina team",
        "Digital marknadsföring för byggföretag",
        "Skapande av portföljer och referensprojekt",
      ],
    },
    {
      icon: <FaDumbbell />,
      info: "Har du ett gym eller wellnesscenter?",
      title: "Gym/Wellnesscenter",
      description: "Så här kan vi hjälpa till att växa din verksamhet:",
      services: [
        "Bokningssystem för träningspass",
        "Hemsida för att visa tjänster och priser",
        "SEO för att synas på nätet",
        "Sociala medier marknadsföring",
      ],
    },
    {
      icon: <FaLaptopCode />,
      info: "Är du frilansare inom tech eller kreativt arbete?",
      title: "Frilansare",
      description: "Följande tjänster passar för att förbättra din online-närvaro:",
      services: [
        "Portfoliowebbplats för att visa ditt arbete",
        "SEO för att hitta nya kunder",
        "Enkel betalningslösning för dina tjänster",
        "Marknadsföring på sociala medier",
      ],
    },
    {
      icon: <FaWarehouse />,
      info: "Är du ett lager eller leverantör för B2B?",
      title: "Lager/B2B",
      description: "Här är lösningar som kan effektivisera din verksamhet:",
      services: [
        "Lagerhanteringssystem",
        "B2B e-handel och betalningslösningar",
        "Automatiserade orderhanteringssystem",
        "Logistiklösningar för snabbare leveranser",
      ],
    },
    {
      icon: <FaBullhorn />,
      info: "Är du en kommunikationsbyrå eller webbyrå?",
      title: "Kommunikationsbyrå/Webbyrå",
      description: "Så här kan vi hjälpa dig att förbättra din byrås verksamhet:",
      services: [
        "Anpassade webbsidor för dina kunder",
        "Digital marknadsföring och SEO",
        "Content creation för sociala medier",
        "Kampanjhantering och analysverktyg",
      ],
    },
  ];

  const handleIconClick = (data: { title: string; description: string; services: string[] }) => {
    setPopupData(data);
    setPopupOpen(true);
    setTimeout(() => {
      const popup = document.getElementById("info-popup");
      if (popup) {
        popup.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  const handleClosePopup = () => {
    setPopupOpen(false);
  };

  return (
    <div className="icons-container-wrapper">
      <div className="icons-container">
        {icons.map((item, index) => (
          <IconCard
            key={index}
            icon={item.icon}
            info={item.info}
            animated={animated}
            onClick={() => handleIconClick(item)}
          />
        ))}
      </div>

      <InfoPopup
        isOpen={popupOpen}
        closePopup={handleClosePopup}
        title={popupData?.title ?? ""}
        description={popupData?.description ?? ""}
        services={popupData?.services ?? []}
      />
    </div>
  );
};

export default IconCards;
