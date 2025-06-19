import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "./SidoButik.scss";

import SidoHeader from "../../components/SidoHeader/SidoHeader";
import CTA from "../../components/Cta/Cta";
import logoButik from "../../assets/images/logoButik.webp";
import FloatingAnnouncement from "../../components/FloatingAnnouncement/FloatingAnnouncement";
import TemplateFeatureCard from "../../components/TemplateFeatureCard/TemplateFeatureCard";
import comingSoonImage from "../../assets/images/SidoButik/featurePreviewPiazzaGrande.webp";
import logoTemplate from "../../assets/images/SidoButik/logotemplatePiazaGrande.webp";

// Icons
import SearchIcon from "@mui/icons-material/TravelExplore";
import DevicesIcon from "@mui/icons-material/Devices";
import IntegrationInstructionsIcon from "@mui/icons-material/IntegrationInstructions";
import AccessibilityNewIcon from "@mui/icons-material/AccessibilityNew";
import GppGoodIcon from "@mui/icons-material/GppGood";
import SpeedIcon from "@mui/icons-material/Speed";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import SettingsSuggestIcon from "@mui/icons-material/SettingsSuggest";
import GridViewIcon from "@mui/icons-material/GridView";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import EditNoteIcon from "@mui/icons-material/EditNote";

const features = [
  {
    icon: <SearchIcon />,
    title: "Sökmotoroptimering",
    desc: "Byggt för att prestera högt i Google, utan extra plugins.",
  },
  {
    icon: <DevicesIcon />,
    title: "Responsiv design",
    desc: "Anpassat för mobil, surfplatta och alla skärmstorlekar.",
  },
  {
    icon: <IntegrationInstructionsIcon />,
    title: "Integrationer",
    desc: "Sociala medier, formulär, bokningssystem och mer.",
  },
  {
    icon: <AccessibilityNewIcon />,
    title: "Tillgänglighet",
    desc: "Design enligt WCAG – så att alla kan använda din sajt.",
  },
  {
    icon: <GppGoodIcon />,
    title: "GDPR & cookies",
    desc: "Allt du behöver för att följa lagkraven i EU.",
  },
  {
    icon: <SpeedIcon />,
    title: "Hög prestanda",
    desc: "Blixtsnabba laddningstider och optimerad kod.",
  },
  {
    icon: <MonetizationOnIcon />,
    title: "Budgetvänlig",
    desc: "Färdiga lösningar till låg kostnad – inga genvägar i kvaliteten.",
  },
  {
    icon: <BuildCircleIcon />,
    title: "Support som ingår",
    desc: "Support ingår alltid i starten, och kan förlängas vid behov.",
  },
];

const SidoButik = () => {
  useEffect(() => {
    document.title = "Sido Butik | Ditt mallgalleri";
  }, []);

  return (
    <>
      <Helmet>
        <title>Sido Butik | Mallgalleri av React-templates | Mambyly Solutions</title>
        <meta name="description" content="Sido Butik är ett galleri med utvalda React-mallar för småföretag." />
        <link rel="canonical" href="https://mambylysolutions.se/sidoButik" />
      </Helmet>

      <div className="sido-home-container">
        <SidoHeader />
        <FloatingAnnouncement />

        <section className="section-welcome">
          <section className="section-intro">
            <div className="intro-content">
              <div className="sido-brand-hero">
                <img src={logoButik} alt="Sido Butik" className="logo-butik" />
                <div className="sido-brand-tagline">by Mambyly Solutions</div>
              </div>
              <h1>
                Välkommen till <br /> <span className="highlight">Sido Butik</span>
              </h1>
              <p>
                Utforska ett växande galleri av React-mallar. Testa varje mall i realtid, uppdatera innehållet direkt
                och lansera den med vår hjälp.
              </p>
              <p className="sido-butik-cta-text">
                Du får en webbplats som är både snygg, snabb och redo för framtiden.
              </p>
              <Link to="/templates/mallar" className="cta-link">
                Utforska mallarna →
              </Link>

              <a href="#benefits" className="cta-anchor">
                Varför välja Sido Butik? ↓
              </a>
            </div>

            <div className="features-list">
              {features.map((f, index) => (
                <div className="feature-item" key={index}>
                  <div className="icon-wrapper">{f.icon}</div>
                  <div className="feature-text">
                    <h3>{f.title}</h3>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </section>

        <section className="section-feature">
          <h2 className="benefits-title">Förhandstitt på nästa mall</h2>
          <TemplateFeatureCard
            name="Websmallen för din restaurang"
            image={comingSoonImage}
            logo={logoTemplate}
            description="En elegant, snabb och mobilanpassad mall som lyfter fram din meny, förenklar bokningar och skapar en oförglömlig gästupplevelse – perfekt för moderna restauranger med höga ambitioner."
            comingSoon={false}
            badge="Nyhet"
            link="/templates/piazza-grande"
          />
        </section>
        <section id="benefits" className="section-benefits">
          <div className="sido-benefits-card">
            <h2 className="benefits-title">
              Sido Butik & React – för dig som vill växa och hålla budgeten under kontroll.
            </h2>
            <ul className="benefits-list">
              <li>
                <SpeedIcon className="benefit-icon" />
                <div>
                  <strong>Blixtsnabb prestanda</strong>
                  Våra mallar är byggda med React – ett av världens snabbaste och mest moderna ramverk för
                  webbutveckling. Det betyder korta laddningstider och smidigare användarupplevelse.
                </div>
              </li>
              <li>
                <SettingsSuggestIcon className="benefit-icon" />
                <div>
                  <strong>Full kontroll på tekniken</strong>
                  Du äger din kod och kan utveckla exakt det du behöver – utan att begränsas av plugins eller låsta
                  system.
                </div>
              </li>
              <li>
                <GridViewIcon className="benefit-icon" />
                <div>
                  <strong>Modulärt och skalbart</strong>
                  Allt är uppdelat i tydliga komponenter, vilket gör det enkelt att bygga vidare och anpassa efter din
                  verksamhets behov.
                </div>
              </li>
              <li>
                <AutoAwesomeIcon className="benefit-icon" />
                <div>
                  <strong>Modern design & UX</strong>
                  Vi använder React för att leverera ett gränssnitt som känns naturligt, responsivt och professionellt –
                  oavsett skärmstorlek.
                </div>
              </li>
              <li>
                <SupportAgentIcon className="benefit-icon" />
                <div>
                  <strong>Teknisk support ingår</strong>
                  Vi hjälper dig att komma igång med din mall, och erbjuder support för vidareutveckling vid behov.
                </div>
              </li>
              <li>
                <EditNoteIcon className="benefit-icon" />
                <div>
                  <strong>Förhandsgranska ditt innehåll</strong>
                  Du kan enkelt lägga in dina egna texter, färger och bilder och se hur din hemsida skulle se ut – innan
                  våra slutjusteringar gör den perfekt.
                </div>
              </li>
            </ul>
          </div>
        </section>

        <footer className="sido-footer">
          <p>
            © {new Date().getFullYear()} <span>Sido Butik</span> — En del av{" "}
            <a href="https://mambylysolutions.se">Mambyly Solutions</a>
          </p>
          <Link to="/">← Tillbaka till startsidan</Link>
        </footer>
      </div>
    </>
  );
};

export default SidoButik;
