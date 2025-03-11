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
          <h1 className="home_title">Linköping, Sverige, Norr Europa</h1>
          <h2 className="dynamic_title">
          Vi levererar inte bara varor, men   <SwitchWord words={["kvalitet", "förtroende", "effektivitet", "professionalism"]}  />
          </h2>
        </section>
        <div className="home_CTA_box">
          <Link to="/tjänster">
            <CTA text="VARA TJÄNSTER" backgroundColor="#0B770B" color="#DBD714" />
          </Link>
          <Link to="/kontaktaOss">
            <CTA text="KONTAKTA OSS" backgroundColor="#DBD714" color="#0B770B" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default Home;
