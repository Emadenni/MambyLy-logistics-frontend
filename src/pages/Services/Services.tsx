import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";
import { servicesData } from "../../components/data/service";
import MicroserviceCard from "../../components/MicroservicesCard/MicroservicesCard";
import { microservicesData } from "../../components/data/microservices";
import CTA from "../../components/Cta/Cta";
import ContactForm from "../../components/ContactForm/ContactForm";
import TitleBox from "../../components/TitleBox/TitleBox";

const Services = () => {
  const location = useLocation();
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const handleSelect = (title: string) => {
    setSelectedSubject(title); 
    console.log("Selezionato:", title); 
  };

  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <Layout>
      <div className="services_page__wrapper">
        <div className="services_container">
        <TitleBox 
            title="Varje behov har sin lösning" 
            subTitle="Välj våra tjänster som passar dig" 
          />
          {/* <section className="services_container__title-box">
            <h1 className="services_container__title">Varje behov har sin lösning</h1>
            <h2 className="services_container__sub-title">Välj våra tjänster som passar dig</h2>
          </section> */}

          <div className="services_cards_container">
            {servicesData.map((service) => (
              <ServicesCard
                key={service.id}
                title={service.title}
                shortDescription={service.shortDescription}
                image={service.image}
                color={service.color}
                background_color={service.background_color}
                id={service.id}
              >
                <CTA
                  text="LÄS MER"
                  backgroundColor="#0B770B"
                  color="#DBD714"
                  hoverBackgroundColor="#2596be"
                  hoverColor="#faf2f2"
                />
              </ServicesCard>
            ))}
          </div>
        </div>

        <div className="microservices_container">
          <div className="microservices_cards__section" id="service1" data-testid="service1-section">
            <h2>Transporttjänster</h2>
            <div className="microservices_cards__list">
              {microservicesData.transport.map((service) => (
                <MicroserviceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  type={service.type}
                  onSelect={() => setSelectedSubject(service.title)}
                />
              ))}
            </div>
          </div>

          <div className="microservices_cards__section" id="service2">
            <h2 data-testid="digital-section-title">Digitala tjänster</h2>
            <div className="microservices_cards__list">
              {microservicesData.digital.map((service) => (
                <MicroserviceCard
                  key={service.id}
                  id={service.id}
                  title={service.title}
                  description={service.description}
                  type={service.type}
                  onSelect={() => setSelectedSubject(service.title)}
                />
              ))}
            </div>
          </div>
        </div>

       
      </div>
    </Layout>
  );
};

export default Services;
