import React from "react";
import { NavLink } from "react-router-dom"; // Importazione corretta
import "./navbar.scss";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__list__item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            HEM
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/tjänster"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            TJÄNSTER
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/kontaktaOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            KONTAKTA OSS
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/jobbaMedOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            JOBBA MED OSS
          </NavLink>
        </li>

        <li className="navbar__list__item">
          <NavLink
            to="/omOss"
            className={({ isActive }) => (isActive ? "navbar_link navbar_link--active" : "navbar_link")}
          >
            OM OSS
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
