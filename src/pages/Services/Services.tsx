import React from 'react';
import Layout from '../../components/Layout/Layout';
import "./services.scss"
import Services_card from '../../components/Services_card/Services_card';

const Services = () => {
  return (
    <Layout>
          <div className="services_container"> 
            <section className='services_container__title-box'>
          <h1 className="services_container__title">Varje behov har sin lösning </h1>
          <h2 className="services_container__sub-title"> välj våra tjänster som passar dig</h2>
          </section>
      <Services_card />
      </div>
    </Layout>
  );
}

export default Services;
