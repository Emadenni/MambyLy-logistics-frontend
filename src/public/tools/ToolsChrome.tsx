import React from "react";
import { useCopy } from "../experience/i18n";
import Screen, { TopBar } from "../experience/Screen";
import { PATHS, type ScreenId } from "../experience/routes";
import { TOOLS_COPY, TOOLS_LOGO } from "./catalogue";
import "../styles/tools.scss";

/**
 * The frame of the MambyLy Tools pages: the site's own screen (bar, menu, language, contact,
 * footer), with the line's logo – the same "mambyLy", "TOOLS" spaced out underneath – and its gold
 * accent on the page (styles/tools.scss).
 */
const ToolsChrome: React.FC<{
  id: ScreenId;
  head: React.ReactNode;
  /** the page's place under MambyLy Tools (Stay…); none on /tools itself */
  here?: string;
  children: React.ReactNode;
}> = ({ id, head, here, children }) => {
  const t = useCopy();
  const c = TOOLS_COPY[t.lang];
  const crumbs = here ? [{ label: "MambyLy Tools", to: PATHS.tools[t.lang] }, { label: here }] : [{ label: "MambyLy Tools" }];
  return (
    <Screen
      id={id}
      tone="ivory"
      className="tl"
      head={head}
      bar={
        <TopBar
          crumbs={crumbs}
          service="tools"
          logo={{ src: TOOLS_LOGO.green, label: c.homeLabel }}
          logoTo={PATHS.tools[t.lang]}
          back={here ? { screen: "tools", label: "MambyLy Tools" } : { screen: "explore", label: t.common.back, anyPrevious: true }}
        />
      }
    >
      <div className="tl-main">{children}</div>
    </Screen>
  );
};

export default ToolsChrome;
