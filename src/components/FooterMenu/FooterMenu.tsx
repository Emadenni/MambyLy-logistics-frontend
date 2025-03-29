import React from "react";
import { NavLink } from "react-router-dom";
import "./footerMenu.scss";
import AdminLink from "../AdminLink/AdminLink";

const FooterMenu: React.FC  = () => {
  return (
    <div className="footer_menu" role="navigation">
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
            JOBB
          </NavLink>
        </li>
        <li className="footer_menu__list__item">
          <NavLink to="/omOss" className="footer_menu_link">
            OM OSS
          </NavLink>
        </li>

       
      </ul>
      <AdminLink />
    </div>
  );
};

export default FooterMenu;
