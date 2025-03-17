import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./hamburgerMenu.scss";

const HamburgerMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen((prevState) => !prevState);
  };

  return (
    <div className={`hamburger-menu ${isOpen ? "open" : ""}`}>
      {isOpen && <div className="hamburger-menu__overlay" data-testid="overlay" onClick={toggleMenu}></div>}

      <div className="hamburger-menu__icon" role="button" aria-label="Open menu" onClick={toggleMenu}>
        <div className={`bar ${isOpen ? "bar--open" : ""}`}></div>
        <div className={`bar ${isOpen ? "bar--open" : ""}`}></div>
        <div className={`bar ${isOpen ? "bar--open" : ""}`}></div>
      </div>

      {/* Lista del menu */}
      <div className={`hamburger-menu__list ${isOpen ? "open" : ""}`}  data-testid="menu-list">
        <ul>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
            >
              HEM
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/tjänster"
              className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
            >
              TJÄNSTER
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/kontaktaOss"
              className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
            >
              KONTAKTA OSS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/jobbaMedOss"
              className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
            >
              JOBBA MED OSS
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/omOss"
              className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
            >
              OM OSS
            </NavLink>
          </li>
        </ul>

        <div className="hamburger-menu__close" onClick={toggleMenu}>
          <span>&#10005;</span> {/* Icona X */}
        </div>
      </div>
    </div>
  );
};

export default HamburgerMenu;
