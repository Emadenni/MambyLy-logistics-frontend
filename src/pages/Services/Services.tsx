import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";
import { servicesData } from "../../components/data/service";
import React from "react";


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
     {/*  <div className="services_page__wrapper"> */}
        <div className="services_container">
          {servicesData.length > 0 && (
            <ServicesCard
              key={servicesData[0].id}
              title={servicesData[0].title}
              shortDescription={servicesData[0].shortDescription}
              color={servicesData[0].color}
              background_color={servicesData[0].background_color}
              id={servicesData[0].id}
              path=""
            ></ServicesCard>
          )}
          
        </div>
     {/*  </div> */}
    </Layout>
  );
};

export default Services;
