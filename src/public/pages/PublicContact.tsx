import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Dialog } from "@mui/material";
import { FiArrowDown, FiMessageCircle, FiPhone, FiX } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import ContactForm from "../../components/ContactForm/ContactForm";
import logoDark from "../assets/logo-dark.svg";
import { publicContact } from "../contact";

const steps = [
  "Du kontaktar oss och förklarar dina behov i detalj.",
  "Vi skickar ett frågeformulär med några specifika och riktade frågor för att bättre förstå dina behov.",
  "Efter att ha fått dina svar, ger vi ett erbjudande via video, VR, mail eller chat.",
  "Om du accepterar erbjudandet, presenterar vi en road map och börjar arbeta tillsammans.",
];

const PublicContact: React.FC = () => {
  const location = useLocation();
  const subjectFromCard = location.state?.subject || "";

  const [isModalVisible, setIsModalVisible] = useState(false);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  return (
    <PublicShell>
      <Helmet>
        <title>Kontakta oss – Få hjälp och support | Mambyly Solutions</title>
        <meta
          name="description"
          content="Kontakta oss idag för att diskutera dina behov. Vi erbjuder personlig support och skräddarsydda lösningar för ditt företag."
        />
        <meta
          name="keywords"
          content="kontakt, support, hjälp, frågor, företagslösningar, skräddarsydda tjänster"
        />
        <link rel="canonical" href="https://mambylysolutions.se/kontaktaOss" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Låt oss prata</p>
            <h1 className="mp-display mp-display--page">
              Vad vill du
              <br />
              förenkla?
            </h1>
            <p className="mp-lead">Berätta om din verksamhet och vad som tar tid i vardagen. Vi börjar där.</p>
          </div>
          <p className="mp-note-card" aria-hidden="true">
            Vi hör
            <br />
            av oss!
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top">
        <div className="mp-container mp-contact">
          <div className="mp-contact__process">
            <h2>Skicka ett meddelande till oss</h2>
            <p>Ta ett ögonblick för att läsa vårt workflow och förstå hur vi hanterar din förfrågan.</p>
            <ol className="mp-process">
              {steps.map((text, index) => (
                <li key={index}>
                  <span className="mp-process__num" aria-hidden="true">{index + 1}</span>
                  <div>
                    <h3>Steg {index + 1}</h3>
                    <p>{text}</p>
                    {index === 0 && (
                      <a href="#contact_form" className="mp-textlink mp-textlink--small">
                        Gå till formuläret <FiArrowDown aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>
            <button type="button" onClick={openModal} className="mp-btn mp-btn--outline" aria-haspopup="dialog">
              Läs mer om vårt arbetssätt
            </button>

            <div className="mp-card mp-card--soft mp-direct">
              <h3>Hellre ett samtal?</h3>
              <ul className="mp-contact-list">
                <li>
                  <FiPhone aria-hidden="true" />
                  <a href={publicContact.phoneHref}>{publicContact.phoneNational}</a>
                </li>
                <li>
                  <FiMessageCircle aria-hidden="true" />
                  <a href={publicContact.whatsappGreetingUrl} target="_blank" rel="noopener noreferrer">
                    Skriv på WhatsApp<span className="mp-sr"> (öppnas i ny flik)</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div id="contact_form" className="mp-card mp-form-card mp-anchor">
            <h2>Berätta för oss hur vi kan hjälpa dig</h2>
            <p className="mp-muted">Vi ser verkligen fram emot att få stötta dig med våra tjänster!</p>
            <div className="mp-form">
              <ContactForm subjectFromCard={subjectFromCard} />
            </div>
          </div>
        </div>
      </section>

      <Dialog
        open={isModalVisible}
        onClose={closeModal}
        className="mp-dialog"
        aria-labelledby="mp-workflow-title"
        PaperProps={{ className: "mp-dialog__paper mp-dialog__paper--narrow" }}
      >
        <button type="button" className="mp-dialog__close" onClick={closeModal} aria-label="Stäng">
          <FiX aria-hidden="true" />
        </button>
        <div className="mp-dialog__body">
          <img src={logoDark} alt="MambyLy Solutions" width={150} height={43} className="mp-dialog__logo" />
          <h2 id="mp-workflow-title" className="mp-sr">
            Vårt arbetssätt
          </h2>
          <p>
            Vi anser att denna metod garanterar en hög grad av personalisering och ett agilt arbetssätt för att bäst
            möta dina behov. Vi tror också att på detta sätt förblir det som skrivs klart och tydligt, vilket minskar
            risken för missförstånd och garanterar en bättre förståelse.
          </p>
          <button type="button" onClick={closeModal} className="mp-btn mp-btn--primary">
            Stäng
          </button>
        </div>
      </Dialog>
    </PublicShell>
  );
};

export default PublicContact;
