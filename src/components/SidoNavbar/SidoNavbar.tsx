import { NavLink } from "react-router-dom";
import "./SidoNavbar.scss";
import React from "react";

const SidoNavbar = () => {
  return (
    <nav className="sido-navbar">
      <NavLink to="/" className="sido-navbar-link">
        Hem
      </NavLink>
      <NavLink to="/policy" className="sido-navbar-link">
        Policy
      </NavLink>
      <NavLink to="/kontaktaOss" className="sido-navbar-link">
        Kontakt
      </NavLink>
      <NavLink to="/kontaktaOss" className="sido-navbar-link inaktive">
        Mallar
      </NavLink>
    </nav>
  );
};

export default SidoNavbar;
