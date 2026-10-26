import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight, FiCheck, FiMonitor } from "react-icons/fi";
import { LuIdCard } from "react-icons/lu";
import PublicShell from "../components/PublicShell";
import { useHashScroll } from "../components/useHashScroll";
import { CardPreview } from "../digital-card/DigitalCard";
import { getExamples } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import type { ContactState } from "../digital-card/service";

const cardIncludes = [
  "Design efter din identitet: logotyp, färger, fram- och baksida",
  "Klickbara kontaktvägar: telefon, e-post, webbplats och sociala medier",
  "”Spara kontakt”: en kontaktfil som mottagaren bekräftar i sin telefon",
  "Egen länk och QR-kod, med knapp för att dela eller kopiera länken",
  "Publicering hos oss, så att innehållet kan uppdateras med samma länk",
];

const siteIncludes = [
  "Presentation av verksamheten, tjänsterna och tidigare arbeten",
  "Samma logotyp, färger och ton som ditt visitkort",
  "Byggd för mobilen först, lika tydlig på datorn",
  "Tydliga kontaktvägar på varje sida",
  "Grundläggande sökmotoranpassning: titlar, beskrivningar och delningsbilder",
];

const request = (service: ContactState["service"]): ContactState => ({ service });

/** /tjänster – the two services: the digital card (main) and a coordinated website (complement). */
const PublicServices: React.FC = () => {
  useHashScroll();
  const previews = getExamples().slice(0, 3);

  return (
    <PublicShell>
      <Helmet>
        <title>Tjänster – digitala visitkort och webbplatser | MambyLy Solutions</title>
        <meta
          name="description"
          content="Digitalt visitkort med din logotyp och dina kontaktuppgifter – och en webbplats i samma stil när du behöver. Begär en offert."
        />
        <link rel="canonical" href="https://www.mambylysolutions.se/tjänster" />
      </Helmet>

      <section className="mp-intro mp-intro--paper">
        <div className="mp-container mp-intro__grid">
          <div>
            <p className="mp-eyebrow">Tjänster</p>
            <h1 className="mp-display mp-display--page">
              Två tjänster.
              <br />
              Samma stil.
            </h1>
            <p className="mp-lead">
              Ett digitalt visitkort som gör det lätt att nå dig – och, om du behöver, en webbplats som ser ut som
              kortet.
            </p>
          </div>
          <p className="mp-note-card" aria-hidden="true">
            Kort.
            <br />
            Webb.
            <br />
            Klart.
          </p>
        </div>
      </section>

      <section className="mp-section mp-section--flush-top">
        <div className="mp-container mp-offers">
          <article id="visitkort" className="mp-offer mp-offer--main mp-anchor" aria-labelledby="mp-offer-card">
            <div className="mp-offer__head">
              <span className="mp-icon-badge" aria-hidden="true"><LuIdCard /></span>
              <div>
                <p className="mp-offer__tag">Huvudtjänst</p>
                <h2 id="mp-offer-card">Digitalt visitkort</h2>
              </div>
            </div>
            <p className="mp-offer__lead">
              Ett elegant kort med din logotyp, dina färger och dina kontaktuppgifter. Det öppnas i webbläsaren via en
              länk – utan app – och mottagaren kan spara dina uppgifter.
            </p>
            <div className="mp-offer__fan" aria-hidden="true">
              {previews.map((c) => (
                <div key={c.slug}>
                  <CardPreview card={c} t={cardStrings[c.lang]} />
                </div>
              ))}
            </div>
            <h3 className="mp-offer__subhead">Det här ingår</h3>
            <ul className="mp-ticks">
              {cardIncludes.map((item) => (
                <li key={item}>
                  <FiCheck aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <p className="mp-offer__fit">
              <strong>Har du redan en webbplats?</strong> Då är visitkortet allt du behöver – kortet länkar dit.
            </p>
            <div className="mp-actions">
              <Link to="/kontaktaOss" state={request("card")} className="mp-btn mp-btn--primary">
                Begär offert på visitkort <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/exempel" className="mp-textlink">
                Se exemplen <FiArrowRight aria-hidden="true" />
              </Link>
            </div>
          </article>

          <article id="webbplats" className="mp-offer mp-anchor" aria-labelledby="mp-offer-site">
            <div className="mp-offer__head">
              <span className="mp-icon-badge" aria-hidden="true"><FiMonitor /></span>
              <div>
                <p className="mp-offer__tag">Tillägg</p>
                <h2 id="mp-offer-site">Webbplats</h2>
              </div>
            </div>
            <p className="mp-offer__lead">
              En webbplats i samma stil som ditt visitkort, för dig som vill berätta mer: om verksamheten, tjänsterna och
              det du har gjort.
            </p>
            <h3 className="mp-offer__subhead">Det här ingår</h3>
            <ul className="mp-ticks">
              {siteIncludes.map((item) => (
                <li key={item}>
                  <FiCheck aria-hidden="true" /> {item}
                </li>
              ))}
            </ul>
            <p className="mp-offer__fit">
              <strong>Börjar du från noll?</strong> Vi gör kort och webbplats tillsammans, så att allt hänger ihop.
            </p>
            <div className="mp-actions">
              <Link to="/kontaktaOss" state={request("both")} className="mp-btn mp-btn--primary">
                Visitkort + webbplats <FiArrowUpRight aria-hidden="true" />
              </Link>
              <Link to="/kontaktaOss" state={request("site")} className="mp-textlink">
                Bara en webbplats
              </Link>
            </div>
          </article>
        </div>
      </section>

      <section className="mp-section mp-section--alt" aria-labelledby="mp-price-title">
        <div className="mp-container mp-split">
          <div>
            <h2 id="mp-price-title">Pris och villkor</h2>
            <p>
              Varje kort och varje webbplats anpassas efter verksamheten. Därför ger vi en offert efter ett första samtal,
              med vad som ingår, hur publiceringen sköts och hur ändringar hanteras.
            </p>
          </div>
          <div>
            <h2 className="mp-h3">Frågor?</h2>
            <p>
              De vanligaste frågorna – om appar, delning, kontakter och uppdateringar – hittar du{" "}
              <Link to="/#fragor">på startsidan</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="mp-container mp-cta" aria-labelledby="mp-cta-title">
        <div>
          <h2 id="mp-cta-title">Redo för ett eget kort?</h2>
          <p>Berätta kort om din verksamhet. Logotyp och material tar vi när vi har pratat.</p>
        </div>
        <Link to="/kontaktaOss" state={request("card")} className="mp-btn mp-btn--light mp-btn--lg">
          Begär offert <FiArrowUpRight aria-hidden="true" />
        </Link>
      </section>
    </PublicShell>
  );
};

export default PublicServices;
