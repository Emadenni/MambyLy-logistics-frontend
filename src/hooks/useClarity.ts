import { useEffect } from "react";
import clarity from "@microsoft/clarity";
import { safeParse } from "../utils/safeParse";

const clarityId = import.meta.env.VITE_CLARITY_ID;

export const useClarity = () => {
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const parsed = safeParse(consent);

    if (consent && !parsed) {
      console.warn("❌ Consent non valido, lo rimuovo");
      localStorage.removeItem("cookieConsent");
      window.dispatchEvent(new CustomEvent("invalidCookieConsent"));
      return;
    }

    if (clarityId && parsed?.analytics === true) {
      clarity.init(clarityId);
    } else {
    }
  }, []);
};
