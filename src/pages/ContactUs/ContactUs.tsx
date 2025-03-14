// ContactUs.tsx
import React from "react";
import { useLocation } from "react-router-dom"; // Per accedere alla location passata
import Layout from "../../components/Layout/Layout";
import ContactForm from "../../components/ContactForm/ContactForm";

const ContactUs = () => {
 
  const location = useLocation();
  const subjectFromCard = location.state?.subject || ""; 
  return (
    <Layout>
      <div className="contactUs_wrapper">
        <div className="contactUs_container">
          <section className="contactUs_container__title-box">
            <h1 className="contactUs_container__title">
              Skicka ett meddelande till oss
            </h1>
            <h2 className="contactUs_container__sub-title">
              Har du frågor eller funderingar? Vi är här för att svara på dem
            </h2>
          </section>
         
          <ContactForm subjectFromCard={subjectFromCard} />
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
