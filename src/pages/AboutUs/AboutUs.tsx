import React from "react";
import "./aboutUs.scss";
import Layout from "../../components/Layout/Layout";
import Carousel from "../../components/Carousel/Carousel";
import TitleBox from "../../components/TitleBox/TitleBox";
import ContactsListBox from "../../components/ContactsListBox/ContactsListBox";

const AboutUs: React.FC = () => {
  return (
    <Layout>
      <div className="aboutUs_wrapper">
        <div className="aboutUs_container">
          <TitleBox
            title="Programmerade för att växa"
            subTitle="Med vårt engagemang vill vi vara din pålitliga digitallösning"
          />
   <div className="aboutUs_intro-card">
  <div className="aboutUs_intro-card__content">
    <p className="aboutUs_intro-card__lead">
      <strong>Mambyly Solutions</strong> är ett ungt initiativ inom den digitala världen – en liten studio med stor
      drivkraft.
    </p>
    <p>
      Vi hjälper företag att ta sina första (eller nästa) digitala steg genom smarta lösningar som förenklar, förbättrar
      och automatiserar vardagliga arbetsflöden. Från lättanvända e-handelslösningar till skräddarsydda interna verktyg
      och till och med decentraliserade applikationer (DApps) – vi är nyfikna, flexibla och alltid engagerade.
    </p>
    <p>
      Vår styrka ligger i närheten till kunden och möjligheten att snabbt anpassa oss efter behov. Vi tror på tydlig
      kommunikation, enkel design och teknik som gör skillnad – oavsett om det gäller ett litet projekt eller en större
      idé.
    </p>
    <p className="aboutUs_intro-card__closing">
      Vi bygger inte bara kod – vi bygger relationer, förtroende och framtidens digitala möjligheter.
    </p>
  </div>
</div>


          <Carousel />
          <ContactsListBox />{" "}
        </div>
      </div>
    </Layout>
  );
};

export default AboutUs;
