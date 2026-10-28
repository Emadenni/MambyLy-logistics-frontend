import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiCompass, FiMail, FiUsers } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import { TbBrowser } from "react-icons/tb";
import { useCopy } from "./i18n";
import { PATHS, resolvePath, type ScreenId, type StaticScreen } from "./routes";

/** The five places of the menu and the screens that belong to each of them. */
type Section = "explore" | "websites" | "cards" | "about" | "contact";

const SECTION_OF: Partial<Record<ScreenId, Section>> = {
  explore: "explore",
  websites: "websites",
  method: "websites",
  cards: "cards",
  services: "cards",
  examples: "cards",
  about: "about",
  jobs: "about",
  contact: "contact",
};

const ITEMS: { section: Section; screen: StaticScreen; icon: React.ReactNode }[] = [
  { section: "explore", screen: "explore", icon: <FiCompass /> },
  { section: "websites", screen: "websites", icon: <TbBrowser /> },
  { section: "cards", screen: "cards", icon: <LuIdCard /> },
  { section: "about", screen: "about", icon: <FiUsers /> },
  { section: "contact", screen: "contact", icon: <FiMail /> },
];

/**
 * Site navigation: one small compass button in the header opens a compact row of icon links
 * (a real <nav> with links, not an application menu). Each icon has its translated name (read by
 * screen readers, shown as a tooltip on hover and focus); the current section has
 * aria-current="page". Closes after a choice, on Escape (focus back on the button) and on a click
 * outside. Never opens on hover alone.
 */
const NavMenu: React.FC = () => {
  const t = useCopy();
  const m = t.menu;
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const id = useId();
  const wrap = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const active = SECTION_OF[resolvePath(location.pathname).screen];

  useEffect(() => setOpen(false), [location.key]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!wrap.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  return (
    <div ref={wrap} className={`mp-menu${open ? " is-open" : ""}`}>
      <button
        ref={button}
        type="button"
        className="mp-menu__toggle"
        aria-expanded={open}
        aria-controls={id}
        aria-label={open ? m.close : m.open}
        onClick={() => setOpen((v) => !v)}
      >
        <FiCompass aria-hidden="true" />
        <span className="mp-menu__tip" aria-hidden="true">
          {open ? m.close : m.open}
        </span>
      </button>
      <nav id={id} className="mp-menu__panel" aria-label={m.label} hidden={!open}>
        <ul>
          {ITEMS.map((item) => {
            const current = active === item.section;
            return (
              <li key={item.section}>
                <Link
                  to={PATHS[item.screen][t.lang]}
                  className={`mp-menu__link${current ? " is-on" : ""}`}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span aria-hidden="true">{item.icon}</span>
                  <span className="mp-sr">{m[item.section]}</span>
                  <span className="mp-menu__tip" aria-hidden="true">
                    {m[item.section]}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default NavMenu;
