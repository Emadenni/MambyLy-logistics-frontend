// ✅ DEFINIZIONE SICURA GLOBAL WINDOW
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

  if (typeof window === "undefined") return;
  if (!measurementId) return;

  window.dataLayer = window.dataLayer || [];

  // ✅ Inizializza gtag se non esiste
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
    console.log("🔧 gtag inizializzato");
  }

  // ✅ Imposta consenso iniziale
  console.log("🔒 Consenso iniziale: denied");
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  // ✅ Aggiorna consenso effettivo
  console.log("🔄 Aggiorno consenso effettivo:", consent);
  window.gtag("consent", "update", {
    ad_storage: consent.marketing ? "granted" : "denied",
    analytics_storage: consent.analytics ? "granted" : "denied",
  });

  const alreadyLoaded = document.querySelector(
    'script[src*="googletagmanager.com/gtag/js"]'
  );

  const runAfterScriptLoad = () => {
    if (!window.gtag) {
      console.warn("❌ gtag non disponibile dopo il caricamento script");
      return;
    }

    console.log("⚙️ Configurazione GA in corso...");
    window.gtag("js", new Date());

    // ✅ Tracciamento automatico pagina
    window.gtag("config", measurementId, {
      anonymize_ip: true,
      send_page_view: true, // ✅ importante!
    });

    // ✅ Evento test per debug
    if (consent.analytics) {
      window.gtag("event", "debug_event", {
        event_category: "debug",
        event_label: "Consent accepted",
      });
    }

    console.log("✅ GA configurato. Ora controllo se parte la richiesta 'collect'...");

    // ✅ TEST: verifichiamo se GA collect è bloccato
    fetch("https://www.google-analytics.com/g/collect", { mode: "no-cors" })
      .then(() => console.log("✅ GA collect raggiungibile dal browser"))
      .catch(() => console.warn("❌ GA collect BLOCCATO (rete o browser)"));
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
    console.log("📦 Script GA già presente");
    runAfterScriptLoad();
  }
};
