import { useEffect } from "react";
import { safeParse } from "../utils/safeParse"; // assicurati che il path sia corretto

const clarityId = import.meta.env.VITE_CLARITY_ID;

// ✅ Hook che carica Clarity solo se già consentito
export const useClarity = () => {
  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    const parsed = safeParse(consent);

    // 🔧 Se il valore è malformato (es. "all"), lo rimuovo per forzare nuovo consenso
    if (consent && !parsed) {
      localStorage.removeItem("cookieConsent");
      return; // esco subito, Clarity non va caricato
    }

    if (clarityId && parsed?.analytics === true) {
      injectClarity();
    }
  }, []);
};

// ✅ Funzione da chiamare subito quando l’utente accetta
export const injectClarity = () => {
  if (!clarityId) return;

  const alreadyLoaded = document.querySelector(`script[src*="${clarityId}"]`);
  if (alreadyLoaded) return;

  const script = document.createElement("script");
  script.src = `https://www.clarity.ms/tag/${clarityId}`;
  script.async = true;
  document.head.appendChild(script);
};
