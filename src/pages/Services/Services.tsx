import React from "react";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";
import { servicesData } from "../../components/data/service";
import MicroserviceCard from "../../components/MicroservicesCard/MicroservicesCard";
import {  microservicesData } from "../../components/data/microservices";

const Services = () => {
  return (
    <Layout>
      <div className="services_container">
        <section className="services_container__title-box">
          <h1 className="services_container__title">Varje behov har sin lösning </h1>
          <h2 className="services_container__sub-title"> välj våra tjänster som passar dig</h2>
        </section>
        <div className="services_cards_container">
      <ServicesCard 
        title={servicesData[0].title}
        shortDescription={servicesData[0].shortDescription}
        image={servicesData[0].image}
        color={servicesData[0].color}
        background_color={servicesData[0].background_color}
        path={servicesData[0].path}
      />

      <ServicesCard
        title={servicesData[1].title}
        shortDescription={servicesData[1].shortDescription}
        image={servicesData[1].image}
        color={servicesData[1].color}
        background_color={servicesData[1].background_color}
        path={servicesData[1].path}
      />
    </div>
      </div>

      <div className="microservices-container">
      <div className="microservices-section">
        <h2>Transport</h2>
        <div className="microservices-list">
          { microservicesData.transport.map((service) => (
            <MicroserviceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              type={service.type}
            />
          ))}
        </div>
      </div>

      <div className="microservices-section">
        <h2>Digital</h2>
        <div className="microservices-list">
          { microservicesData.digital.map((service) => (
            <MicroserviceCard
              key={service.id}
              id={service.id}
              title={service.title}
              description={service.description}
              type={service.type}
            />
          ))}
        </div>
      </div>
    </div>

      
    </Layout>
  );
};

export default Services;
