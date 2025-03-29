import React, { useState } from "react";
import "./hero.scss";
import hero_img from "../../assets/video-placeholder.png";
import hero_video from "../../assets/video/hero-video.mp4";

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="hero" data-testid="home-page">
      <img src={hero_img} alt="hero placeholder" className={`hero_img ${isLoaded ? "hidden" : ""}`} />

      <video
        className={`hero_video ${isLoaded ? "loaded" : ""}`}
        loop
        muted
        autoPlay
        playsInline
        onLoadedData={() => setIsLoaded(true)}
        poster={hero_img}
        role= "video"
      >
        <source src={hero_video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Hero;
