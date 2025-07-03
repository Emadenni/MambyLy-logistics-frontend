import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const useTrackPageViews = () => {
  const location = useLocation();

  useEffect(() => {
    if (!window.gtag) return;
    window.gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: location.pathname,
    });
    console.log("📡 Tracciamento page_view su:", location.pathname);
  }, [location]);
};
