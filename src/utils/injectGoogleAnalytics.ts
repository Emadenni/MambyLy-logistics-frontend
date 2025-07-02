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

  // ✅ Inizializza dataLayer e gtag PRIMA dello script
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
  }

  // ✅ Imposta consenso iniziale e aggiornato
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });

  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const configureGA = () => {
    console.log("⚙️ Configurazione GA in corso...");

    window.gtag!("js", new Date());
    window.gtag!("config", measurementId, {
      anonymize_ip: true
    });

    // 🔍 Evento page_view
    window.gtag!("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });

    // 🧪 Evento debug
    if (consent.analytics) {
      window.gtag!("event", "debug_event", {
        event_category: "debug",
        event_label: "Consent accepted",
      });
    }

    console.log("✅ GA configurato. Ora controllo se parte la richiesta 'collect'...");

    // ✅ CONTROLLO ATTIVO SU "collect"
    setTimeout(() => {
      const found = performance.getEntriesByType("resource").some((entry: any) =>
        typeof entry.name === "string" &&
        entry.name.includes("google-analytics.com/g/collect")
      );

      if (found) {
        console.log("📡 ✅ RICHIESTA 'collect' RILEVATA 🔥 GA FUNZIONA");
      } else {
        console.warn("🛑 Nessuna richiesta 'collect' trovata. GA NON sta inviando dati.");
      }
    }, 2000); // 2s per sicurezza dopo load
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
