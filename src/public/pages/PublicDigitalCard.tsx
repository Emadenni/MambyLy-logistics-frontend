import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiExternalLink, FiGrid, FiLayers, FiMousePointer, FiRotateCw, FiShare2, FiUserPlus } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import CardExperience from "../digital-card/CardExperience";
import { DEMO_CARD_SLUG, getCard } from "../digital-card/registry";
import { DIGITAL_CARD_SUBJECT } from "../digital-card/service";


const features = [
  { icon: <FiRotateCw />, title: "Vrid och luta i 3D", text: "Kortet följer musen eller fingret och kan vändas med ett drag, en knapp eller tangentbordet." },
  { icon: <FiLayers />, title: "Fram- och baksida", text: "Logotyp och namn på framsidan, kontaktuppgifter och det viktigaste om verksamheten på baksidan." },
  { icon: <FiMousePointer />, title: "Klickbara kontakter", text: "Telefon, e-post, webbplats och sociala medier öppnas direkt från kortet." },
  { icon: <FiUserPlus />, title: "Spara kontakt", text: "Kontakten kan laddas ner som en vCard-fil (.vcf) som telefonen eller datorn kan öppna." },
  { icon: <FiShare2 />, title: "Dela vidare", text: "Dela kortet med telefonens delningsmeny eller kopiera länken. Svep uppåt på kortet för att lämna över det." },
  { icon: <FiGrid />, title: "Personlig QR-kod", text: "En QR-kod som leder till ditt kort, att visa på skärmen eller trycka på material." },
];

const steps = [
  { title: "Skicka logotyp och kontaktuppgifter", text: "Börja med en kort förfrågan. Logotyp och övrigt material ber vi om när vi har pratat." },
  { title: "Vi anpassar kortet", text: "Färger, logotyp och innehåll formas efter din verksamhet." },
  { title: "Du får din länk och QR-kod", text: "Länken och QR-koden är klara att dela." },
];

const PublicDigitalCard: React.FC = () => {
  const demo = getCard(DEMO_CARD_SLUG);

  return (
    <PublicShell>
      <Helmet>
        <title>Digitala visitkort – Mambyly Solutions</title>
        <meta
          name="description"
          content="Ett interaktivt digitalt visitkort med egen länk och QR-kod. Den som öppnar länken ser kortet direkt i webbläsaren – utan app."
        />
        <link rel="canonical" href="https://mambylysolutions.se/digital-card" />
      </Helmet>

      <section className="mp-intro mp-intro--paper mp-dcs-hero" aria-labelledby="mp-dcs-title">
        <div className="mp-container mp-dcs-hero__grid">
          <div>
            <p className="mp-eyebrow">Digitala visitkort</p>
            <h1 id="mp-dcs-title" className="mp-display mp-display--page">
              Ditt visitkort,
              <br />
              alltid med dig.
            </h1>
            <p className="mp-lead">
              Du får en personlig länk som du delar via meddelande, e-post eller QR-kod. Den som öppnar länken ser
              ditt visitkort direkt i webbläsaren – utan att installera någon app.
            </p>
            <div className="mp-actions">
              <Link to="/kontaktaOss" state={{ subject: DIGITAL_CARD_SUBJECT }} className="mp-btn mp-btn--primary mp-btn--lg">
                Begär offert <FiArrowUpRight aria-hidden="true" />
              </Link>
              <a href="#mp-dcs-how" className="mp-textlink">
                Så fungerar det
              </a>
            </div>
          </div>

          {demo && (
            <div className="mp-dcs-demo" aria-labelledby="mp-dcs-demo-label" role="region">
              <p id="mp-dcs-demo-label" className="mp-dcs-demo__label">
                <strong>Demo:</strong> Exempelbageriet och Alva Exempel är påhittade.
              </p>
              <CardExperience card={demo} />
              <Link to={`/card/${demo.slug}`} className="mp-textlink mp-textlink--small">
                Öppna demokortet på egen sida <FiExternalLink aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="mp-section" aria-labelledby="mp-dcs-features">
        <div className="mp-container">
          <header className="mp-section__head">
            <h2 id="mp-dcs-features">Det här ingår</h2>
            <p>Allt fungerar i webbläsaren på mobil och dator.</p>
          </header>
          <div className="mp-grid mp-grid--3">
            {features.map((f) => (
              <article key={f.title} className="mp-card mp-card--feature">
                <span className="mp-icon-badge" aria-hidden="true">{f.icon}</span>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="mp-dcs-how" className="mp-section mp-section--alt mp-anchor" aria-labelledby="mp-dcs-use">
        <div className="mp-container mp-split">
          <div>
            <h2 id="mp-dcs-use">Dela och använd kortet</h2>
            <p>
              Kortet har en egen adress. Skicka länken i ett sms, i chatten eller i din e-postsignatur, eller låt
              någon skanna QR-koden från din telefon eller från tryckt material.
            </p>
            <p>
              Mottagaren behöver inget konto och ingen app: kortet öppnas i webbläsaren, och kontaktuppgifterna kan
              sparas som en kontaktfil.
            </p>
          </div>
          <ol className="mp-process">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="mp-process__num" aria-hidden="true">{i + 1}</span>
                <div>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mp-container mp-cta" aria-labelledby="mp-dcs-cta">
        <div>
          <h2 id="mp-dcs-cta">Vill du ha ett eget digitalt visitkort?</h2>
          <p>Berätta kort om din verksamhet. Logotyp och material tar vi senare.</p>
        </div>
        <Link to="/kontaktaOss" state={{ subject: DIGITAL_CARD_SUBJECT }} className="mp-btn mp-btn--light mp-btn--lg">
          Begär offert <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicDigitalCard;
