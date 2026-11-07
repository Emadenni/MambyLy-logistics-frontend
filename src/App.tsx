import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useAuthStore } from "./store/useAuthStore";
import ScrollToTop from "./components/ScrollToTop";
import PromoBanner from "./components/PromoBanner/PromoBanner";
import CookieConsentBanner from "./components/CookieConsentBanner/CookieConsentBanner";
import PublicLayout from "./components/PublicLayout";
import { CartProvider } from "./Context/CartContext";
import Analytics from "./components/Analytics";

// Stylesheets of the pre-restyle public pages, of admin, login and Sido Butik: imported here in the
// exact order their components used to bring them in (Home, Services, ContactUs, WorkWithUs, AboutUs,
// NotFoundPage, AdminApp, LoginScreen, SidoButik, Templates, TemplateDetails), so their CSS is
// unchanged while their code is no longer part of the first download.
import "./components/Hero/hero.scss";
import "./components/ScrollIndicator/ScrollIndicator.scss";
import "./components/Header/header.scss";
import "./components/Logo/logo.scss";
import "./components/Navbar/navbar.scss";
import "./components/HamburgerMenu/hamburgerMenu.scss";
import "./components/Footer/footer.scss";
import "./components/FooterMenu/footerMenu.scss";
import "./components/AdminLink/adminLink.scss";
import "./components/Terms/terms.scss";
import "./components/SocialBox/socialBox.scss";
import "./components/Layout/layout.scss";
import "./components/SectionIntro/sectionIntro.scss";
import "./components/Carousel/carousel.scss";
import "./components/SidoButikBanner/SidoButikBanner.scss";
import "./components/BivioSection/BivioSection.scss";
import "./components/WhatIsReactSection/WhatIsReactSection.scss";
import "./pages/Home/home.scss";
import "./pages/Services/services.scss";
import "./components/Cta/cta.scss";
import "./components/IconCards/iconCards.scss";
import "./components/ServicesCard/servicesCard.scss";
import "./components/PricingPackages/pricingPackages.scss";
import "./components/ExtraServices/extraServices.scss";
import "./pages/ContactUs/contactUs.scss";
import "./components/TitleBox/titleBox.scss";
import "./pages/WorkWithUs/workWithUs.scss";
import "./pages/AboutUs/aboutUs.scss";
import "./components/ContactsListBox/contactsListBox.scss";
import "./admin/admin.scss";
import "./pages/SidoButik/sidoButik.scss";
import "./components/SidoHeader/sidoHeader.scss";
import "./components/SidoNavbar/sidoNavbar.scss";
import "./components/Steps/Steps.scss";
import "./components/Summary/Summary.scss";
import "./components/FloatingAnnouncement/floatingAnnouncement.scss";
import "./components/TemplateFeatureCard/TemplateFeatureCard.scss";
import "./components/InfoBanner/InfoBanner.scss";
import "./pages/Templates/Templates.scss";
import "./components/CustomAlert/CustomAlert.scss";
import "./components/TemplateDetails/TemplateDetails.scss";
// Admin and its sign-in (src/admin), Sido Butik: same code, hooks and requests as before; it loads
// when they are opened.
const AdminApp = lazy(() => import("./admin/AdminApp"));
const LoginScreen = lazy(() => import("./admin/LoginScreen"));
const SidoButik = lazy(() => import("./pages/SidoButik/SidoButik"));
const Templates = lazy(() => import("./pages/Templates/Templates"));
const TemplateDetails = lazy(() => import("./components/TemplateDetails/TemplateDetails"));

// Public site: one screen at a time, Swedish and English (see src/public/experience and
// docs/RESTYLE-PUBLIC.md). Swedish keeps the existing URLs; English lives under /en.
import Stage from "./public/experience/Stage";
import { CONCEPT_BASE, LANGS, PATHS, isLegacyPath } from "./public/experience/routes";
import Hub from "./public/experience/screens/Hub";
import LegacyConsent from "./public/experience/LegacyConsent";

// The other screens load on the way there (and in the background once the first page is idle):
// the home page carries only what it shows.
const screens = {
  websites: () => import("./public/experience/screens/Websites"),
  method: () => import("./public/experience/screens/Method"),
  cards: () => import("./public/experience/screens/Cards"),
  services: () => import("./public/experience/screens/Services"),
  examples: () => import("./public/experience/screens/Examples"),
  about: () => import("./public/experience/screens/About"),
  contact: () => import("./public/experience/screens/Contact"),
  jobs: () => import("./public/experience/screens/Jobs"),
  privacy: () => import("./public/experience/screens/Privacy"),
  card: () => import("./public/pages/PublicCard"),
  concept: () => import("./public/experience/concepts/Concept"),
};
const Websites = lazy(screens.websites);
const Method = lazy(screens.method);
const Cards = lazy(screens.cards);
const Services = lazy(screens.services);
const Examples = lazy(() => screens.examples().then((m) => ({ default: m.Examples })));
const Example = lazy(() => screens.examples().then((m) => ({ default: m.Example })));
const About = lazy(screens.about);
const Contact = lazy(screens.contact);
const Jobs = lazy(screens.jobs);
const Privacy = lazy(() => screens.privacy().then((m) => ({ default: m.Privacy })));
const NotFound = lazy(() => screens.privacy().then((m) => ({ default: m.NotFound })));
const PublicCard = lazy(screens.card);
const Concept = lazy(screens.concept);

/** A screen that may still be loading: nothing until it is there (a moment, usually preloaded). */
const page = (el: React.ReactNode) => <Suspense fallback={null}>{el}</Suspense>;

/** Once the first page is idle, the public screens load quietly, so moving on stays instant. */
const PreloadScreens = () => {
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 2500));
    const cancel = window.cancelIdleCallback ?? window.clearTimeout;
    let id = 0;
    const start = window.setTimeout(() => {
      id = idle(() => Object.values(screens).forEach((load) => void load().catch(() => undefined)), { timeout: 8000 });
    }, 6000);
    return () => {
      window.clearTimeout(start);
      cancel(id);
    };
  }, []);
  return null;
};

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
          {/* Previous banner, unchanged, for Sido Butik; the public site has its own, admin and login none. */}
          <LegacyConsent banner={<CookieConsentBanner />} />
          <ScrollToTop />
          {/* <PromoBanner /> */}
          <Routes>
            <Route element={<Stage />}>
              {LANGS.map((lang) => (
                <React.Fragment key={lang}>
                  <Route path={PATHS.home[lang]} element={<Hub />} />
                  <Route path={PATHS.explore[lang]} element={<Hub />} />
                  <Route path={PATHS.websites[lang]} element={page(<Websites />)} />
                  <Route path={PATHS.method[lang]} element={page(<Method />)} />
                  <Route path={`${CONCEPT_BASE[lang]}/:slug`} element={page(<Concept />)} />
                  <Route path={PATHS.cards[lang]} element={page(<Cards />)} />
                  <Route path={PATHS.services[lang]} element={page(<Services />)} />
                  <Route path={PATHS.examples[lang]} element={page(<Examples />)} />
                  <Route path={`${PATHS.examples[lang]}/:slug`} element={page(<Example />)} />
                  <Route path={PATHS.about[lang]} element={page(<About />)} />
                  <Route path={PATHS.contact[lang]} element={page(<Contact />)} />
                  <Route path={PATHS.jobs[lang]} element={page(<Jobs />)} />
                  <Route path={PATHS.privacy[lang]} element={page(<Privacy />)} />
                </React.Fragment>
              ))}
              <Route path="/card" element={page(<PublicCard />)} />
              <Route path="/en/card" element={page(<PublicCard />)} />
              <Route path="/card/:slug" element={page(<PublicCard />)} />
              <Route path="*" element={page(<NotFound />)} />
            </Route>
            <Route element={<PublicLayout />}>
              <Route path="/sidoButik" element={page(<SidoButik />)} />
              <Route path="/sidoButik/mallar" element={page(<Templates />)} />
              <Route path="/sidoButik/mallar/:templateId" element={page(<TemplateDetails />)} />
            </Route>
            <Route path="/login" element={page(<LoginScreen />)} />
            <Route path="/admin/*" element={isAuthenticated ? page(<AdminApp />) : <Navigate to="/login" replace />} />
          </Routes>

          <LegacyWhatsApp />
          <PreloadScreens />
          <Analytics />
        </Router>
      </CartProvider>
    </HelmetProvider>
  );
};

export default App;
