import React, { useState } from 'react';
import './terms.scss';

const Terms: React.FC = () => {
  const [showModal, setShowModal] = useState<'policy' | 'terms' | null>(null);

  return (
    <article className='terms'>
      <ul className='terms__list'>
        <li className='terms__list__item'>
          <button onClick={() => setShowModal('policy')}>
            Integritetspolicy
          </button>
        </li>
        <li className='terms__list__item'>
          <button onClick={() => setShowModal('terms')}>
            Användarvillkor
          </button>
        </li>
      </ul>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(null)}>
          <div className="modal__content" onClick={(e) => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setShowModal(null)}>✕</button>
            {showModal === 'policy' && (
              <>
                <h2>Integritetspolicy</h2>
                <p>Vi värnar om din integritet. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter i enlighet med den allmänna dataskyddsförordningen (GDPR).</p>
                <ul>
                  <li><strong>Vilka uppgifter samlar vi in?</strong> Vi samlar in de uppgifter som du lämnar frivilligt när du använder våra tjänster, t.ex. namn, e-postadress, samt annan information som behövs för att tillhandahålla våra tjänster.</li>
                  <li><strong>Hur används uppgifterna?</strong> Uppgifterna används för att leverera våra tjänster, förbättra användarupplevelsen och, om du samtycker, för att skicka relevant information via e-post eller på annat sätt.</li>
                  <li><strong>Hur skyddas dina uppgifter?</strong> Vi vidtar lämpliga tekniska och organisatoriska åtgärder för att skydda dina uppgifter mot obehörig åtkomst, förlust eller manipulation.</li>
                  <li><strong>Tredje part</strong> Vi delar inte dina personuppgifter med tredje part utan ditt uttryckliga samtycke, utom när det krävs enligt lag.</li>
                  <li><strong>Din rätt att återkalla samtycke och andra rättigheter</strong> Du har rätt att när som helst återkalla ditt samtycke, begära åtkomst till, rätta, radera eller få överförda dina personuppgifter. För att göra det kan du kontakta oss via e-post eller via den kontaktinformation som finns på vår webbplats eller maila direkt till <a href="mailto:intern@mambylysolutions.se">intern@mambylysolutions.se</a>.</li>
                </ul>
                <p className='green'>Kontakta oss gärna om du har frågor kring vår integritetspolicy. Du kan nå oss på <a href="mailto:intern@mambylysolutions.se">intern@mambylysolutions.se</a>.</p>
              </>
            )}
            {showModal === 'terms' && (
              <>
                <h2>Användarvillkor</h2>
                <p>Genom att använda vår tjänst godkänner du följande användarvillkor:</p>
                <ul>
                  <li><strong>Tjänstens användning</strong> Du förbinder dig att använda tjänsten i enlighet med gällande lagar och att inte missbruka den för olagliga eller otillbörliga ändamål.</li>
                  <li><strong>Ansvarsbegränsning</strong> Vi ansvarar inte för direkta eller indirekta skador som kan uppstå vid användning av vår tjänst, med undantag för skador som orsakas av vår egen vårdslöshet.</li>
                  <li><strong>Immateriella rättigheter</strong> Allt innehåll på denna webbplats tillhör oss eller våra partners och får inte användas utan vårt uttryckliga tillstånd.</li>
                  <li><strong>Ändringar av villkor</strong> Vi förbehåller oss rätten att ändra dessa villkor när som helst. Ändringar publiceras på webbplatsen och träder i kraft omedelbart efter publicering.</li>
                  <li><strong>Tillämplig lag</strong> Dessa villkor regleras av svensk lag, och alla tvister som uppstår ska avgöras vid svensk domstol.</li>
                </ul>
                <p>Om du inte godkänner dessa villkor ber vi dig att inte använda tjänsten.</p>
                <p className='green'>Kontakta oss gärna om du har frågor kring vår Användarvillkor. Du kan nå oss på <a href="mailto:intern@mambylysolutions.se">intern@mambylysolutions.se</a>.</p>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
};

export default Terms;
