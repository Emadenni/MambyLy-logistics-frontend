import React from "react";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";

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
    </Layout>
  );
};

export default Services;
