import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { pathFor, resolvePath } from "../routes";
import { useUi } from "../ui";
import StoryPage from "../story/StoryPage";
import Veil from "../story/Veil";

/**
 * "/" and "/utforska" (English "/en", "/en/explore"): the home veil lies on top of Utforska, the
 * card's scroll story. Lifting the veil (drag, wheel, tap, Enter or Space) reveals the page that is
 * already there and moves the URL to /utforska; Back or the logo lowers the veil again.
 */
const Hub: React.FC = () => {
  const t = useCopy();
  const location = useLocation();
  const navigate = useNavigate();
  const reduce = useReducedMotion() ?? false;
  const isHome = resolvePath(location.pathname).screen === "home";
  const setCoverShown = useUi((s) => s.setCoverShown);
  const exploreTitle = useRef<HTMLHeadingElement>(null);
  const shownHome = useRef(isHome);

  const explorePath = pathFor("explore", t.lang);
  const homePath = pathFor("home", t.lang);

  // Focus follows the veil: its control when it comes down, the page title once it is up.
  useEffect(() => {
    setCoverShown(isHome);
    if (shownHome.current === isHome) return;
    shownHome.current = isHome;
    const focus = window.setTimeout(
      () => (isHome ? document.querySelector<HTMLElement>(".mp-veil__handle") : exploreTitle.current)?.focus({ preventScroll: true }),
      reduce ? 0 : 480,
    );
    return () => window.clearTimeout(focus);
  }, [isHome, reduce, setCoverShown]);

  useEffect(() => () => setCoverShown(false), [setCoverShown]);

  return (
    <>
      <Veil
        home={isHome}
        onOpen={() => navigate(explorePath)}
        head={<ScreenHead lang={t.lang} title={t.meta.home.title} description={t.meta.home.description} screen="home" />}
      />

      <div className="mp-under" aria-hidden={isHome ? true : undefined} {...(isHome ? { inert: "" } : {})}>
        <Screen
          id="explore"
          className="mp-screen--tale"
          head={isHome ? null : <ScreenHead lang={t.lang} title={t.meta.explore.title} description={t.meta.explore.description} screen="explore" />}
          bar={<TopBar crumbs={[{ label: t.nav.explore }]} logoTo={homePath} />}
          withAdmin
        >
          <h1 className="mp-sr" ref={exploreTitle} tabIndex={-1} data-focus={isHome ? undefined : ""}>
            {t.explore.title}
          </h1>
          <StoryPage active={!isHome} />
        </Screen>
      </div>
    </>
  );
};

export default Hub;
