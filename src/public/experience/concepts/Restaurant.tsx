import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiChevronLeft, FiChevronRight, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { fill, useCopy } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote, goTo } from "./ConceptChrome";
import MENU from "./restaurant-menu.json";

type Lang = "sv" | "en";
type Dish = (typeof MENU.dishes)[number];
type CatId = "starters" | "mains" | "desserts";

/** Texts of the page around the menu (the menu itself comes from restaurant-menu.json). */
const copy = {
  sv: {
    kind: "Restaurang",
    name: "Trattoria Limone",
    catsLabel: "Kategorier",
    counter: "Rätt {i} av {n} bland {cat}",
    allergens: "Allergener (exempel)",
    ingredientsTitle: "Ingredienser",
    swipeHint: "Svep eller använd pilarna",
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
    findLines: ["Adressen är påhittad – restaurangen finns inte.", "På en riktig sajt står adress, karta och vägbeskrivning här."],
    hoursTitle: "Öppettider (exempel)",
    hours: ["Tis–tors 17–22", "Fre–lör 17–23", "Sön–mån stängt"],
  },
  en: {
    kind: "Restaurant",
    name: "Trattoria Limone",
    catsLabel: "Categories",
    counter: "Dish {i} of {n} in {cat}",
    allergens: "Allergens (example)",
    ingredientsTitle: "Ingredients",
    swipeHint: "Swipe or use the arrows",
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
    findLines: ["The address is made up – the restaurant does not exist.", "A real site shows the address, a map and directions here."],
    hoursTitle: "Opening hours (example)",
    hours: ["Tue–Thu 5–10 pm", "Fri–Sat 5–11 pm", "Sun–Mon closed"],
  },
};

const DISHES: Dish[] = MENU.dishes;
const CATS = MENU.categories.map((c) => c.id as CatId);
const START = Math.max(0, DISHES.findIndex((d) => d.id === MENU.initialDishId));
const TIMES = ["17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30"];
const label = (key: keyof typeof MENU.labels, lang: Lang) => MENU.labels[key][lang];
const photo = (d: Dish, w: 480 | 900) => media(d.media, w);

/**
 * Restaurant: the menu is the site. One dish at a time – the photograph of that very dish, its
 * category, name, price and an ingredients/allergens disclosure – browsed with arrows, swipe or the
 * category row. Six dishes, six photographs, matched by id (restaurant-menu.json). Booking and
 * "Find us" open in place and say plainly that nothing is sent.
 */
const Restaurant: React.FC = () => {
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

  const dish = DISHES[index];
  const cat = dish.category as CatId;
  const inCat = DISHES.filter((d) => d.category === cat);
  const posInCat = inCat.findIndex((d) => d.id === dish.id) + 1;
  const catLabel = (id: CatId) => MENU.categories.find((x) => x.id === id)!.label[lang];

  // An opened panel comes into view and takes the focus.
  useEffect(() => {
    if (panel) goTo(`${ids}-${panel}`);
  }, [panel, ids]);

  // The next dish is fetched ahead; the others only when they are shown.
  useEffect(() => {
    const next = new Image();
    next.src = photo(DISHES[(index + 1) % DISHES.length], 900);
  }, [index]);

  const go = (to: number) => {
    const next = (to + DISHES.length) % DISHES.length;
    setDir(to > index ? 1 : -1);
    setIndex(next);
    setInfo(false);
  };
  const openCat = (id: CatId) => go(DISHES.findIndex((d) => d.category === id));

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
        <span className="cx-re__kind">{c.kind}</span>
        <span className="cx-re__name">{c.name}</span>
      </header>

      <main id="cx-main-restaurant" className="cx-re__main">
        <h1 className="mp-sr" data-focus>
          {c.name} – {label("menu", lang)}
        </h1>
        <div className="cx-re__stage" onPointerDown={onDown} onPointerUp={onUp} onPointerCancel={() => (swipe.current = null)}>
          <p className="cx-re__catword" aria-hidden="true" style={{ "--len": catLabel(cat).length } as React.CSSProperties}>
            {catLabel(cat)}
          </p>
          <div className="cx-re__plate">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={dish.id}
                src={photo(dish, 900)}
                srcSet={`${photo(dish, 480)} 480w, ${photo(dish, 900)} 900w`}
                sizes="(min-width: 600px) 440px, 88vw"
                alt={dish.alt[lang]}
                width={900}
                height={900}
                decoding="async"
                fetchPriority={dish.id === MENU.initialDishId ? "high" : "auto"}
                draggable={false}
                {...slide}
              />
            </AnimatePresence>
          </div>
          <button type="button" className="cx-re__book" onClick={() => setPanel(panel === "book" ? null : "book")} aria-expanded={panel === "book"} aria-controls={`${ids}-book`}>
            {label("book", lang)} <FiArrowRight aria-hidden="true" />
          </button>
        </div>

        <section className="cx-re__menu" aria-labelledby={`${ids}-menu`}>
          <h2 id={`${ids}-menu`} className="cx-re__rule">
            <span>{label("menu", lang)}</span>
          </h2>
          <div className="cx-re__dish" aria-live="polite" aria-atomic="true">
            <h3>{dish.name[lang]}</h3>
            <p>{dish.description[lang]}</p>
            <p className="cx-re__price">{dish.priceSek}&nbsp;kr</p>
          </div>
          <button type="button" className="cx-re__info" aria-expanded={info} aria-controls={`${ids}-info`} onClick={() => setInfo((v) => !v)}>
            {label("ingredients", lang)} {info ? <FiMinus aria-hidden="true" /> : <FiPlus aria-hidden="true" />}
          </button>
          <div id={`${ids}-info`} className="cx-re__infobox" hidden={!info}>
            <p>
              <strong>{c.ingredientsTitle}:</strong> {dish.ingredients[lang].join(", ")}
            </p>
            <p>
              <strong>{c.allergens}:</strong> {dish.illustrativeAllergens[lang].join(", ")}
            </p>
            <p className="cx-re__small">{MENU.notice[lang]}</p>
          </div>

          <div className="cx-re__pager">
            <button type="button" onClick={() => go(index - 1)} aria-label={label("previous", lang)}>
              <FiChevronLeft aria-hidden="true" />
            </button>
            <p>
              <span aria-hidden="true">
                {posInCat} / {inCat.length}
              </span>
              <span className="mp-sr">{fill(c.counter, { i: posInCat, n: inCat.length, cat: catLabel(cat).toLowerCase() })}</span>
            </p>
            <button type="button" onClick={() => go(index + 1)} aria-label={label("next", lang)}>
              <FiChevronRight aria-hidden="true" />
            </button>
          </div>
          <p className="cx-re__hint">{c.swipeHint}</p>

          <nav className="cx-re__cats" aria-label={c.catsLabel}>
            {CATS.map((id) => (
              <button key={id} type="button" aria-current={cat === id ? "true" : undefined} onClick={() => openCat(id)}>
                {catLabel(id)}
              </button>
            ))}
          </nav>
        </section>

        <section id={`${ids}-book`} className="cx-re__panel" hidden={panel !== "book"} aria-labelledby={`${ids}-bt`}>
          <div className="cx-re__panelhead">
            <h2 id={`${ids}-bt`}>{label("book", lang)}</h2>
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
            <h2 id={`${ids}-ft`}>{label("findUs", lang)}</h2>
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
        {label("findUs", lang)} <FiArrowRight aria-hidden="true" />
      </button>
    </ConceptFrame>
  );
};

export default Restaurant;
