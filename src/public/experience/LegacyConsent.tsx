import React from "react";
import { useLocation } from "react-router-dom";
import { isLegacyPath } from "./routes";

/**
 * Admin, login and Sido Butik keep the previous cookie banner exactly as it was; the public site
 * shows its own bilingual banner (ConsentBanner, same storage key and values).
 */
const LegacyConsent: React.FC<{ banner: React.ReactNode }> = ({ banner }) => {
  const { pathname } = useLocation();
  return isLegacyPath(pathname) ? <>{banner}</> : null;
};

export default LegacyConsent;
