import { useState, useEffect } from "react";
import Terms from "../Terms/Terms";
import "./cookieConsentBanner.scss";
import React from "react";

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 500); // ritarda di 500ms

      return () => clearTimeout(timer);
    }
  }, []);

  const handleConsent = (choice: "all" | "essential" | "none") => {
    localStorage.setItem("cookieConsent", choice);
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="cookie-banner">
      <p>Vi använder cookies för att förbättra din upplevelse. Du kan välja vilka cookies du accepterar.</p>
      <div className="cookie-banner-buttons">
        <button onClick={() => handleConsent("all")}>Acceptera alla</button>
        <button onClick={() => handleConsent("essential")}>Endast nödvändiga</button>
        <button onClick={() => handleConsent("none")}>Avvisa alla</button>
      </div>
      <div className="cookie-banner-terms">
        <Terms />
      </div>
    </div>
  );
};

export default CookieConsentBanner;
