import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { isClarityRunning, isPrivatePath } from "../hooks/analytics";
import { useClarity } from "../hooks/useClarity";
import { UMAMI_SCRIPT_ID, useUmami } from "../hooks/useUmami";

/**
 * Starts the analytics the visitor accepted, and keeps them off the admin. They cannot be stopped
 * once loaded, so arriving at a private route from a public screen reloads the page without them.
 */
const Analytics = () => {
  const { pathname } = useLocation();
  const excluded = isPrivatePath(pathname);
  useClarity(excluded);
  useUmami(excluded);

  useEffect(() => {
    if (excluded && (isClarityRunning() || document.getElementById(UMAMI_SCRIPT_ID))) window.location.reload();
  }, [excluded]);

  return null;
};

export default Analytics;
