declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

type ConsentOptions = {
  analytics: boolean;
  marketing: boolean;
};

export const injectGoogleAnalytics = ({ analytics, marketing }: ConsentOptions) => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (typeof window === "undefined" || !measurementId) return;

  // Prepara dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: any[]) {
      window.dataLayer.push(args);
    };

  // ✅ Invia la modalità consenso
  window.gtag("consent", "default", {
    ad_storage: marketing ? "granted" : "denied",
    analytics_storage: analytics ? "granted" : "denied",
    wait_for_update: 500,
  });

  // ✅ Inietta script GA solo se non già presente
  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);
  }

  // ✅ Configura GA
  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
  });

  console.log("📈 Google Analytics configurato con Consent Mode:", {
    analytics,
    marketing,
  });
};
