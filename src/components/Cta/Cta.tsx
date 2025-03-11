import React from "react";
import { CTAProps } from "./cta.types";
import "./cta.scss";

const CTA: React.FC<CTAProps> = ({ text, backgroundColor = "#000", color = "#fff", onClick }) => {
  return (
    <button 
      className="cta-button" 
      style={{ backgroundColor, color }} 
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default CTA;
