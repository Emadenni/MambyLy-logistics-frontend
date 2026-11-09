import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuBadgeCheck, LuCalendarClock, LuHeadphones, LuHouse, LuStar, LuUtensils } from "react-icons/lu";
import { useCopy } from "../experience/i18n";
import { ScreenHead } from "../experience/Screen";
import { PATHS } from "../experience/routes";
import { TOOLS, TOOLS_COPY, type ToolId } from "./catalogue";
import ToolsChrome from "./ToolsChrome";

const ICON: Record<ToolId, React.ReactNode> = {
  stay: <LuHouse aria-hidden />,
  reviews: <LuStar aria-hidden />,
  menu: <LuUtensils aria-hidden />,
  booking: <LuCalendarClock aria-hidden />,
  guide: <LuHeadphones aria-hidden />,
  origin: <LuBadgeCheck aria-hidden />,
};

/** Where an active tool lives. */
const PAGE: Partial<Record<ToolId, (lang: "sv" | "en") => string>> = { stay: (lang) => PATHS.toolsStay[lang] };

/** /tools: the shop window of the line, one card per tool; the coming ones are switched off. */
const ToolsHome: React.FC = () => {
  const t = useCopy();
  const c = TOOLS_COPY[t.lang];
  return (
    <ToolsChrome>
      <ScreenHead lang={t.lang} title={c.meta} description={c.metaDesc} screen="tools" />
      <section className="tl-hero">
        <p className="tl-kicker">{c.kicker}</p>
        <h1 data-focus>{c.title}</h1>
        <p className="tl-lead">{c.lead}</p>
        {/* the tag that opens a page: the idea of the whole line, drawn */}
        <div className="tl-hero__tag" aria-hidden="true">
          <span className="tl-hero__chip" />
          <i />
          <i />
          <i />
        </div>
      </section>

      <section className="tl-grid-wrap" aria-label={c.toolsLabel}>
        <ul className="tl-grid">
          {TOOLS.map((tool, i) => {
            const to = tool.status === "active" ? PAGE[tool.id]?.(t.lang) : undefined;
            const body = (
              <>
                <span className="tl-card__top">
                  <span className="tl-card__icon">{ICON[tool.id]}</span>
                  <span className={`tl-badge tl-badge--${tool.status}`}>{tool.status === "active" ? c.active : c.soon}</span>
                </span>
                <span className="tl-card__name">{tool.name}</span>
                <span className="tl-card__line">{tool.line[t.lang]}</span>
                <span className="tl-card__who">
                  <span>{c.who}</span> {tool.who[t.lang]}
                </span>
                {to && (
                  <span className="tl-card__go">
                    {c.open} <LuArrowRight aria-hidden />
                  </span>
                )}
              </>
            );
            return (
              <li key={tool.id} style={{ "--i": i } as React.CSSProperties}>
                {to ? (
                  <Link to={to} className="tl-card tl-card--active">
                    {body}
                  </Link>
                ) : (
                  <div className="tl-card tl-card--soon" aria-disabled="true">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </ToolsChrome>
  );
};

export default ToolsHome;
