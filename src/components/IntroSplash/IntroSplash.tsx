import React, { useEffect } from "react";
import "./IntroSplash.scss";
import logo from "../../assets/images/mambylyLogoRestyled.webp";

const IntroSplash = ({ onFinish }: { onFinish: () => void }) => {
useEffect(() => {
  const timer = setTimeout(() => {
    sessionStorage.setItem("introSeen", "true");
    onFinish();
  }, 2000);

  return () => clearTimeout(timer);
}, [onFinish]);

 return (
  <div className="intro-splash">
    <img src={logo} alt="My Unbelieve Solutions" className="intro-logo" />

    <p className="intro-tagline">Ditt projekt är vårt projekt.</p>

    <div className="intro-loader">
      <div className="bar"></div>
    </div>


  </div>
);
}
export default IntroSplash;
