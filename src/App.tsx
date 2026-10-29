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
// Admin and its sign-in (src/admin): own layout and styles, same hooks and requests as before.
import AdminApp from "./admin/AdminApp";
import LoginScreen from "./admin/LoginScreen";
import SidoButik from "./pages/SidoButik/SidoButik";
import Templates from "./pages/Templates/Templates";
import TemplateDetails from "./components/TemplateDetails/TemplateDetails";

// Public site: one screen at a time, Swedish and English (see src/public/experience and
// docs/RESTYLE-PUBLIC.md). Swedish keeps the existing URLs; English lives under /en.
import Stage from "./public/experience/Stage";
import { CONCEPT_BASE, LANGS, PATHS, isLegacyPath } from "./public/experience/routes";
import Hub from "./public/experience/screens/Hub";
import Websites from "./public/experience/screens/Websites";
import Method from "./public/experience/screens/Method";
import Cards from "./public/experience/screens/Cards";
import Services from "./public/experience/screens/Services";
import { Example, Examples } from "./public/experience/screens/Examples";
import About from "./public/experience/screens/About";
import Contact from "./public/experience/screens/Contact";
import Jobs from "./public/experience/screens/Jobs";
import { NotFound, Privacy } from "./public/experience/screens/Privacy";
import PublicCard from "./public/pages/PublicCard";
import Concept from "./public/experience/concepts/Concept";
import LegacyConsent from "./public/experience/LegacyConsent";

import whatsapp_icon from "./assets/images/socials/whatsapp_icon.webp";
import { publicContact } from "./public/contact";

/** The floating WhatsApp button stays on Sido Butik only; the public site offers the contact wizard
 * and e-mail, and in the admin and its sign-in it would only cover the work. */
const LegacyWhatsApp = () => {
  const { pathname } = useLocation();
  if (!isLegacyPath(pathname) || /^\/(admin|login)(\/|$)/i.test(pathname)) return null;
  return (
    <a href={publicContact.whatsappGreetingUrl} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="whatsapp-icon">
      <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon" loading="lazy" />
    </a>
  );
};

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
        <Router>
          {/* Previous banner, unchanged, for admin, login and Sido Butik; the public site has its own. */}
          <LegacyConsent banner={<CookieConsentBanner />} />
          <ScrollToTop />
          {/* <PromoBanner /> */}
          <Routes>
            <Route element={<Stage />}>
              {LANGS.map((lang) => (
                <React.Fragment key={lang}>
                  <Route path={PATHS.home[lang]} element={<Hub />} />
                  <Route path={PATHS.explore[lang]} element={<Hub />} />
                  <Route path={PATHS.websites[lang]} element={<Websites />} />
                  <Route path={PATHS.method[lang]} element={<Method />} />
                  <Route path={`${CONCEPT_BASE[lang]}/:slug`} element={<Concept />} />
                  <Route path={PATHS.cards[lang]} element={<Cards />} />
                  <Route path={PATHS.services[lang]} element={<Services />} />
                  <Route path={PATHS.examples[lang]} element={<Examples />} />
                  <Route path={`${PATHS.examples[lang]}/:slug`} element={<Example />} />
                  <Route path={PATHS.about[lang]} element={<About />} />
                  <Route path={PATHS.contact[lang]} element={<Contact />} />
                  <Route path={PATHS.jobs[lang]} element={<Jobs />} />
                  <Route path={PATHS.privacy[lang]} element={<Privacy />} />
                </React.Fragment>
              ))}
              <Route path="/card" element={<PublicCard />} />
              <Route path="/en/card" element={<PublicCard />} />
              <Route path="/card/:slug" element={<PublicCard />} />
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route element={<PublicLayout />}>
              <Route path="/sidoButik" element={<SidoButik />} />
              <Route path="/sidoButik/mallar" element={<Templates />} />
              <Route path="/sidoButik/mallar/:templateId" element={<TemplateDetails />} />
            </Route>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/admin/*" element={isAuthenticated ? <AdminApp /> : <Navigate to="/login" replace />} />
          </Routes>

          <LegacyWhatsApp />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
