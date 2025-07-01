declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export const injectGoogleAnalytics = (options?: { marketing?: boolean }) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (typeof window === "undefined" || !measurementId) return;

  // 1. Definisce sempre dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: any[]) {
      window.dataLayer.push(args);
    };

  // 2. Funzione per configurare Google Analytics
  const configureGA = () => {
    window.gtag!("js", new Date());

    // 💡 Consent Mode v2: importantissimo per evitare "hit differiti"
    window.gtag!("consent", "update", {
      analytics_storage: "granted",
      ad_storage: options?.marketing ? "granted" : "denied", // ⬅️ cambia se serve
    });

    window.gtag!("config", measurementId, {
      anonymize_ip: true,
      debug_mode: true, // rimuovi in produzione se vuoi
    });

    console.log(`📈 Google Analytics configurato con ID: ${measurementId}`);
  };

  // 3. Controlla se lo script è già presente
  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );

  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = configureGA;
    document.head.appendChild(script);
  } else {
    configureGA();
  }
};
