import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight } from "react-icons/lu";
import { useCopy } from "../experience/i18n";
import { ScreenHead } from "../experience/Screen";
import { PATHS } from "../experience/routes";
import { TOOLS, TOOLS_COPY, type ToolId } from "./catalogue";
import ToolMark from "./ToolMark";
import ToolsChrome from "./ToolsChrome";

/** Where an active tool lives. */
const PAGE: Partial<Record<ToolId, (lang: "sv" | "en") => string>> = {
  stay: (lang) => PATHS.toolsStay[lang],
  reviews: (lang) => PATHS.toolsReviews[lang],
  guide: (lang) => PATHS.toolsGuide[lang],
};

/**
 * /tools: the shop window of the line, as modules – one tile per tool, its logo on a plate and a
 * line underneath. The ready tool is the green plate and a link; the coming ones are switched off.
 */
const ToolsHome: React.FC = () => {
  const t = useCopy();
  const c = TOOLS_COPY[t.lang];
  const ready = TOOLS.filter((tool) => tool.status === "active").length;
  const readyLabel = ready === 1 ? c.countActive : c.countActivePl;
  return (
    <ToolsChrome id="tools" head={<ScreenHead lang={t.lang} title={c.meta} description={c.metaDesc} screen="tools" />}>
      <section className="tl-top">
        <p className="tl-kicker">{c.kicker}</p>
        <h1 data-focus>{c.title}</h1>
        <p className="tl-lead">{c.lead}</p>
      </section>

      <section className="tl-modules" aria-label={c.toolsLabel}>
        <p className="tl-modules__head" aria-hidden="true">
          <span>{c.toolsLabel}</span>
          <span>
            {ready} {readyLabel} · {TOOLS.length - ready} {c.countSoon}
          </span>
        </p>
        <ul className="tl-tiles">
          {TOOLS.map((tool, i) => {
            const to = tool.status === "active" ? PAGE[tool.id]?.(t.lang) : undefined;
            const body = (
              <>
                <span className="tl-tile__plate">
                  {tool.logo ? (
                    <img src={tool.logo.src} alt={tool.name} width={tool.logo.width} height={tool.logo.height} decoding="async" />
                  ) : (
                    <>
                      <ToolMark
                        name={tool.name.replace("MambyLy ", "")}
                        light={tool.status === "active"}
                        accent={tool.status === "active" ? tool.accent?.dark : tool.accent?.pale}
                      />
                      <span className="tl-vh">{tool.name}</span>
                    </>
                  )}
                </span>
                <span className="tl-tile__line">{tool.line[t.lang]}</span>
                <span className="tl-tile__who">{tool.who[t.lang]}</span>
                <span className="tl-tile__state">
                  <i aria-hidden="true" />
                  {tool.status === "active" ? c.active : c.soon}
                  {to && <LuArrowRight aria-hidden />}
                </span>
              </>
            );
            return (
              <li key={tool.id} style={{ "--i": i } as React.CSSProperties}>
                {to ? (
                  <Link to={to} className="tl-tile tl-tile--active">
                    {body}
                  </Link>
                ) : (
                  <div className="tl-tile tl-tile--soon" aria-disabled="true">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        <p className="tl-modules__by">{c.madeBy}</p>
      </section>
    </ToolsChrome>
  );
};

export default ToolsHome;
