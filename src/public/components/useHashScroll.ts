import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls to the element named by the URL hash (e.g. /#sa-funkar-det from the card menu).
 * Runs after ScrollToTop's scroll-to-top on route change, so the section wins.
 */
export function useHashScroll() {
  const { hash, key } = useLocation();

  useEffect(() => {
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
      // Move focus for keyboard and screen-reader users without a second jump.
      if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
      el.focus({ preventScroll: true });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [hash, key]);
}
