import React, { useState } from "react";
import { CTAProps } from "../../types/common";
import "./cta.scss";

const CTA: React.FC<CTAProps> = ({
  text,
  backgroundColor = "#000",
  color = "#fff",
  hoverBackgroundColor = "#444",  
  hoverColor = "#fff", 
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    backgroundColor: isHovered ? hoverBackgroundColor : backgroundColor,
    color: isHovered ? hoverColor : color,
  };

  return (
    <button
      className="cta-button"
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}  
      onMouseLeave={() => setIsHovered(false)}  
    >
      {text}
    </button>
  );
};

export default CTA;
