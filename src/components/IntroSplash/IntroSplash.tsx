import React, { useEffect } from "react";
import "./IntroSplash.scss";
import logo from "../../assets/images/mambylyLogoRestyled.webp";

const IntroSplash = ({ onFinish }: { onFinish: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem("introSeen", "true");
      onFinish();
    }, 6500);

    return () => clearTimeout(timer);
  }, [onFinish]);

 return (
  <div className="intro-splash">
    <img src={logo} alt="My Unbelieve Solutions" className="intro-logo" />

    <p className="intro-tagline">Ditt projekt är vårt projekt.</p>

    <div className="intro-loader">
      <div className="bar"></div>
    </div>

    <button className="intro-cta" onClick={onFinish}>
      Starta
    </button>
  </div>
);
}
export default IntroSplash;
