import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiArrowDown, FiMessageCircle, FiPhone } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import ContactForm from "../../components/ContactForm/ContactForm";
import { CardPreview } from "../digital-card/DigitalCard";
import { examplePath, getCard } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import { SERVICE_SUBJECTS, subjectFor, type ContactState, type ServiceKey } from "../digital-card/service";
import { publicContact } from "../contact";

const steps = [
  { title: "Vi hör av oss", text: "Vi läser din förfrågan och svarar med e-post eller telefon." },
  { title: "Vi pratar om kortet", text: "Innehåll, utseende och vad du vill ha med. Du får en offert." },
  { title: "Du provar", text: "Vi tar fram kortet – och webbplatsen om du vill ha en – och du testar." },
  { title: "Klart att dela", text: "Du får den färdiga länken och QR-koden." },
];

const serviceOptions: { key: ServiceKey; label: string; hint: string }[] = [
  { key: "card", label: "Digitalt visitkort", hint: "Jag har redan en webbplats, eller behöver ingen." },
  { key: "both", label: "Visitkort + webbplats", hint: "Jag börjar från noll." },
  { key: "site", label: "Webbplats", hint: "Främst en ny webbplats." },
];

const PublicContact: React.FC = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as ContactState;
  const example = state.example ? getCard(state.example) : undefined;
  const model = example?.demo && example.example ? example : undefined;

  const [service, setService] = useState<ServiceKey | undefined>(
    state.service && state.service in SERVICE_SUBJECTS ? state.service : model ? "card" : undefined
  );
  // A subject sent by another page (older links) is kept as it is until a service is chosen.
  const subject = service ? subjectFor(service, model) : state.subject || "";

  return (
    <PublicShell>
      <Helmet>
        <title>Kontakta oss – digitala visitkort och webbplatser | MambyLy Solutions</title>
        <meta
          name="description"
          content="Berätta vad du behöver: ett digitalt visitkort, en webbplats eller båda. Vi hör av oss och tar fram en offert."
        />
        <link rel="canonical" href="https://www.mambylysolutions.se/kontaktaOss" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Kontakt</p>
            <h1 className="mp-display mp-display--page">
              Berätta vad
              <br />
              du behöver.
            </h1>
            <p className="mp-lead">
              Välj vad det gäller och skriv några rader om din verksamhet. Logotyp och material kan du skicka när vi har
              pratat.
            </p>
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
            <h2>Så går det till</h2>
            <ol className="mp-process">
              {steps.map((s, index) => (
                <li key={s.title}>
                  <span className="mp-process__num" aria-hidden="true">{index + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <p>{s.text}</p>
                    {index === 0 && (
                      <a href="#contact_form" className="mp-textlink mp-textlink--small">
                        Gå till formuläret <FiArrowDown aria-hidden="true" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ol>

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
            <h2>Vad gäller det?</h2>

            <fieldset className="mp-service-pick">
              <legend className="mp-sr">Välj tjänst</legend>
              {serviceOptions.map((o) => (
                <label key={o.key} className={`mp-service-pick__option${service === o.key ? " is-checked" : ""}`}>
                  <input type="radio" name="mp-service" value={o.key} checked={service === o.key} onChange={() => setService(o.key)} />
                  <span>
                    <strong>{o.label}</strong>
                    <small>{o.hint}</small>
                  </span>
                </label>
              ))}
            </fieldset>

            {model && service !== "site" && (
              <div className="mp-model">
                <div className="mp-model__card">
                  <CardPreview card={model} t={cardStrings[model.lang]} />
                </div>
                <p>
                  <span>Vald stil</span>
                  <strong>{model.company || model.name}</strong> – exemplet för {model.example?.sector.toLowerCase()}.{" "}
                  <Link to={examplePath(model.slug)}>Visa exemplet</Link>
                </p>
              </div>
            )}

            <p className="mp-muted mp-form-card__hint">
              Valet fylls i som ämne i formuläret nedan – du kan ändra det fritt.
            </p>
            <div className="mp-form">
              <ContactForm subjectFromCard={subject} />
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
};

export default PublicContact;
