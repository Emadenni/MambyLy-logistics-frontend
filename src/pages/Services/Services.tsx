import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "../../components/Layout/Layout";
import "./services.scss";
import ServicesCard from "../../components/ServicesCard/ServicesCard";
import { servicesData } from "../../components/data/service";
import ServicesGrid from "../../components/ServicesGrid/ServicesGrid";
import CTA from "../../components/Cta/Cta";
import { Helmet } from "react-helmet-async"; 

const Services: React.FC = () => {
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
      <Helmet>
        <title>Våra Tjänster - Mambyly Solutions</title>
        <meta
          name="description"
          content="Utforska våra digitala tjänster och boka en kostnadsfri konsultation idag. Vi hjälper ditt företag att växa med smarta och anpassade lösningar."
        />
        <meta name="keywords" content="digitala tjänster, konsultation, webbutveckling, automation, Mambyly Solutions" />
        <meta name="author" content="Mambyly Solutions" />
        {/* Puoi aggiungere altri meta tag SEO qui */}
      </Helmet>

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
          />
        )}
        <ServicesGrid />
        <Link to="/kontaktaOss">
          <div className="servicesCTA-container">
            <CTA
              className="cta_button"
              text="Boka en kostnadsfri konsultation idag"
              backgroundColor="#2196f3"
              color="#fff"
              hoverBackgroundColor="darkgreen"
              hoverColor="#DBD714"
            />
          </div>
        </Link>
      </div>
    </Layout>
  );
};

export default Services;
