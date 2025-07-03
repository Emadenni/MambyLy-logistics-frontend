declare global {
  interface Window {
    plausible?: (...args: any[]) => void;
  }
}

export const injectPlausible = () => {
  const alreadyLoaded = document.querySelector('script[src*="plausible.io/js/plausible"]');
  if (alreadyLoaded) return;

  const script = document.createElement("script");
  script.src = "https://plausible.io/js/plausible.js";
  script.setAttribute("data-domain", "mambylysolutions.se"); // 🔁 METTI IL TUO DOMINIO
  script.setAttribute("data-manual", "true"); // 👉 disabilita tracking automatico
  script.async = true;

  script.onload = () => {
    console.log("✅ Plausible caricato");
  };

  document.head.appendChild(script);
};
