import React, { useEffect } from "react";
import "./header.scss";
import { useDeviceStore } from "../../store/useDeviceStore";
import Logo from "../Logo/Logo";
import Navbar from "../Navbar/Navbar";
import HamburgerMenu from "../HamburgerMenu/HamburgerMenu";

const Header: React.FC = () => {
  const { isMobile, setIsMobile } = useDeviceStore();

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

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
    <header className="header">
      <div className="logo_container">
        <Logo size="medium" />
      </div>
      {isMobile ? <HamburgerMenu /> : <Navbar />}
    </header>
  );
};

export default Header;
