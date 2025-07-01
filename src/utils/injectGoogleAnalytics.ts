declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const injectGoogleAnalytics = (consent: {
  analytics: boolean;
  marketing: boolean;
}) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (typeof window === "undefined" || !measurementId) return;

  // 1. Inizializza dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: any[]) {
      window.dataLayer.push(args);
    };

  // 2. Imposta il consenso iniziale (negato di default)
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // 3. Inietta lo script solo se non è già presente
  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // 4. Aggiorna i consensi effettivi
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });

  // 5. Configura GA
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
  });

  // ✅ Debug log
  console.log("📈 GA attivato con consensi:", consent);
};
