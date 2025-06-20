import { NavLink } from "react-router-dom";
import "./sidoNavbar.scss";
import React from "react";

const SidoNavbar = () => {
  return (
    <nav className="sido-navbar">
      <NavLink to="/sidoButik" className="sido-navbar-link">
        Hem
      </NavLink>
      <NavLink to="/policy" className="sido-navbar-link">
        Policy
      </NavLink>
      <NavLink to="/kontaktaOss" className="sido-navbar-link">
        Kontakt
      </NavLink>
      <NavLink to="/mallar" className="sido-navbar-link">
        Mallar
      </NavLink>
    </nav>
  );
};

export default SidoNavbar;
