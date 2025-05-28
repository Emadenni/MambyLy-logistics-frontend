import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async"; 
import { Link } from "react-router-dom";
import "./sidoButik.scss";
import SidoHeader from "../../components/SidoHeader/SidoHeader";
import logoButik from "../../assets/images/logoButik.webp";
import FloatingAnnouncement from "../../components/FloatingAnnouncement/FloatingAnnouncement";

const SidoButik = () => {
  useEffect(() => {
    document.title = "Sido Butik | Ditt mallgalleri";
  }, []);

  return (
    <>
    <Helmet>
  <title>Sido Butik | Mallgalleri av React-templates | Mambyly Solutions</title>
  <meta
    name="description"
    content="Sido Butik är ett galleri med utvalda React-mallar för småföretag. Budgetvänliga, högpresterande templates – perfekt för en snabb digital start."
  />
  <meta
    name="keywords"
    content="React templates, React mallar, hemsidemallar, småföretag, webbutveckling, frontend, Mambyly Solutions, Sido Butik"
  />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://mambylysolutions.se/sidoButik" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Sido Butik | React-mallar för småföretag" />
  <meta
    property="og:description"
    content="Utforska vårt mallgalleri för småföretag – färdiga React-mallar med fokus på prestanda, design och enkelhet."
  />
  <meta property="og:url" content="https://mambylysolutions.se/sidoButik" />
  <meta property="og:image" content="https://mambylysolutions.se/logoButic.webp" />

  {/* Twitter Card */}
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Sido Butik | React-mallar för småföretag" />
  <meta
    name="twitter:description"
    content="Hitta färdiga React-mallar för småföretag i Sido Butik. Snabbt, enkelt, budgetvänligt. By Mambyly Solutions."
  />
  <meta name="twitter:image" content="https://mambylysolutions.se/logoButic.webp" />
</Helmet>

      <SidoHeader />
      
      <FloatingAnnouncement />

      <div className="sido-brand-hero">
        <img src={logoButik} alt="Sido Butik" />
        <div className="sido-brand-tagline">by Mambyly Solutions</div>
      </div>

      <div className="sido-butik-container sido-butik-tighter">
        <div className="sido-butik-content">
          <h1 className="sido-butik-title">
            Välkommen till <span className="highlight">Sido Butik</span>
          </h1>

          <p className="sido-butik-description">
            Ett noggrant utvalt galleri av React-mallar för små företag och kreativa projekt. Betala mindre – kom igång
            snabbt.
          </p>

          <div className="sido-butik-announcement">
            Vårt mål är att släppa en ny mall varje månad. De första kommer snart! 🛠️
            <br />
            Kontakta oss på <strong>info@mambylysolutions.se</strong> eller skriv till oss på WhatsApp.
          </div>

          <div className="sido-butik-back">
            <Link to="/">← Tillbaka till startsidan</Link>
          </div>

          <div className="sido-benefits-card">
            <h2 className="benefits-title">Varför välja Sido Butik?</h2>
            <ul className="benefits-list">
              <li>
                <strong>⚡ Hög prestanda</strong>
                <br />
                Våra React-mallar är snabba, responsiva och byggda för att växa.
              </li>
              <li>
                <strong>💼 Budgetvänlig</strong>
                <br />
                Färdiga lösningar till låg kostnad – inga genvägar i kvaliteten.
              </li>
              <li>
                <strong>🔧 Förberedda för framtiden</strong>
                <br />
                Skapade för att enkelt utökas med nya funktioner när du är redo.
              </li>
              <li>
                <strong>🛟 Support som ingår</strong>
                <br />
                Varje mall inkluderar kostnadsfri support en viss period (beroende på mall).
                <br />
                Efter det erbjuder vi prisvärda supportpaket för fortsatt trygghet.
              </li>
              <li>
                <strong>🎨 Temabaserade mallar</strong>
                <br />
                Skräddarsydda för verkliga behov: restaurang, portfolio, event, butik med mera.
              </li>
            </ul>
          </div>
        </div>
      </div>
      <footer className="sido-footer">
        <p>
          © {new Date().getFullYear()} <span>Sido Butik</span> — En del av{" "}
          <a href="https://mambylysolutions.se">Mambyly Solutions</a>
        </p>
        <Link to="/">← Tillbaka till startsidan</Link>
      </footer>
    </>
  );
};

export default SidoButik;
