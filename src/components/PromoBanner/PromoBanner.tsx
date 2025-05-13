import React, { useEffect, useState } from "react";
import PromoModal from "../PromoModal/PromoModal";

const PromoBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBanner(true);
    }, 5000); // mostra dopo 5s

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showBanner && !isMinimized) {
      const autoMinimize = setTimeout(() => {
        setIsMinimized(true); // riduce dopo 15s
      }, 15000);

      return () => clearTimeout(autoMinimize);
    }
  }, [showBanner, isMinimized]);

  if (!showBanner && !isMinimized) return null;

  return (
    <>
      {!isMinimized ? (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "0px",
            backgroundColor: "#ff5722", 
            color: "white",
            padding: "16px",
            margin:"5px",
            borderRadius: "10px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            fontSize: "18px",
          }}
        >
          Behöver du en enkel hemsida för ditt företag?{" "}
          <span
            onClick={() => setShowModal(true)}
            style={{ textDecoration: "underline", cursor: "pointer", fontWeight: "bold" }}
          >
            Se vårt erbjudande!
          </span>
          <button
            style={{
              marginLeft: "12px",
              backgroundColor: "white",
              color: "#ff5722",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
            onClick={() => {
              setShowBanner(false);
              setIsMinimized(false);
            }}
          >
            Stäng
          </button>
        </div>
      ) : (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "20px",
            backgroundColor: "white",
            color: "#ff5722",
            padding: "10px 16px",
            borderRadius: "50%",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            zIndex: 1000,
            cursor: "pointer",
            fontSize: "24px",
          }}
          onClick={() => {
            setIsMinimized(false);
            setShowBanner(true);
          }}
          title="Visa erbjudande"
        >
          📣
        </div>
       )}

      {showModal && <PromoModal onClose={() => setShowModal(false)} />}
    </>
  );
};

export default PromoBanner;
