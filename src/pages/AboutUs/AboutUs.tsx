import React from "react";
import { Helmet } from "react-helmet-async"; 
import { Link } from "react-router-dom";
import "./aboutUs.scss";
import Layout from "../../components/Layout/Layout";
import Carousel from "../../components/Carousel/Carousel";
import TitleBox from "../../components/TitleBox/TitleBox";
import ContactsListBox from "../../components/ContactsListBox/ContactsListBox";
import CTA from "../../components/Cta/Cta";

const AboutUs: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Om oss – Mambyly Solutions | Din digitala partner</title>
        <meta
          name="description"
          content="Mambyly Solutions är en ung, engagerad digital studio som hjälper företag att växa med smarta, anpassade lösningar."
        />
        <meta
          name="keywords"
          content="digital studio, digitala lösningar, e-handel, webbappar, interna verktyg, digital utveckling"
        />
        <link rel="canonical" href="https://mambylysolutions.se/omOss" />
      </Helmet>

      <Layout>
        <div className="aboutUs_wrapper">
          <div className="about_card__background"></div>
          <div className="aboutUs_container">
            <TitleBox
              title="Programmerade för att växa"
              subTitle="Med vårt engagemang vill vi vara din pålitliga digitallösning"
            />
            <div className="aboutUs_intro-card">
              <div className="aboutUs_intro-card__content">
                <p className="aboutUs_intro-card__lead">
                  <strong>Mambyly Solutions</strong> är ett ungt initiativ inom den digitala världen – en liten studio
                  med stor drivkraft.
                </p>
                <p>
                  Vi hjälper företag att ta sina första (eller nästa) digitala steg genom smarta lösningar som
                  förenklar, förbättrar och automatiserar vardagliga arbetsflöden. Från lättanvända e-handelslösningar
                  till skräddarsydda interna verktyg och moderna digitala produkter (som webbplatser, webbsidor,
                  webbappar, dashboards) – vi är nyfikna, flexibla och alltid engagerade.
                </p>
                <p>
                  Vår styrka ligger i närheten till kunden och möjligheten att snabbt anpassa oss efter behov. Vi tror
                  på tydlig kommunikation, enkel design och teknik som gör skillnad – oavsett om det gäller ett litet
                  projekt eller en större idé.
                </p>
                <p className="aboutUs_intro-card__closing">
                  Vi bygger inte bara kod – vi bygger relationer, förtroende och framtidens digitala möjligheter.
                </p>
              </div>
            </div>
            <ContactsListBox />
            {/* <div className="carousel_container_home">
              <Carousel />
              <Link to="/tjänster">
                <div className="cta_container">
                  <CTA
                    text="UTFORSKA VÅRA TJÄNSTER OCH HÖR AV DIG TILL OSS IDAG!"
                    backgroundColor="#91ceee;"
                    color="rgba(66, 165, 245)"
                    hoverBackgroundColor="#fff"
                    hoverColor="#DBD714"
                  />
                </div>
              </Link>
            </div> */}
          </div>
        </div>
      </Layout>
    </>
  );
};

export default AboutUs;
