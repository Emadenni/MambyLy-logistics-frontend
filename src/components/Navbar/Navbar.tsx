import React from "react";
import { Link } from "react-router-dom";
import "./navbar.scss"

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar__list">

        <li className="navbar__list__item">
          <Link to="/" className="navbar_link">
            HEM
          </Link>
          </li>

          <li className="navbar__list__item">
          <Link to="/services" className="navbar_link">
            TJÄNSTER
          </Link>
          </li>

          <li className="navbar__list__item">
          <Link to="/contactUs" className="navbar_link">
            KONTAKTA OSS
          </Link>
          </li>

          <li className="navbar__list__item">
          <Link to="/workWithUs" className="navbar_link">
            JOBBA MED OSS
          </Link>
          </li>
          <li className="navbar__list__item">
          <Link to="/aboutUs" className="navbar_link">
            OM OSS
          </Link>
           </li>
       
      </ul>
    </nav>
  );
};

export default Navbar;
