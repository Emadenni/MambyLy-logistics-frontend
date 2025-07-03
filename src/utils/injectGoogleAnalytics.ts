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
    console.log("🔧 gtag inizializzato");
  }

  // Consenso iniziale (negato)
  console.log("🔒 Consenso iniziale: denied");
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // Consenso effettivo
  console.log("🔄 Aggiorno consenso effettivo:", consent);
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });

  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const configureGA = () => {
    if (!window.gtag) return;

    console.log("⚙️ Configurazione GA in corso...");
    window.gtag("js", new Date());

    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false // disabilitiamo automatico
    });

    // ✅ page_view manuale
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // ✅ evento debug test
    if (consent.analytics) {
      window.gtag("event", "test_realtime_event", {
        event_category: "debug",
        event_label: "test_click"
      });
    }

    console.log("✅ GA configurato. Controllo se collect è bloccato...");
    fetch("https://www.google-analytics.com/g/collect", { mode: "no-cors" })
      .then(() => console.log("✅ GA collect raggiungibile"))
      .catch(() => console.warn("❌ GA collect BLOCCATO (rete o browser)"));
  };

  if (!alreadyLoaded) {
    console.log("🧩 Iniezione script GA...");
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Script GA caricato");
      configureGA();
    };
    document.head.appendChild(script);
  } else {
    console.log("📦 Script GA già presente");
    configureGA();
  }
};
