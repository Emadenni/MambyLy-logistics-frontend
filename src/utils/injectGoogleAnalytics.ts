declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const injectGoogleAnalytics = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

  if (typeof window === "undefined" || !measurementId) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function (...args: any[]) {
    window.dataLayer.push(args);
  };

  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );

  const configGA = () => {
    window.gtag!("js", new Date());
    window.gtag!("config", measurementId, {
      anonymize_ip: true,
      debug_mode: true,
    });
    console.log(`📈 Google Analytics configurato: ${measurementId}`);
  };

  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = configGA; // ✅ SOLO dopo che è pronto
    document.head.appendChild(script);
  } else {
    configGA(); // ✅ Se già caricato, esegui subito
  }
};
