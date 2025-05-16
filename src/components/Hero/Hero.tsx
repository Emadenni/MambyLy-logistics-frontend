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

      {/* QUI ORA FUNZIONA */}
      <div className="hero_content">
        {children}
      </div>
    </div>
  );
};

export default Hero;
