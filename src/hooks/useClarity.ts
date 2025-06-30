import { useEffect } from "react";
import clarity from "@microsoft/clarity";
import { safeParse } from "../utils/safeParse";

const clarityId = import.meta.env.VITE_CLARITY_ID;

export const useClarity = () => {
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const parsed = safeParse(consent);

    console.log("🧪 useClarity attivato");
    console.log("📦 Consent letto:", parsed);
    console.log("🌍 Env mode:", import.meta.env.MODE);
    console.log("🆔 Clarity ID:", clarityId);

    if (consent && !parsed) {
      console.warn("❌ Consent non valido, lo rimuovo");
      localStorage.removeItem("cookieConsent");
      window.dispatchEvent(new CustomEvent("invalidCookieConsent"));
      return;
    }

    if (clarityId && parsed?.analytics === true) {
      console.log("🚀 Avvio Clarity con ID:", clarityId);
      clarity.init(clarityId);
    } else {
      console.log("⏹️ Clarity NON avviato: condizione non soddisfatta");
    }
  }, []);
};
