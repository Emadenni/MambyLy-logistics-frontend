import React, { useEffect, useRef, useState } from "react";
import "./footer.scss";
import { Link } from "react-router-dom";
import FooterMenu from "../FooterMenu/FooterMenu";
import Logo from "../Logo/Logo";
import Terms from "../Terms/Terms";
import SocialBox from "../SocialBox/SocialBox";

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const footerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, []);

  return (
    <>
      <div className={`overlay ${isVisible ? "visible" : ""}`} />
      <footer className={`footer ${isVisible ? "footer--visible" : ""}`} ref={footerRef}>
        <div className="footer__logo_container">
          <Logo size="small" />
        </div>
        <Terms />
        <SocialBox />
        <FooterMenu />
        <p className="copyright">
          © {new Date().getFullYear()} MambyLy Solutions. Alla rättigheter förbehållna.
        </p>
      </footer>
      
    </>
  );
};

export default Footer;
