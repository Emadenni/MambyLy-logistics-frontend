import React, { ReactNode } from "react";
import PublicHeader from "./PublicHeader";
import PublicFooter from "./PublicFooter";
import "../styles/public.scss";

/**
 * Wrapper for the restyled public pages. Every new style lives under `.mambyly-public`
 * (or `body:has(.mambyly-public)` for portals), so admin, login and Sido Butik keep their
 * current look even though the CSS ships in the same bundle.
 */
const PublicShell: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className="mambyly-public">
    <a className="mp-skip" href="#mp-main">
      Hoppa till innehållet
    </a>
    <PublicHeader />
    <main id="mp-main" className="mp-main" tabIndex={-1}>
      {children}
    </main>
    <PublicFooter />
  </div>
);

export default PublicShell;
