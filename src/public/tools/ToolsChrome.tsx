import React from "react";
import { Link } from "react-router-dom";
import { LuArrowUpRight } from "react-icons/lu";
import { useCopy } from "../experience/i18n";
import LangSwitch from "../experience/LangSwitch";
import { PATHS } from "../experience/routes";
import { TOOLS_COPY } from "./catalogue";
import "@fontsource/familjen-grotesk/latin-400.css";
import "@fontsource/familjen-grotesk/latin-500.css";
import "@fontsource/familjen-grotesk/latin-600.css";
import "@fontsource/familjen-grotesk/latin-700.css";
import "../styles/tools.scss";

/** The text logo of the line: "MambyLy" and "Tools", the tag mark between them. */
export const ToolsMark: React.FC<{ product?: string }> = ({ product = "Tools" }) => (
  <span className="tl-mark">
    <span className="tl-mark__brand">MambyLy</span>
    <span className="tl-mark__dot" aria-hidden="true" />
    <span className="tl-mark__product">{product}</span>
  </span>
);

/**
 * The frame of the MambyLy Tools pages: their own header (the Tools mark, the way back to the main
 * site, the language) and footer, on the line's own dark ground.
 */
const ToolsChrome: React.FC<{ children: React.ReactNode; product?: string; home?: string }> = ({ children, product, home }) => {
  const t = useCopy();
  const c = TOOLS_COPY[t.lang];
  return (
    <div className="tl">
      <header className="tl-head">
        <Link to={home ?? PATHS.tools[t.lang]} className="tl-head__mark" aria-label={c.homeLabel}>
          <ToolsMark product={product} />
        </Link>
        <div className="tl-head__end">
          <LangSwitch />
          <Link to={PATHS.explore[t.lang]} className="tl-head__site">
            {c.backToSite} <LuArrowUpRight aria-hidden />
          </Link>
        </div>
      </header>
      <main className="tl-main">{children}</main>
      <footer className="tl-foot">
        <Link to={PATHS.tools[t.lang]} aria-label={c.homeLabel}>
          <ToolsMark />
        </Link>
        <p>{c.madeBy}</p>
        <p>
          <Link to={PATHS.explore[t.lang]}>mambylysolutions.se</Link> · <Link to={PATHS.privacy[t.lang]}>{t.common.privacy}</Link>
        </p>
      </footer>
    </div>
  );
};

export default ToolsChrome;
