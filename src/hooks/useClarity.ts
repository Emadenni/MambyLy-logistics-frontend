import { useEffect } from "react";
import { safeParse } from "../utils/safeParse";
import { startClarity } from "./analytics";

const clarityId = import.meta.env.VITE_CLARITY_ID;

/** Clarity loads nothing until the visitor has accepted, and never on a private route. */
export const useClarity = (excluded: boolean) => {
  useEffect(() => {
    const load = () => {
      const consent = localStorage.getItem("cookieConsent");
      const parsed = safeParse(consent);

      if (consent && !parsed) {
        console.warn("❌ Consent non valido, lo rimuovo");
        localStorage.removeItem("cookieConsent");
        window.dispatchEvent(new CustomEvent("invalidCookieConsent"));
        return;
      }

      if (!excluded && clarityId && parsed?.analytics === true) startClarity(clarityId);
    };
    load();
    // Fired by the consent banner when a choice is saved.
    window.addEventListener("cookieConsentSaved", load);
    return () => window.removeEventListener("cookieConsentSaved", load);
  }, [excluded]);
};
