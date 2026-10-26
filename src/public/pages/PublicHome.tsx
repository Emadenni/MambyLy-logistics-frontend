import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiArrowUpRight,
  FiCheck,
  FiEdit3,
  FiFeather,
  FiLayers,
  FiLink,
  FiMessageCircle,
  FiPhone,
  FiSmartphone,
  FiUserPlus,
} from "react-icons/fi";
import PublicShell from "../components/PublicShell";
import CardShowcase from "../components/CardShowcase";
import ExampleTile from "../components/ExampleTile";
import SidoButikPromo from "../components/SidoButikPromo";
import { useHashScroll } from "../components/useHashScroll";
import { CardPreview } from "../digital-card/DigitalCard";
import { getCard, getExamples } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import type { ContactState } from "../digital-card/service";
import type { CardConfig } from "../digital-card/types";
import { publicSiteConfig } from "../config";
import { publicContact } from "../contact";

const HERO_EXAMPLE = "kvist-och-hyvel";
const SITE_EXAMPLE = "kvist-och-hyvel";

const benefits = [
  { icon: <FiLink />, title: "Delas med en länk", text: "Skicka kortet i sms, WhatsApp eller mejl – eller låt någon skanna QR-koden." },
  { icon: <FiSmartphone />, title: "Ingen app behövs", text: "Mottagaren öppnar kortet direkt i webbläsaren, i mobilen eller på datorn." },
  { icon: <FiLayers />, title: "Allt på ett ställe", text: "Telefon, e-post, webbplats och sociala medier – samlade och klickbara." },
  { icon: <FiFeather />, title: "Ser ut som ditt företag", text: "Logotyp, färger och ton formas efter din identitet. Inte en mall med ditt namn på." },
  { icon: <FiUserPlus />, title: "Lätt att spara", text: "Med ”Spara kontakt” öppnar telefonen dina uppgifter, och mottagaren bekräftar." },
  {
    icon: <FiEdit3 />,
    title: "Samma länk, nytt innehåll",
    text: "När vi publicerar och sköter kortet åt dig kan innehållet uppdateras utan att länken ändras. Uppgifter som någon redan sparat i sin telefon ändras inte av sig själva.",
  },
];

const steps = [
  { title: "Berätta om din verksamhet", text: "Skicka logotyp, kontaktuppgifter och de länkar du vill ha med." },
  { title: "Vi formger ditt kort", text: "Ett visitkort med fram- och baksida, i dina färger och med din logotyp." },
  { title: "Du provar och tycker till", text: "Du testar kortet i telefonen och vi justerar de sista detaljerna tillsammans." },
  { title: "Du får din länk", text: "Den färdiga länken och QR-koden – redo att delas." },
];

export const faq = [
  {
    q: "Behöver mottagaren installera en app?",
    a: "Nej. Kortet är en webbsida: det öppnas i webbläsaren som redan finns i mobilen eller datorn.",
  },
  {
    q: "Hur delar jag kortet?",
    a: "Du skickar länken – i sms, WhatsApp, mejl, sociala medier eller din e-postsignatur – eller visar QR-koden. På kortsidan finns en knapp för telefonens delningsmeny, eller för att kopiera länken.",
  },
  {
    q: "Kan mottagaren spara mina uppgifter i telefonen?",
    a: "Ja. ”Spara kontakt” ger telefonen en kontaktfil (vCard) med dina uppgifter. Telefonen visar kontakten eller filen, och mottagaren bekräftar själv. Exakt hur det ser ut beror på telefon och webbläsare.",
  },
  {
    q: "Kan kortet uppdateras efteråt?",
    a: "Ja, när vi publicerar och sköter kortet åt dig: vi ändrar innehållet och länken förblir densamma. Den som redan har sparat dina uppgifter i sina kontakter behåller dock den gamla versionen tills hen sparar igen.",
  },
  {
    q: "Fungerar det på alla telefoner?",
    a: "Kortet fungerar i moderna webbläsare på iPhone, Android och dator. Vissa funktioner, som delningsmenyn, beror på enheten – finns den inte visas Kopiera länk i stället. Vi experimenterar också med delning via NFC på kompatibla enheter, men det ingår inte i tjänsten i dag.",
  },
  {
    q: "Vad är skillnaden mellan visitkort och webbplats?",
    a: "Visitkortet är kort och personligt: vem du är och hur man når dig. En webbplats berättar mer – om verksamheten, tjänsterna och tidigare arbeten. Har du redan en webbplats länkar kortet dit.",
  },
  {
    q: "Vem står för publicering och drift?",
    a: "Vi kan publicera och sköta kortet åt dig, så att länken fungerar och innehållet kan uppdateras. Vad som ingår och hur ändringar hanteras kommer vi överens om i offerten.",
  },
  {
    q: "Vad kostar det?",
    a: "Det beror på vad du behöver. Berätta om din verksamhet så återkommer vi med en offert.",
  },
];

/** A browser window drawn with CSS, in the colours of an example card: site and card belong together. */
const SiteMock: React.FC<{ card: CardConfig }> = ({ card }) => (
  <div
    className="mp-sitemock"
    aria-hidden="true"
    style={{ "--sm-bg": card.theme.front, "--sm-ink": card.theme.frontInk, "--sm-accent": card.theme.accent, "--sm-dark": card.theme.back } as React.CSSProperties}
  >
    <div className="mp-sitemock__chrome">
      <span />
      <span />
      <span />
      <p>{card.website?.label}</p>
    </div>
    <div className="mp-sitemock__page">
      <div className="mp-sitemock__nav">
        {card.logoUrl && <img src={card.logoUrl} alt="" width={28} height={28} loading="lazy" />}
        <b>{card.company}</b>
        <i />
        <i />
        <i />
      </div>
      <div className="mp-sitemock__hero">
        <p>{card.tagline}</p>
        <i />
        <i />
        <em>{card.website ? "Kontakta oss" : ""}</em>
      </div>
      <div className="mp-sitemock__grid">
        <span />
        <span />
        <span />
      </div>
    </div>
    <div className="mp-sitemock__card">
      <CardPreview card={card} t={cardStrings[card.lang]} />
    </div>
  </div>
);

const PublicHome: React.FC = () => {
  useHashScroll();
  const hero = getCard(HERO_EXAMPLE);
  const siteCard = getCard(SITE_EXAMPLE);
  const examples = getExamples();
  const fan = examples.filter((c) => c.slug !== HERO_EXAMPLE).slice(0, 2);
  const contact = (service: ContactState["service"]): ContactState => ({ service });

  return (
    <PublicShell>
      <Helmet>
        <title>Digitala visitkort för företag | MambyLy Solutions</title>
        <meta
          name="description"
          content="Digitala visitkort med din logotyp, dina färger och dina kontaktuppgifter. Delas med en länk och öppnas utan app. Webbplats i samma stil när du behöver."
        />
        <link rel="canonical" href="https://www.mambylysolutions.se/" />
      </Helmet>

      {/* A. Opening */}
      <section className="mp-hero2" aria-labelledby="mp-hero-title">
        <div className="mp-container mp-hero2__grid">
          <div className="mp-hero2__copy">
            <p className="mp-eyebrow">Visitkort &amp; webbplatser</p>
            <h1 id="mp-hero-title" className="mp-display">
              Digitala visitkort <span className="mp-hero2__accent">för ditt företag.</span>
            </h1>
            <p className="mp-lead">
              Med din logotyp, dina färger och alla dina kontaktvägar. Du delar kortet med en länk – mottagaren öppnar
              det direkt i webbläsaren och kan spara dina uppgifter.
            </p>
            <div className="mp-actions mp-hero2__actions">
              <Link to="/exempel" className="mp-btn mp-btn--primary mp-btn--lg">
                Se exemplen <FiArrowRight aria-hidden="true" />
              </Link>
              <Link to="/kontaktaOss" state={contact("card")} className="mp-btn mp-btn--outline mp-btn--lg">
                Begär ditt visitkort
              </Link>
            </div>
          </div>

          {hero && (
            <div className="mp-hero2__stage">
              <div className="mp-hero2__fan" aria-hidden="true">
                {fan.map((c) => (
                  <div key={c.slug} className="mp-hero2__fan-card">
                    <CardPreview card={c} t={cardStrings[c.lang]} />
                  </div>
                ))}
              </div>
              <CardShowcase card={hero} className="mp-hero2__card" />
              <p className="mp-hero2__caption">
                Exempel: {hero.company} – {hero.example?.sector.toLowerCase()}.{" "}
                <Link to={`/exempel/${hero.slug}`}>Öppna exemplet</Link>
              </p>
            </div>
          )}
        </div>
      </section>

      <div className="mp-strip">
        <ul className="mp-container">
          <li>Mindre krångel. Mer företag.</li>
          <li>Delas med en länk</li>
          <li>Öppnas utan app</li>
          <li>Din logotyp, dina färger</li>
        </ul>
      </div>

      {/* B. Benefits */}
      <section id="fordelar" className="mp-section mp-anchor" aria-labelledby="mp-benefits-title">
        <div className="mp-container mp-benefits">
          <div className="mp-benefits__intro">
            <p className="mp-eyebrow">Varför digitalt</p>
            <h2 id="mp-benefits-title">Ett visitkort som alltid finns till hands.</h2>
            <p>
              Pappersvisitkort tar slut, blir liggande eller hamnar i fel ficka. Ett digitalt kort skickar du när du
              behöver – och det ser lika bra ut varje gång.
            </p>
            <div className="mp-chat" aria-hidden="true">
              <p className="mp-chat__bubble mp-chat__bubble--out">Trevligt att ses idag! Här är mitt visitkort:</p>
              <div className="mp-chat__link">
                {hero && (
                  <div className="mp-chat__preview">
                    <CardPreview card={hero} t={cardStrings[hero.lang]} />
                  </div>
                )}
                <p>
                  <b>{hero?.company ?? "Ditt företag"} – digitalt visitkort</b>
                  <span>mambylysolutions.se/card/…</span>
                </p>
              </div>
              <p className="mp-chat__bubble mp-chat__bubble--in">Tack! Nu har jag dina uppgifter.</p>
            </div>
          </div>
          <ul className="mp-benefits__list">
            {benefits.map((b) => (
              <li key={b.title}>
                <span className="mp-icon-badge mp-icon-badge--sm" aria-hidden="true">{b.icon}</span>
                <div>
                  <h3>{b.title}</h3>
                  <p>{b.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* C. How it works */}
      <section id="sa-funkar-det" className="mp-band mp-anchor" aria-labelledby="mp-how-title">
        <div className="mp-container">
          <header className="mp-band__head">
            <p className="mp-eyebrow mp-eyebrow--light">Så funkar det</p>
            <h2 id="mp-how-title">Från logotyp till färdig länk.</h2>
          </header>
          <ol className="mp-flow">
            {steps.map((s, i) => (
              <li key={s.title}>
                <span className="mp-flow__num" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
          <div className="mp-band__actions">
            <Link to="/kontaktaOss" state={contact("card")} className="mp-btn mp-btn--light">
              Börja med en förfrågan <FiArrowUpRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* D. Examples */}
      <section id="exempel" className="mp-section mp-anchor" aria-labelledby="mp-examples-title">
        <div className="mp-container">
          <header className="mp-section__head mp-section__head--row">
            <div>
              <p className="mp-eyebrow">Exempel</p>
              <h2 id="mp-examples-title">Ett kort för varje verksamhet.</h2>
              <p>Påhittade företag, riktiga lösningar: varje kort har sin egen identitet. Öppna ett och vänd på det.</p>
            </div>
            <Link to="/exempel" className="mp-btn mp-btn--outline">
              Alla exempel <FiArrowRight aria-hidden="true" />
            </Link>
          </header>
          <div className="mp-xrow">
            {examples.slice(0, 4).map((c) => (
              <ExampleTile key={c.slug} card={c} />
            ))}
          </div>
        </div>
      </section>

      {/* E. Website */}
      <section id="webbplats" className="mp-section mp-section--alt mp-anchor" aria-labelledby="mp-site-title">
        <div className="mp-container mp-siteoffer">
          {siteCard && <SiteMock card={siteCard} />}
          <div className="mp-siteoffer__copy">
            <p className="mp-eyebrow">Webbplats</p>
            <h2 id="mp-site-title">Behöver du också en webbplats?</h2>
            <p>
              Har du redan en webbplats räcker det med visitkortet – vi länkar till den. Börjar du från noll kan vi göra
              båda, med samma logotyp, färger och känsla.
            </p>
            <ul className="mp-ticks">
              <li><FiCheck aria-hidden="true" /> Presentera verksamheten, tjänsterna och tidigare arbeten</li>
              <li><FiCheck aria-hidden="true" /> Byggd för mobilen först, lika tydlig på datorn</li>
              <li><FiCheck aria-hidden="true" /> Kortet leder till webbplatsen – och webbplatsen till kortet</li>
            </ul>
            <div className="mp-actions">
              <Link to="/kontaktaOss" state={contact("both")} className="mp-btn mp-btn--primary">
                Visitkort + webbplats <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/tjänster#webbplats" className="mp-textlink">
                Läs mer om webbplatser
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* F. FAQ */}
      <section id="fragor" className="mp-section mp-anchor" aria-labelledby="mp-faq-title">
        <div className="mp-container mp-faq">
          <header className="mp-faq__head">
            <p className="mp-eyebrow">Vanliga frågor</p>
            <h2 id="mp-faq-title">Bra att veta.</h2>
            <p>
              Hittar du inte svaret? <Link to="/kontaktaOss">Skriv till oss</Link> eller ring{" "}
              <a href={publicContact.phoneHref}>{publicContact.phoneNational}</a>.
            </p>
          </header>
          <div className="mp-faq__list">
            {faq.map((f) => (
              <details key={f.q} className="mp-disclosure">
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {publicSiteConfig.showSidoButik && <SidoButikPromo />}

      {/* G. Contact */}
      <section id="kontakt" className="mp-container mp-cta mp-cta--choices mp-anchor" aria-labelledby="mp-cta-title">
        <div>
          <p className="mp-eyebrow mp-eyebrow--light">Kontakt</p>
          <h2 id="mp-cta-title">Vad vill du ha hjälp med?</h2>
          <p>Välj ett alternativ – det följer med till formuläret, där du berättar resten.</p>
          <p className="mp-cta__direct">
            <a href={publicContact.phoneHref}>
              <FiPhone aria-hidden="true" /> {publicContact.phoneNational}
            </a>
            <a href={publicContact.whatsappGreetingUrl} target="_blank" rel="noopener noreferrer">
              <FiMessageCircle aria-hidden="true" /> WhatsApp<span className="mp-sr"> (öppnas i ny flik)</span>
            </a>
          </p>
        </div>
        <ul className="mp-choices">
          <li>
            <Link to="/kontaktaOss" state={contact("card")} className="mp-choice">
              <strong>Ett digitalt visitkort</strong>
              <span>Jag har redan en webbplats, eller behöver ingen.</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link to="/kontaktaOss" state={contact("both")} className="mp-choice">
              <strong>Visitkort och webbplats</strong>
              <span>Jag börjar från noll och vill ha båda.</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </li>
          <li>
            <Link to="/kontaktaOss" state={contact("site")} className="mp-choice">
              <strong>En webbplats</strong>
              <span>Jag vill främst ha en ny webbplats.</span>
              <FiArrowUpRight aria-hidden="true" />
            </Link>
          </li>
        </ul>
      </section>
    </PublicShell>
  );
};

export default PublicHome;
