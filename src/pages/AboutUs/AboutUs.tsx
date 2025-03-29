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
            subTitle="Med vårt engagemang vill vi vara din pålitliga logistiklösning"
          />
          <div className="aboutUs_container__main-text">
            <p>
              <strong>Mambyly Logistics</strong> är ett ungt företag, men med ett team fyllt med erfarenhet och stor
              teknisk kompetens. Vår mission är att göra arbetsflödet smidigt, effektivt och intelligent för våra
              kunder. Vi garanterar pålitlighet, engagemang och erbjuder flexibilitet samt skräddarsydda lösningar.
            </p>
            <div className="aboutUs_container__secondary-text">
              <p>
                Vi ansvarar för att transportera era släp till de önskade destinationerna, med en punktlig och säker
                service. Varje kund får tillgång till ett grundläggande digitalt paket, med stora möjligheter till
                anpassning, för att få full kontroll och en optimerad hantering av operationerna.
              </p>
              <p>
                Vi är redo att arbeta i Sverige och hela Nordeuropa, med ett dynamiskt och innovativt förhållningssätt.
                Vi är övertygade om att lyssnande på era behov är det första steget mot ett framgångsrikt samarbete.
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
