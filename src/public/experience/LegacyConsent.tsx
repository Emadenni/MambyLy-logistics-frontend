import React from "react";
import { useLocation } from "react-router-dom";
import { isLegacyPath } from "./routes";
import { isPrivatePath } from "../../hooks/analytics";

/**
 * Sido Butik keeps the previous cookie banner exactly as it was; the public site shows its own
 * bilingual banner (ConsentBanner, same storage key and values). Admin and login load no analytics,
 * so there is nothing to ask.
 */
const LegacyConsent: React.FC<{ banner: React.ReactNode }> = ({ banner }) => {
  const { pathname } = useLocation();
  return isLegacyPath(pathname) && !isPrivatePath(pathname) ? <>{banner}</> : null;
};

export default LegacyConsent;
