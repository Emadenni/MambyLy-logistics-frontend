import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { FiArrowUpRight, FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { fill, useCopy } from "../i18n";
import { media } from "../media";
import { ConceptFrame, DemoNote } from "./ConceptChrome";
import { SiteFooter, SiteNav, SiteSections } from "./Site";
import { sectionId } from "./sites";

type Cat = "portraits" | "spaces" | "brands";
type Photo = { id: string; img: string; cat: Cat; title: string; alt: string };

const copy = {
  sv: {
    wordmark: "Fotograf",
    title: "Människor. Platser. Berättelser.",
    lead: "Ett påhittat fotografportfolio: välj en bild för att öppna serien.",
    cats: { portraits: "Porträtt", spaces: "Rum", brands: "Varumärken" } as Record<Cat, string>,
    all: "Alla bilder",
    filter: "Visa",
    open: "Öppna serien",
    count: "{n} bilder",
    one: "1 bild",
    series: "Serie: {cat}",
    of: "{i} av {n}",
    prev: "Föregående bild",
    next: "Nästa bild",
    close: "Stäng serien",
    bookTitle: "Boka fotografering",
    bookLead: "En demo: ingen fotograf kontaktas och ingenting bokas.",
    kind: "Vad gäller det?",
    month: "Önskad månad",
    yourName: "Namn",
    send: "Skicka förfrågan",
    needName: "Fyll i ditt namn.",
    sent: "Det här är en demo – ingen fotografering har bokats och inget skickades.",
    photos: [
      { id: "p1", img: "photo-portrait-woman", cat: "portraits", title: "Vind vid kusten", alt: "Svartvitt porträtt av en kvinna i vind vid havet" },
      { id: "s1", img: "photo-space-arch", cat: "spaces", title: "Valv och kvällsljus", alt: "Ljust rum med valvbåge, matbord och utsikt mot havet" },
      { id: "b1", img: "photo-brand-craft", cat: "brands", title: "Hantverk i verkstaden", alt: "Händer som hyvlar en träbräda i en snickarverkstad" },
      { id: "p2", img: "photo-portrait-man", cat: "portraits", title: "Vid klipporna", alt: "Porträtt av en man på en klippa vid havet i solnedgång" },
    ] as Photo[],
  },
  en: {
    wordmark: "Photographer",
    title: "People. Places. Stories.",
    lead: "A made-up photographer's portfolio: pick a picture to open the series.",
    cats: { portraits: "Portraits", spaces: "Spaces", brands: "Brands" } as Record<Cat, string>,
    all: "All photos",
    filter: "Show",
    open: "View the series",
    count: "{n} photos",
    one: "1 photo",
    series: "Series: {cat}",
    of: "{i} of {n}",
    prev: "Previous photo",
    next: "Next photo",
    close: "Close the series",
    bookTitle: "Book a shoot",
    bookLead: "A demo: no photographer is contacted and nothing is booked.",
    kind: "What is it about?",
    month: "Preferred month",
    yourName: "Name",
    send: "Send request",
    needName: "Fill in your name.",
    sent: "This is a demo – no shoot was booked and nothing was sent.",
    photos: [
      { id: "p1", img: "photo-portrait-woman", cat: "portraits", title: "Wind on the coast", alt: "Black and white portrait of a woman in the wind by the sea" },
      { id: "s1", img: "photo-space-arch", cat: "spaces", title: "Arch and evening light", alt: "Bright room with an arch, a dining table and a view of the sea" },
      { id: "b1", img: "photo-brand-craft", cat: "brands", title: "Craft in the workshop", alt: "Hands planing a wooden board in a carpentry workshop" },
      { id: "p2", img: "photo-portrait-man", cat: "portraits", title: "By the cliffs", alt: "Portrait of a man on a cliff by the sea at sunset" },
    ] as Photo[],
  },
};

const CATS: Cat[] = ["portraits", "spaces", "brands"];
const MONTHS = { sv: ["Januari", "Februari", "Mars", "April", "Maj", "Juni"], en: ["January", "February", "March", "April", "May", "June"] };

/**
 * Photographer: the contact sheet is the navigation. Every picture opens its series fullscreen
 * (arrows, keyboard, Escape); the category row filters the sheet and the counts are the real number
 * of pictures in the demo. The site around it (about, work, process, questions,
 * booking) comes from sites.ts with its navigation.
 */
const Photographer: React.FC = () => {
  const { lang } = useCopy();
  const c = copy[lang];
  const reduce = useReducedMotion() ?? false;
  const ids = useId();
  const [cat, setCat] = useState<Cat | "all">("all");
  const [viewer, setViewer] = useState<{ cat: Cat; i: number } | null>(null);
  const [req, setReq] = useState({ kind: "portraits" as Cat, month: 0, name: "" });
  const [tried, setTried] = useState(false);
  const [sent, setSent] = useState(false);
  const opener = useRef<HTMLButtonElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const dialog = useRef<HTMLDivElement>(null);

  const photos = c.photos;
  const shown = cat === "all" ? photos : photos.filter((p) => p.cat === cat);
  const inCat = (k: Cat) => photos.filter((p) => p.cat === k);
  const countOf = (k: Cat) => (inCat(k).length === 1 ? c.one : fill(c.count, { n: inCat(k).length }));
  const series = viewer ? inCat(viewer.cat) : [];
  const current = viewer ? series[viewer.i] : null;

  const openSeries = (p: Photo, btn: HTMLButtonElement) => {
    opener.current = btn;
    setViewer({ cat: p.cat, i: inCat(p.cat).findIndex((x) => x.id === p.id) });
  };
  const step = (d: number) => viewer && setViewer({ ...viewer, i: (viewer.i + d + series.length) % series.length });
  const close = () => {
    setViewer(null);
    window.setTimeout(() => opener.current?.focus(), 0);
  };

  useEffect(() => {
    if (!viewer) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "Tab" && dialog.current) {
        // keep the focus inside the open series
        const items = [...dialog.current.querySelectorAll<HTMLElement>("button")];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) (e.preventDefault(), last.focus());
        else if (!e.shiftKey && document.activeElement === last) (e.preventDefault(), first.focus());
      }
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = overflow;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewer]);

  return (
    <ConceptFrame id="photographer" tone="dark">
      <SiteNav id="photographer" wordmark={<span className="cx-ph__kind">{c.wordmark}</span>} />

      <main id="cx-main-photographer" className="cx-ph__main">
        <h1 id={sectionId("photographer", "work")} data-focus>
          {c.title}
        </h1>
        <p className="cx-ph__lead">{c.lead}</p>

        <div className="cx-ph__filters" role="group" aria-label={c.filter}>
          <button type="button" aria-pressed={cat === "all"} onClick={() => setCat("all")}>
            {c.all} <span>{photos.length}</span>
          </button>
          {CATS.map((k) => (
            <button key={k} type="button" aria-pressed={cat === k} onClick={() => setCat(k)}>
              {c.cats[k]} <span>{inCat(k).length}</span>
            </button>
          ))}
        </div>

        <ul className={`cx-ph__sheet cx-ph__sheet--${shown.length}`}>
          {shown.map((p) => (
            <li key={p.id}>
              <button type="button" className="cx-ph__tile" onClick={(e) => openSeries(p, e.currentTarget)} aria-label={`${p.title} – ${c.cats[p.cat]}, ${countOf(p.cat)}. ${c.open}`}>
                <img src={media(p.img, 627)} alt="" width={627} height={627} loading="lazy" decoding="async" />
                <span className="cx-ph__cap" aria-hidden="true">
                  <span>
                    {c.cats[p.cat]} / {inCat(p.cat).length}
                  </span>
                  <span className="cx-ph__open">
                    {c.open} <FiArrowUpRight />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>

        <SiteSections id="photographer" />

        <section id={sectionId("photographer", "book")} className="cx-ph__panel cx-ph__panel--book" aria-labelledby={`${ids}-bt`}>
          <h2 id={`${ids}-bt`}>{c.bookTitle}</h2>
          <p className="cx-ph__small">{c.bookLead}</p>
          {sent ? (
            <DemoNote text={c.sent} onAgain={() => (setSent(false), setTried(false), setReq({ kind: "portraits", month: 0, name: "" }))} />
          ) : (
            <form
              noValidate
              className="cx-ph__form"
              onSubmit={(e) => {
                e.preventDefault();
                setTried(true);
                if (req.name.trim().length > 1) setSent(true);
              }}
            >
              <fieldset>
                <legend>{c.kind}</legend>
                {CATS.map((k) => (
                  <label key={k} className={req.kind === k ? "is-on" : undefined}>
                    <input type="radio" name={`${ids}-kind`} checked={req.kind === k} onChange={() => setReq({ ...req, kind: k })} />
                    {c.cats[k]}
                  </label>
                ))}
              </fieldset>
              <label htmlFor={`${ids}-m`}>{c.month}</label>
              <select id={`${ids}-m`} value={req.month} onChange={(e) => setReq({ ...req, month: Number(e.target.value) })}>
                {MONTHS[lang].map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <label htmlFor={`${ids}-n`}>{c.yourName}</label>
              <input id={`${ids}-n`} autoComplete="off" value={req.name} onChange={(e) => setReq({ ...req, name: e.target.value })} aria-invalid={tried && req.name.trim().length < 2 ? true : undefined} />
              <p role="alert" className="cx-ph__err">
                {tried && req.name.trim().length < 2 ? c.needName : ""}
              </p>
              <button type="submit" className="cx-ph__send">
                {c.send}
              </button>
            </form>
          )}
        </section>
      </main>

      <SiteFooter id="photographer" wordmark={c.wordmark} />

      <AnimatePresence>
        {viewer && current && (
          <motion.div
            ref={dialog}
            className="cx-ph__viewer"
            role="dialog"
            aria-modal="true"
            aria-label={fill(c.series, { cat: c.cats[viewer.cat] })}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.18 } }}
          >
            <div className="cx-ph__vhead">
              <p>
                {fill(c.series, { cat: c.cats[viewer.cat] })} · <span aria-live="polite">{fill(c.of, { i: viewer.i + 1, n: series.length })}</span>
              </p>
              <button ref={closeBtn} type="button" onClick={close} aria-label={c.close}>
                <FiX aria-hidden="true" />
              </button>
            </div>
            <figure>
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={current.id}
                  src={media(current.img, 627)}
                  alt={current.alt}
                  width={627}
                  height={627}
                  initial={reduce ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, transition: { duration: 0.12 } }}
                />
              </AnimatePresence>
              <figcaption>{current.title}</figcaption>
            </figure>
            {series.length > 1 && (
              <div className="cx-ph__vnav">
                <button type="button" onClick={() => step(-1)} aria-label={c.prev}>
                  <FiChevronLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => step(1)} aria-label={c.next}>
                  <FiChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ConceptFrame>
  );
};

export default Photographer;
