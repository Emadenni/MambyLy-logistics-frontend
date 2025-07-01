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

  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  // ✅ Imposta consenso dinamico per GDPR
  window.gtag("consent", "default", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
    wait_for_update: 500,
  });

  const alreadyLoaded = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  );
  if (!alreadyLoaded) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);
  }

  window.gtag("js", new Date());
  window.gtag("config", measurementId, {
    anonymize_ip: true,
  });

  console.log("\u{1F4C8} GA attivato con GDPR dynamic consent:", consent);
};
