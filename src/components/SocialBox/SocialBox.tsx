import React from "react";
import "./socialBox.scss";
import facebook_icon from "../../assets/images/socials/facebook_icon.png";
import instagram_icon from "../../assets/images/socials/instagram_icon.png";
import linkedin_icon from "../../assets/images/socials/linkedin_icon.png";
import tiktok_icon from "../../assets/images/socials/tiktok_icon.png";
import whatsapp_icon from "../../assets/images/socials/whatsapp_icon.png";
import viber_icon from "../../assets/images/socials/viber_icon.png";

const SocialBox: React.FC = () => {
  return (
    <div className="socials_box__container">
      <a href="https://www.facebook.com/profile.php?id=61565198694451" aria-label="Facebook">
        <img src={facebook_icon} alt="facebook_icon" className="social_icon" />
      </a>
      <a href="https://www.instagram.com/mamby.ly.se/" aria-label="Instagram">
        <img src={instagram_icon} alt="instagram_icon" className="social_icon extra" />
      </a>
      <a href="https://www.linkedin.com/company/104626842/" aria-label="LinkedIn">
        <img src={linkedin_icon} alt="linkedin_icon" className="social_icon" />
      </a>
      <a
        href="https://wa.me/46722116422?text=Hej!%20Jag%20besökte%20din%20webbplats%20och%20vill%20veta%20mer!"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="WhatsApp"
      >
        <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon" />
      </a>
      <a href="https://www.tiktok.com/@mambyly" aria-label="TikTok">
        <img src={tiktok_icon} alt="tiktok_icon" className="social_icon extra" />
      </a>
    </div>
  );
};

export default SocialBox;
