import { useEffect, useState } from "react";
import Terms from "../Terms/Terms";
import "./cookieConsentBanner.scss";
import React from "react";

const CookieConsentBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  useEffect(() => {
    if (showBanner) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [showBanner]);

  const handleConsent = (choice: "all" | "essential" | "custom" | "reject") => {
    if (choice === "all") {
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify({
          essential: true,
          analytics: true,
          marketing: true,
        })
      );
    } else if (choice === "essential" || choice === "reject") {
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify({
          essential: true,
          analytics: false,
          marketing: false,
        })
      );
    } else if (choice === "custom") {
      localStorage.setItem(
        "cookieConsent",
        JSON.stringify({
          essential: true,
          ...preferences,
        })
      );
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
    <div className="cookie-overlay" role="dialog" aria-modal="true" aria-labelledby="cookie-title">
      <div className="cookie-modal">
        <h2 id="cookie-title">Integritet & cookies</h2>
        <p>Vi använder cookies för att förbättra din upplevelse. Du kan välja vilka kategorier du vill tillåta.</p>

        <div className="cookie-switches">
          <div className="cookie-switch">
            <span>Analytiska</span>
            <label className="switch">
              <input type="checkbox" checked={preferences.analytics} onChange={() => handleSwitch("analytics")} />
              <span className="slider round"></span>
            </label>
          </div>
          <div className="cookie-switch">
            <span>Marknadsföring</span>
            <label className="switch">
              <input type="checkbox" checked={preferences.marketing} onChange={() => handleSwitch("marketing")} />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        <div className="cookie-buttons">
          <button className="essential" onClick={() => handleConsent("essential")}>Endast nödvändiga</button>
          <button className="custom" onClick={() => handleConsent("custom")}>Spara val</button>
          <button className="accept" onClick={() => handleConsent("all")}>Acceptera alla</button>
          <button className="reject" onClick={() => handleConsent("reject")}>Avvisa alla</button>
        </div>

        <div className="cookie-terms">
          <Terms />
        </div>
      </div>
    </div>
  ) : null;
};

export default CookieConsentBanner;
