import React from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import "./footer.scss";
import FooterMenu from "../FooterMenu/FooterMenu";
import Logo from "../Logo/Logo";
import Terms from "../Terms/Terms";
import SocialBox from "../SocialBox/SocialBox";


const Footer: React.FC  = () => {
  return (
    <footer className="footer">
      <div className="footer__logo_container">
        <Logo size="small" />
      </div>
      <Terms />
      <SocialBox />
      <FooterMenu />
     
    </footer>
  );
};

export default Footer;
