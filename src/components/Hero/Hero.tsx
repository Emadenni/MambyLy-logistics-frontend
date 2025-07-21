import React from "react";
import { Link } from "react-router-dom";
import "./hero.scss";
import hero_img from "../../assets/images/hero-pic.webp";
import ScrollIndicator from "../ScrollIndicator/ScrollIndicator";

const Hero: React.FC = () => {
  return (
    <div className="hero">
      <div className="hero-image">
        <img src={hero_img} alt="Hero Illustration" />
      </div>
      <div className="hero_content">
        <h1>Webbplatser och digitala lösningar för småföretag</h1>
        <p>Moderna, skräddarsydda lösningar som hjälper ditt företag att växa online.</p>
        <div className="hero-buttons">
          <Link to="/tjänster">
            <button className="primary">Våra tjänster</button>
          </Link>
          <Link to="/kontaktaOss">
            <button className="secondary">Kontakta oss</button>
          </Link>
        </div>
        <ScrollIndicator/>
      </div>
    </div>
  );
};

export default Hero;

/*
// Versione precedente con video
import React, { useState, useRef, useEffect, ReactNode } from "react";
import "./hero.scss";
import hero_img from "../../assets/video-placeholder.webp";
import hero_video from "../../assets/video/hero-video.webm";

interface HeroProps {
  children?: ReactNode;
}

const Hero: React.FC<HeroProps> = ({ children }) => {
  const [videoReady, setVideoReady] = useState(false);
  const [isBrowser, setIsBrowser] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setIsBrowser(true);
  }, []);

  useEffect(() => {
    if (!isBrowser || !videoRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) videoRef.current?.play();
      else videoRef.current?.pause();
    }, { threshold: 0.5 });
    observer.observe(videoRef.current);
    return () => {
      if (videoRef.current) observer.unobserve(videoRef.current);
    };
  }, [isBrowser]);

  return (
    <div className="hero">
      {isBrowser && (
        <video
          ref={videoRef}
          className={`hero_video ${videoReady ? "loaded" : ""}`}
          loop
          muted
          autoPlay
          playsInline
          preload="auto"
          onCanPlayThrough={() => setVideoReady(true)}
          poster={hero_img}
        >
          <source src={hero_video} type="video/mp4" />
        </video>
      )}

      <div className="hero_content">
        {children}
      </div>
    </div>
  );
};

export default Hero;
*/
