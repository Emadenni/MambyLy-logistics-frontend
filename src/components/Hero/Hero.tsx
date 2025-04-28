import React, { useState, useEffect, useRef } from "react";
import "./hero.scss";
import hero_img from "../../assets/video-placeholder.webp"; // Immagine di placeholder
import hero_video from "../../assets/video/hero-video.mp4"; // Video MP4 ottimizzato

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="hero" data-testid="home-page">
      {/* Placeholder immagine */}
      <img
        src={hero_img}
        alt="Hero placeholder"
        className={`hero_img ${isLoaded ? "hidden" : ""}`}
      />

      {/* Video */}
      <video
        ref={videoRef}
        className={`hero_video ${isLoaded ? "loaded" : ""}`}
        loop
        muted
        autoPlay
        playsInline
        preload="auto"
        onLoadedData={() => setIsLoaded(true)}
        poster={hero_img}
        role="video"
      >
        <source src={hero_video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Hero;
