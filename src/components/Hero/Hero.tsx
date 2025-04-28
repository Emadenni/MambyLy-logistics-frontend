import React, { useState, useRef, useEffect } from "react";
import "./hero.scss";
import hero_img from "../../assets/video-placeholder.webp"; // Immagine di placeholder
import hero_video from "../../assets/video/hero-video.mp4"; // Video MP4 ottimizzato

const Hero: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Lazy load del video quando è visibile nell'area del viewport
  const handleIntersection = (entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && videoRef.current) {
        videoRef.current.play(); // Avvia il video quando entra nel viewport
      } else if (videoRef.current) {
        videoRef.current.pause(); // Pausa il video quando non è visibile
      }
    });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5, // Inizia a caricare il video quando è visibile per almeno il 50%
    });

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="hero" data-testid="home-page">
      {/* Placeholder immagine */}
      <img
        src={hero_img}
        alt="Hero placeholder"
        className={`hero_img ${isLoaded ? "hidden" : ""}`}
      />

      {/* Video ottimizzato */}
      <video
        ref={videoRef}
        className={`hero_video ${isLoaded ? "loaded" : ""}`}
        loop
        muted
        autoPlay
        playsInline
        preload="auto" // Pre-carica il video
        onLoadedData={() => setIsLoaded(true)} // Segna il video come caricato
        poster={hero_img} // Immagine di placeholder
        role="video"
      >
        {/* Video MP4 ottimizzato */}
        <source src={hero_video} type="video/mp4" />
      </video>
    </div>
  );
};

export default Hero;
