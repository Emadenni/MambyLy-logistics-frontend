import React from "react";
import { Link } from "react-router-dom";
import logoLight from "../assets/logo-light.svg";
import Terms from "../../components/Terms/Terms";
import SocialBox from "../../components/SocialBox/SocialBox";
import AdminLink from "../../components/AdminLink/AdminLink";
import { publicContact } from "../contact";

const PublicFooter: React.FC = () => {
  // Same mechanism as the previous footer: CookieConsentBanner listens for this event.
  const handleOpenCookieSettings = () => {
    window.dispatchEvent(new Event("invalidCookieConsent"));
  };

  return (
    <footer className="mp-footer">
      <div className="mp-container mp-footer__inner">
        <div className="mp-footer__brand">
          <Link to="/" className="mp-footer__logo">
            <img src={logoLight} alt="MambyLy Solutions – till startsidan" width={150} height={43} />
          </Link>
          <p>För dig som driver eget.</p>
          <ul className="mp-footer__contact">
            <li>
              <a href={publicContact.phoneHref}>
                <span className="mp-sr">Ring MambyLy: </span>
                {publicContact.phoneNational}
              </a>
            </li>
            <li>
              <a href={publicContact.whatsappGreetingUrl} target="_blank" rel="noopener noreferrer">
                WhatsApp<span className="mp-sr"> (öppnas i ny flik)</span>
              </a>
            </li>
            <li>
              <Link to="/card">Vårt visitkort</Link>
            </li>
          </ul>
        </div>

        <nav className="mp-footer__nav" aria-label="Sidfot">
          <h2 className="mp-footer__heading">Sidor</h2>
          <ul>
            <li><Link to="/">Hem</Link></li>
            <li><Link to="/tjänster">Tjänster</Link></li>
            <li><Link to="/omOss">Om oss</Link></li>
            <li><Link to="/jobbaMedOss">Jobb</Link></li>
            <li><Link to="/kontaktaOss">Kontakta oss</Link></li>
            <li><Link to="/digital-card">Digitala visitkort</Link></li>
          </ul>
        </nav>

        <div className="mp-footer__social">
          <h2 className="mp-footer__heading">Följ oss</h2>
          <SocialBox />
        </div>
      </div>

      <div className="mp-container mp-footer__legal">
        <Terms />
        <button type="button" className="mp-footer__cookie" onClick={handleOpenCookieSettings}>
          Ändra cookieinställningar
        </button>
        <p className="mp-footer__copy">
          © {new Date().getFullYear()} MambyLy Solutions. Alla rättigheter förbehållna.
        </p>
        <AdminLink />
      </div>
    </footer>
  );
};

export default PublicFooter;
