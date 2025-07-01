declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const injectGoogleAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (typeof window === "undefined" || !measurementId) return;

  // ✅ Sempre definisce gtag, anche se lo script è già presente
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  // ✅ Configura GA solo una volta
  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );

  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // ✅ Sempre configura GA, anche se script già presente
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true, // opzionale per GDPR
  });
};
