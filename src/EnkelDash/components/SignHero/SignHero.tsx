import React from "react";
import "./SignHero.scss";

import logo120 from "../../assets/logoDash-120.webp.webp";
import logo240 from "../../assets/logoDash-240.webp.webp";

const SignHero: React.FC = () => {
  return (
    <div className="sign-hero">
      <div className="sign-hero__logo">
        <picture>
          <source srcSet={logo240} media="(min-width: 1024px)" />
          <source srcSet={logo120} media="(min-width: 600px)" />
          <img src={logo120} alt="EnkelDash Logo" />
        </picture>
      </div>
      <div className="sign-hero__content">
        <h1>Välkommen till EnkelDash</h1>
        <p>Din smarta kontrollpanel för att gestire allting med stil.</p>
      </div>
    </div>
  );
};

export default SignHero;
