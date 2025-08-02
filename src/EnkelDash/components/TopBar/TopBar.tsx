import React from "react";
import './topbar.scss';
import logoIcon from '../../assets/logo-icon-64.webp';
import userImg from '../../../assets/images/profileEmanuele.webp';
import companyLogo from "../../../assets/images/mambylyLogoRestyled.webp"

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
          <button className="topbar__circle">B</button>
          <button className="topbar__circle">S</button>
          <button className="topbar__circle">G</button>
          <button className="topbar__circle">V</button>
          <button className="topbar__circle">D</button>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
