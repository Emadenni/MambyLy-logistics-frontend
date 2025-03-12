import React from "react";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";
import MicroserviceCard from "../../components/MicroservicesCard/MicroservicesCard";
import { microservices } from "../../components/data/microservices";

const Services = () => {
  return (
    <Layout>
      <div className="services_container">
        <section className="services_container__title-box">
          <h1 className="services_container__title">Varje behov har sin lösning </h1>
          <h2 className="services_container__sub-title"> välj våra tjänster som passar dig</h2>
        </section>
        <ServicesCard />
      </div>

      <div className="microservices-container">
      <div className="microservices-section">
        <h2>Transport</h2>
        <div className="microservices-list">
          {microservices.transport.map((service) => (
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
          {microservices.digital.map((service) => (
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
