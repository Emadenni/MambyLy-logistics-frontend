import React from "react";
import Hero from "../../components/Hero/Hero";
import Layout from "../../components/Layout/Layout";

const Home: React.FC = () => {
  console.log("Rendering Home Component");
  return (
    <Layout>
      <Hero />
    </Layout>
  );
};

export default Home;
