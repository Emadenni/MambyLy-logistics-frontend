import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuCopy, LuKey, LuMessageCircle, LuNfc, LuQrCode, LuSmartphone, LuWifi } from "react-icons/lu";
import { useCopy } from "../../experience/i18n";
import { ScreenHead } from "../../experience/Screen";
import { PATHS, STAY_DEMO_BASE, type Lang } from "../../experience/routes";
import { publicContact } from "../../contact";
import ToolsChrome from "../ToolsChrome";
import { Cottage, TownHouse } from "./Drawing";
import { STAY_PRICING, STAY_PRICING_NOTE } from "./pricing";
import "../../styles/stay.scss";

const COPY: Record<Lang, {
  meta: string;
  metaDesc: string;
  kicker: string;
  title: string;
  lead: string;
  demoStuga: string;
  demoCity: string;
  talk: string;
  problemTitle: string;
  problemText: string;
  questions: string[];
  stepsKicker: string;
  stepsTitle: string;
  steps: { title: string; text: string }[];
  guestKicker: string;
  guestTitle: string;
  guestText: string;
  guestList: { icon: "key" | "wifi" | "chat" | "phone"; text: string }[];
  packagingAlt: string;
  packagingNote: string;
  whoKicker: string;
  whoTitle: string;
  who: { title: string; text: string }[];
  whoNote: string;
  priceKicker: string;
  priceTitle: string;
  demosKicker: string;
  demosTitle: string;
  demos: { id: "stuga" | "lagenhet"; title: string; text: string }[];
  open: string;
  contactTitle: string;
  contactText: string;
  contactCta: string;
  mockArrival: string;
  mockAsk: string;
}> = {
  sv: {
    meta: "MambyLy Stay – digital concierge för uthyrare | MambyLy Tools",
    metaDesc: "En skylt med NFC och QR i boendet: gästen får husets information och svar på sina frågor på sitt eget språk, dygnet runt.",
    kicker: "MambyLy Stay",
    title: "Gästerna får svar. Du får lugn.",
    lead: "En skylt med NFC-tagg och QR-kod i boendet. Gästen trycker eller skannar och får allt om huset – nyckeln, Wi-Fi, bastun, soporna – och svar på sina frågor på sitt eget språk, dygnet runt.",
    demoStuga: "Se demo: stuga",
    demoCity: "Se demo: lägenhet",
    talk: "Prata med oss",
    problemTitle: "Samma frågor, om och om igen",
    problemText: "Var ligger nyckeln? Vad är lösenordet? Hur funkar bastun? Som värd svarar du på samma sak för varje ny gäst – ofta sent på kvällen. Med Stay finns svaret redan i boendet.",
    questions: ["Vad är lösenordet till Wi-Fi?", "Var hittar jag nyckeln?", "Hur eldar jag bastun?", "När är utcheckning?", "Var sorterar vi soporna?"],
    stepsKicker: "Så funkar det",
    stepsTitle: "Tre steg till färre frågor",
    steps: [
      { title: "Vi skriver husets manual", text: "Du berättar om boendet, vi gör det till en tydlig guide och svar på vanliga frågor – på svenska, engelska och tyska." },
      { title: "Skylten kommer på plats", text: "Du får en skylt med NFC-tagg och QR-kod att sätta vid dörren eller i köket. Ingen app behövs." },
      { title: "Gästen får svar", text: "Gästen trycker med telefonen och får husets information och en chatt som svarar på hens språk." },
    ],
    guestKicker: "Vad gästen ser",
    guestTitle: "Allt viktigt, i en hand",
    guestText: "Gästsidan öppnas direkt i telefonens webbläsare, på telefonens språk.",
    guestList: [
      { icon: "key", text: "Ankomstkortet: koden till nyckelboxen, Wi-Fi med kopiera-knapp, tider för in- och utcheckning." },
      { icon: "wifi", text: "Allt om huset: bastu, kamin, sopor, parkering och husets regler – kort och tydligt." },
      { icon: "chat", text: "En chatt som svarar utifrån husets information, på svenska, engelska och tyska." },
      { icon: "phone", text: "Hittar den inte svaret kan gästen skriva direkt till dig." },
    ],
    packagingAlt: "Stay-skylten med NFC-tagg och QR-kod i sin förpackning",
    packagingNote: "Skylten med NFC och QR, som den kommer i lådan.",
    whoKicker: "För vem",
    whoTitle: "För dig som hyr ut",
    who: [
      { title: "Stugor och fritidshus", text: "Bastu, kamin, brygga och sopsortering förklarade en gång – för alla gäster." },
      { title: "Lägenheter i stan", text: "Portkod, tvättstuga, kollektivtrafik och husets regler, på gästens språk." },
      { title: "Flera boenden", text: "Samma lugn i varje hus, och ett lägre pris per boende." },
    ],
    whoNote: "Perfekt om du hyr ut via Airbnb eller Booking – eller direkt till dina gäster.",
    priceKicker: "Priser",
    priceTitle: "En månadsavgift per boende",
    demosKicker: "Demo",
    demosTitle: "Prova som en gäst",
    demos: [
      { id: "stuga", title: "Sjöstugan vid Roxen", text: "Stuga vid sjön: bastu, kamin och ved, bad och kanot, källsortering och parkering." },
      { id: "lagenhet", title: "Stadsvåningen", text: "Lägenhet i stan: portkod, våning, tvättstuga, buss och tåg, frukost i närheten och husets regler." },
    ],
    open: "Öppna demon",
    contactTitle: "Vill du ha Stay i ditt boende?",
    contactText: "Berätta om ditt boende, så återkommer vi skriftligt med ett förslag.",
    contactCta: "Kontakta oss",
    mockArrival: "Nyckelboxen",
    mockAsk: "Fråga vad som helst…",
  },
  en: {
    meta: "MambyLy Stay – a digital concierge for hosts | MambyLy Tools",
    metaDesc: "A sign with NFC and QR in your rental: guests get the house information and answers to their questions in their own language, around the clock.",
    kicker: "MambyLy Stay",
    title: "Guests get answers. You get peace.",
    lead: "A sign with an NFC tag and QR code in your rental. Guests tap or scan and get everything about the house – the key, Wi-Fi, the sauna, the recycling – and answers to their questions in their own language, around the clock.",
    demoStuga: "See the cottage demo",
    demoCity: "See the flat demo",
    talk: "Talk to us",
    problemTitle: "The same questions, over and over",
    problemText: "Where's the key? What's the password? How does the sauna work? As a host you answer the same things for every new guest – often late in the evening. With Stay the answer is already in the house.",
    questions: ["What's the Wi-Fi password?", "Where do I find the key?", "How do I heat the sauna?", "When is check-out?", "Where does the recycling go?"],
    stepsKicker: "How it works",
    stepsTitle: "Three steps to fewer questions",
    steps: [
      { title: "We write the house manual", text: "You tell us about the place; we turn it into a clear guide and answers to common questions – in Swedish, English and German." },
      { title: "The sign goes up", text: "You get a sign with an NFC tag and QR code for the door or the kitchen. No app needed." },
      { title: "Guests get answers", text: "Guests tap with their phone and get the house information and a chat that answers in their language." },
    ],
    guestKicker: "What the guest sees",
    guestTitle: "Everything that matters, in one hand",
    guestText: "The guest page opens straight in the phone's browser, in the phone's language.",
    guestList: [
      { icon: "key", text: "The arrival card: the key box code, Wi-Fi with a copy button, check-in and check-out times." },
      { icon: "wifi", text: "All about the house: sauna, fireplace, recycling, parking and house rules – short and clear." },
      { icon: "chat", text: "A chat that answers from the house information, in Swedish, English and German." },
      { icon: "phone", text: "If it can't find the answer, the guest can write to you directly." },
    ],
    packagingAlt: "The Stay sign with NFC tag and QR code in its packaging",
    packagingNote: "The sign with NFC and QR, as it comes in the box.",
    whoKicker: "Who it's for",
    whoTitle: "For hosts",
    who: [
      { title: "Cottages and holiday homes", text: "Sauna, fireplace, jetty and recycling explained once – for every guest." },
      { title: "City flats", text: "Door code, laundry room, public transport and house rules, in the guest's language." },
      { title: "Several properties", text: "The same calm in every house, and a lower price per property." },
    ],
    whoNote: "Perfect if you rent out on Airbnb or Booking – or directly to your guests.",
    priceKicker: "Prices",
    priceTitle: "One monthly fee per property",
    demosKicker: "Demo",
    demosTitle: "Try it as a guest",
    demos: [
      { id: "stuga", title: "Sjöstugan vid Roxen", text: "A lakeside cottage: sauna, fireplace and firewood, swimming and canoe, recycling and parking." },
      { id: "lagenhet", title: "Stadsvåningen", text: "A city flat: door code, floor, laundry room, bus and train, breakfast nearby and house rules." },
    ],
    open: "Open the demo",
    contactTitle: "Want Stay in your rental?",
    contactText: "Tell us about your place and we'll get back to you in writing with a proposal.",
    contactCta: "Contact us",
    mockArrival: "Key box",
    mockAsk: "Ask anything…",
  },
};

const GUEST_ICON = { key: <LuKey aria-hidden />, wifi: <LuWifi aria-hidden />, chat: <LuMessageCircle aria-hidden />, phone: <LuSmartphone aria-hidden /> };

/** A phone with the guest page on it: the cottage, the arrival card and the question bar. */
const PhoneMock: React.FC<{ arrival: string; ask: string }> = ({ arrival, ask }) => (
  <div className="tl-phone" aria-hidden="true">
    <div className="tl-phone__screen">
      <div className="tl-phone__top">
        <Cottage />
        <b>Sjöstugan vid Roxen</b>
        <span>Roxen, Linköping</span>
      </div>
      <div className="tl-phone__card">
        <span>
          <LuKey /> {arrival}
        </span>
        <strong>4812</strong>
        <span className="tl-phone__wifi">
          <LuWifi /> Sjostugan <i>
            <LuCopy />
          </i>
        </span>
      </div>
      <div className="tl-phone__rows">
        <i />
        <i />
        <i />
      </div>
      <div className="tl-phone__ask">
        <LuMessageCircle /> {ask}
      </div>
    </div>
  </div>
);

/** /tools/stay: what Stay does, how, for whom, what it costs, the demos and the way to start. */
const StayLanding: React.FC = () => {
  const t = useCopy();
  const c = COPY[t.lang];
  const demo = (id: "stuga" | "lagenhet") => `${STAY_DEMO_BASE}/${id}`;
  return (
    <ToolsChrome id="toolsStay" here="Stay" head={<ScreenHead lang={t.lang} title={c.meta} description={c.metaDesc} screen="toolsStay" />}>

      <section className="tl-stay-hero tl-dark">
        <div className="tl-stay-hero__text">
          <p className="tl-kicker">{c.kicker}</p>
          <h1 data-focus>{c.title}</h1>
          <p className="tl-lead">{c.lead}</p>
          <div className="tl-actions">
            <Link to={demo("stuga")} className="tl-btn tl-btn--solid">
              {c.demoStuga} <LuArrowRight aria-hidden />
            </Link>
            <Link to={demo("lagenhet")} className="tl-btn">
              {c.demoCity} <LuArrowRight aria-hidden />
            </Link>
          </div>
          <p className="tl-tags" aria-hidden="true">
            <span>
              <LuNfc /> NFC
            </span>
            <span>
              <LuQrCode /> QR
            </span>
            <span>SV · EN · DE</span>
          </p>
        </div>
        <PhoneMock arrival={c.mockArrival} ask={c.mockAsk} />
      </section>

      <section className="tl-band">
        <div className="tl-band__text">
          <h2>{c.problemTitle}</h2>
          <p>{c.problemText}</p>
        </div>
        <ul className="tl-bubbles" aria-hidden="true">
          {c.questions.map((q, i) => (
            <li key={q} style={{ "--i": i } as React.CSSProperties}>
              {q}
            </li>
          ))}
        </ul>
      </section>

      <section className="tl-section">
        <p className="tl-kicker">{c.stepsKicker}</p>
        <h2>{c.stepsTitle}</h2>
        <ol className="tl-steps">
          {c.steps.map((s, i) => (
            <li key={s.title}>
              <span className="tl-steps__n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="tl-section tl-guest">
        <div>
          <p className="tl-kicker">{c.guestKicker}</p>
          <h2>{c.guestTitle}</h2>
          <p className="tl-lead">{c.guestText}</p>
          <ul className="tl-guest__list">
            {c.guestList.map((g) => (
              <li key={g.text}>
                <span>{GUEST_ICON[g.icon]}</span>
                {g.text}
              </li>
            ))}
          </ul>
        </div>
        <figure className="tl-pack">
          {/* placeholder picture of the physical kit: replace public/tools/stay-packaging.jpg */}
          <img src="/tools/stay-packaging.jpg" alt={c.packagingAlt} width={1200} height={1200} loading="lazy" decoding="async" />
          <figcaption>{c.packagingNote}</figcaption>
        </figure>
      </section>

      <section className="tl-section">
        <p className="tl-kicker">{c.whoKicker}</p>
        <h2>{c.whoTitle}</h2>
        <ul className="tl-who">
          {c.who.map((w) => (
            <li key={w.title}>
              <h3>{w.title}</h3>
              <p>{w.text}</p>
            </li>
          ))}
        </ul>
        <p className="tl-note">{c.whoNote}</p>
      </section>

      <section className="tl-section">
        <p className="tl-kicker">{c.priceKicker}</p>
        <h2>{c.priceTitle}</h2>
        <ul className="tl-prices">
          {STAY_PRICING.map((p) => (
            <li key={p.id} className={p.featured ? "is-featured" : undefined}>
              <h3>{p.name[t.lang]}</h3>
              <p className="tl-prices__price">
                <strong>{p.price[t.lang]}</strong> <span>{p.unit[t.lang]}</span>
              </p>
              <p>{p.note[t.lang]}</p>
            </li>
          ))}
        </ul>
        <p className="tl-note">{STAY_PRICING_NOTE[t.lang]}</p>
      </section>

      <section className="tl-section">
        <p className="tl-kicker">{c.demosKicker}</p>
        <h2>{c.demosTitle}</h2>
        <ul className="tl-demos">
          {c.demos.map((d) => (
            <li key={d.id}>
              <Link to={demo(d.id)} className={`tl-demo tl-demo--${d.id}`}>
                <span className="tl-demo__art" aria-hidden="true">
                  {d.id === "stuga" ? <Cottage /> : <TownHouse />}
                </span>
                <span className="tl-demo__title">{d.title}</span>
                <span className="tl-demo__text">{d.text}</span>
                <span className="tl-demo__go">
                  {c.open} <LuArrowRight aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="tl-cta tl-dark">
        <h2>{c.contactTitle}</h2>
        <p>{c.contactText}</p>
        <div className="tl-actions">
          <Link to={PATHS.contact[t.lang]} className="tl-btn tl-btn--solid">
            {c.contactCta} <LuArrowRight aria-hidden />
          </Link>
          <a href={`mailto:${publicContact.email}?subject=MambyLy%20Stay`} className="tl-btn">
            {publicContact.email}
          </a>
        </div>
      </section>
    </ToolsChrome>
  );
};

export default StayLanding;
