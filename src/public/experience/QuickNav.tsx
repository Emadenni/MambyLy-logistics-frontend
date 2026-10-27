import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCopy } from "./i18n";
import { PATHS, type ScreenId, type StaticScreen } from "./routes";

/** The four places of the quick navigation and the screens that belong to each of them. */
type Section = "explore" | "websites" | "cards" | "about";
const SECTIONS: Section[] = ["explore", "websites", "cards", "about"];

const SECTION_OF: Partial<Record<ScreenId, Section>> = {
  explore: "explore",
  websites: "websites",
  method: "websites",
  cards: "cards",
  services: "cards",
  examples: "cards",
  about: "about",
  jobs: "about",
};

/** Screens without the bar: the cover, fullscreen demos (they have their own way back) and /card. */
export const hasQuickNav = (screen: ScreenId) => !["home", "concept", "example", "card"].includes(screen);

/** On touch screens a focused text field means the keyboard is up: the bar steps aside. */
function useTyping() {
  const [typing, setTyping] = useState(false);
  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const isField = (el: EventTarget | null) =>
      el instanceof HTMLElement && (el.matches("textarea, select, [contenteditable]") || (el instanceof HTMLInputElement && !["checkbox", "radio", "button", "submit", "file"].includes(el.type)));
    const onIn = (e: FocusEvent) => coarse.matches && isField(e.target) && setTyping(true);
    const onOut = () => window.setTimeout(() => setTyping(coarse.matches && isField(document.activeElement)), 0);
    // Fallback for keyboards that do not move the focus: the visible viewport gets much shorter.
    const vv = window.visualViewport;
    const onResize = () => vv && coarse.matches && setTyping(vv.height < window.innerHeight * 0.72);
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    vv?.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
      vv?.removeEventListener("resize", onResize);
    };
  }, []);
  return typing;
}

/**
 * Quick navigation along the bottom edge of the inner screens: four direct destinations, the
 * current section marked with a green dot and aria-current. Kontakt stays in the top bar.
 */
const QuickNav: React.FC<{ screen: ScreenId; shown: boolean }> = ({ screen, shown }) => {
  const t = useCopy();
  const reduce = useReducedMotion() ?? false;
  const typing = useTyping();
  const active = SECTION_OF[screen];
  const visible = shown && !typing;

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.nav
          key="qnav"
          className="mp-qnav"
          aria-label={t.qnav.label}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0, transition: reduce ? { duration: 0 } : { duration: 0.32, ease: [0.22, 0.75, 0.18, 1] } }}
          exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 18, transition: { duration: 0.2 } }}
        >
          <ul>
            {SECTIONS.map((s) => {
              const on = s === active;
              const exact = on && screen === s;
              return (
                <li key={s}>
                  <Link
                    to={PATHS[s as StaticScreen][t.lang]}
                    className={`mp-qnav__link${on ? " is-on" : ""}`}
                    aria-current={exact ? "page" : on ? "true" : undefined}
                  >
                    <span className="mp-qnav__dot" aria-hidden="true" />
                    {t.qnav[s]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default QuickNav;
