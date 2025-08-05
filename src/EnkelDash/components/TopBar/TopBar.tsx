import React, { useState } from "react";
import "./TopBar.scss";
import logoIcon from "../../assets/logo-icon-64.webp";
import userImg from "../../../assets/images/profileEmanuele.webp";
import companyLogo from "../../../assets/images/mambylyLogoRestyled.webp";

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";

import offerKitIcon from "../../assets/offerKit.webp";
import clientSideIcon from "../../assets/clienSide.webp";
import chillBookingIcon from "../../assets/chillBooking.webp";
import shiftDealerIcon from "../../assets/shiftDealer.webp";
import brandOnIcon from "../../assets/brandOn.webp";
import fullStockIcon from "../../assets/fullStock.webp";
import pingMeIcon from "../../assets/pingMe.webp";


import { useSidebarStore } from "../../store/SidebarStore";


type ToolIcon = {
  name: string;
  icon: string;
};

const toolIcons: ToolIcon[] = [
  { name: "OfferKit", icon: offerKitIcon },
  { name: "ClientSide", icon: clientSideIcon },
  { name: "ChillBooking", icon: chillBookingIcon },
  { name: "ShiftDealer", icon: shiftDealerIcon },
  { name: "BrandOn", icon: brandOnIcon },
  { name: "FullStock", icon: fullStockIcon },
  { name: "PingMe", icon: pingMeIcon },
];

const Topbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // ✅ prendi toggleSidebar dallo store Zustand
  const toggleSidebar = useSidebarStore((state) => state.toggleSidebar);

  const handleSettings = () => {
    console.log("Open settings");
  };

  const handleLogout = () => {
    console.log("Logout");
  };

  return (
    <div className="topbar-wrapper">
      <div className="topbar-header-line">
        <div className="headline-mobile-actions mobile-only">
          <button
            type="button"
            className="topbar-icon"
            aria-label="Settings"
            onClick={handleSettings}
          >
            <SettingsIcon />
          </button>
          <button
            type="button"
            className="topbar-icon"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </button>
        </div>

        <img src={logoIcon} alt="logo" className="topbar-header-line__icon" />

        <div className="headline-mobile-toggle mobile-only">
          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Open tools menu"
            onClick={() => {
              setIsRightSidebarOpen(false);
              setIsMobileMenuOpen((v) => !v);
            }}
          >
            <MenuIcon />
          </button>

          <button
            type="button"
            className="mobile-menu-toggle"
            aria-label="Open productivity menu"
            onClick={() => {
              toggleSidebar(); // ✅ chiama lo store Zustand
              setIsMobileMenuOpen(false);
            }}
          >
            <DashboardIcon />
          </button>
        </div>

        <div className="topbar-actions desktop-only" aria-label="Topbar actions">
          <button
            type="button"
            className="topbar-icon topbar-icon--settings"
            aria-label="Settings"
            onClick={handleSettings}
          >
            <SettingsIcon />
          </button>
          <button
            type="button"
            className="topbar-icon topbar-icon--logout"
            aria-label="Logout"
            onClick={handleLogout}
          >
            <LogoutIcon />
          </button>
        </div>
      </div>

      <div className="topbar">
        <div className="topbar__left">
          <img src={userImg} alt="user" className="topbar__avatar" />
          <div className="topbar__info">
            <div className="topbar__name">Mario Rossi</div>
            <div className="topbar__role">Admin</div>
            <div className="topbar__company">MambyLy Solutions</div>
          </div>
          <div className="topbar__logo-container">
            <img src={companyLogo} alt="company" className="topbar__company-logo" />
          </div>
        </div>

        <div className="topbar__right desktop-only">
          <div className="topbar__right-scroll">
            {toolIcons.map((tool) => (
              <button
                type="button"
                className="topbar__icon-button"
                key={tool.name}
                aria-label={tool.name}
                onClick={() => console.log(`Open ${tool.name}`)}
              >
                <img src={tool.icon} alt={tool.name} className="topbar__tool-icon" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-sidebar" role="menu" aria-label="Tools">
          {toolIcons.map((tool) => (
            <button
              type="button"
              className="mobile-sidebar__item"
              key={tool.name}
              onClick={() => console.log(`Open ${tool.name}`)}
            >
              <img src={tool.icon} alt={tool.name} />
              <span>{tool.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Topbar;
