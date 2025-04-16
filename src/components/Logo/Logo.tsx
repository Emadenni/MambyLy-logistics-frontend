import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/mambylyLogoRestyled.png";
import "./logo.scss";
import { logoProps } from "../../types/common";



const Logo: React.FC  = ({ size = "medium" }: logoProps) => {
  return (
    <Link to="/" className="mambyLy_logo-container">
      <img src={logo} alt="mambyLy-logo" className={`mambyLy_logo ${size}`} />
    </Link>
  );
};

export default Logo;
