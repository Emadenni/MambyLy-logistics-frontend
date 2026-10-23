import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCompass, FiFeather, FiMail, FiMapPin, FiPhone, FiUsers } from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import SocialBox from "../../components/SocialBox/SocialBox";
import { publicTeam } from "../content/team";

const values = [
  { icon: <FiUsers />, title: "Närhet", text: "En direkt dialog och en partner som lyssnar." },
  { icon: <FiCompass />, title: "Tydlighet", text: "Begripliga beslut, från första samtal till lansering." },
  { icon: <FiFeather />, title: "Nytta", text: "Teknik som hjälper dig i verkligheten." },
];

const PublicAbout: React.FC = () => {
  return (
    <PublicShell>
      <Helmet>
        <title>Om oss – Mambyly Solutions | Din digitala partner</title>
        <meta
          name="description"
          content="Mambyly Solutions är en ung, engagerad digital studio som hjälper företag att växa med smarta, anpassade lösningar."
        />
        <meta
          name="keywords"
          content="digital studio, digitala lösningar, e-handel, webbappar, interna verktyg, digital utveckling"
        />
        <link rel="canonical" href="https://mambylysolutions.se/omOss" />
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
              <strong>Mambyly Solutions</strong> är ett ungt initiativ inom den digitala världen – en liten studio med
              stor drivkraft.
            </p>
            <p>
              Vi hjälper företag att ta sina första (eller nästa) digitala steg genom smarta lösningar som förenklar,
              förbättrar och automatiserar vardagliga arbetsflöden. Från lättanvända e-handelslösningar till
              skräddarsydda interna verktyg och moderna digitala produkter (som webbplatser, webbsidor, webbappar,
              dashboards) – vi är nyfikna, flexibla och alltid engagerade.
            </p>
            <p>
              Vår styrka ligger i närheten till kunden och möjligheten att snabbt anpassa oss efter behov. Vi tror på
              tydlig kommunikation, enkel design och teknik som gör skillnad – oavsett om det gäller ett litet projekt
              eller en större idé.
            </p>
            <p className="mp-prose__closing">
              Vi bygger inte bara kod – vi bygger relationer, förtroende och framtidens digitala möjligheter.
            </p>
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
            {/* Contact details reproduced exactly as in ContactsListBox, including their links. */}
            <ul className="mp-contact-list">
              <li>
                <FiMail aria-hidden="true" />
                <a href="mailto:info@mambyly.se">info@mambylysolutions.se</a>
              </li>
              <li>
                <FiPhone aria-hidden="true" />
                <a href="tel:+46764510582">+46 72 211 64 22</a>
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
          <h2 id="mp-cta-title">Vad vill du förenkla?</h2>
          <p>Berätta om din verksamhet. Vi hittar en väg framåt tillsammans.</p>
        </div>
        <Link to="/kontaktaOss" className="mp-btn mp-btn--light mp-btn--lg">
          Berätta om din idé <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicAbout;
