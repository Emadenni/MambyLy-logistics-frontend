import React from "react";
import "./WhatIsReactSection.scss";

const WhatIsReactSection: React.FC = () => {
  return (
    <section className="what-react">
      <div className="container">
        <h2 className="what-react__title">Vad är React och en SPA?</h2>
        <p className="what-react__intro">
          Vi bygger moderna hemsidor med React – ett ramverk som används av företag som Netflix, Meta och Spotify.
        </p>

        <div className="what-react__block">
          <h3>🚀 Vad är React?</h3>
          <p>
            React är ett bibliotek för att skapa användargränssnitt som är snabbt, interaktivt och lätt att underhålla.
            Det gör det möjligt att återanvända komponenter, vilket minskar utvecklingstiden och gör din webbplats mer flexibel.
          </p>
        </div>

        <div className="what-react__block">
          <h3>🧠 Vad är en SPA?</h3>
          <p>
            En Single Page Application (SPA) laddar bara en gång – därefter sker navigationen utan att ladda om hela sidan.
            Det ger en snabbare och smidigare upplevelse för användaren.
          </p>
        </div>

        <div className="what-react__block">
          <h3>✅ Varför är det bättre för dig?</h3>
          <ul>
            <li>Blixtsnabba sidladdningar</li>
            <li>Bättre användarupplevelse</li>
            <li>Enklare vidareutveckling</li>
            <li>Teknik som används av stora aktörer i världen</li>
          </ul>
        </div>

        <div className="what-react__block what-react__block--highlight">
          <h3>🧩 Vad bygger vi egentligen?</h3>
          <p>
            Vi skapar inte bara snygga sidor – vi bygger kompletta webbaserade applikationer med modern teknik.
            Från kraftfulla gränssnitt i React till skalbara backend-lösningar i molnet.
            Det betyder att du får en lösning som växer med ditt företag.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIsReactSection;
