import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.scss";

const Navbar: React.FC  = () => {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__list__item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            Hem
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/tjänster"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            Tjänster
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/kontaktaOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            Kontakta Oss
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/jobbaMedOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            Jobb
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/omOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            Om Oss
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
