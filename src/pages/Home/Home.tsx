import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";  // Importa Helmet
import { Link } from "react-router-dom";
import SwitchWord from "../../components/SwitchWord/SwitchWord";
import Hero from "../../components/Hero/Hero";
import CTA from "../../components/Cta/Cta";
import Layout from "../../components/Layout/Layout";
import SectionIntro from "../../components/SectionIntro/SectionIntro";
import CardsCarousel from "../../components/Carousel/Carousel";
import "./home.scss";

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

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

      <Hero>
        <section className="hero_content_container">
          <h1 className="title home_title">Linköping. Sverige. Var som helst.</h1>
          <h2
            className="dynamic_title"
            style={{
              opacity: isVisible ? 1 : 0,
              transition: "opacity 0.8s ease-in-out",
              minHeight: "3em",
            }}
          >
            Din tekniska partner i varje steg{" "}
            <span className="switchword_wrapper">
              <SwitchWord
                words={[
                  "webbappar",
                  "hemsidor",
                  "integrationer",
                  "dashboards",
                  "automatiseringar",
                  "affärssystem",
                  "bokningssystem",
                  "API-integrationer",
                  "API-utveckling",
                  "SEO-optimering",
                ]}
              />
            </span>
          </h2>

          <div className="home_CTA_box">
            <Link to="/tjänster">
              <CTA
                className="cta_button"
                text="VARA TJÄNSTER"
                backgroundColor="#fff"
                color="rgb(4 57 111)"
                hoverBackgroundColor="darkgreen"
                hoverColor="#DBD714"
              />
            </Link>
            <Link to="/kontaktaOss">
              <CTA
                className="cta_button"
                text="KONTAKTA OSS"
                backgroundColor="#DBD714"
                color="#045D17"
                hoverBackgroundColor="darkgreen"
                hoverColor="#DBD714"
              />
            </Link>
          </div>
        </section>
      </Hero>

      <SectionIntro />
      <CardsCarousel showCount={6} />
    </Layout>
  );
};

export default Home;
