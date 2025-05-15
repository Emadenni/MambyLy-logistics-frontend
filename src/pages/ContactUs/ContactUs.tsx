import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import "./contactUs.scss";
import Layout from "../../components/Layout/Layout";
import ContactForm from "../../components/ContactForm/ContactForm";
import TitleBox from "../../components/TitleBox/TitleBox";
import Logo from "../../components/Logo/Logo";

const ContactUs = () => {
  const location = useLocation();
  const subjectFromCard = location.state?.subject || "";

  // Stato per gestire la visibilità della modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Funzione per aprire la modal
  const openModal = () => setIsModalVisible(true);

  // Funzione per chiudere la modal
  const closeModal = () => setIsModalVisible(false);

  return (
    <Layout>
      <div className="contactUs_wrapper">
        <div className="contactUs_container">
          <TitleBox
            title="Skicka ett meddelande till oss"
            subTitle="Ta ett ögonblick för att läsa vårt workflow och förstå hur vi hanterar din förfrågan."
          />

          {/* Modal */}
          {isModalVisible && (
            <div className="modal-overlay">
              <div className="modal-content">
                 <Logo size="medium" />
                <div className="note">
                  <p>
                    Vi anser att denna metod garanterar en hög grad av personalisering och ett agilt arbetssätt för att
                    bäst möta dina behov. Vi tror också att på detta sätt förblir det som skrivs klart och tydligt,
                    vilket minskar risken för missförstånd och garanterar en bättre förståelse.
                  </p>
                </div>
                <button onClick={closeModal} className="close-modal-button">
                  Stäng
                </button>
              </div>
            </div>
          )}

          <div className="steps_container">
            <div className="step step-1">
              <div className="step_number">1</div>
              <p className="step_title">Steg 1</p>
              <p className="step_description">Du kontaktar oss och förklarar dina behov i detalj.</p>
              <a href="#contact_form" className="step_link">
                Gå till formuläret
              </a>
            </div>
            <div className="step step-2">
              <div className="step_number">2</div>
              <p className="step_title">Steg 2</p>
              <p className="step_description">
                Vi skickar ett frågeformulär med några specifika och riktade frågor för att bättre förstå dina behov.
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
            {/* Bottone per aprire la modal */}
            <button onClick={openModal} className="open-modal-button">
              Läs mer om vårt arbetssätt
            </button>
          </div>

          <div id="contact_form">
            <h2>Berätta för oss hur vi kan hjälpa dig</h2>
            <h3>Vi ser verkligen fram emot att få stötta dig med våra tjänster!</h3>
            <ContactForm subjectFromCard={subjectFromCard} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactUs;
