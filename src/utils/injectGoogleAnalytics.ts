declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const injectGoogleAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (typeof window === "undefined" || !measurementId) return;

  // ✅ Inizializza sempre dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
  }

  // ✅ Aggiunge script solo se non già presente
  const alreadyLoaded = document.querySelector(`script[src*="googletagmanager.com/gtag/js"]`);
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // ✅ Sempre invia configurazione (essenziale per sessione attiva!)
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,       // opzionale per GDPR
    debug_mode: true,         // utile in DebugView
  });

  console.log("📈 Google Analytics iniettato:", measurementId);
};
