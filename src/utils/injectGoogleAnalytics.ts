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

  // ✅ STEP 1 - Inizializza gtag
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function (...args: any[]) {
      window.dataLayer.push(args);
    };
    console.log("🔧 gtag inizializzato");
  }

  // ✅ STEP 2 - Imposta consenso
  console.log("🔒 Consenso iniziale: denied");
  window.gtag("consent", "default", {
    ad_storage: "denied",
    analytics_storage: "denied",
  });

  console.log("🔄 Aggiorno consenso effettivo:", consent);
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

    setTimeout(() => {
      window.gtag!("config", measurementId, {
        anonymize_ip: true,
      });

      window.gtag!("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname,
      });

      if (consent.analytics) {
        window.gtag!("event", "debug_event", {
          event_category: "debug",
          event_label: "Consent accepted",
        });
      }

      console.log("✅ GA configurato. Ora controllo se parte la richiesta 'collect'...");

      // 🧪 TEST MANUALE: forziamo richiesta verso collect per verificarla
      const testImg = new Image();
      const testUrl = `https://www.google-analytics.com/g/collect?v=2&tid=${measurementId}&cid=555&t=event&en=ping_test`;
      testImg.src = testUrl;
      testImg.onload = () => console.log("📡 Ping manuale GA RICEVUTO: collect OK ✅");
      testImg.onerror = () =>
        console.warn(
          "❌ Ping manuale GA FALLITO. Il browser o rete sta bloccando collect. 🔒"
        );
    }, 500);
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
