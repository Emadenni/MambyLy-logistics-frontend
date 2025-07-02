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

  if (typeof window === "undefined") {
    console.warn("🌐 GA abortito: finestra non disponibile (SSR?)");
    return;
  }

  if (!measurementId) {
    console.error("❌ GA abortito: VITE_GA_MEASUREMENT_ID non definito");
    return;
  }

  // 🔧 Inizializza dataLayer e gtag (SEMPRE prima dello script)
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  // 🔒 Imposta consenso iniziale (denied)
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // Aggiorna subito il consenso
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });

  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const configureGA = () => {
    window.gtag!("js", new Date());
    window.gtag!("config", measurementId, {
      anonymize_ip: true,
      debug_mode: true, // Necessario per DebugView
    });

    // Evento page_view
    window.gtag!("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Evento test
    if (consent.analytics) {
      window.gtag!("event", "debug_event", {
        event_category: "debug",
        event_label: "Consent accepted",
      });
    }

    console.log("✅ GA attivo e configurato con consenso:", consent);
  };

  if (!alreadyLoaded) {
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
