
import React from "react";
import { useLocation } from "react-router-dom"; 
import "./contactUs.scss"
import Layout from "../../components/Layout/Layout";
import ContactForm from "../../components/ContactForm/ContactForm";
import TitleBox from "../../components/TitleBox/TitleBox";

const ContactUs = () => {
  const location = useLocation();
  const subjectFromCard = location.state?.subject || "";
  return (
    <Layout>
      <div className="contactUs_wrapper">
        <div className="contactUs_container">
          <TitleBox
            title="Skicka ett meddelande till oss"
            subTitle="Har du frågor eller funderingar? Vi är här för att svara på dem"
          />

          <ContactForm subjectFromCard={subjectFromCard} />
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
