import React, { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUp, FiMenu, FiPlus, FiX } from "react-icons/fi";
import { useCopy } from "../i18n";
import { media } from "../media";
import { PATHS, type ConceptId } from "../routes";
import { conceptCopy } from "./content";
import { goTo } from "./ConceptChrome";
import { SITES, SITE_UI, sectionId, type SxSection } from "./sites";

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

const Head: React.FC<{ s: SxSection; hid: string }> = ({ s, hid }) => (
  <div className="cx-sx__head">
    <p className="cx-sx__kicker">{s.kicker}</p>
    <h2 id={hid}>{s.title}</h2>
    {"lead" in s && s.lead && <p className="cx-sx__lead">{s.lead}</p>}
  </div>
);

const Section: React.FC<{ id: ConceptId; s: SxSection }> = ({ id, s }) => {
  const hid = `${sectionId(id, s.key)}-h`;
  const body = (() => {
    switch (s.kind) {
      case "text":
        return (
          <div className={`cx-sx__text${s.img ? " has-img" : ""}`}>
            <div>
              <Head s={s} hid={hid} />
              {s.text.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {s.stats && (
                <dl className="cx-sx__stats">
                  {s.stats.map((st) => (
                    <div key={st.label}>
                      <dt>{st.n}</dt>
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
            <Head s={s} hid={hid} />
            <ol className={`cx-sx__cards${s.numbered ? " is-numbered" : ""}`}>
              {s.items.map((it, i) => (
                <li key={it.title}>
                  {s.numbered && <span className="cx-sx__num">{String(i + 1).padStart(2, "0")}</span>}
                  {it.meta && <span className="cx-sx__meta">{it.meta}</span>}
                  <h3>{it.title}</h3>
                  {it.text && <p>{it.text}</p>}
                </li>
              ))}
            </ol>
          </>
        );
      case "groups":
        return (
          <>
            <Head s={s} hid={hid} />
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
            <Head s={s} hid={hid} />
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
            <Head s={s} hid={hid} />
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
            <Head s={s} hid={hid} />
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
            <Head s={s} hid={hid} />
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
  return (
    <>
      {list.map((s) => (
        <Section key={s.key} id={id} s={s} />
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
