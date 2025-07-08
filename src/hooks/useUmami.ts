// src/hooks/useUmami.ts
import { useEffect } from "react";

export const useUmami = () => {
  useEffect(() => {
    const scriptId = "umami-script";
    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.setAttribute("defer", "true");
    script.setAttribute("data-website-id", import.meta.env.VITE_UMAMI_SITE_ID);
    script.src = import.meta.env.VITE_UMAMI_SCRIPT_URL;
    script.id = scriptId;

    document.body.appendChild(script);
  }, []);
};
