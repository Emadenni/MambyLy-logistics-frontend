import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUp, FiMenu, FiPlus, FiRotateCw, FiX } from "react-icons/fi";
import { useCopy } from "../i18n";
import { media } from "../media";
import { PATHS, type ConceptId } from "../routes";
import { conceptCopy } from "./content";
import { goTo } from "./ConceptChrome";
import { SITES, SITE_UI, sectionId, type SxItem, type SxSection } from "./sites";

const toTop = () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });

/** The section of the page that is in the middle of the screen, among the navigation's targets. */
const useActive = (ids: string[]) => {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join(" ");
  useEffect(() => {
    const els = key
      .split(" ")
      .map((i) => document.getElementById(i))
      .filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
  return active;
};

/**
 * Navigation of a website demo, the way a real site of its kind has one: the wordmark (back to the
 * top), links to the sections, the main action, and on small screens a menu that opens over the
 * page. The link of the section in view is marked.
 */
export const SiteNav: React.FC<{ id: ConceptId; wordmark: React.ReactNode; badge?: number }> = ({ id, wordmark, badge }) => {
  const { lang } = useCopy();
  const d = SITES[lang][id];
  const ui = SITE_UI[lang];
  const sheet = useId();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActive([...d.nav.map((n) => n.id), d.cta.id]);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", esc);
    document.documentElement.classList.add("cx-nav-open");
    return () => {
      window.removeEventListener("keydown", esc);
      document.documentElement.classList.remove("cx-nav-open");
    };
  }, [open]);

  const go = (target: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    // after the menu has closed, so the page under it can scroll
    requestAnimationFrame(() => goTo(target));
  };
  const count = badge ? <span className="cx-nav__badge">{badge}</span> : null;

  return (
    <header className={`cx-nav cx-nav--${id}${scrolled ? " is-scrolled" : ""}${open ? " is-open" : ""}`}>
      <button type="button" className="cx-nav__mark" onClick={() => (setOpen(false), toTop())}>
        {wordmark}
      </button>
      <nav className="cx-nav__links" aria-label={ui.nav}>
        <ul>
          {d.nav.map((n) => (
            <li key={n.id}>
              <a href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? "true" : undefined}>
                {n.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <a className="cx-nav__cta" href={`#${d.cta.id}`} onClick={go(d.cta.id)} aria-current={active === d.cta.id ? "true" : undefined}>
        {d.cta.label} {count}
      </a>
      <button type="button" className="cx-nav__burger" aria-expanded={open} aria-controls={sheet} onClick={() => setOpen((v) => !v)}>
        {open ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        <span className="mp-sr">{open ? ui.close : ui.menu}</span>
      </button>
      <div id={sheet} className="cx-nav__sheet" hidden={!open}>
        <nav aria-label={ui.nav}>
          <ol>
            {d.nav.map((n, i) => (
              <li key={n.id} style={{ "--i": i } as React.CSSProperties}>
                <a href={`#${n.id}`} onClick={go(n.id)} aria-current={active === n.id ? "true" : undefined}>
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  {n.label}
                </a>
              </li>
            ))}
          </ol>
          <a className="cx-nav__sheetcta" href={`#${d.cta.id}`} onClick={go(d.cta.id)}>
            {d.cta.label} {count} <FiArrowRight aria-hidden="true" />
          </a>
          <p>{d.tagline}</p>
        </nav>
      </div>
    </header>
  );
};

/**
 * What makes each demo's site its own, besides colours and type (the motion itself is CSS in
 * _site.scss): cards that turn over, titles built letter by letter, numbers that count up, a band
 * of words running across, a light that follows the pointer over the cards.
 */
const FLIP: Partial<Record<ConceptId, string[]>> = {
  restaurant: ["events"],
  photographer: ["services"],
  painter: ["services"],
  lighting: ["materials"],
  typographic: ["venues"],
};
const SPLIT: ConceptId[] = ["architecture", "typographic"];
const COUNT: ConceptId[] = ["logistics", "architecture", "lighting", "restaurant"];
const GLOW: ConceptId[] = ["lighting", "photographer"];
const MARQUEE: Partial<Record<ConceptId, { after: string; words: Record<"sv" | "en", string[]> }>> = {
  restaurant: { after: "menu", words: { sv: ["Antipasti", "Primi", "Secondi", "Dolci", "Limonata", "Espresso"], en: ["Antipasti", "Primi", "Secondi", "Dolci", "Limonata", "Espresso"] } },
  logistics: { after: "services", words: { sv: ["Paket", "Pall", "Flytt", "Kyl & frys", "Byggmaterial", "Samma dag"], en: ["Parcels", "Pallets", "Removals", "Chilled", "Building materials", "Same day"] } },
  typographic: { after: "about", words: { sv: ["Utställning", "Samtal", "Scen", "Rött", "Tyg", "Rörelse"], en: ["Exhibition", "Talks", "Stage", "Red", "Fabric", "Motion"] } },
};
const still = () => typeof window === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** A title whose letters arrive one by one (read whole by screen readers). */
const Split: React.FC<{ text: string }> = ({ text }) => {
  let k = 0;
  return (
    <>
      <span className="mp-sr">{text}</span>
      <span className="cx-sx__split" aria-hidden="true">
        {text.split(" ").map((word, w) => (
          <span key={w} className="cx-sx__word">
            {[...word].map((ch, i) => (
              <span key={i} className="cx-sx__ch" style={{ "--ci": k++ } as React.CSSProperties}>
                {ch}
              </span>
            ))}
          </span>
        ))}
      </span>
    </>
  );
};

/** A number that counts up from zero the first time it is seen ("40+", "98 %", "2 m" keep their unit). */
const Count: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const m = /^(\d+)(\D*)$/.exec(value);
  const [n, setN] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !m || still()) return;
    const to = Number(m[1]);
    let frame = 0;
    const seen = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        seen.disconnect();
        const t0 = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - t0) / 1400);
          setN(Math.round(to * (1 - Math.pow(1 - t, 3))));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.6 },
    );
    setN(0);
    seen.observe(el);
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span ref={ref}>
      {m && n !== null ? (
        <>
          <span aria-hidden="true">{n + m[2]}</span>
          <span className="mp-sr">{value}</span>
        </>
      ) : (
        value
      )}
    </span>
  );
};

/** A band of words running across the page, between two sections. */
const Marquee: React.FC<{ words: string[] }> = ({ words }) => (
  <div className="cx-sx-marquee" aria-hidden="true">
    <div className="cx-sx-marquee__run">
      {[0, 1].map((n) => (
        <span key={n}>
          {words.map((w) => (
            <React.Fragment key={w}>
              <b>{w}</b>
              <i />
            </React.Fragment>
          ))}
        </span>
      ))}
    </div>
  </div>
);

/** The light over a card follows the pointer (--px/--py). */
const glow = (e: React.PointerEvent<HTMLElement>) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--px", `${(((e.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
  e.currentTarget.style.setProperty("--py", `${(((e.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
};

/** A card that turns over: the name in front, what it is about on the back. */
const FlipCard: React.FC<{ it: SxItem; i: number; numbered?: boolean }> = ({ it, i, numbered }) => {
  const [on, setOn] = useState(false);
  return (
    <li className={`is-flip${on ? " is-flipped" : ""}`} style={{ "--i": i } as React.CSSProperties}>
      <button type="button" className="cx-sx__flip" aria-pressed={on} onClick={() => setOn((v) => !v)}>
        <span className="cx-sx__face cx-sx__face--front">
          {numbered && <span className="cx-sx__num">{String(i + 1).padStart(2, "0")}</span>}
          {it.meta && <span className="cx-sx__meta">{it.meta}</span>}
          <span className="cx-sx__h3">{it.title}</span>
          <FiRotateCw className="cx-sx__turn" aria-hidden="true" />
        </span>
        <span className="cx-sx__face cx-sx__face--back">
          <span className="cx-sx__h3">{it.title}</span>
          {it.text && <span className="cx-sx__p">{it.text}</span>}
        </span>
      </button>
    </li>
  );
};

const Head: React.FC<{ s: SxSection; hid: string; split?: boolean }> = ({ s, hid, split }) => (
  <div className="cx-sx__head">
    <p className="cx-sx__kicker">{s.kicker}</p>
    <h2 id={hid}>{split ? <Split text={s.title} /> : s.title}</h2>
    {"lead" in s && s.lead && <p className="cx-sx__lead">{s.lead}</p>}
  </div>
);

const Section: React.FC<{ id: ConceptId; s: SxSection }> = ({ id, s }) => {
  const hid = `${sectionId(id, s.key)}-h`;
  const split = SPLIT.includes(id);
  const flip = FLIP[id]?.includes(s.key);
  const count = COUNT.includes(id);
  const onMove = GLOW.includes(id) ? glow : undefined;
  const body = (() => {
    switch (s.kind) {
      case "text":
        return (
          <div className={`cx-sx__text${s.img ? " has-img" : ""}`}>
            <div>
              <Head s={s} hid={hid} split={split} />
              {s.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.stats && (
                <dl className="cx-sx__stats">
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <dt>{count ? <Count value={st.n} /> : st.n}</dt>
                      <dd>{st.label}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
            {s.img && (
              <figure className="cx-sx__pic">
                <img src={media(s.img[0], s.img[1])} alt={s.alt ?? ""} width={s.img[1]} height={s.img[1]} loading="lazy" decoding="async" />
              </figure>
            )}
          </div>
        );
      case "cards":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <ol className={`cx-sx__cards${s.numbered ? " is-numbered" : ""}`}>
              {s.items.map((it, i) =>
                flip ? (
                  <FlipCard key={it.title} it={it} i={i} numbered={s.numbered} />
                ) : (
                <li key={it.title} onPointerMove={onMove} style={{ "--i": i } as React.CSSProperties}>
                  {s.numbered && <span className="cx-sx__num">{String(i + 1).padStart(2, "0")}</span>}
                  {it.meta && <span className="cx-sx__meta">{it.meta}</span>}
                  <h3>{it.title}</h3>
                  {it.text && <p>{it.text}</p>}
                </li>
                ),
              )}
            </ol>
          </>
        );
      case "groups":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <div className="cx-sx__groups">
              {s.groups.map((g) => (
                <div key={g.title}>
                  <h3>{g.title}</h3>
                  <ul>
                    {g.items.map((it) => (
                      <li key={it.title}>
                        <span className="cx-sx__row">
                          <strong>{it.title}</strong>
                          <i aria-hidden="true" />
                          {it.meta && <span>{it.meta}</span>}
                        </span>
                        {it.text && <span className="cx-sx__sub">{it.text}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </>
        );
      case "gallery":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <ul className="cx-sx__gallery">
              {s.items.map((g) => (
                <li key={g.caption}>
                  <figure>
                    <img src={media(g.img[0], g.img[1])} alt={g.alt} width={g.img[1]} height={g.img[1]} loading="lazy" decoding="async" />
                    <figcaption>{g.caption}</figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </>
        );
      case "quotes":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <ul className="cx-sx__quotes">
              {s.items.map((q) => (
                <li key={q.quote}>
                  <blockquote>
                    <p>{q.quote}</p>
                    <footer>{q.by}</footer>
                  </blockquote>
                </li>
              ))}
            </ul>
            <p className="cx-sx__note">{s.note}</p>
          </>
        );
      case "faq":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <div className="cx-sx__faq">
              {s.items.map((f) => (
                <details key={f.q}>
                  <summary>
                    {f.q} <FiPlus aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </>
        );
      case "info":
        return (
          <>
            <Head s={s} hid={hid} split={split} />
            <dl className="cx-sx__info">
              {s.rows.map((r) => (
                <div key={r.label}>
                  <dt>{r.label}</dt>
                  {r.lines.map((l) => (
                    <dd key={l}>{l}</dd>
                  ))}
                </div>
              ))}
            </dl>
          </>
        );
    }
  })();
  return (
    <section id={sectionId(id, s.key)} className={`cx-sx cx-sx--${s.kind} cx-sx--${s.key}`} aria-labelledby={hid}>
      <div className="cx-sx__in">{body}</div>
    </section>
  );
};

/** Sections of a demo's site (sites.ts); `keys` picks some of them, in their order, for one place of the page. */
export const SiteSections: React.FC<{ id: ConceptId; keys?: string[] }> = ({ id, keys }) => {
  const { lang } = useCopy();
  const all = SITES[lang][id].sections;
  const list = keys ? keys.map((k) => all.find((s) => s.key === k)).filter((s): s is SxSection => !!s) : all;
  const band = MARQUEE[id];
  return (
    <>
      {list.map((s) => (
        <React.Fragment key={s.key}>
          <Section id={id} s={s} />
          {band?.after === s.key && <Marquee words={band.words[lang]} />}
        </React.Fragment>
      ))}
    </>
  );
};

/** Footer of a demo's site: wordmark, pages, details, and the plain note that it is a demo. */
export const SiteFooter: React.FC<{ id: ConceptId; wordmark: React.ReactNode }> = ({ id, wordmark }) => {
  const { lang } = useCopy();
  const d = SITES[lang][id];
  const ui = SITE_UI[lang];
  const s = conceptCopy[lang].shared;
  return (
    <footer className={`cx-foot cx-foot--${id}`}>
      <div className="cx-foot__in">
        <div className="cx-foot__brand">
          <p className="cx-foot__mark">{wordmark}</p>
          <p>{d.tagline}</p>
        </div>
        <nav aria-label={ui.footNav}>
          <h2>{ui.footNav}</h2>
          <ul>
            {[...d.nav, d.cta].map((n) => (
              <li key={n.id}>
                <a href={`#${n.id}`} onClick={(e) => (e.preventDefault(), goTo(n.id))}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {d.footer.map((col) => (
          <div key={col.title}>
            <h2>{col.title}</h2>
            <ul>
              {col.lines.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="cx-foot__base">
        <p>
          {ui.fictitious} {s.footer}
        </p>
        <p className="cx-foot__acts">
          <Link to={PATHS.contact[lang]}>
            {s.wantSite} {s.wantSiteCta} <FiArrowRight aria-hidden="true" />
          </Link>
          <button type="button" onClick={toTop}>
            {ui.top} <FiArrowUp aria-hidden="true" />
          </button>
        </p>
      </div>
    </footer>
  );
};
