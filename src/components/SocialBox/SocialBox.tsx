import React from "react";
import "./socialBox.scss";
import facebook_icon from "../../assets/images/socials/facebook_icon.webp";
import instagram_icon from "../../assets/images/socials/instagram_icon.webp";
import linkedin_icon from "../../assets/images/socials/linkedin_icon.webp";
import tiktok_icon from "../../assets/images/socials/tiktok_icon.webp";
import whatsapp_icon from "../../assets/images/socials/whatsapp_icon.webp";

const SocialBox: React.FC = () => {
  return (
    <div className="socials_box__container">
      <a href="https://www.facebook.com/profile.php?id=61565139296744" aria-label="Facebook">
        <img src={facebook_icon} alt="facebook_icon" className="social_icon" loading="lazy" />
      </a>
      <a href="https://www.instagram.com/mambyly_solutions/" aria-label="Instagram">
        <img src={instagram_icon} alt="instagram_icon" className="social_icon extra" loading="lazy" />
      </a>
      <a href="https://www.linkedin.com/company/104626842/" aria-label="LinkedIn">
        <img src={linkedin_icon} alt="linkedin_icon" className="social_icon" loading="lazy" />
      </a>
      <a
        href="https://wa.me/46764510582?text=Hej!%20Jag%20besökte%20din%20webbplats%20och%20vill%20veta%20mer!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <img src={whatsapp_icon} alt="" className="social_icon" loading="lazy" />
      </a>
      <a href="http://tiktok.com/@mambylysolutions" aria-label="TikTok">
        <img src={tiktok_icon} alt="tiktok_icon" className="social_icon extra" loading="lazy" />
      </a>
    </div>
  );
};

export default SocialBox;
