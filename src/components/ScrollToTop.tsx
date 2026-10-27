// components/ScrollToTop.tsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isLegacyPath } from "../public/experience/routes";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // The public site restores and resets scroll itself (src/public/experience/Stage.tsx).
    if (!isLegacyPath(pathname)) return;
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
