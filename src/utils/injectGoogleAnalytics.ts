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
  if (!window.gtag) {
    window.gtag = (...args: any[]) => window.dataLayer.push(args);
  }

  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );
  
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;

    // ✅ Aspetta che lo script sia caricato
    script.onload = () => {
      window.gtag!("js", new Date());
      window.gtag!("config", measurementId, {
        anonymize_ip: true,
        debug_mode: true,
      });
      console.log("✅ GA attivato dopo script load");
    };

    document.head.appendChild(script);
  } else {
    // ✅ Se già caricato, esegui subito
    window.gtag!("js", new Date());
    window.gtag!("config", measurementId, {
      anonymize_ip: true,
      debug_mode: true,
    });
    console.log("✅ GA attivato subito (script già presente)");
  }
};
