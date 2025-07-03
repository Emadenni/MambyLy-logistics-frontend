import { useEffect, useState } from "react";
import Terms from "../Terms/Terms";
import "./cookieConsentBanner.scss";
import React from "react";
import clarity from "@microsoft/clarity";

const clarityId = import.meta.env.VITE_CLARITY_ID;

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  // Mostra il banner se il consenso è assente o non valido
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");

    try {
      const parsed = consent ? JSON.parse(consent) : null;
      if (!parsed || typeof parsed !== "object") throw new Error("Invalid consent");
    } catch {
      localStorage.removeItem("cookieConsent");
      setShowBanner(true);
    }
  }, []);

  // Riapertura forzata del banner
  useEffect(() => {
    const reopen = () => setShowBanner(true);
    window.addEventListener("invalidCookieConsent", reopen);
    return () => window.removeEventListener("invalidCookieConsent", reopen);
  }, []);

  // Blocca lo scroll quando il banner è visibile
  useEffect(() => {
    document.body.style.overflow = showBanner ? "hidden" : "";
  }, [showBanner]);

  const handleConsent = (choice: "all" | "essential" | "custom" | "reject") => {
    let finalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
    };

    if (choice === "all") {
      finalConsent.analytics = true;
      finalConsent.marketing = true;
    } else if (choice === "custom") {
      finalConsent = { essential: true, ...preferences };
    }

    localStorage.setItem("cookieConsent", JSON.stringify(finalConsent));
    console.log("📢 Consenso salvato:", finalConsent);

    if (finalConsent.analytics && clarityId) {
      console.log("🟢 Clarity attivato");
      clarity.init(clarityId);
    }

    setShowBanner(false);
  };

  const handleSwitch = (category: "analytics" | "marketing") => {
    setPreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  return showBanner ? (
    <div
      className="cookie-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-title"
    >
      <div className="cookie-modal">
        <h2 id="cookie-title">Integritet & cookies</h2>
        <p>
          Vi använder cookies för att förbättra din upplevelse. Du kan välja
          vilka kategorier du vill tillåta.
        </p>

        <div className="cookie-switches">
          <div className="cookie-switch">
            <span>Analytiska</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={() => handleSwitch("analytics")}
              />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="cookie-switch">
            <span>Marknadsföring</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={() => handleSwitch("marketing")}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="cookie-buttons">
          <button className="essential" onClick={() => handleConsent("essential")}>
            Endast nödvändiga
          </button>
          <button className="custom" onClick={() => handleConsent("custom")}>
            Spara val
          </button>
          <button className="accept" onClick={() => handleConsent("all")}>
            Acceptera alla
          </button>
          <button className="reject" onClick={() => handleConsent("reject")}>
            Avvisa alla
          </button>
        </div>

        <div className="cookie-terms">
          <Terms />
        </div>
      </div>
    </div>
  ) : null;
};

export default CookieConsentBanner;
