import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useCopy } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote, goTo } from "./ConceptChrome";

type Service = "interior" | "exterior" | "wallpaper";
type Panel = "work" | "how" | "about" | "quote";

const copy = {
  sv: {
    wordmark: "Måleri",
    contact: "Kontakt",
    title: ["Samma rum.", "Ny känsla."],
    before: "Före",
    after: "Efter",
    compare: "Jämför före och efter",
    showBefore: "Visa före",
    showAfter: "Visa efter",
    simulation: "Designsimulering: samma foto, bara väggarna är omfärgade digitalt.",
    services: { interior: "Invändigt", exterior: "Fasad", wallpaper: "Tapetsering" } as Record<Service, string>,
    servicesLabel: "Tjänster",
    serviceText: {
      interior: "Vi målar väggar, tak och snickerier.",
      exterior: "Vi tvättar, skrapar och målar trä- och putsfasader.",
      wallpaper: "Vi tar ned gammal tapet, spacklar och sätter upp ny.",
    } as Record<Service, string>,
    serviceSteps: {
      exterior: ["Besiktning av fasaden", "Tvätt och skrapning", "Grundning där det behövs", "Två strykningar"],
      wallpaper: ["Nedtagning och spackling", "Grundning av väggen", "Uppsättning med rak mönsterpassning"],
    } as Partial<Record<Service, string[]>>,
    noPhoto: "Inga bilder i demon för den här tjänsten – på en riktig sajt visas riktiga jobb här.",
    cta: "Berätta vad du vill måla",
    more: "Se fler arbeten",
    how: "Så arbetar vi",
    about: "Om oss",
    workTitle: "Fler arbeten",
    work: [
      { title: "Kök, ljusgrå snickerier", text: "Exempeltext – påhittat uppdrag." },
      { title: "Trapphus, två kulörer", text: "Exempeltext – påhittat uppdrag." },
      { title: "Sommarhus, panel och knutar", text: "Exempeltext – påhittat uppdrag." },
    ],
    howTitle: "Så arbetar vi",
    howSteps: ["Vi tittar på rummet och pratar kulör.", "Du får en skriftlig offert.", "Vi skyddar, förbereder och målar.", "Slutbesiktning tillsammans."],
    aboutTitle: "Om oss",
    aboutText: "Ett påhittat måleri för den här demon. Erfarenhet, certifieringar och område skulle stå här på en riktig sajt.",
    quoteTitle: "Berätta vad du vill måla",
    quoteLead: "En demo: ingen offert skapas och ingenting skickas.",
    room: "Vad gäller det?",
    rooms: ["Vardagsrum", "Sovrum", "Kök", "Fasad", "Annat"],
    size: "Ungefärlig yta (m²)",
    describe: "Beskriv kort",
    needText: "Skriv några ord om jobbet.",
    send: "Skicka",
    sent: "Det här är en demo – ingen offert har skapats och inget skickades.",
  },
  en: {
    wordmark: "Painting & decorating",
    contact: "Contact",
    title: ["Same room.", "A fresh feeling."],
    before: "Before",
    after: "After",
    compare: "Compare before and after",
    showBefore: "Show before",
    showAfter: "Show after",
    simulation: "Design simulation: the same photo, only the walls recoloured digitally.",
    services: { interior: "Interiors", exterior: "Exteriors", wallpaper: "Wallpapering" } as Record<Service, string>,
    servicesLabel: "Services",
    serviceText: {
      interior: "We paint walls, ceilings and woodwork.",
      exterior: "We wash, scrape and paint timber and rendered facades.",
      wallpaper: "We strip old wallpaper, fill and hang new.",
    } as Record<Service, string>,
    serviceSteps: {
      exterior: ["Survey of the facade", "Washing and scraping", "Priming where needed", "Two coats"],
      wallpaper: ["Stripping and filling", "Priming the wall", "Hanging with a straight pattern match"],
    } as Partial<Record<Service, string[]>>,
    noPhoto: "No pictures in the demo for this service – a real site shows real jobs here.",
    cta: "Tell us what needs painting",
    more: "View more work",
    how: "How we work",
    about: "About us",
    workTitle: "More work",
    work: [
      { title: "Kitchen, pale grey woodwork", text: "Sample text – made-up job." },
      { title: "Stairwell, two colours", text: "Sample text – made-up job." },
      { title: "Summer house, panels and corners", text: "Sample text – made-up job." },
    ],
    howTitle: "How we work",
    howSteps: ["We look at the room and talk colours.", "You get a written quote.", "We protect, prepare and paint.", "A final walk-through together."],
    aboutTitle: "About us",
    aboutText: "A made-up painting firm for this demo. Experience, certifications and area would be described here on a real site.",
    quoteTitle: "Tell us what needs painting",
    quoteLead: "A demo: no quote is created and nothing is sent.",
    room: "What is it?",
    rooms: ["Living room", "Bedroom", "Kitchen", "Facade", "Other"],
    size: "Approximate area (m²)",
    describe: "Short description",
    needText: "Write a few words about the job.",
    send: "Send",
    sent: "This is a demo – no quote was created and nothing was sent.",
  },
};

const SERVICES: Service[] = ["interior", "exterior", "wallpaper"];

/**
 * Painting & decorating: the visible result leads. A before/after comparison (a native range
 * input, so it works with drag, keyboard and screen readers, and never moves the page), services
 * that change the content below, and a quote request that stays a demo.
 * The two pictures are the same photo; "after" has only the wall surfaces recoloured, so the
 * comparison lines up exactly. It is declared as a design simulation.
 */
const Painter: React.FC = () => {
  const { lang } = useCopy();
  const c = copy[lang];
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [pos, setPos] = useState(50);
  const [service, setService] = useState<Service>("interior");
  const [panel, setPanel] = useState<Panel | null>(null);
  const [quote, setQuote] = useState({ room: 0, size: "", text: "" });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    if (panel) goTo(`${ids}-${panel}`);
  }, [panel, ids]);

  const toggle = (p: Panel) => setPanel(panel === p ? null : p);
  const nudge = (d: number) => setPos((v) => Math.min(100, Math.max(0, v + d)));

  return (
    <ConceptFrame id="painter">
      <header className="cx-pa__head">
        <span className="cx-pa__kind">{c.wordmark}</span>
        <button type="button" className="cx-pa__contact" onClick={() => toggle("quote")} aria-expanded={panel === "quote"} aria-controls={`${ids}-quote`}>
          {c.contact}
        </button>
      </header>

      <main id="cx-main-painter" className="cx-pa__main">
        <h1 data-focus>
          {c.title[0]} <em>{c.title[1]}</em>
        </h1>

        <div className="cx-pa__view">
          <AnimatePresence mode="wait" initial={false}>
            {service === "interior" ? (
              <motion.div key="cmp" className="cx-pa__cmp" style={{ "--pos": `${pos}%` } as React.CSSProperties} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.12 } }}>
                <img className="cx-pa__img" src={media("paint-before", 570)} alt="" width={570} height={1374} decoding="async" fetchPriority="high" draggable={false} />
                <img className="cx-pa__img cx-pa__img--after" src={media("paint-after", 570)} alt="" width={570} height={1374} decoding="async" draggable={false} />
                <span className="cx-pa__tag cx-pa__tag--before" aria-hidden="true">
                  {c.before}
                </span>
                <span className="cx-pa__tag cx-pa__tag--after" aria-hidden="true">
                  {c.after}
                </span>
                <span className="cx-pa__line" aria-hidden="true">
                  <span className="cx-pa__knob">
                    <FiChevronLeft />
                    <FiChevronRight />
                  </span>
                </span>
                <input
                  className="cx-pa__range"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={pos}
                  onChange={(e) => setPos(Number(e.target.value))}
                  aria-label={c.compare}
                  aria-valuetext={`${c.before} ${pos}%, ${c.after} ${100 - pos}%`}
                />
              </motion.div>
            ) : (
              <motion.div key={service} className="cx-pa__text" initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.12 } }}>
                <p className="cx-pa__big">{c.services[service]}</p>
                <ol>
                  {c.serviceSteps[service]?.map((st) => (
                    <li key={st}>{st}</li>
                  ))}
                </ol>
                <p className="cx-pa__small">{c.noPhoto}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {service === "interior" && (
          <div className="cx-pa__cmpctl">
            <button type="button" onClick={() => setPos(100)} aria-pressed={pos === 100}>
              {c.showBefore}
            </button>
            <button type="button" onClick={() => nudge(-10)} aria-label={`${c.compare} −10%`}>
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button type="button" onClick={() => nudge(10)} aria-label={`${c.compare} +10%`}>
              <FiChevronRight aria-hidden="true" />
            </button>
            <button type="button" onClick={() => setPos(0)} aria-pressed={pos === 0}>
              {c.showAfter}
            </button>
          </div>
        )}
        {service === "interior" && <p className="cx-pa__small cx-pa__sim">{c.simulation}</p>}

        <div className="cx-pa__tabs" role="group" aria-label={c.servicesLabel}>
          {SERVICES.map((sv) => (
            <button key={sv} type="button" aria-pressed={service === sv} onClick={() => setService(sv)}>
              {c.services[sv]}
            </button>
          ))}
        </div>
        <p className="cx-pa__lead" aria-live="polite">
          {c.serviceText[service]}
        </p>

        <button type="button" className="cx-pa__cta" onClick={() => toggle("quote")} aria-expanded={panel === "quote"} aria-controls={`${ids}-quote`}>
          {c.cta} <FiArrowUpRight aria-hidden="true" />
        </button>
        <button type="button" className="cx-pa__more" onClick={() => toggle("work")} aria-expanded={panel === "work"} aria-controls={`${ids}-work`}>
          {c.more} <FiArrowRight aria-hidden="true" />
        </button>

        <section id={`${ids}-quote`} className="cx-pa__panel" hidden={panel !== "quote"} aria-labelledby={`${ids}-qt`}>
          <h2 id={`${ids}-qt`}>{c.quoteTitle}</h2>
          <p className="cx-pa__small">{c.quoteLead}</p>
          {sent ? (
            <DemoNote text={c.sent} onAgain={() => (setSent(false), setTried(false), setQuote({ room: 0, size: "", text: "" }))} />
          ) : (
            <form
              noValidate
              className="cx-pa__form"
              onSubmit={(e) => {
                e.preventDefault();
                setTried(true);
                if (quote.text.trim().length > 2) setSent(true);
              }}
            >
              <label htmlFor={`${ids}-r`}>{c.room}</label>
              <select id={`${ids}-r`} value={quote.room} onChange={(e) => setQuote({ ...quote, room: Number(e.target.value) })}>
                {c.rooms.map((r, i) => (
                  <option key={r} value={i}>
                    {r}
                  </option>
                ))}
              </select>
              <label htmlFor={`${ids}-s`}>{c.size}</label>
              <input id={`${ids}-s`} inputMode="numeric" autoComplete="off" value={quote.size} onChange={(e) => setQuote({ ...quote, size: e.target.value.replace(/[^\d]/g, "").slice(0, 4) })} />
              <label htmlFor={`${ids}-x`}>{c.describe}</label>
              <textarea id={`${ids}-x`} rows={3} value={quote.text} onChange={(e) => setQuote({ ...quote, text: e.target.value })} aria-invalid={tried && quote.text.trim().length < 3 ? true : undefined} />
              <p role="alert" className="cx-pa__err">
                {tried && quote.text.trim().length < 3 ? c.needText : ""}
              </p>
              <button type="submit" className="cx-pa__cta">
                {c.send}
              </button>
            </form>
          )}
        </section>

        <section id={`${ids}-work`} className="cx-pa__panel" hidden={panel !== "work"} aria-labelledby={`${ids}-wt`}>
          <h2 id={`${ids}-wt`}>{c.workTitle}</h2>
          <ul className="cx-pa__work">
            {c.work.map((w) => (
              <li key={w.title}>
                <strong>{w.title}</strong>
                <span>{w.text}</span>
              </li>
            ))}
          </ul>
        </section>

        <section id={`${ids}-how`} className="cx-pa__panel" hidden={panel !== "how"} aria-labelledby={`${ids}-ht`}>
          <h2 id={`${ids}-ht`}>{c.howTitle}</h2>
          <ol className="cx-pa__steps">
            {c.howSteps.map((st) => (
              <li key={st}>{st}</li>
            ))}
          </ol>
        </section>

        <section id={`${ids}-about`} className="cx-pa__panel" hidden={panel !== "about"} aria-labelledby={`${ids}-abt`}>
          <h2 id={`${ids}-abt`}>{c.aboutTitle}</h2>
          <p>{c.aboutText}</p>
        </section>

        <nav className="cx-pa__links" aria-label={c.wordmark}>
          <button type="button" onClick={() => toggle("how")} aria-expanded={panel === "how"} aria-controls={`${ids}-how`}>
            {c.how}
          </button>
          <span aria-hidden="true">·</span>
          <button type="button" onClick={() => toggle("about")} aria-expanded={panel === "about"} aria-controls={`${ids}-about`}>
            {c.about}
          </button>
        </nav>
      </main>
    </ConceptFrame>
  );
};

export default Painter;
