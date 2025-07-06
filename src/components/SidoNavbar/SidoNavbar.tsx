import { NavLink } from "react-router-dom";
import "./sidoNavbar.scss";
import React from "react";

const SidoNavbar = () => {
  return (
    <nav className="sido-navbar">
      <NavLink
        to="/sidoButik"
        end
        className={({ isActive }) =>
          `sido-navbar-link ${isActive ? "active" : ""}`
        }
      >
        Hem
      </NavLink>

  

      <NavLink
        to="/sidoButik/mallar"
        end
        className={({ isActive }) =>
          `sido-navbar-link ${isActive ? "active" : ""}`
        }
      >
        Mallar
      </NavLink>
    </nav>
  );
};

export default SidoNavbar;
