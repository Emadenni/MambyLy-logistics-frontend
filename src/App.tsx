import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./store/useAuthStore";
import ScrollToTop from "./components/ScrollToTop";
import PromoBanner from "./components/PromoBanner/PromoBanner";
import CookieConsentBanner from "./components/CookieConsentBanner/CookieConsentBanner";
import PublicLayout from "./components/PublicLayout";
import { CartProvider } from "./Context/CartContext";
import { useClarity } from "./hooks/useClarity";
import { useUmami } from "./hooks/useUmami";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import WorkWithUs from "./pages/WorkWithUs/WorkWithUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import LoginForm from "./components/LoginForm/LoginForm";
import SidoButik from "./pages/SidoButik/SidoButik";
import Templates from "./pages/Templates/Templates";
import TemplateDetails from "./components/TemplateDetails/TemplateDetails";
import SignDash from "./EnkelDash/pages/Dashboard/SignDash";
import Dashboard from "./EnkelDash/pages/Dashboard/Dashboard";

import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";

// ✅ Wrapper per accedere a useLocation dentro Router
const AppWrapper = () => {
  useClarity();
  useUmami();
  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hideWhatsAppIcon =
    location.pathname.startsWith("/dash") ||
    location.pathname.startsWith("/sign") ||
    location.pathname.startsWith("/admin");

  return (
    <>
      <ScrollToTop />
      {/* <PromoBanner /> */}
      <Routes>
        {/* 🌐 SITO PUBBLICO */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tjänster" element={<Services />} />
          <Route path="/kontaktaOss" element={<ContactUs />} />
          <Route path="/jobbaMedOss" element={<WorkWithUs />} />
          <Route path="/omOss" element={<AboutUs />} />
          <Route path="/sidoButik" element={<SidoButik />} />
          <Route path="/sidoButik/mallar" element={<Templates />} />
          <Route path="/sidoButik/mallar/:templateId" element={<TemplateDetails />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 🔐 PAGINE PROTETTE */}
        <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
       {/*  <Route path="/dash" element={isAuthenticated ? <Dashboard /> : <Navigate to="/sign" />} /> */}

       <Route path="/dash" element={<Dashboard />} />

        {/* 🔓 PAGINE PUBBLICHE ESTERNE */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/sign" element={<SignDash />} />
      </Routes>

      {/* ✅ WHATSAPP ICON SOLO SU PAGINE PUBBLICHE */}
      {!hideWhatsAppIcon && (
        <a
          href="https://wa.me/46764510582?text=Hej!%20Jag%20besökte%20din%20webbplats%20och%20vill%20veta%20mer!"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="whatsapp-icon"
        >
          <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon" loading="lazy" />
        </a>
      )}
    </>
  );
};

const App = () => (
  <HelmetProvider>
    <CartProvider>
      <CookieConsentBanner />
      <Router>
        <AppWrapper />
      </Router>
    </CartProvider>
  </HelmetProvider>
);

export default App;
