import React from "react";
import "./ScrollIndicator.scss";

const ScrollIndicator = () => {
  const handleClick = () => {
    // Scrolla verso il primo elemento dopo la Hero
    const nextSection = document.querySelector(".after-hero");
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="scroll-indicator" onClick={handleClick} role="button" aria-label="Scroll down">
      <div className="chevron chevron1"></div>
      <div className="chevron chevron2"></div>
      <div className="chevron chevron3"></div>
    </div>
  );
};

export default ScrollIndicator;
