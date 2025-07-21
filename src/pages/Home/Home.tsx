import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Hero from "../../components/Hero/Hero";
import Layout from "../../components/Layout/Layout";
import SectionIntro from "../../components/SectionIntro/SectionIntro";
import CardsCarousel from "../../components/Carousel/Carousel";
import SidoButikBanner from "../../components/SidoButikBanner/SidoButikBanner";
import BivioSection from "../../components/BivioSection/BivioSection";
import WhatIsReactSection from "../../components/WhatIsReactSection/WhatIsReactSection";
import "./home.scss";

const Home: React.FC = () => {
  return (
    <Layout>
      <Helmet>
        <title>Din tekniska partner i Linköping och Sverige | Mambyly Solutions</title>
        <meta
          name="description"
          content="Vi erbjuder skräddarsydda webbappar, hemsidor, integrationer och SEO-optimering för företag i Linköping, Sverige och var som helst."
        />
        <meta
          name="keywords"
          content="webbappar, hemsidor, integrationer, dashboards, automatiseringar, affärssystem, bokningssystem, API, SEO"
        />
        <link rel="canonical" href="https://mambylysolutions.se/" />
      </Helmet>

      <Hero />

      <div className="after-hero">
        <SectionIntro />
        <WhatIsReactSection />
      </div>

      <div className="carousel-container">
        <CardsCarousel showCount={7} />
      </div>

      <SidoButikBanner />
      <BivioSection />
    </Layout>
  );
};

export default Home;
