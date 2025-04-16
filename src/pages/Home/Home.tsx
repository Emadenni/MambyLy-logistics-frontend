import React from "react";
import { Link } from "react-router-dom";
import TextTransition, { presets } from "react-text-transition";
import "./home.scss";
import Hero from "../../components/Hero/Hero";

import CTA from "../../components/Cta/Cta";
import Layout from "../../components/Layout/Layout";
import SwitchWord from "../../components/SwitchWord/SwitchWord";

const Home: React.FC = () => {
  return (
    <Layout>
      <div className="home_container">
        <Hero />

        <section className="transition_container">
          <h1 className="title home_title">Linköping. Sverige. Var som helst.</h1>
          <h2 className="dynamic_title">
            Inte bara digitala tjänster, men
            <SwitchWord
              words={["innovation", "säkerhet", "effektivitet", "pålitlighet", "automatisering", "smarta lösningar"]}
            />
          </h2>
        </section>
        <div className="home_CTA_box">
          <Link to="/tjänster">
            <CTA
              className="cta_button"
              text="VARA TJÄNSTER"
              backgroundColor="#fff"
              color="rgba(66, 165, 245)"
              hoverBackgroundColor="#fff"
              hoverColor="#0B770B"
            />
          </Link>
          <Link to="/kontaktaOss">
            <CTA
              className="cta_button"
              text="KONTAKTA OSS"
              backgroundColor="#DBD714"
              color="#045D17"
              hoverBackgroundColor="#fff"
              hoverColor="#DBD714"
            />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
