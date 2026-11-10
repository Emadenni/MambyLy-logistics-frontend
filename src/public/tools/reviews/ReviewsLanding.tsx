import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuNfc, LuQrCode, LuRotateCcw, LuShieldCheck, LuSmartphone, LuStar } from "react-icons/lu";
import { useCopy } from "../../experience/i18n";
import { ScreenHead } from "../../experience/Screen";
import { PATHS, type Lang } from "../../experience/routes";
import { publicContact } from "../../contact";
import { TOOLS } from "../catalogue";
import ToolMark from "../ToolMark";
import ToolsChrome from "../ToolsChrome";

const COPY: Record<Lang, {
  meta: string;
  metaDesc: string;
  name: string;
  title: string;
  lead: string;
  talk: string;
  hint: string;
  problemTitle: string;
  problemText: string;
  thoughts: string[];
  stepsKicker: string;
  stepsTitle: string;
  steps: { title: string; text: string }[];
  seesKicker: string;
  seesTitle: string;
  seesText: string;
  sees: { icon: "star" | "nfc" | "phone" | "fair"; text: string }[];
  whoKicker: string;
  whoTitle: string;
  who: { title: string; text: string }[];
  whoNote: string;
  contactTitle: string;
  contactText: string;
  contactCta: string;
  mock: {
    place: string;
    town: string;
    thanks: string;
    ask: string;
    button: string;
    formTitle: string;
    formHint: string;
    formPost: string;
    demoNote: string;
    again: string;
  };
}> = {
  sv: {
    meta: "MambyLy Reviews – fler recensioner på Google | MambyLy Tools",
    metaDesc: "En skylt med NFC och QR vid kassan: kunden blippar och landar direkt i ditt recensionsformulär på Google.",
    name: "MambyLy Reviews",
    title: "Fler recensioner, utan att du behöver fråga.",
    lead: "En skylt med NFC-tagg och QR-kod vid kassan. Kunden blippar eller skannar och landar direkt i ditt recensionsformulär på Google – ingen app, inget letande.",
    talk: "Prata med oss",
    hint: "Prova själv: tryck på knappen i telefonen.",
    problemTitle: "Nöjda kunder berättar sällan",
    problemText: "Du gör ett bra jobb varje dag, men recensionerna uteblir. Kunden går, och du hinner inte be om en recension vid varje kassa. Med Reviews finns vägen dit redan på disken.",
    thoughts: ["Det här var riktigt bra.", "Det borde fler få veta.", "Jag skriver nog något sen.", "…och så glömmer jag det."],
    stepsKicker: "Så funkar det",
    stepsTitle: "Tre steg till fler recensioner",
    steps: [
      { title: "Du ger oss din Google-länk", text: "Vi behöver länken till ditt recensionsformulär. Du behöver en företagsprofil på Google, och vi hjälper dig att hitta länken." },
      { title: "Skylten kommer på plats", text: "En skylt med NFC-tagg och QR-kod att ställa vid kassan, på bordet eller i ett skyltfönster. Ingen app behövs." },
      { title: "Kunden blippar och skriver", text: "Telefonen öppnar ett kort tack med ditt namn och en knapp rakt in i formuläret. Resten gör kunden själv." },
    ],
    seesKicker: "Vad kunden ser",
    seesTitle: "Ett tack, och en väg rakt dit",
    seesText: "Sidan öppnas direkt i telefonens webbläsare, på telefonens språk.",
    sees: [
      { icon: "nfc", text: "Blippa med NFC eller skanna QR-koden. Det funkar på alla moderna telefoner." },
      { icon: "star", text: "Ett kort tack med ditt företags namn och en knapp som tar kunden rakt till ditt formulär på Google." },
      { icon: "phone", text: "Inga konton att skapa hos oss och ingen app att ladda ner." },
      { icon: "fair", text: "Alla kunder leds till samma formulär. Vi väljer inte vem som får frågan, och kundens ord är alltid kundens egna." },
    ],
    whoKicker: "För vem",
    whoTitle: "För dig med en disk, ett bord eller en dörr",
    who: [
      { title: "Butiker", text: "Vid kassan eller på kvittot: en lugn påminnelse när kunden ändå står där." },
      { title: "Kaféer och restauranger", text: "På bordet eller vid disken, när gästen sitter med kaffet." },
      { title: "Salonger och verkstäder", text: "När jobbet är klart och kunden är nöjd, medan det är färskt." },
    ],
    whoNote: "Fungerar för alla verksamheter som har en företagsprofil på Google.",
    contactTitle: "Vill du ha Reviews i din verksamhet?",
    contactText: "Berätta vad du driver, så återkommer vi skriftligt med ett förslag.",
    contactCta: "Kontakta oss",
    mock: {
      place: "Kafé Månskäret",
      town: "Exempelfirma för demon",
      thanks: "Tack för besöket!",
      ask: "Hjälp andra hitta hit. En recension tar en minut.",
      button: "Skriv en recension",
      formTitle: "Din recension",
      formHint: "Berätta vad du tyckte…",
      formPost: "Publicera",
      demoNote: "Demo: här öppnas ditt eget formulär på Google.",
      again: "Börja om",
    },
  },
  en: {
    meta: "MambyLy Reviews – more Google reviews | MambyLy Tools",
    metaDesc: "A sign with NFC and QR at the counter: the customer taps and lands straight in your Google review form.",
    name: "MambyLy Reviews",
    title: "More reviews, without you having to ask.",
    lead: "A sign with an NFC tag and QR code at the counter. The customer taps or scans and lands straight in your Google review form – no app, no searching.",
    talk: "Talk to us",
    hint: "Try it: tap the button in the phone.",
    problemTitle: "Happy customers rarely say so",
    problemText: "You do a good job every day, but the reviews don't come. The customer leaves, and you can't ask at every till. With Reviews the way there is already on the counter.",
    thoughts: ["That was really good.", "More people should know.", "I'll write something later.", "…and then I forget."],
    stepsKicker: "How it works",
    stepsTitle: "Three steps to more reviews",
    steps: [
      { title: "You give us your Google link", text: "We need the link to your review form. You need a business profile on Google, and we help you find the link." },
      { title: "The sign goes up", text: "A sign with an NFC tag and QR code for the counter, the table or the shop window. No app needed." },
      { title: "The customer taps and writes", text: "The phone opens a short thank-you with your name and a button straight into the form. The customer does the rest." },
    ],
    seesKicker: "What the customer sees",
    seesTitle: "A thank-you, and the way straight there",
    seesText: "The page opens straight in the phone's browser, in the phone's language.",
    sees: [
      { icon: "nfc", text: "Tap with NFC or scan the QR code. It works on every modern phone." },
      { icon: "star", text: "A short thank-you with your business name and a button that takes the customer straight to your form on Google." },
      { icon: "phone", text: "No account to create with us and no app to download." },
      { icon: "fair", text: "Every customer is sent to the same form. We don't choose who gets asked, and the customer's words are always their own." },
    ],
    whoKicker: "Who it's for",
    whoTitle: "For anyone with a counter, a table or a door",
    who: [
      { title: "Shops", text: "At the till or on the receipt: a calm reminder when the customer is standing there anyway." },
      { title: "Cafés and restaurants", text: "On the table or at the counter, while the guest sits with their coffee." },
      { title: "Salons and workshops", text: "When the job is done and the customer is pleased, while it's fresh." },
    ],
    whoNote: "Works for any business that has a business profile on Google.",
    contactTitle: "Want Reviews in your business?",
    contactText: "Tell us what you run and we'll get back to you in writing with a proposal.",
    contactCta: "Contact us",
    mock: {
      place: "Kafé Månskäret",
      town: "A made-up business for the demo",
      thanks: "Thanks for visiting!",
      ask: "Help others find us. A review takes a minute.",
      button: "Write a review",
      formTitle: "Your review",
      formHint: "Tell us what you thought…",
      formPost: "Post",
      demoNote: "Demo: this is where your own Google form opens.",
      again: "Start over",
    },
  },
};

const SEES_ICON = { star: <LuStar aria-hidden />, nfc: <LuNfc aria-hidden />, phone: <LuSmartphone aria-hidden />, fair: <LuShieldCheck aria-hidden /> };

const Stars: React.FC<{ filled?: boolean }> = ({ filled }) => (
  <span className={filled ? "tl-rv__stars is-filled" : "tl-rv__stars"} aria-hidden="true">
    {[0, 1, 2, 3, 4].map((i) => (
      <LuStar key={i} />
    ))}
  </span>
);

/** A phone you can tap: the customer's thank-you page, then (in the demo) where the Google form opens. */
const PhoneDemo: React.FC<{ m: (typeof COPY)["sv"]["mock"] }> = ({ m }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="tl-phone tl-rv-phone">
      <div className="tl-phone__screen">
        <div className="tl-phone__top tl-rv-top">
          <LuStar aria-hidden className="tl-rv-top__star" />
          <b>{m.place}</b>
          <span>{m.town}</span>
        </div>
        {open ? (
          <div className="tl-rv-form" key="form">
            <p className="tl-rv-form__title">{m.formTitle}</p>
            <Stars filled />
            <p className="tl-rv-form__field">{m.formHint}</p>
            <p className="tl-rv-form__post" aria-hidden="true">
              {m.formPost}
            </p>
            <p className="tl-rv-form__note">{m.demoNote}</p>
            <button type="button" className="tl-rv-again" onClick={() => setOpen(false)}>
              <LuRotateCcw aria-hidden /> {m.again}
            </button>
          </div>
        ) : (
          <div className="tl-phone__card tl-rv-card" key="thanks">
            <strong>{m.thanks}</strong>
            <p>{m.ask}</p>
            <Stars />
            <button type="button" className="tl-rv-go" onClick={() => setOpen(true)}>
              {m.button} <LuArrowRight aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

/** /tools/reviews: what Reviews does, how, for whom, a phone to try, and the way to start. */
const ReviewsLanding: React.FC = () => {
  const t = useCopy();
  const c = COPY[t.lang];
  const accent = TOOLS.find((tool) => tool.id === "reviews")?.accent?.dark;
  return (
    <ToolsChrome id="toolsReviews" here="Reviews" head={<ScreenHead lang={t.lang} title={c.meta} description={c.metaDesc} screen="toolsReviews" />}>
      <section className="tl-stay-hero tl-dark">
        <div className="tl-stay-hero__text">
          <div className="tl-rv-logo">
            <ToolMark name="Reviews" light accent={accent} />
            <span className="tl-vh">{c.name}</span>
          </div>
          <h1 data-focus>{c.title}</h1>
          <p className="tl-lead">{c.lead}</p>
          <div className="tl-actions">
            <Link to={PATHS.contact[t.lang]} className="tl-btn tl-btn--solid">
              {c.talk} <LuArrowRight aria-hidden />
            </Link>
          </div>
          <p className="tl-tags" aria-hidden="true">
            <span>
              <LuNfc /> NFC
            </span>
            <span>
              <LuQrCode /> QR
            </span>
            <span>Google</span>
          </p>
        </div>
        <div className="tl-rv-stage">
          <PhoneDemo m={c.mock} />
          <p className="tl-rv-hint">{c.hint}</p>
        </div>
      </section>

      <section className="tl-band">
        <div className="tl-band__text">
          <h2>{c.problemTitle}</h2>
          <p>{c.problemText}</p>
        </div>
        <ul className="tl-bubbles" aria-hidden="true">
          {c.thoughts.map((q, i) => (
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

      <section className="tl-section tl-rv-sees">
        <p className="tl-kicker">{c.seesKicker}</p>
        <h2>{c.seesTitle}</h2>
        <p className="tl-lead">{c.seesText}</p>
        <ul className="tl-guest__list">
          {c.sees.map((g) => (
            <li key={g.text}>
              <span>{SEES_ICON[g.icon]}</span>
              {g.text}
            </li>
          ))}
        </ul>
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

      <section className="tl-cta tl-dark">
        <h2>{c.contactTitle}</h2>
        <p>{c.contactText}</p>
        <div className="tl-actions">
          <Link to={PATHS.contact[t.lang]} className="tl-btn tl-btn--solid">
            {c.contactCta} <LuArrowRight aria-hidden />
          </Link>
          <a href={`mailto:${publicContact.email}?subject=MambyLy%20Reviews`} className="tl-btn">
            {publicContact.email}
          </a>
        </div>
      </section>
    </ToolsChrome>
  );
};

export default ReviewsLanding;
