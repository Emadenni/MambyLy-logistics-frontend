import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import "./styles/globals.scss";
import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";

import Home from "./pages/Home/Home";
import Services from "./pages/Services/Services";
import ContactUs from "./pages/ContactUs/ContactUs";
import WorkWithUs from "./pages/WorkWithUs/WorkWithUs";
import AboutUs from "./pages/AboutUs/AboutUs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import LoginForm from "./components/LoginForm/LoginForm";
import ScrollToTop from "./components/ScrollToTop";
import PublicLayout from "./components/PublicLayout";
import PromoBanner from "./components/PromoBanner/PromoBanner";

const App = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <ScrollToTop />
      <PromoBanner />
      <Routes>
      
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tjänster" element={<Services />} />
          <Route path="/kontaktaOss" element={<ContactUs />} />
          <Route path="/jobbaMedOss" element={<WorkWithUs />} />
          <Route path="/omOss" element={<AboutUs />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        <Route path="/login" element={<LoginForm />} />
        <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
      </Routes>
        <a
        href="https://wa.me/46722116422?text=Hej!%20Jag%20besökte%20din%20webbplats%20och%20vill%20veta%20mer!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
        className="whatsapp-icon"
      >
        <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon" loading="lazy" />
      </a>
    </Router>
  );
};

export default App;
