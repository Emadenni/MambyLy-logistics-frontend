import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar__list">
        <li className="navbar__list__item">
          <Link to="/" className="navbar_link">
            Hem
          </Link>
          <Link to="/services" className="navbar_link">
            Tjänster
          </Link>
          <Link to="/contactUs" className="navbar_link">
            Kontakta Oss
          </Link>
          <Link to="/workWithUs" className="navbar_link">
            Jobba med Oss
          </Link>
          <Link to="/aboutUs" className="navbar_link">
            Om Oss
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
