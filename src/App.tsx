import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./store/useAuthStore";
import ScrollToTop from "./components/ScrollToTop";
import PromoBanner from "./components/PromoBanner/PromoBanner";
import CookieConsentBanner from "./components/CookieConsentBanner/CookieConsentBanner";
import PublicLayout from "./components/PublicLayout";
import IntroSplash from "./components/IntroSplash/IntroSplash";
import { CartProvider } from "./Context/CartContext";
import { useClarity } from "./hooks/useClarity";

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
import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";

// ✅ Componente per tracciare le page_view su cambio route
const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_location: window.location.href,
        page_path: location.pathname,
      });
      console.log("📡 page_view inviato su route change:", location.pathname);
    }
  }, [location]);

  return null;
};

const App = () => {
  useClarity();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [splashDone, setSplashDone] = useState<boolean>(false);

  // ✅ Gestione splash iniziale
  useEffect(() => {
    const seen = sessionStorage.getItem("introSeen");
    if (seen === "true") {
      setSplashDone(true);
    }
  }, []);

  const handleSplashFinish = () => {
    sessionStorage.setItem("introSeen", "true");
    setSplashDone(true);
  };

  // ✅ Riapplica consenso cookie se già salvato
  useEffect(() => {
    if (!splashDone) return;

    const savedConsent = localStorage.getItem("cookieConsent");
    try {
      const parsed = savedConsent ? JSON.parse(savedConsent) : null;
      if (parsed?.analytics || parsed?.marketing) {
        console.log("📦 Ricarico consenso salvato:", parsed);
        import("./utils/injectGoogleAnalytics").then(({ injectGoogleAnalytics }) => {
          injectGoogleAnalytics({
            analytics: parsed.analytics,
            marketing: parsed.marketing,
          });
        });
      }
    } catch (err) {
      console.warn("❌ CookieConsent invalido o non parsabile");
    }
  }, [splashDone]);

  if (!splashDone) {
    return <IntroSplash onFinish={handleSplashFinish} />;
  }

  return (
    <HelmetProvider>
      <CartProvider>
        <CookieConsentBanner />
        <Router>
          <PageViewTracker />
          <ScrollToTop />
          <PromoBanner />
          <Routes>
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
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/admin"
              element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />}
            />
          </Routes>

          <a
            href="https://wa.me/46764510582?text=Hej!%20Jag%20besökte%20din%20webbplats%20och%20vill%20veta%20mer!"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="whatsapp-icon"
          >
            <img
              src={whatsapp_icon}
              alt="whatsapp_icon"
              className="social_icon"
              loading="lazy"
            />
          </a>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
