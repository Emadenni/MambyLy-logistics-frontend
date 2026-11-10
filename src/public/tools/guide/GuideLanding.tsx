import React from "react";
import { Link } from "react-router-dom";
import { LuArrowRight, LuFootprints, LuGlobe, LuHeadphones, LuNfc, LuQrCode, LuSmartphone, LuVolume2 } from "react-icons/lu";
import { useCopy } from "../../experience/i18n";
import { ScreenHead } from "../../experience/Screen";
import { GUIDE_DEMO_BASE, PATHS, type Lang } from "../../experience/routes";
import { publicContact } from "../../contact";
import { pick } from "../shared/engine";
import { TOOLS } from "../catalogue";
import ToolMark from "../ToolMark";
import ToolsChrome from "../ToolsChrome";
import { GUIDE_DEMO } from "./data";
import PointArt from "./PointArt";
import { GUIDE_PRICING, GUIDE_PRICING_NOTE } from "./pricing";

const COPY: Record<Lang, {
  meta: string;
  metaDesc: string;
  name: string;
  title: string;
  lead: string;
  demo: string;
  talk: string;
  hint: string;
  problemTitle: string;
  problemText: string;
  questions: string[];
  stepsKicker: string;
  stepsTitle: string;
  steps: { title: string; text: string }[];
  seesKicker: string;
  seesTitle: string;
  seesText: string;
  sees: { icon: "nfc" | "media" | "globe" | "voice" | "walk" | "phone"; text: string }[];
  signAlt: string;
  signNote: string;
  whoKicker: string;
  whoTitle: string;
  who: { title: string; text: string }[];
  whoNote: string;
  priceKicker: string;
  priceTitle: string;
  demoKicker: string;
  demoTitle: string;
  demoCard: { title: string; text: string };
  open: string;
  contactTitle: string;
  contactText: string;
  contactCta: string;
  mock: { place: string; count: string; name: string; listen: string };
}> = {
  sv: {
    meta: "MambyLy Guide – ljudguide med NFC och QR | MambyLy Tools",
    metaDesc: "En skylt vid varje punkt: besökaren blippar och får text, bild och ljud på sitt eget språk. Ingen app, ingen uthyrd ljudguide.",
    name: "MambyLy Guide",
    title: "Låt platsen berätta, på besökarens språk.",
    lead: "En liten skylt med NFC-tagg och QR-kod vid varje punkt. Besökaren blippar eller skannar och får text, bild och ljud på sitt eget språk. Ingen app att ladda ner, ingen ljudguide att hyra ut.",
    demo: "Prova demon",
    talk: "Prata med oss",
    hint: "Så ser besökaren det: en sida per punkt.",
    problemTitle: "Platsen har en berättelse. Besökaren hittar den inte alltid.",
    problemText: "En skylt med text räcker sällan, och språket är ofta bara ett. En egen app eller uthyrda ljudguider kostar mer än en liten förening kan lägga. Med Guide räcker en skylt vid varje punkt.",
    questions: ["Vad är det här för byggnad?", "Finns det något på engelska?", "Hur gammalt är det?", "Var går stigen vidare?"],
    stepsKicker: "Så funkar det",
    stepsTitle: "Tre steg till en guide",
    steps: [
      { title: "Ni berättar, vi skriver ihop", text: "Ni skickar era anteckningar och foton. Vi gör texterna korta och tydliga och översätter dem till engelska och tyska. Egna inspelningar lägger vi in som ljud." },
      { title: "Skyltarna sätts upp", text: "Vi levererar en skylt med NFC-tagg och QR-kod till varje punkt, med numret på rundturen. Sätt dem vid väggen, stolpen eller dörren." },
      { title: "Besökaren blippar och lyssnar", text: "Telefonen öppnar punktens sida direkt, med text, bild och en knapp för att lyssna. Ingen app behövs." },
    ],
    seesKicker: "Vad besökaren ser",
    seesTitle: "En sida per punkt",
    seesText: "Sidan öppnas direkt i telefonens webbläsare, på telefonens språk.",
    sees: [
      { icon: "nfc", text: "Blippa med NFC eller skanna QR-koden. Det funkar på moderna telefoner." },
      { icon: "media", text: "Punktens namn, ett kort stycke text och en bild. Numret visar var på rundturen man är." },
      { icon: "globe", text: "Svenska, engelska eller tyska, vald automatiskt efter telefonen, med en knapp för att byta." },
      { icon: "voice", text: "En knapp för att lyssna: telefonen läser upp texten, eller så spelas er egen inspelade röst." },
      { icon: "walk", text: "Nästa punkt och en lista över rundturen, där besökta punkter bockas av. Det sparas bara i besökarens telefon." },
    ],
    signAlt: "Platshållare: skylten vid en punkt med NFC-tagg och QR-kod",
    signNote: "Skylten vid en punkt. Bilden är en platshållare.",
    whoKicker: "För vem",
    whoTitle: "För platser med mycket att berätta och litet att lägga",
    who: [
      { title: "Hembygdsgårdar och små museer", text: "Byggnaderna, redskapen och människorna, punkt för punkt." },
      { title: "Kyrkor och kulturmiljöer", text: "Historien på plats, för besökare som inte läser svenska." },
      { title: "Byar och vandringsleder", text: "En stig med stopp där något hänt. Ingen elektronik utomhus, bara en skylt." },
    ],
    whoNote: "Ni behöver ingen egen app eller teknik. Ni behöver era berättelser.",
    priceKicker: "Priser",
    priceTitle: "En årsavgift per plats",
    demoKicker: "Demo",
    demoTitle: "Prova som besökare",
    demoCard: { title: "Exempelby hembygdsgård", text: "En påhittad gård i Östergötland med sju punkter: huvudbyggnaden, smedjan, ladugården, brunnen, väderkvarnen, skolsalen och kyrkstigen." },
    open: "Öppna demon",
    contactTitle: "Vill ni ha Guide på er plats?",
    contactText: "Berätta om platsen och hur många punkter ni har, så återkommer vi skriftligt med ett förslag.",
    contactCta: "Kontakta oss",
    mock: { place: "Exempelby hembygdsgård", count: "Punkt 2 av 7", name: "Smedjan", listen: "Lyssna" },
  },
  en: {
    meta: "MambyLy Guide – an audio guide with NFC and QR | MambyLy Tools",
    metaDesc: "A sign at every point: the visitor taps and gets text, pictures and audio in their own language. No app, no audio guide to rent.",
    name: "MambyLy Guide",
    title: "Let the place tell its story, in the visitor's language.",
    lead: "A small sign with an NFC tag and QR code at every point. The visitor taps or scans and gets text, pictures and audio in their own language. No app to download, no audio guide to rent out.",
    demo: "Try the demo",
    talk: "Talk to us",
    hint: "This is what the visitor sees: one page per point.",
    problemTitle: "The place has a story. Visitors don't always find it.",
    problemText: "A sign with text is rarely enough, and it is often in one language only. An app of your own or rented audio guides cost more than a small society can spend. With Guide, one sign at each point is enough.",
    questions: ["What building is this?", "Is there anything in English?", "How old is it?", "Where does the path go next?"],
    stepsKicker: "How it works",
    stepsTitle: "Three steps to a guide",
    steps: [
      { title: "You tell us, we write it up", text: "You send your notes and photos. We make the texts short and clear and translate them into English and German. Recordings of your own go in as audio." },
      { title: "The signs go up", text: "We deliver a sign with an NFC tag and QR code for every point, with its number on the walk. Put them on the wall, the post or the door." },
      { title: "The visitor taps and listens", text: "The phone opens the point's page straight away, with text, a picture and a button to listen. No app needed." },
    ],
    seesKicker: "What the visitor sees",
    seesTitle: "One page per point",
    seesText: "The page opens straight in the phone's browser, in the phone's language.",
    sees: [
      { icon: "nfc", text: "Tap with NFC or scan the QR code. It works on modern phones." },
      { icon: "media", text: "The point's name, a short text and a picture. The number shows where on the walk you are." },
      { icon: "globe", text: "Swedish, English or German, picked automatically from the phone, with a button to switch." },
      { icon: "voice", text: "A button to listen: the phone reads the text aloud, or your own recorded voice plays." },
      { icon: "walk", text: "The next point and a list of the walk, with visited points ticked off. This is kept only on the visitor's phone." },
    ],
    signAlt: "Placeholder: the sign at a point with an NFC tag and QR code",
    signNote: "The sign at a point. The picture is a placeholder.",
    whoKicker: "Who it's for",
    whoTitle: "For places with a lot to tell and little to spend",
    who: [
      { title: "Heritage farms and small museums", text: "The buildings, the tools and the people, point by point." },
      { title: "Churches and historic sites", text: "The history on the spot, for visitors who don't read Swedish." },
      { title: "Villages and trails", text: "A path with stops where something happened. No electronics outdoors, just a sign." },
    ],
    whoNote: "You don't need an app or any technology of your own. You need your stories.",
    priceKicker: "Prices",
    priceTitle: "One annual fee per place",
    demoKicker: "Demo",
    demoTitle: "Try it as a visitor",
    demoCard: { title: "Exempelby heritage farm", text: "A made-up farm in Östergötland with seven points: the main house, the smithy, the barn, the well, the windmill, the schoolroom and the church path." },
    open: "Open the demo",
    contactTitle: "Want Guide at your place?",
    contactText: "Tell us about the place and how many points you have, and we'll get back to you in writing with a proposal.",
    contactCta: "Contact us",
    mock: { place: "Exempelby heritage farm", count: "Point 2 of 7", name: "The smithy", listen: "Listen" },
  },
};

const SEES_ICON = {
  nfc: <LuNfc aria-hidden />,
  media: <LuSmartphone aria-hidden />,
  globe: <LuGlobe aria-hidden />,
  voice: <LuVolume2 aria-hidden />,
  walk: <LuFootprints aria-hidden />,
  phone: <LuSmartphone aria-hidden />,
};

/** A phone with a point on it: the picture, the number on the walk, the name and the Listen button. */
const PhoneMock: React.FC<{ m: (typeof COPY)["sv"]["mock"] }> = ({ m }) => (
  <div className="tl-phone tl-gd-phone" aria-hidden="true">
    <div className="tl-phone__screen">
      <div className="tl-gd-phone__bar">{m.place}</div>
      <PointArt art="forge" label="" />
      <div className="tl-gd-phone__body">
        <span>{m.count}</span>
        <b>{m.name}</b>
        <i />
        <i />
        <i className="is-short" />
        <p>
          <LuVolume2 /> {m.listen}
        </p>
      </div>
    </div>
  </div>
);

/** /tools/guide: what Guide does, how, for whom, what it costs, the demo and the way to start. */
const GuideLanding: React.FC = () => {
  const t = useCopy();
  const c = COPY[t.lang];
  const accent = TOOLS.find((tool) => tool.id === "guide")?.accent?.dark;
  const demo = `${GUIDE_DEMO_BASE}/${GUIDE_DEMO}`;
  return (
    <ToolsChrome id="toolsGuide" here="Guide" head={<ScreenHead lang={t.lang} title={c.meta} description={c.metaDesc} screen="toolsGuide" />}>
      <section className="tl-stay-hero tl-dark">
        <div className="tl-stay-hero__text">
          <div className="tl-rv-logo">
            <ToolMark name="Guide" light accent={accent} />
            <span className="tl-vh">{c.name}</span>
          </div>
          <h1 data-focus>{c.title}</h1>
          <p className="tl-lead">{c.lead}</p>
          <div className="tl-actions">
            <Link to={demo} className="tl-btn tl-btn--solid">
              {c.demo} <LuArrowRight aria-hidden />
            </Link>
            <Link to={PATHS.contact[t.lang]} className="tl-btn">
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
            <span>SV · EN · DE</span>
          </p>
        </div>
        <div className="tl-rv-stage">
          <PhoneMock m={c.mock} />
          <p className="tl-rv-hint">{c.hint}</p>
        </div>
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
        </div>
        <figure className="tl-pack">
          {/* placeholder picture of a sign at a point: replace public/tools/guide-skylt.jpg (4:3) */}
          <img src="/tools/guide-skylt.jpg" alt={c.signAlt} width={1200} height={900} loading="lazy" decoding="async" />
          <figcaption>{c.signNote}</figcaption>
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
          {GUIDE_PRICING.map((p) => (
            <li key={p.id} className={p.featured ? "is-featured" : undefined}>
              <h3>{pick(p.name, t.lang)}</h3>
              <p className="tl-prices__price">
                <strong>{pick(p.price, t.lang)}</strong> <span>{pick(p.unit, t.lang)}</span>
              </p>
              <p>{pick(p.note, t.lang)}</p>
            </li>
          ))}
        </ul>
        <p className="tl-note">{pick(GUIDE_PRICING_NOTE, t.lang)}</p>
      </section>

      <section className="tl-section">
        <p className="tl-kicker">{c.demoKicker}</p>
        <h2>{c.demoTitle}</h2>
        <ul className="tl-demos tl-demos--one">
          <li>
            <Link to={demo} className="tl-demo">
              <span className="tl-demo__art tl-gd-demo" aria-hidden="true">
                <PointArt art="house" label="" />
              </span>
              <span className="tl-demo__title">{c.demoCard.title}</span>
              <span className="tl-demo__text">{c.demoCard.text}</span>
              <span className="tl-demo__go">
                {c.open} <LuArrowRight aria-hidden />
              </span>
            </Link>
          </li>
        </ul>
      </section>

      <section className="tl-cta tl-dark">
        <h2>{c.contactTitle}</h2>
        <p>{c.contactText}</p>
        <div className="tl-actions">
          <Link to={PATHS.contact[t.lang]} className="tl-btn tl-btn--solid">
            {c.contactCta} <LuArrowRight aria-hidden />
          </Link>
          <a href={`mailto:${publicContact.email}?subject=MambyLy%20Guide`} className="tl-btn">
            {publicContact.email}
          </a>
        </div>
      </section>
    </ToolsChrome>
  );
};

export default GuideLanding;
