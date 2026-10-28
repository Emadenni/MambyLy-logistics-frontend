// src/hooks/useUmami.ts
import { useEffect } from "react";

/** Umami starts only after the visitor has allowed statistics (localStorage "cookieConsent"). */
const analyticsAllowed = () => {
  try {
    return JSON.parse(localStorage.getItem("cookieConsent") || "null")?.analytics === true;
  } catch {
    return false;
  }
};

export const useUmami = () => {
  useEffect(() => {
    const scriptId = "umami-script";
    const load = () => {
      if (document.getElementById(scriptId) || !analyticsAllowed()) return;
      if (!import.meta.env.VITE_UMAMI_SCRIPT_URL || !import.meta.env.VITE_UMAMI_SITE_ID) return;

      const script = document.createElement("script");
      script.setAttribute("defer", "true");
      script.setAttribute("data-website-id", import.meta.env.VITE_UMAMI_SITE_ID);
      script.src = import.meta.env.VITE_UMAMI_SCRIPT_URL;
      script.id = scriptId;

      document.body.appendChild(script);
    };
    load();
    // Fired by the consent banner when a choice is saved.
    window.addEventListener("cookieConsentSaved", load);
    return () => window.removeEventListener("cookieConsentSaved", load);
  }, []);
};
