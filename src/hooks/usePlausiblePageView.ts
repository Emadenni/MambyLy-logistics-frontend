import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const usePlausiblePageView = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== "undefined" && typeof window.plausible === "function") {
      window.plausible("pageview");
      console.log("📡 Pageview tracciato:", location.pathname);
    }
  }, [location]);
};
