import React from "react";
import './TopBar.scss';
import logoIcon from '../../assets/logo-icon-64.webp';
import userImg from '../../../assets/images/profileEmanuele.webp';
import companyLogo from "../../../assets/images/mambylyLogoRestyled.webp";

import offerKitIcon from "../../assets/offerKit.webp";
import clientSideIcon from "../../assets/clienSide.webp";
import catchyIcon from "../../assets/catchy.webp";
import chillBookingIcon from "../../assets/chillBooking.webp";
import doolioIcon from "../../assets/doolio.webp";
import shiftDealerIcon from "../../assets/ShiftDealer.webp";
import brandOnIcon from "../../assets/BrandOn.webp";
import fullStockIcon from "../../assets/fullStock.webp";
import mailManagerIcon from "../../assets/mailManager.webp";
import pingMeIcon from "../../assets/pingMe.webp";

const toolIcons = [
  { name: "OfferKit", icon: offerKitIcon },
  { name: "ClientSide", icon: clientSideIcon },
  // { name: "Catchy", icon: catchyIcon },
  { name: "ChillBooking", icon: chillBookingIcon },
  // { name: "Doolio", icon: doolioIcon },
  { name: "ShiftDealer", icon: shiftDealerIcon },
  { name: "BrandOn", icon: brandOnIcon },
  { name: "FullStock", icon: fullStockIcon },
  // { name: "MailManager", icon: mailManagerIcon },
  { name: "PingMe", icon: pingMeIcon },
];

const Topbar = () => {
  return (
    <div className="topbar-wrapper">
      <div className="topbar-header-line">
        <img src={logoIcon} alt="logo" className="topbar-header-line__icon" />
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

        <div className="topbar__center"></div>

        <div className="topbar__right">
          <div className="topbar__right-scroll">
            {toolIcons.map((tool, index) => (
              <button className="topbar__icon-button" key={index}>
                <img src={tool.icon} alt={tool.name} className="topbar__tool-icon" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
