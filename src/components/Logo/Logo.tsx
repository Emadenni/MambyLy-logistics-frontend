import React, { useEffect, useState } from "react";
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
  const [currentSize, setCurrentSize] = useState(size);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setCurrentSize("small");
      } else {
        setCurrentSize(size);
      }
    };

    handleResize(); // Set initial size

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [size]);

  const { width, height } = sizeMap[currentSize];

  return (
    <Link to="/" className="mambyLy_logo-container">
      <img
        src={logo}
        alt="mambyLy-logo"
        className={`mambyLy_logo ${currentSize}`}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
    </Link>
  );
};

export default Logo;
