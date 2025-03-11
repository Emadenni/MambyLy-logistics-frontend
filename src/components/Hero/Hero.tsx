import React, { useState } from "react";
import "./hero.scss";
import hero_img from "../../assets/video-placeholder.png";
import hero_video from "../../assets/video/5200378-hd_1280_720_30fps.mp4";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="hero">
      {/* Placeholder image visibile finché il video non è pronto */}
      {!isLoaded && <img src={hero_img} alt="hero placeholder" className="hero_img" />}

      <video
        className={`hero_video ${isLoaded ? "loaded" : ""}`}
        loop
        muted
        autoPlay
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        poster={hero_img}
      >
        <source src={hero_video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Hero;
