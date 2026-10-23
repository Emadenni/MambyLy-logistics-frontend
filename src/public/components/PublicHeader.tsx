import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { FiArrowUpRight, FiMenu, FiX } from "react-icons/fi";
import logoDark from "../assets/logo-dark.svg";
import { publicSiteConfig } from "../config";

type NavItem = { to: string; label: string; end?: boolean };

const navItems: NavItem[] = [
  { to: "/", label: "Hem", end: true },
  { to: "/tjänster", label: "Tjänster" },
  { to: "/omOss", label: "Om oss" },
  { to: "/jobbaMedOss", label: "Jobb" },
  ...(publicSiteConfig.showSidoButik ? [{ to: "/sidoButik", label: "Sido Butik" }] : []),
];

const linkClass = ({ isActive }: { isActive: boolean }) => (isActive ? "mp-nav__link is-active" : "mp-nav__link");

const PublicHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { pathname } = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 921px)");
    const onDesktop = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onDesktop);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [menuOpen]);

  return (
    <header className={`mp-header ${menuOpen ? "is-open" : ""}`}>
      <div className="mp-header__inner mp-container">
        <Link to="/" className="mp-header__logo">
          <img src={logoDark} alt="MambyLy Solutions – till startsidan" width={150} height={43} />
        </Link>

        <nav className="mp-nav" aria-label="Huvudmeny">
          <ul className="mp-nav__list">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link to="/kontaktaOss" className="mp-btn mp-btn--primary mp-btn--sm">
            Kontakta oss <FiArrowUpRight aria-hidden="true" />
          </Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="mp-header__toggle"
          aria-expanded={menuOpen}
          aria-controls="mp-mobile-menu"
          aria-label={menuOpen ? "Stäng meny" : "Öppna meny"}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>

      <div className="mp-mobile-menu__backdrop" hidden={!menuOpen} onClick={() => setMenuOpen(false)} />
      <div id="mp-mobile-menu" ref={panelRef} className="mp-mobile-menu" hidden={!menuOpen}>
        <nav aria-label="Mobilmeny">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className={linkClass}>
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/kontaktaOss" className={linkClass}>
                Kontakta oss
              </NavLink>
            </li>
          </ul>
        </nav>
        <Link to="/kontaktaOss" className="mp-btn mp-btn--primary mp-btn--block">
          Vad vill du förenkla? <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </header>
  );
};

export default PublicHeader;
