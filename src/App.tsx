import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./store/useAuthStore";
import ScrollToTop from "./components/ScrollToTop";
import PromoBanner from "./components/PromoBanner/PromoBanner";
import CookieConsentBanner from "./components/CookieConsentBanner/CookieConsentBanner";
import PublicLayout from "./components/PublicLayout";
import { CartProvider } from "./Context/CartContext";
import { useClarity } from "./hooks/useClarity";
import { useUmami } from "./hooks/useUmami";

// Pre-restyle public pages: no longer routed, but still imported so that their stylesheets
// stay in the bundle in the same order and admin/login/Sido Butik keep the exact same CSS.
import "./pages/Home/Home";
import "./pages/Services/Services";
import "./pages/ContactUs/ContactUs";
import "./pages/WorkWithUs/WorkWithUs";
// AboutUs only contributes these two stylesheets; importing them directly (same order) keeps the
// former team data – and the photo of the person no longer presented – out of the build.
import "./pages/AboutUs/aboutUs.scss";
import "./components/ContactsListBox/contactsListBox.scss";
import "./pages/NotFoundPage/NotFoundPage";
import AdminPage from "./pages/AdminPage/AdminPage";
import LoginForm from "./components/LoginForm/LoginForm";
import SidoButik from "./pages/SidoButik/SidoButik";
import Templates from "./pages/Templates/Templates";
import TemplateDetails from "./components/TemplateDetails/TemplateDetails";

// Restyled public pages ("Mindre krångel. Mer företag."), see src/public/.
import Home from "./public/pages/PublicHome";
import Services from "./public/pages/PublicServices";
import ContactUs from "./public/pages/PublicContact";
import WorkWithUs from "./public/pages/PublicJobs";
import AboutUs from "./public/pages/PublicAbout";
import NotFoundPage from "./public/pages/PublicNotFound";
import DigitalCardService from "./public/pages/PublicDigitalCard";
import PublicCard from "./public/pages/PublicCard";

import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";
import { publicContact } from "./public/contact";

const App = () => {
  useClarity();
  useUmami();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Commentato per testare LCP senza blocchi
  /*
  const [splashDone, setSplashDone] = useState<boolean>(false);

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

  if (!splashDone) {
    return <IntroSplash onFinish={handleSplashFinish} />;
  }
  */

  return (
    <HelmetProvider>
      <CartProvider>
        <CookieConsentBanner />
        <Router>
          <ScrollToTop />
          {/* <PromoBanner /> */}
          <Routes>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/tjänster" element={<Services />} />
              <Route path="/kontaktaOss" element={<ContactUs />} />
              <Route path="/jobbaMedOss" element={<WorkWithUs />} />
              <Route path="/omOss" element={<AboutUs />} />
              <Route path="/digital-card" element={<DigitalCardService />} />
              <Route path="/card" element={<PublicCard />} />
              <Route path="/card/:slug" element={<PublicCard />} />
              <Route path="/sidoButik" element={<SidoButik />} />
              <Route path="/sidoButik/mallar" element={<Templates />} />
              <Route path="/sidoButik/mallar/:templateId" element={<TemplateDetails />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/login" />} />
          </Routes>

          <a
            href={publicContact.whatsappGreetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="whatsapp-icon"
          >
            <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon" loading="lazy" />
          </a>
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
