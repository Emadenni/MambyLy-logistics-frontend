import React from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/images/mambylyLogoRestyled.webp";
import "./logo.scss";
import { logoProps } from "../../types/common";


const sizeMap = {
  small: { width: 160, height: 40 },
  medium: { width: 240, height: 60 },
  large: { width: 320, height: 80 },
};

const Logo: React.FC<logoProps> = ({ size = "medium" }) => {
  const { width, height } = sizeMap[size];

  return (
    <Link to="/" className="mambyLy_logo-container">
      <img
        src={logo}
        alt="mambyLy-logo"
        className={`mambyLy_logo ${size}`}
        width={width}
        height={height}
        loading="eager" 
        decoding="async"
      />
    </Link>
  );
};


export default Logo;
