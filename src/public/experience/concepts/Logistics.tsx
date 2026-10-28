import React, { useEffect, useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiEdit2, FiMail, FiMapPin, FiMoreHorizontal, FiPackage, FiTruck, FiUsers } from "react-icons/fi";
import { LuLayers } from "react-icons/lu";
import { fill, useCopy } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

type Load = "parcel" | "pallet" | "other";
type Panel = "services" | "about" | "contact";

const copy = {
  sv: {
    wordmark: "Transport & logistik",
    title: ["Från din dörr.", "Hela vägen fram."],
    from: "Hämtning",
    to: "Leverans",
    placeholder: "Ort eller postnummer",
    routeLabel: "Transportens väg från hämtning till leverans",
    load: "Vad ska skickas?",
    loads: { parcel: "Paket", pallet: "Pall", other: "Annat" } as Record<Load, string>,
    cta: "Be om transportoffert",
    tagline: "Lokala leveranser · Företagstransporter",
    needBoth: "Fyll i både hämtning och leverans.",
    summaryTitle: "Din förfrågan",
    summary: "Från {from} till {to} · {load}",
    summaryNote: "Det här är en demo: ingen offert, inget pris och ingen transport skapas, och ingenting skickas.",
    edit: "Ändra",
    send: "Skicka förfrågan",
    sent: "Det här är en demo – ingen förfrågan skickades och ingen transport är bokad.",
    nav: { services: "Våra transporter", about: "Om oss", contact: "Kontakt" } as Record<Panel, string>,
    services: [
      { title: "Lokala leveranser", text: "Paket och mindre gods inom samma region, samma dag eller nästa – exempeltext." },
      { title: "Företagstransporter", text: "Fasta körningar mellan lager, butik och kund efter överenskommelse." },
      { title: "Pallgods", text: "Hel- och halvpall med bakgavellyft. Mått och vikt anges i förfrågan." },
    ],
    about: "Ett påhittat åkeri för den här demon. Uppgifter om fordon, område och tider skulle stå här på en riktig sajt.",
    contact: "På en riktig sajt står telefon, e-post och adress här. Demon har inga riktiga kontaktuppgifter.",
  },
  en: {
    wordmark: "Transport & logistics",
    title: ["From your door.", "All the way there."],
    from: "Collection",
    to: "Delivery",
    placeholder: "Town or postcode",
    routeLabel: "The route of the transport from collection to delivery",
    load: "What needs moving?",
    loads: { parcel: "Parcel", pallet: "Pallet", other: "Other" } as Record<Load, string>,
    cta: "Request a transport quote",
    tagline: "Local deliveries · Business transport",
    needBoth: "Fill in both collection and delivery.",
    summaryTitle: "Your request",
    summary: "From {from} to {to} · {load}",
    summaryNote: "This is a demo: no quote, no price and no transport is created, and nothing is sent.",
    edit: "Edit",
    send: "Send request",
    sent: "This is a demo – no request was sent and no transport is booked.",
    nav: { services: "Our services", about: "About us", contact: "Contact" } as Record<Panel, string>,
    services: [
      { title: "Local deliveries", text: "Parcels and smaller goods within the same region, same or next day – sample text." },
      { title: "Business transport", text: "Regular runs between warehouse, shop and customer, as agreed." },
      { title: "Pallet freight", text: "Full and half pallets with a tail lift. Size and weight go in the request." },
    ],
    about: "A made-up haulier for this demo. Vehicles, area and times would be described here on a real site.",
    contact: "A real site lists phone, email and address here. The demo has no real contact details.",
  },
};

const LOAD_ICONS: Record<Load, React.ReactNode> = { parcel: <FiPackage />, pallet: <LuLayers />, other: <FiMoreHorizontal /> };
const PANEL_ICONS: Record<Panel, React.ReactNode> = { services: <FiTruck />, about: <FiUsers />, contact: <FiMail /> };

/**
 * Transport & logistics: the journey of the shipment leads the page. The visitor fills in
 * collection, delivery and the kind of load; the drawn route takes their places as labels. The
 * quote request is a summary that states it is a demo – nothing is sent, priced or booked.
 */
const Logistics: React.FC<{ s: ConceptCopy["shared"] }> = ({ s }) => {
  const { lang } = useCopy();
  const c = copy[lang];
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [load, setLoad] = useState<Load>("parcel");
  const [tried, setTried] = useState(false);
  const [stage, setStage] = useState<"form" | "summary" | "sent">("form");
  const [panel, setPanel] = useState<Panel | null>(null);

  const ok = from.trim().length > 1 && to.trim().length > 1;

  useEffect(() => {
    if (panel) goTo(`${ids}-panel`);
  }, [panel, ids]);

  return (
    <ConceptFrame id="logistics">
      <header className="cx-lo__head">
        <span className="cx-lo__kind">{c.wordmark}</span>
      </header>

      <main id="cx-main-logistics" className="cx-lo__main">
        <h1 data-focus>
          {c.title[0]}
          <br />
          {c.title[1]}
        </h1>

        <figure className="cx-lo__route" role="img" aria-label={`${c.routeLabel}: ${from.trim() || c.from} → ${to.trim() || c.to}`}>
          <img src={media("site-logistics", 900)} srcSet={`${media("site-logistics", 900)} 900w, ${media("site-logistics", 1536)} 1536w`} sizes="(min-width: 960px) 560px, 100vw" alt="" width={1536} height={1024} decoding="async" fetchPriority="high" />
          <svg viewBox="0 0 300 120" preserveAspectRatio="none" aria-hidden="true">
            <path className="cx-lo__path" d="M28 30 C 120 20, 70 98, 170 84 S 250 60, 272 96" />
            <motion.path
              className="cx-lo__pathon"
              d="M28 30 C 120 20, 70 98, 170 84 S 250 60, 272 96"
              initial={false}
              animate={{ pathLength: from.trim() && to.trim() ? 1 : from.trim() ? 0.45 : 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.6, ease: "easeInOut" }}
            />
          </svg>
          <span className="cx-lo__pin cx-lo__pin--from" aria-hidden="true">
            <i /> {from.trim() || c.from}
          </span>
          <span className="cx-lo__pin cx-lo__pin--to" aria-hidden="true">
            <i /> {to.trim() || c.to}
          </span>
        </figure>

        <section className="cx-lo__card" aria-label={c.cta}>
          <AnimatePresence mode="wait" initial={false}>
            {stage === "form" ? (
              <motion.form
                key="form"
                noValidate
                initial={reduce ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.12 } }}
                onSubmit={(e) => {
                  e.preventDefault();
                  setTried(true);
                  if (ok) setStage("summary");
                }}
              >
                <div className="cx-lo__field">
                  <FiMapPin aria-hidden="true" />
                  <label htmlFor={`${ids}-f`}>{c.from}</label>
                  <input id={`${ids}-f`} value={from} placeholder={c.placeholder} autoComplete="off" onChange={(e) => setFrom(e.target.value)} aria-invalid={tried && from.trim().length < 2 ? true : undefined} />
                </div>
                <div className="cx-lo__field">
                  <FiMapPin aria-hidden="true" />
                  <label htmlFor={`${ids}-t`}>{c.to}</label>
                  <input id={`${ids}-t`} value={to} placeholder={c.placeholder} autoComplete="off" onChange={(e) => setTo(e.target.value)} aria-invalid={tried && to.trim().length < 2 ? true : undefined} />
                </div>
                <fieldset className="cx-lo__loads">
                  <legend className="mp-sr">{c.load}</legend>
                  {(Object.keys(c.loads) as Load[]).map((k) => (
                    <label key={k} className={load === k ? "is-on" : undefined}>
                      <input type="radio" name={`${ids}-load`} checked={load === k} onChange={() => setLoad(k)} />
                      <span aria-hidden="true">{LOAD_ICONS[k]}</span> {c.loads[k]}
                    </label>
                  ))}
                </fieldset>
                <p role="alert" className="cx-lo__err">
                  {tried && !ok ? c.needBoth : ""}
                </p>
                <button type="submit" className="cx-lo__cta">
                  {c.cta} <FiArrowUpRight aria-hidden="true" />
                </button>
              </motion.form>
            ) : (
              <motion.div key="summary" className="cx-lo__summary" initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <h2>{c.summaryTitle}</h2>
                <p className="cx-lo__sumline">{fill(c.summary, { from: from.trim(), to: to.trim(), load: c.loads[load].toLowerCase() })}</p>
                {stage === "sent" ? (
                  <DemoNote text={c.sent} onAgain={() => (setStage("form"), setFrom(""), setTo(""), setTried(false))} />
                ) : (
                  <>
                    <p className="cx-lo__note">{c.summaryNote}</p>
                    <div className="cx-lo__sumact">
                      <button type="button" onClick={() => setStage("form")}>
                        <FiEdit2 aria-hidden="true" /> {c.edit}
                      </button>
                      <button type="button" className="cx-lo__cta" onClick={() => setStage("sent")}>
                        {c.send}
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <p className="cx-lo__tag">
          <FiTruck aria-hidden="true" /> {c.tagline}
        </p>

        <section id={`${ids}-panel`} className="cx-lo__panel" hidden={!panel} aria-label={panel ? c.nav[panel] : undefined}>
          {panel === "services" && (
            <ul>
              {c.services.map((sv) => (
                <li key={sv.title}>
                  <strong>{sv.title}</strong>
                  <span>{sv.text}</span>
                </li>
              ))}
            </ul>
          )}
          {panel === "about" && <p>{c.about}</p>}
          {panel === "contact" && <p>{c.contact}</p>}
        </section>
      </main>

      <nav className="cx-lo__bar" aria-label={c.wordmark}>
        {(Object.keys(c.nav) as Panel[]).map((k) => (
          <button key={k} type="button" aria-expanded={panel === k} aria-controls={`${ids}-panel`} onClick={() => setPanel(panel === k ? null : k)}>
            <span aria-hidden="true">{PANEL_ICONS[k]}</span>
            {c.nav[k]}
          </button>
        ))}
      </nav>

      <footer className="cx-foot">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Logistics;
