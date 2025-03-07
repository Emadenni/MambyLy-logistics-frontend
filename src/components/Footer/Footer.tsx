import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import "./footer.scss";
import Footer_menu from "../Footer_menu/Footer_menu";
import Logo from "../Logo/Logo";
import Terms from "../Terms/Terms";

const Footer = (props: Props) => {
  return (
    <footer className="footer">
      <div className="footer__logo_container">
        <Logo size="small" />
      </div>
      <Terms />

      <Footer_menu />
    </footer>
  );
};

export default Footer;
