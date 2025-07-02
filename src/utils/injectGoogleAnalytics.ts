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

  // Inizializza dataLayer e gtag
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = (...args: any[]) => window.dataLayer.push(args);
    console.log("🔧 gtag inizializzato");
  }

  // Imposta consenso di default
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });
  console.log("🔒 Consenso iniziale impostato (denied)");

  // Aggiorna consenso effettivo
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });
  console.log("✅ Consenso aggiornato:", consent);

  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const runAfterScriptLoad = () => {
    console.log("⚙️ Configurazione GA...");

    window.gtag!("js", new Date());

    // ✅ Config base
    window.gtag!("config", measurementId, {
      anonymize_ip: true,
      send_page_view: false, // manuale
    });

    // ✅ Invia manualmente page_view
    if (consent.analytics) {
      window.gtag!("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });

      // ✅ Invia evento test tracciabile
      window.gtag!("event", "test_realtime_event", {
        event_category: "debug",
        event_label: "test_click",
        non_interaction: true,
      });

      console.log("📡 Eventi inviati: page_view + test_realtime_event");
    }
  };

  if (!alreadyLoaded) {
    console.log("🧩 Iniezione script GA...");
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    script.onload = () => {
      console.log("✅ Script GA caricato");
      runAfterScriptLoad();
    };
    document.head.appendChild(script);
  } else {
    runAfterScriptLoad();
  }
};
