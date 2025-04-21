import React, { useState } from 'react'
import "./terms.scss"

const Terms: React.FC = () => {
  const [showModal, setShowModal] = useState<'policy' | 'terms' | null>(null)

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
          <div className="modal__content" onClick={e => e.stopPropagation()}>
            <button className="modal__close" onClick={() => setShowModal(null)}>✕</button>
            {showModal === 'policy' && (
              <>
                <h2>Integritetspolicy</h2>
                <p>Vi värnar om din integritet. Denna integritetspolicy förklarar hur vi samlar in, använder och skyddar dina personuppgifter.</p>
                <ul>
                  <li><strong>Vilka uppgifter samlar vi in?</strong> Vi samlar endast in de uppgifter du själv lämnar till oss, t.ex. namn, e-postadress och annan information som behövs för att tillhandahålla våra tjänster.</li>
                  <li><strong>Hur används uppgifterna?</strong> Uppgifterna används för att leverera våra tjänster, förbättra användarupplevelsen och, om du samtycker, för att skicka nyhetsbrev och erbjudanden.</li>
                  <li><strong>Hur skyddas dina uppgifter?</strong> Vi använder tekniska och organisatoriska säkerhetsåtgärder för att skydda dina uppgifter mot obehörig åtkomst, förlust eller manipulation.</li>
                  <li><strong>Tredje part</strong> Vi delar inte dina personuppgifter med tredje part utan ditt samtycke, förutom när det krävs enligt lag.</li>
                  <li><strong>Dina rättigheter</strong> Du har rätt att begära information om vilka uppgifter vi har om dig, få dem rättade eller raderade.</li>
                </ul>
                <p>Kontakta oss gärna om du har frågor kring vår integritetspolicy.</p>
              </>
            )}
            {showModal === 'terms' && (
              <>
                <h2>Användarvillkor</h2>
                <p>Genom att använda vår tjänst godkänner du följande användarvillkor:</p>
                <ul>
                  <li><strong>Tjänstens användning</strong> Du förbinder dig att använda tjänsten i enlighet med gällande lagar och inte missbruka den för olagliga eller otillbörliga ändamål.</li>
                  <li><strong>Ansvarsbegränsning</strong> Vi ansvarar inte för eventuella direkta eller indirekta skador som kan uppstå vid användning av vår tjänst.</li>
                  <li><strong>Immateriella rättigheter</strong> Allt innehåll på denna webbplats tillhör oss eller våra partners och får inte användas utan tillstånd.</li>
                  <li><strong>Ändringar av villkor</strong> Vi förbehåller oss rätten att när som helst ändra dessa villkor. Ändringar publiceras på webbplatsen.</li>
                  <li><strong>Tillämplig lag</strong> Dessa villkor regleras enligt svensk lag.</li>
                </ul>
                <p>Om du inte godkänner dessa villkor ber vi dig att inte använda tjänsten.</p>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  )
}

export default Terms
