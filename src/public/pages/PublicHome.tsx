import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCalendar,
  FiCheck,
  FiEdit3,
  FiHeadphones,
  FiMonitor,
  FiSend,
  FiSettings,
} from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import HeroScene from "../components/HeroScene";
import SidoButikPromo from "../components/SidoButikPromo";
import { publicSiteConfig } from "../config";
import { slides } from "../../components/data/slides";

const needs = [
  {
    icon: <FiMonitor />,
    title: "Synas online",
    text: "En professionell hemsida som presenterar ditt företag och gör det enkelt att ta kontakt.",
  },
  {
    icon: <FiCalendar />,
    title: "Ta emot bokningar",
    text: "Låt dina kunder boka och beställa direkt – så att du kan fokusera på det du gör bäst.",
  },
  {
    icon: <FiSettings />,
    title: "Förenkla vardagen",
    text: "Skräddarsydda verktyg och integrationer som samlar allt på ett ställe och minskar dubbelarbete.",
  },
];

const benefits = [
  { title: "Mindre tid på det administrativa", text: "Automatisera och samla det som upprepas varje dag." },
  { title: "Bättre kundupplevelse", text: "Gör det enkelt att boka, beställa eller ta kontakt." },
  { title: "Mer tid till det som räknas", text: "Fokusera på dina kunder och din verksamhet." },
];

const steps = [
  { icon: <FiHeadphones />, title: "Vi lyssnar", text: "Vi lär känna din verksamhet och förstår dina behov." },
  { icon: <FiEdit3 />, title: "Vi skapar", text: "Vi tar fram en lösning som passar dig och ditt företag." },
  { icon: <FiSend />, title: "Vi lanserar", text: "Vi ser till att allt fungerar – och finns med även efter lansering." },
];

const PublicHome: React.FC = () => {
  return (
    <PublicShell>
      <Helmet>
        <title>Din tekniska partner i Linköping och Sverige | Mambyly Solutions</title>
        <meta
          name="description"
          content="Vi erbjuder skräddarsydda webbappar, hemsidor, integrationer och SEO-optimering för företag i Linköping, Sverige och var som helst."
        />
        <meta
          name="keywords"
          content="webbappar, hemsidor, integrationer, dashboards, automatiseringar, affärssystem, bokningssystem, API, SEO"
        />
        <link rel="canonical" href="https://mambylysolutions.se/" />
      </Helmet>

      <section className="mp-hero" aria-labelledby="mp-hero-title">
        <div className="mp-container mp-hero__grid">
          <div className="mp-hero__copy">
            <p className="mp-eyebrow">Digital hjälp för småföretag</p>
            <h1 id="mp-hero-title" className="mp-display">
              <span>Mindre krångel.</span>
              <br />
              <span>Mer företag.</span>
            </h1>
            <p className="mp-lead">Vi förvandlar vardagens små problem till smarta digitala lösningar.</p>
            <div className="mp-actions">
              <Link to="/kontaktaOss" className="mp-btn mp-btn--primary mp-btn--lg">
                Vad vill du förenkla? <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/tjänster" className="mp-textlink">
                Upptäck våra tjänster
              </Link>
            </div>
          </div>
          <HeroScene />
        </div>
      </section>

      <div className="mp-strip">
        <ul className="mp-container">
          <li>För dig som driver eget.</li>
          <li>Hemsidor</li>
          <li>Bokningssystem</li>
          <li>Digitala verktyg</li>
        </ul>
      </div>

      <section className="mp-section" aria-labelledby="mp-needs-title">
        <div className="mp-container">
          <header className="mp-section__head mp-section__head--center">
            <h2 id="mp-needs-title">Vad behöver din verksamhet?</h2>
            <p>Enklare verktyg som gör skillnad i vardagen – oavsett var du är idag.</p>
          </header>
          <div className="mp-grid mp-grid--3">
            {needs.map((need) => (
              <article key={need.title} className="mp-card mp-card--feature">
                <span className="mp-icon-badge" aria-hidden="true">{need.icon}</span>
                <div>
                  <h3>{need.title}</h3>
                  <p>{need.text}</p>
                  <Link to="/tjänster#servicesGrid" className="mp-textlink mp-textlink--small">
                    Läs mer <span className="mp-sr">om {need.title.toLowerCase()}</span>
                    <FiArrowRight aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mp-band" aria-labelledby="mp-band-title">
        <div className="mp-container mp-band__grid">
          <div>
            <h2 id="mp-band-title">
              Små förändringar.
              <br />
              En enklare vardag.
            </h2>
            <p>
              Vi hjälper dig att spara tid, få bättre överblick och skapa en smidigare vardag med verktyg som passar
              just ditt företag.
            </p>
          </div>
          <ul className="mp-checklist">
            {benefits.map((benefit) => (
              <li key={benefit.title}>
                <span className="mp-checklist__icon" aria-hidden="true"><FiCheck /></span>
                <span>
                  <strong>{benefit.title}</strong>
                  {benefit.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mp-section" aria-labelledby="mp-steps-title">
        <div className="mp-container">
          <header className="mp-section__head mp-section__head--center">
            <h2 id="mp-steps-title">Så arbetar vi.</h2>
            <p>Från idé till färdig lösning – vi guidar dig hela vägen.</p>
          </header>
          <ol className="mp-steps">
            {steps.map((step, index) => (
              <li key={step.title}>
                <span className="mp-steps__num" aria-hidden="true">{index + 1}</span>
                <span className="mp-steps__icon" aria-hidden="true">{step.icon}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mp-section mp-section--tight" aria-labelledby="mp-why-title">
        <div className="mp-container mp-split">
          <div>
            <p className="mp-eyebrow">Synlighet</p>
            <h2 id="mp-why-title">Varför synlighet online är avgörande</h2>
            <p>
              I en digital värld där konkurrensen aldrig sover, är <strong>online-närvaro</strong> nyckeln till att
              sticka ut. Genom att synas digitalt kan du inte bara förbättra din produktivitet, utan också bygga
              förtroende, attrahera rätt målgrupp och öppna upp för helt nya affärsmöjligheter.
            </p>
            <ul className="mp-tags" aria-label="Våra tjänster">
              {slides.map((slide) => (
                <li key={slide.id}>
                  <Link to="/tjänster#servicesGrid">{slide.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mp-card mp-tech">
            <h3>Teknik som passar ditt företag</h3>
            <p>
              Moderna webbgränssnitt, återanvändbara komponenter och integrationer som växer med verksamheten. Tekniken
              väljs utifrån dina behov.
            </p>
            <details className="mp-disclosure">
              <summary>Vad är React?</summary>
              <p>
                React är ett bibliotek för att skapa användargränssnitt som är snabbt, interaktivt och lätt att
                underhålla. Det gör det möjligt att återanvända komponenter, vilket minskar utvecklingstiden och gör din
                webbplats mer flexibel.
              </p>
            </details>
            <details className="mp-disclosure">
              <summary>Vad är en SPA?</summary>
              <p>
                En Single Page Application (SPA) laddar bara en gång – därefter sker navigationen utan att ladda om hela
                sidan.
              </p>
            </details>
            <details className="mp-disclosure">
              <summary>Vad bygger vi egentligen?</summary>
              <p>
                Vi skapar inte bara snygga sidor – vi bygger kompletta webbaserade applikationer med modern teknik. Från
                gränssnitt i React till skalbara backend-lösningar i molnet. Det betyder att du får en lösning som kan
                växa med ditt företag.
              </p>
            </details>
          </div>
        </div>
      </section>

      {publicSiteConfig.showSidoButik && <SidoButikPromo />}

      <section className="mp-container mp-cta" aria-labelledby="mp-cta-title">
        <div>
          <p className="mp-eyebrow mp-eyebrow--light">Redo att förenkla?</p>
          <h2 id="mp-cta-title">Vad vill du förenkla?</h2>
          <p>Berätta om din verksamhet. Vi hittar en väg framåt tillsammans.</p>
        </div>
        <Link to="/kontaktaOss" className="mp-btn mp-btn--light mp-btn--lg">
          Kontakta oss <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicHome;
