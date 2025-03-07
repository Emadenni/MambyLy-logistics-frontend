import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/mambyLyLogoDef.png";
import "./logo.scss";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Link to="/" className="mambyLy_logo-container">
      <img src={logo} alt="mambyLy-logo" className="mambyLy_logo" />
    </Link>
  );
};

export default Logo;
