import React from "react";
import { Outlet } from "react-router-dom";
import CookieConsentBanner from "../components/CookieConsentBanner/CookieConsentBanner";

const PublicLayout = () => {
  return (
    <>
      <Outlet />
      <CookieConsentBanner />
    </>
  );
};

export default PublicLayout;
