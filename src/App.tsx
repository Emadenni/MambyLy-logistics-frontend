import React, { useEffect } from "react";
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

import "../src/EnkelDash/lib/amplify"; // ✅ configura Amplify una volta

import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";

/** 🔒 Semplice guard inline */
function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  return isAuthenticated ? children : <Navigate to="/enkel-dash/sign" replace />;
}

// ✅ Wrapper per accedere a useLocation dentro Router
const AppWrapper = () => {
  useClarity();
  useUmami();

  const location = useLocation();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const setIsAuthenticated = useAuthStore((s) => s.setIsAuthenticated);
  const setAdminId = useAuthStore((s) => s.setAdminId);
  const handleUnauthorized = useAuthStore((s) => s.handleUnauthorized);

  // 🔐 Bootstrap sessione Cognito all’avvio dell’app
  useEffect(() => {
    (async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const at = tokens?.accessToken?.toString();
        if (!at) throw new Error("no session");

        // opzionale: ID utente (sub) come adminId
        const me = await getCurrentUser().catch(() => null);
        const sub = (me as any)?.userId ?? null;

        // mantieni compat con store esistente
        sessionStorage.setItem("token", at);
        if (sub) sessionStorage.setItem("adminId", sub);

        setIsAuthenticated(true);
        setAdminId(sub ?? null);
      } catch {
        handleUnauthorized();
      }
    })();
  }, [setIsAuthenticated, setAdminId, handleUnauthorized]);

  const hideWhatsAppIcon =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/enkel-dash/");

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

        <Route
          path="/enkel-dash/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* 🔓 PAGINE PUBBLICHE ESTERNE */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/enkel-dash/sign" element={<SignDash />} />
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
