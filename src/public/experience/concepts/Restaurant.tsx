import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { fill, useCopy } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote, goTo } from "./ConceptChrome";
import type { ConceptCopy } from "./content";

type Cat = "starters" | "mains" | "desserts";
type Dish = { id: string; cat: Cat; name: string; text: string; price: string; ingredients: string; allergens: string; photo?: boolean };

const copy = {
  sv: {
    wordmark: "Restaurang",
    name: "Trattoria Limone",
    menu: "Menyn",
    book: "Boka bord",
    findUs: "Hitta hit",
    cats: { starters: "Förrätter", mains: "Varmrätter", desserts: "Desserter" } as Record<Cat, string>,
    catsLabel: "Kategorier",
    prev: "Föregående rätt",
    next: "Nästa rätt",
    counter: "Rätt {i} av {n}",
    allergensBtn: "Ingredienser & allergener",
    ingredients: "Ingredienser",
    allergens: "Allergener",
    allergenNote: "Illustrativa uppgifter i en demo – ingen riktig allergenguide.",
    noPhoto: "Ingen bild i demon",
    swipeHint: "Svep eller använd pilarna",
    bookTitle: "Boka bord",
    bookLead: "En demo: ingen restaurang kontaktas och inget bord bokas.",
    date: "Datum",
    time: "Tid",
    guests: "Antal gäster",
    fewer: "Färre gäster",
    more: "Fler gäster",
    yourName: "Namn",
    send: "Skicka förfrågan",
    needName: "Fyll i datum och namn.",
    booked: "Det här är en demo – ingen bokning har gjorts och inget skickades.",
    close: "Stäng",
    findTitle: "Hitta hit",
    findLines: ["Adressen är påhittad – restaurangen finns inte.", "På en riktig sajt står adress, karta och vägbeskrivning här."],
    hoursTitle: "Öppettider (exempel)",
    hours: ["Tis–tors 17–22", "Fre–lör 17–23", "Sön–mån stängt"],
    dishes: [
      { id: "burrata", cat: "starters", name: "Burrata", text: "Rostade körsbärstomater och basilikaolja.", price: "145 kr", ingredients: "Burrata, körsbärstomater, basilika, olivolja, flingsalt.", allergens: "Mjölk." },
      { id: "vitello", cat: "starters", name: "Vitello tonnato", text: "Tunt skivad kalv, tonfiskkräm och kapris.", price: "155 kr", ingredients: "Kalvinnanlår, tonfisk, majonnäs, kapris, citron.", allergens: "Fisk, ägg." },
      { id: "ravioli", cat: "mains", name: "Citronravioli", text: "Brynt smör, salvia och parmesan.", price: "195 kr", ingredients: "Färsk pasta, ricotta, citronskal, smör, salvia, parmesan.", allergens: "Gluten, ägg, mjölk.", photo: true },
      { id: "risotto", cat: "mains", name: "Svamprisotto", text: "Karnaroliris, kantareller och timjan.", price: "210 kr", ingredients: "Karnaroliris, kantareller, schalottenlök, vitt vin, timjan, parmesan.", allergens: "Mjölk." },
      { id: "torsk", cat: "mains", name: "Halstrad torsk", text: "Vita bönor, citron och gremolata.", price: "245 kr", ingredients: "Torsk, vita bönor, persilja, vitlök, citron, olivolja.", allergens: "Fisk." },
      { id: "pannacotta", cat: "desserts", name: "Pannacotta", text: "Vanilj och rabarberkompott.", price: "105 kr", ingredients: "Grädde, vanilj, gelatin, rabarber, socker.", allergens: "Mjölk." },
      { id: "tiramisu", cat: "desserts", name: "Tiramisu", text: "Mascarpone, espresso och kakao.", price: "115 kr", ingredients: "Mascarpone, ägg, savoiardikex, espresso, kakao.", allergens: "Gluten, ägg, mjölk." },
    ] as Dish[],
  },
  en: {
    wordmark: "Restaurant",
    name: "Trattoria Limone",
    menu: "The menu",
    book: "Book a table",
    findUs: "Find us",
    cats: { starters: "Starters", mains: "Mains", desserts: "Desserts" } as Record<Cat, string>,
    catsLabel: "Categories",
    prev: "Previous dish",
    next: "Next dish",
    counter: "Dish {i} of {n}",
    allergensBtn: "Ingredients & allergens",
    ingredients: "Ingredients",
    allergens: "Allergens",
    allergenNote: "Illustrative details in a demo – not a real allergen guide.",
    noPhoto: "No picture in the demo",
    swipeHint: "Swipe or use the arrows",
    bookTitle: "Book a table",
    bookLead: "A demo: no restaurant is contacted and no table is booked.",
    date: "Date",
    time: "Time",
    guests: "Guests",
    fewer: "Fewer guests",
    more: "More guests",
    yourName: "Name",
    send: "Send request",
    needName: "Fill in the date and your name.",
    booked: "This is a demo – no booking was made and nothing was sent.",
    close: "Close",
    findTitle: "Find us",
    findLines: ["The address is made up – the restaurant does not exist.", "A real site shows the address, a map and directions here."],
    hoursTitle: "Opening hours (example)",
    hours: ["Tue–Thu 5–10 pm", "Fri–Sat 5–11 pm", "Sun–Mon closed"],
    dishes: [
      { id: "burrata", cat: "starters", name: "Burrata", text: "Roasted cherry tomatoes and basil oil.", price: "145 kr", ingredients: "Burrata, cherry tomatoes, basil, olive oil, flaky salt.", allergens: "Milk." },
      { id: "vitello", cat: "starters", name: "Vitello tonnato", text: "Thinly sliced veal, tuna cream and capers.", price: "155 kr", ingredients: "Veal topside, tuna, mayonnaise, capers, lemon.", allergens: "Fish, egg." },
      { id: "ravioli", cat: "mains", name: "Lemon ravioli", text: "Brown butter, sage and parmesan.", price: "195 kr", ingredients: "Fresh pasta, ricotta, lemon zest, butter, sage, parmesan.", allergens: "Gluten, egg, milk.", photo: true },
      { id: "risotto", cat: "mains", name: "Mushroom risotto", text: "Carnaroli rice, chanterelles and thyme.", price: "210 kr", ingredients: "Carnaroli rice, chanterelles, shallot, white wine, thyme, parmesan.", allergens: "Milk." },
      { id: "torsk", cat: "mains", name: "Seared cod", text: "White beans, lemon and gremolata.", price: "245 kr", ingredients: "Cod, white beans, parsley, garlic, lemon, olive oil.", allergens: "Fish." },
      { id: "pannacotta", cat: "desserts", name: "Panna cotta", text: "Vanilla and rhubarb compote.", price: "105 kr", ingredients: "Cream, vanilla, gelatine, rhubarb, sugar.", allergens: "Milk." },
      { id: "tiramisu", cat: "desserts", name: "Tiramisu", text: "Mascarpone, espresso and cocoa.", price: "115 kr", ingredients: "Mascarpone, egg, savoiardi, espresso, cocoa.", allergens: "Gluten, egg, milk." },
    ] as Dish[],
  },
};

const CATS: Cat[] = ["starters", "mains", "desserts"];
const START = 2; // the lemon ravioli
const TIMES = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];

/**
 * Restaurant: the menu is the site. One dish at a time – big category word, the plate, name,
 * price and an allergen disclosure – browsed with arrows, swipe or the category row. Booking and
 * "Find us" open in place and say plainly that nothing is sent.
 */
const Restaurant: React.FC<{ s: ConceptCopy["shared"] }> = ({ s }) => {
  const { lang } = useCopy();
  const c = copy[lang];
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [index, setIndex] = useState(START);
  const [dir, setDir] = useState(1);
  const [info, setInfo] = useState(false);
  const [panel, setPanel] = useState<"book" | "find" | null>(null);
  const [booking, setBooking] = useState({ date: "", time: "19:00", guests: 2, name: "" });
  const [tried, setTried] = useState(false);
  const [booked, setBooked] = useState(false);
  const swipe = useRef<{ x: number; y: number; id: number } | null>(null);

  // An opened panel comes into view and takes the focus.
  useEffect(() => {
    if (panel) goTo(`${ids}-${panel}`);
  }, [panel, ids]);

  const dishes = c.dishes;
  const dish = dishes[index];
  const go = (to: number) => {
    const next = (to + dishes.length) % dishes.length;
    setDir(to > index ? 1 : -1);
    setIndex(next);
    setInfo(false);
  };
  const openCat = (cat: Cat) => go(dishes.findIndex((d) => d.cat === cat));

  // Horizontal swipe on the dish only; vertical movement stays a page scroll.
  const onDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return;
    swipe.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onUp = (e: React.PointerEvent) => {
    const sw = swipe.current;
    swipe.current = null;
    if (!sw || sw.id !== e.pointerId) return;
    const dx = e.clientX - sw.x;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(e.clientY - sw.y) * 1.4) go(index + (dx < 0 ? 1 : -1));
  };

  const slide = reduce
    ? { initial: false as const, animate: { opacity: 1 }, exit: { opacity: 0, transition: { duration: 0 } } }
    : {
        initial: { opacity: 0, x: 40 * dir },
        animate: { opacity: 1, x: 0, transition: { duration: 0.34, ease: [0.22, 0.75, 0.18, 1] as const } },
        exit: { opacity: 0, x: -30 * dir, transition: { duration: 0.16 } },
      };

  const bookOk = booking.date !== "" && booking.name.trim().length > 1;

  return (
    <ConceptFrame id="restaurant">
      <header className="cx-re__head">
        <span className="cx-re__kind">{c.wordmark}</span>
        <span className="cx-re__name">{c.name}</span>
      </header>

      <main id="cx-main-restaurant" className="cx-re__main">
        <h1 className="mp-sr" data-focus>
          {c.name} – {c.menu}
        </h1>
        <div className="cx-re__stage" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (swipe.current = null)}>
          <p className="cx-re__catword" aria-hidden="true" style={{ "--len": c.cats[dish.cat].length } as React.CSSProperties}>
            {c.cats[dish.cat]}
          </p>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={dish.id} className="cx-re__plate" {...slide}>
              {dish.photo ? (
                <img src={media("site-restaurant", 1024)} srcSet={`${media("site-restaurant", 640)} 640w, ${media("site-restaurant", 1024)} 1024w`} sizes="(min-width: 960px) 420px, 92vw" alt="" width={1024} height={1536} decoding="async" fetchPriority="high" draggable={false} />
              ) : (
                <div className="cx-re__noimg" aria-hidden="true">
                  <span>{dish.name.charAt(0)}</span>
                  <small>{c.noPhoto}</small>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <button type="button" className="cx-re__book" onClick={() => setPanel(panel === "book" ? null : "book")} aria-expanded={panel === "book"} aria-controls={`${ids}-book`}>
            {c.book} <FiArrowRight aria-hidden="true" />
          </button>
        </div>

        <section className="cx-re__menu" aria-labelledby={`${ids}-menu`}>
          <h2 id={`${ids}-menu`} className="cx-re__rule">
            <span>{c.menu}</span>
          </h2>
          <div className="cx-re__dish" aria-live="polite" aria-atomic="true">
            <h3>{dish.name}</h3>
            <p>{dish.text}</p>
            <p className="cx-re__price">{dish.price}</p>
          </div>
          <button type="button" className="cx-re__info" aria-expanded={info} aria-controls={`${ids}-info`} onClick={() => setInfo((v) => !v)}>
            {c.allergensBtn} {info ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
          </button>
          <div id={`${ids}-info`} className="cx-re__infobox" hidden={!info}>
            <p>
              <strong>{c.ingredients}:</strong> {dish.ingredients}
            </p>
            <p>
              <strong>{c.allergens}:</strong> {dish.allergens}
            </p>
            <p className="cx-re__small">{c.allergenNote}</p>
          </div>

          <div className="cx-re__pager">
            <button type="button" onClick={() => go(index - 1)} aria-label={c.prev}>
              <FiChevronLeft aria-hidden="true" />
            </button>
            <p>
              <span aria-hidden="true">
                {String(index + 1).padStart(2, "0")}/{String(dishes.length).padStart(2, "0")}
              </span>
              <span className="mp-sr">{fill(c.counter, { i: index + 1, n: dishes.length })}</span>
            </p>
            <button type="button" onClick={() => go(index + 1)} aria-label={c.next}>
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
          <p className="cx-re__hint">{c.swipeHint}</p>

          <nav className="cx-re__cats" aria-label={c.catsLabel}>
            {CATS.map((cat) => (
              <button key={cat} type="button" aria-current={dish.cat === cat ? "true" : undefined} onClick={() => openCat(cat)}>
                {c.cats[cat]}
              </button>
            ))}
          </nav>
        </section>

        <section id={`${ids}-book`} className="cx-re__panel" hidden={panel !== "book"} aria-labelledby={`${ids}-bt`}>
          <div className="cx-re__panelhead">
            <h2 id={`${ids}-bt`}>{c.bookTitle}</h2>
            <button type="button" onClick={() => setPanel(null)} aria-label={c.close}>
              <FiX aria-hidden="true" />
            </button>
          </div>
          <p className="cx-re__small">{c.bookLead}</p>
          {booked ? (
            <DemoNote text={c.booked} onAgain={() => (setBooked(false), setTried(false), setBooking({ date: "", time: "19:00", guests: 2, name: "" }))} />
          ) : (
            <form
              noValidate
              className="cx-re__form"
              onSubmit={(e) => {
                e.preventDefault();
                setTried(true);
                if (bookOk) setBooked(true);
              }}
            >
              <label htmlFor={`${ids}-d`}>{c.date}</label>
              <input id={`${ids}-d`} type="date" value={booking.date} onChange={(e) => setBooking({ ...booking, date: e.target.value })} aria-invalid={tried && !booking.date ? true : undefined} />
              <label htmlFor={`${ids}-t`}>{c.time}</label>
              <select id={`${ids}-t`} value={booking.time} onChange={(e) => setBooking({ ...booking, time: e.target.value })}>
                {TIMES.map((tm) => (
                  <option key={tm}>{tm}</option>
                ))}
              </select>
              <span className="cx-re__label" id={`${ids}-g`}>
                {c.guests}
              </span>
              <div className="cx-re__stepper" role="group" aria-labelledby={`${ids}-g`}>
                <button type="button" aria-label={c.fewer} disabled={booking.guests <= 1} onClick={() => setBooking({ ...booking, guests: booking.guests - 1 })}>
                  <FiMinus aria-hidden="true" />
                </button>
                <output aria-live="polite">{booking.guests}</output>
                <button type="button" aria-label={c.more} disabled={booking.guests >= 8} onClick={() => setBooking({ ...booking, guests: booking.guests + 1 })}>
                  <FiPlus aria-hidden="true" />
                </button>
              </div>
              <label htmlFor={`${ids}-n`}>{c.yourName}</label>
              <input id={`${ids}-n`} autoComplete="off" value={booking.name} onChange={(e) => setBooking({ ...booking, name: e.target.value })} aria-invalid={tried && booking.name.trim().length < 2 ? true : undefined} />
              <p role="alert" className="cx-re__err">
                {tried && !bookOk ? c.needName : ""}
              </p>
              <button type="submit" className="cx-re__send">
                {c.send} <FiArrowRight aria-hidden="true" />
              </button>
            </form>
          )}
        </section>

        <section id={`${ids}-find`} className="cx-re__panel" hidden={panel !== "find"} aria-labelledby={`${ids}-ft`}>
          <div className="cx-re__panelhead">
            <h2 id={`${ids}-ft`}>{c.findTitle}</h2>
            <button type="button" onClick={() => setPanel(null)} aria-label={c.close}>
              <FiX aria-hidden="true" />
            </button>
          </div>
          {c.findLines.map((l) => (
            <p key={l}>{l}</p>
          ))}
          <h3>{c.hoursTitle}</h3>
          <ul>
            {c.hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      </main>

      <button type="button" className="cx-re__find" onClick={() => setPanel(panel === "find" ? null : "find")} aria-expanded={panel === "find"} aria-controls={`${ids}-find`}>
        {c.findUs} <FiArrowRight aria-hidden="true" />
      </button>

      <footer className="cx-foot">{s.footer}</footer>
    </ConceptFrame>
  );
};

export default Restaurant;
