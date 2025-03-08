import React from 'react'
import "./hero.scss";
import hero_img from "../../assets/images/hero_img.png"; /* placeholder */
import sample from "../../assets/video/5200378-hd_1280_720_30fps.mp4"





const Hero: React.FC = () => {
  console.log("Rendering Hero Component");
  return (
    <div className="hero">
   {/*    <img src={hero_img} alt="hero_img" className="hero_img" /> */}
   <video className='hero_video'loop muted autoPlay >
    <source src={sample} type='video/mp4' />
</video>
    </div>
  );
};

export default Hero;