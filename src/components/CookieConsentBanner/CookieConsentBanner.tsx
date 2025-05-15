import React, { useEffect, useState } from "react";
import Terms from "../Terms/Terms";
import "./cookieConsentBanner.scss";

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);

useEffect(() => {
  const consent = localStorage.getItem("cookieConsent");

  if (!consent) {
    setTimeout(() => {
      setShowBanner(true);
      document.body.style.overflow = "hidden"; // blocca scroll
    }, 1000);
  }

  return () => {
    document.body.style.overflow = ""; // ripristina scroll se il componente si smonta
  };
}, []);

const handleConsent = (choice: "all" | "essential" | "none") => {
  localStorage.setItem("cookieConsent", choice);
  setShowBanner(false);
  document.body.style.overflow = ""; // riabilita scroll
};

  return (
    <div
      className={`cookie-banner ${showBanner ? "show" : ""}`}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie Consent Banner"
    >
      <p>
        Vi använder cookies för att förbättra din upplevelse. Du kan välja vilka cookies du accepterar.
      </p>
      <div className="cookie-banner-buttons">
        <button
          className="consent"
          onClick={() => handleConsent("all")}
          title="Acceptera alla cookies"
        >
          Acceptera alla
        </button>
        <button
          className="settings"
          onClick={() => handleConsent("essential")}
          title="Endast nödvändiga cookies"
        >
          Endast nödvändiga
        </button>
        <button
          className="reject"
          onClick={() => handleConsent("none")}
          title="Avvisa alla cookies"
        >
          Avvisa alla
        </button>
      </div>
      <div className="terms">
        <Terms />
      </div>
    </div>
  );
};

export default CookieConsentBanner;
