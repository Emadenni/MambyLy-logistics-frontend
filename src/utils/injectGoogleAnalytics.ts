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

  console.log("🚀 Inizio iniezione GA...");

  // Inizializza dataLayer e gtag se non esistono
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    console.log("🔧 Definizione funzione gtag");
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  } else {
    console.log("✅ gtag già definito");
  }

  // Imposta consenso di default (negato)
  console.log("🔒 Imposto consenso iniziale (denied)");
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // Inietta lo script GA se non presente
  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const proceed = () => {
    // Applica il consenso aggiornato
    console.log("📜 Aggiornamento consenso:", consent);
    window.gtag!("consent", "update", {
      ad_storage: consent.marketing ? "granted" : "denied",
      analytics_storage: consent.analytics ? "granted" : "denied",
    });

    // Configura GA solo dopo che è caricato
    console.log("⚙️ Configurazione GA con ID:", measurementId);
    window.gtag!("js", new Date());
    window.gtag!("config", measurementId, {
      anonymize_ip: true,
    });

    // 🔥 Invio manuale evento page_view per visibilità Realtime
    window.gtag!("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // Evento test per debug
    if (consent.analytics) {
      console.log("🧪 Invio evento test (debug_event)");
      window.gtag!("event", "debug_event", {
        event_category: "debug",
        event_label: "Attivazione GA con consenso",
      });
    }

    console.log("✅ GA pronto con consenso dinamico:", consent);
  };

  if (!alreadyLoaded) {
    console.log("🧩 Iniezione script GA...");
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Script GA caricato");
      proceed();
    };
    document.head.appendChild(script);
  } else {
    console.log("📦 Script GA già presente");
    proceed();
  }
};
