import React from "react";
import { useLocation } from "react-router-dom";
import "./contactUs.scss";
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
            subTitle="Ta ett ögonblick för att läsa vårt workflow och förstå hur vi hanterar din förfrågan."
          />
          <div className="steps_container">
            <div className="step step-1">
              <div className="step_number">1</div>
              <p className="step_title">Steg 1</p>
              <p className="step_description">
                Du kontaktar oss och förklarar dina behov i detalj.
              </p>
              <a href="#contact_form" className="step_link">Gå till formuläret</a>
            </div>
            <div className="step step-2">
              <div className="step_number">2</div>
              <p className="step_title">Steg 2</p>
              <p className="step_description">
                Vi skickar ett frågeformulär för att förstå dina behov bättre.
              </p>
            </div>
            <div className="step step-3">
              <div className="step_number">3</div>
              <p className="step_title">Steg 3</p>
              <p className="step_description">
                Efter att ha fått dina svar, ger vi ett erbjudande via video, VR, mail eller chat.
              </p>
            </div>
            <div className="step step-4">
              <div className="step_number">4</div>
              <p className="step_title">Steg 4</p>
              <p className="step_description">
                Om du accepterar erbjudandet, presenterar vi en road map och börjar arbeta tillsammans.
              </p>
            </div>
          </div>
          <div className="note">
            <p>
              Denna metod garanterar en hög grad av personalisering och ett agilt arbetssätt för att bäst möta dina
              behov.
            </p>
          </div>
          <div id="contact_form">
            <ContactForm subjectFromCard={subjectFromCard} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
