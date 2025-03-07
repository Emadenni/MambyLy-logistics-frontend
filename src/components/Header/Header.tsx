import React, { useEffect } from "react";
import { useDeviceStore } from "../../store/useDeviceStore";
import Logo from "../Logo/Logo";
import Navbar from "../Navbar/Navbar";
import Hamburger_menu from "../Hamburger_menu/Hamburger_menu";

const Header = () => {
  const { isMobile, setIsMobile } = useDeviceStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    const handleMediaChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    setIsMobile(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleMediaChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, [setIsMobile]);

  return (
    <header>
      <div className="logo-container">
        <Logo />
      </div>
      {isMobile ? <Hamburger_menu /> : <Navbar />}
    </header>
  );
};

export default Header;
