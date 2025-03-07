import React from "react";
import { Link } from "react-router-dom";
import "./social_box.scss"
import facebook_icon from "../../assets/images/socials/facebook_icon.png";
import instagram_icon from "../../assets/images/socials/instagram_icon.png";
import linkedin_icon from "../../assets/images/socials/linkedin_icon.png";
import tiktok_icon from "../../assets/images/socials/tiktok_icon.png";
import whatsapp_icon from "../../assets/images/socials/whatsapp_icon.png";
import viber_icon from "../../assets/images/socials/viber_icon.png";

const Social_box: React.FC  = (props: Props) => {
  return (
    <div className="socials_box__container">
      <Link to="/">                                                         {/* fill link  */}
        <img src={facebook_icon} alt="facebook_icon" className="social_icon" />
      </Link>
      <Link to="/">                                                         {/* fill link  */}
        <img src={instagram_icon} alt="instagram_icon" className="social_icon extra" />
      </Link>
      <Link to="/">                                                          {/* fill link  */}
        <img src={linkedin_icon} alt="linkedin_icon" className="social_icon" />
      </Link>
      <Link to="/">                                                          {/* fill link  */}
        <img src={whatsapp_icon} alt="whatsapp_icon" className="social_icon"/>
      </Link>
      <Link to="/">                                                         {/*  fill link  */}
        <img src={tiktok_icon} alt="tiktok_icon" className="social_icon extra" />
      </Link>
      <Link to="/">                                                           {/* fill link  */}
        <img src={viber_icon} alt="viber_icon"  className="social_icon"/>
      </Link>
    </div>
  );
};

export default Social_box;
