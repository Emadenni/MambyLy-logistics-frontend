import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCompass, FiFeather, FiMail, FiMapPin, FiPhone, FiUsers } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import SocialBox from "../../components/SocialBox/SocialBox";
import { publicTeam } from "../content/team";
import { publicContact } from "../contact";

const values = [
  { icon: <FiUsers />, title: "Närhet", text: "En direkt dialog och en partner som lyssnar." },
  { icon: <FiCompass />, title: "Tydlighet", text: "Begripliga beslut, från första samtal till lansering." },
  { icon: <FiFeather />, title: "Enkelhet", text: "Lösningar som är lätta att använda – för dig och för dina kunder." },
];

const PublicAbout: React.FC = () => {
  return (
    <PublicShell>
      <Helmet>
        <title>Om oss | MambyLy Solutions</title>
        <meta
          name="description"
          content="MambyLy Solutions är en liten studio i Linköping som gör digitala visitkort och webbplatser för småföretag."
        />
        <link rel="canonical" href="https://www.mambylysolutions.se/omOss" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Om MambyLy</p>
            <h1 className="mp-display mp-display--page">
              En liten studio.
              <br />
              Nära din verksamhet.
            </h1>
            <p className="mp-lead">Vi tror på tydlig kommunikation, enkel design och teknik som gör skillnad.</p>
          </div>
          <p className="mp-note-card" aria-hidden="true">
            Lokalt.
            <br />
            Personligt.
            <br />
            På riktigt.
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top">
        <div className="mp-container mp-split mp-split--about">
          <div className="mp-prose">
            <p className="mp-prose__lead">
              <strong>MambyLy Solutions</strong> är en liten studio som gör digitala visitkort – och webbplatser när
              det behövs.
            </p>
            <p>
              Vi arbetar med småföretagare, hantverkare, säljare och andra som träffar många människor och vill vara
              lätta att nå. Ett visitkort som delas med en länk, ser ut som ditt företag och går att spara i telefonen.
            </p>
            <p>
              Behöver du också en webbplats gör vi den i samma stil, så att kort och webbplats hänger ihop. Vi håller
              det enkelt: tydliga steg, ett nära samarbete och inga tekniska omvägar.
            </p>
            <p className="mp-prose__closing">Mindre krångel. Mer företag.</p>
          </div>

          <div className="mp-card mp-values">
            <p className="mp-eyebrow">Det vi tror på</p>
            <ul>
              {values.map((value) => (
                <li key={value.title}>
                  <span className="mp-icon-badge mp-icon-badge--sm" aria-hidden="true">{value.icon}</span>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mp-section mp-section--alt" aria-labelledby="mp-team-title">
        <div className="mp-container">
          <header className="mp-section__head mp-section__head--center">
            <h2 id="mp-team-title">Människorna bakom MambyLy</h2>
            <p>Ett litet team med stor drivkraft.</p>
          </header>
          <ul className="mp-team">
            {publicTeam.map((member) => (
              <li key={member.name} className="mp-card mp-team__card">
                <img
                  src={member.imageUrl}
                  alt={`Porträtt av ${member.name}`}
                  width={132}
                  height={132}
                  loading="lazy"
                  decoding="async"
                />
                <h3>{member.name}</h3>
                <p className="mp-team__role">{member.role}</p>
                <a href={`mailto:${member.email}`} className="mp-textlink mp-textlink--small">
                  {member.email}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mp-section" aria-labelledby="mp-contacts-title">
        <div className="mp-container mp-split">
          <div>
            <h2 id="mp-contacts-title">Våra kontakter</h2>
            {/* E-mail kept exactly as in ContactsListBox (owner still to confirm the address); phone from public/contact.ts. */}
            <ul className="mp-contact-list">
              <li>
                <FiMail aria-hidden="true" />
                <a href="mailto:info@mambyly.se">info@mambylysolutions.se</a>
              </li>
              <li>
                <FiPhone aria-hidden="true" />
                <a href={publicContact.phoneHref}>{publicContact.phoneInternational}</a>
              </li>
              <li>
                <FiMapPin aria-hidden="true" />
                <span>Björkliden, Linköping SE</span>
              </li>
            </ul>
          </div>
          <div className="mp-card mp-card--soft mp-social-card">
            <h2 className="mp-h3">Följ oss på sociala medier</h2>
            <SocialBox />
          </div>
        </div>
      </section>

      <section className="mp-container mp-cta" aria-labelledby="mp-cta-title">
        <div>
          <h2 id="mp-cta-title">Vill du ha ett eget visitkort?</h2>
          <p>Berätta om din verksamhet, så tar vi det därifrån.</p>
        </div>
        <Link to="/kontaktaOss" state={{ service: "card" }} className="mp-btn mp-btn--light mp-btn--lg">
          Begär ditt visitkort <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicAbout;
