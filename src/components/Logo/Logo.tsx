import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/mambyLyLogoDef.png";

type Props = {};

const Logo = (props: Props) => {
  return (
    <Link to="/" className="logo">
      <img src={logo} alt="mambyLy-logo" />
    </Link>
  );
};

export default Logo;
