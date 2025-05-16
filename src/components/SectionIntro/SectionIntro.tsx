import React from "react";
import "./sectionIntro.scss";


const SectionIntro = () => {
  return (
    <section className="section-intro">
      <article className="intro-text">
        <h2>
          <span className="highlight">Varför</span> synlighet online är avgörande
        </h2>
        <p>
          I en digital värld där konkurrensen aldrig sover, är <strong>online-närvaro</strong> nyckeln till att
          sticka ut. Genom att synas digitalt kan du inte bara förbättra din produktivitet, utan också <span className="highlight">bygga förtroende</span>, attrahera rätt målgrupp och öppna upp för helt nya affärsmöjligheter.
        </p>
      </article>

      <article className="intro-cta">
        <h3>Redo att ta nästa steg?</h3>
        <p>
          <strong>Låt oss skapa något starkt tillsammans.</strong> Hör av dig så tar vi fram en strategi som passar just dig och dina mål.
        </p>
        <a href="/contact" className="cta-button">Kontakta oss</a>
      </article>
    </section>
  );
};

export default SectionIntro;
