import React from "react";
import { NavLink } from "react-router-dom";
import "./footer_menu.scss";

const Footer_menu = (props: Props) => {
  return (
    <div className="footer_menu">
      <ul className="footer_menu__list">
        <li className="footer_menu__list__item">
          <NavLink to="/" className="footer_menu_link">
            HEM
          </NavLink>
        </li>

        <li className="footer_menu__list__item">
          <NavLink to="/tjänster" className="footer_menu_link">
            TJÄNSTER
          </NavLink>
        </li>

        <li className="footer_menu__list__item">
          <NavLink to="/kontaktaOss" className="footer_menu_link">
            KONTAKTA OSS
          </NavLink>
        </li>

        <li className="footer_menu__list__item">
          <NavLink to="/jobbaMedOss" className="footer_menu_link">
            JOBBA MED OSS
          </NavLink>
        </li>
        <li className="footer_menu__list__item">
          <NavLink to="/omOss" className="footer_menu_link">
            OM OSS
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Footer_menu;
