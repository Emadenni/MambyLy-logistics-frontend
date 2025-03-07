import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/mambyLyLogoDef.png";
import "./logo.scss";
import { logoProps } from "../../types/components";



const Logo = ({ size = "medium" }: LogoProps) => {
  return (
    <Link to="/" className="mambyLy_logo-container">
      <img src={logo} alt="mambyLy-logo" className={`mambyLy_logo ${size}`} />
    </Link>
  );
};

export default Logo;
