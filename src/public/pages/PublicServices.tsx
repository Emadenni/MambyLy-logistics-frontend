import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import {
  FiArrowUpRight,
  FiBookOpen,
  FiCalendar,
  FiCheck,
  FiDatabase,
  FiMonitor,
  FiShield,
  FiShoppingBag,
  FiShoppingCart,
} from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import IndustryDialog, { Industry } from "../components/IndustryDialog";
import { servicesData } from "../../components/data/service";
import { slides } from "../../components/data/slides";
import { iconData } from "../../components/data/iconData";

// Groups only re-arrange the existing services (components/data/slides.tsx); none is removed.
const serviceGroups = [
  { icon: <FiMonitor />, title: "Webbplatser & synlighet", ids: [1, 2, 3] },
  { icon: <FiShoppingCart />, title: "E-handel", ids: [4] },
  { icon: <FiCalendar />, title: "Bokningar & interna verktyg", ids: [5, 6] },
  { icon: <FiDatabase />, title: "Data & integrationer", ids: [7, 8] },
  { icon: <FiShield />, title: "Integritet & tillgänglighet", ids: [9] },
];

const supportPackages = [
  {
    name: "Litet paket",
    price: "1 200 kr/månad",
    items: [
      "Säkerhetsuppdateringar en gång i månaden",
      "Mindre tekniska justeringar (upp till 2 timmar/mån)",
      "E-postsupport (svar inom 48h)",
    ],
  },
  {
    name: "Standardpaket",
    price: "2 100 kr/månad",
    badge: "Rekommenderad",
    items: [
      "Alla tjänster i Litet paket",
      "Säkerhetsuppdateringar varje vecka",
      "Innehållsuppdateringar (upp till 4 timmar/mån)",
      "Prioriterad support (svar inom 24h)",
      "Månatlig teknisk översyn och rapport",
    ],
  },
  {
    name: "Skräddarsytt paket",
    subtitle: "Behöver du mer eller mindre?",
    price: "?",
    items: [
      "Anpassas efter dina behov",
      "Löpande utveckling och API-integration",
      "Personlig rådgivning & support enligt avtal",
    ],
  },
];

const PublicServices: React.FC = () => {
  const location = useLocation();
  const [industry, setIndustry] = useState<Industry | null>(null);
  const intro = servicesData[0];

  // Same behaviour as before: links such as /tjänster#servicesGrid scroll to the anchor.
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);

  return (
    <PublicShell>
      <Helmet>
        <title>Våra Tjänster - Mambyly Solutions</title>
        <meta
          name="description"
          content="Utforska våra digitala tjänster och boka en kostnadsfri konsultation idag. Vi hjälper ditt företag att växa med smarta och anpassade lösningar."
        />
        <meta name="keywords" content="digitala tjänster, konsultation, webbutveckling, automation, Mambyly Solutions" />
        <meta name="author" content="Mambyly Solutions" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Våra tjänster</p>
            <h1 className="mp-display mp-display--page">
              Rätt verktyg
              <br />
              för din vardag.
            </h1>
            <p className="mp-lead">
              Från din första hemsida till ett system som förenklar arbetet. Vi börjar med vad ditt företag behöver.
            </p>
          </div>
          <p className="mp-note-card" aria-hidden="true">
            Mindre krångel.
            <br />
            Mer tid.
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top">
        <div className="mp-container mp-split">
          <div>
            <h2>{intro.title}</h2>
            <p>{intro.shortDescription}</p>
          </div>
          <div className="mp-card mp-card--soft">
            <p>
              Kolla om du tillhör något av de här scenarierna och upptäck våra tjänster. Om du inte gör det, ingen fara –
              vi kan sannolikt hjälpa dig ändå.
            </p>
            <ul className="mp-industries">
              {iconData.map((item) => (
                <li key={item.id}>
                  <button type="button" onClick={() => setIndustry(item)} aria-haspopup="dialog">
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="servicesGrid" className="mp-section mp-section--flush-top mp-anchor" aria-labelledby="mp-services-title">
        <div className="mp-container">
          <header className="mp-section__head">
            <h2 id="mp-services-title">Det här kan vi hjälpa dig med</h2>
          </header>
          <div className="mp-grid mp-grid--services">
            {serviceGroups.map((group) => (
              <article key={group.title} className="mp-card mp-service-group">
                <span className="mp-icon-badge" aria-hidden="true">{group.icon}</span>
                <h3>{group.title}</h3>
                <ul>
                  {slides
                    .filter((slide) => group.ids.includes(slide.id))
                    .map((slide) => (
                      <li key={slide.id}>
                        <h4>{slide.title}</h4>
                        <p>{slide.description}</p>
                      </li>
                    ))}
                </ul>
                <Link to="/kontaktaOss" className="mp-textlink mp-textlink--small">
                  Prata med oss <FiArrowUpRight aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
          <div className="mp-center">
            <Link to="/kontaktaOss" className="mp-btn mp-btn--primary mp-btn--lg">
              Boka en kostnadsfri konsultation idag <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mp-section mp-section--alt" aria-labelledby="mp-support-title">
        <div className="mp-container">
          <header className="mp-section__head">
            <p className="mp-eyebrow">Efter lansering</p>
            <h2 id="mp-support-title">Supportpaket efter lansering</h2>
          </header>
          <div className="mp-grid mp-grid--3">
            {supportPackages.map((pkg) => (
              <article key={pkg.name} className={`mp-card mp-price ${pkg.badge ? "mp-price--featured" : ""}`}>
                {pkg.badge && <span className="mp-price__badge">{pkg.badge}</span>}
                <h3>{pkg.name}</h3>
                {pkg.subtitle && <p className="mp-price__subtitle">{pkg.subtitle}</p>}
                <p className="mp-price__amount">{pkg.price}</p>
                <ul className="mp-ticks">
                  {pkg.items.map((item) => (
                    <li key={item}>
                      <FiCheck aria-hidden="true" /> {item}
                    </li>
                  ))}
                </ul>
                <Link to="/kontaktaOss" className="mp-btn mp-btn--outline mp-btn--block">
                  Kontakta oss
                </Link>
              </article>
            ))}
          </div>
          <p className="mp-notice">
            <strong>OBS!</strong> Ett <strong>månad av full support</strong> efter lansering ingår alltid i alla projekt.
          </p>
        </div>
      </section>

      <section className="mp-section" aria-labelledby="mp-extra-title">
        <div className="mp-container">
          <header className="mp-section__head">
            <h2 id="mp-extra-title">Extra Tjänster</h2>
          </header>
          <div className="mp-grid mp-grid--2">
            <article className="mp-card mp-extra">
              <span className="mp-icon-badge" aria-hidden="true"><FiShoppingBag /></span>
              <h3>Bygga din butik med Shopify? Inga problem.</h3>
              <p>
                Vill du inte ha en helt skräddarsydd butik? Då kan vi hjälpa dig att komma igång med Shopify. Vi hjälper
                dig att sätta upp och anpassa din butik så att du kan börja sälja snabbt och smidigt.
              </p>
              <Link to="/kontaktaOss" className="mp-btn mp-btn--outline">
                Kontakta Oss
              </Link>
              <p className="mp-disclaimer">Vi är inte officiellt anslutna till Shopify.</p>
            </article>
            <article className="mp-card mp-extra">
              <span className="mp-icon-badge" aria-hidden="true"><FiBookOpen /></span>
              <h3>Gör din bokidé till verklighet med KDP.</h3>
              <p>
                Vill du publicera en bok men stöter på tekniska hinder? Vi hjälper dig att ta dig igenom processen med
                Kindle Direct Publishing – enkelt, prisvärt och utan huvudvärk.
              </p>
              <Link to="/kontaktaOss" className="mp-btn mp-btn--outline">
                Kontakta Oss
              </Link>
              <p className="mp-disclaimer">Vi är inte officiellt anslutna till Amazon eller Kindle Direct Publishing.</p>
            </article>
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

      <IndustryDialog industry={industry} onClose={() => setIndustry(null)} />
    </PublicShell>
  );
};

export default PublicServices;
