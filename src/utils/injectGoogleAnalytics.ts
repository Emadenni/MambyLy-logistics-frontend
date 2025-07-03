// ✅ Estensione sicura del tipo Window
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

  // ✅ Inizializza dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: any[]) => {
      window.dataLayer.push(args);
    };
    console.log("🔧 gtag inizializzato");
  }

  // ✅ Consenso bloccato di default
  console.log("🔒 Imposto consenso iniziale: denied");
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // ✅ Applica il consenso dell’utente
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
      send_page_view: false, // ✅ Disattivo auto page_view per GDPR
    });

    // ✅ Invia manualmente una page_view
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
    console.log("📡 Page_view inviata manualmente");

    // ✅ Evento test facoltativo per debug
    if (consent.analytics) {
      window.gtag("event", "debug_event", {
        event_category: "debug",
        event_label: "Consent accepted",
      });
    }
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
