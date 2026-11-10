import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LuArrowLeft, LuArrowRight, LuCheck, LuClock, LuRotateCcw } from "react-icons/lu";
import { phoneLang, pick } from "../shared/engine";
import { TOOLS_LOGO } from "../catalogue";
import { PATHS } from "../../experience/routes";
import Listen from "./Listen";
import PointArt from "./PointArt";
import { GUIDE_UI } from "./strings";
import type { GuideLang, Place, Point } from "./types";
import { clearSeen, markSeen, readSeen, saveGuideLang, savedGuideLang } from "./visited";
import "../../styles/guide.scss";

/** The walk as a list: a tick for the points already seen, the one you are at marked. */
const RouteList: React.FC<{ place: Place; base: string; lang: GuideLang; seen: string[]; current?: string }> = ({ place, base, lang, seen, current }) => {
  const u = GUIDE_UI[lang];
  const done = place.points.filter((p) => seen.includes(p.id)).length;
  return (
    <section className="gd-route" aria-labelledby="gd-route-h">
      <div className="gd-route__head">
        <h2 id="gd-route-h">{u.route}</h2>
        <span>{u.routeSeen(done, place.points.length)}</span>
      </div>
      <ol>
        {place.points.map((p, i) => {
          const isSeen = seen.includes(p.id);
          const here = p.id === current;
          return (
            <li key={p.id} className={`${isSeen ? "is-seen" : ""} ${here ? "is-here" : ""}`.trim()}>
              <Link to={`${base}/${p.id}`} aria-current={here ? "step" : undefined}>
                <span className="gd-route__n" aria-hidden="true">
                  {isSeen ? <LuCheck /> : i + 1}
                </span>
                <span className="gd-route__name">{pick(p.name, lang)}</span>
                <span className="gd-route__state">{here ? u.here : isSeen ? u.seen : ""}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

const Picture: React.FC<{ point: Point; lang: GuideLang }> = ({ point, lang }) => {
  const u = GUIDE_UI[lang];
  const photo = point.photo;
  if (!photo) return null;
  const label = pick(photo.alt, lang) || `${u.drawing}: ${pick(point.name, lang)}`;
  return (
    <figure className="gd-photo">
      {photo.src ? <img src={photo.src} alt={pick(photo.alt, lang)} width={1200} height={750} decoding="async" /> : photo.art ? <PointArt art={photo.art} label={label} /> : null}
    </figure>
  );
};

/**
 * The visitor's page of a place: its start (welcome, hours, the whole walk) or one point (name, its
 * number on the walk, picture, text, Listen, next point). Language from the phone, with a switch;
 * the points seen are kept only in this browser.
 */
const GuideView: React.FC<{ place: Place; pointId?: string; base: string }> = ({ place, pointId, base }) => {
  const [lang, setLang] = useState<GuideLang>(() => savedGuideLang(place.languages) ?? phoneLang(place.languages));
  const [seen, setSeen] = useState<string[]>(() => readSeen(place.slug));
  const top = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const u = GUIDE_UI[lang];

  const index = pointId ? place.points.findIndex((p) => p.id === pointId) : -1;
  const point = index >= 0 ? place.points[index] : undefined;

  // a point opened is a point seen; a new point starts at the top
  useEffect(() => {
    if (point) setSeen(markSeen(place.slug, point.id));
    if (first.current) first.current = false;
    else top.current?.scrollIntoView({ block: "start" });
  }, [place.slug, point]);

  const choose = (l: GuideLang) => {
    setLang(l);
    saveGuideLang(l);
  };

  const next = index >= 0 ? place.points[index + 1] : undefined;
  const prev = index > 0 ? place.points[index - 1] : undefined;
  const allSeen = place.points.every((p) => seen.includes(p.id));
  const title = point ? `${pick(point.name, lang)} – ${place.name}` : place.name;

  return (
    <div className="gd" lang={lang} ref={top}>
      <Helmet htmlAttributes={{ lang }}>
        <title>{`${title} – MambyLy Guide`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content="#1d3a35" />
      </Helmet>

      <header className="gd-top">
        <div className="gd-top__bar">
          {point || pointId ? (
            <Link to={base} className="gd-top__home">
              <LuArrowLeft aria-hidden /> <span>{place.name}</span>
            </Link>
          ) : place.demo ? (
            <span className="gd-demo">{u.demo}</span>
          ) : (
            <span />
          )}
          {place.languages.length > 1 && (
            <div className="gd-langs" role="group" aria-label={u.language}>
              {place.languages.map((l) => (
                <button key={l} type="button" aria-pressed={l === lang} lang={l} onClick={() => choose(l)}>
                  {l.toUpperCase()}
                  <span className="gd-vh"> {GUIDE_UI[l].langName}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <main className="gd-main">
        {point ? (
          <>
            <Picture point={point} lang={lang} />
            <div className="gd-point">
              <p className="gd-count">{u.pointOf(index + 1, place.points.length)}</p>
              <h1 data-focus>{pick(point.name, lang)}</h1>
              <p className="gd-text">{pick(point.text, lang)}</p>
              <Listen text={pick(point.text, lang)} lang={lang} audioSrc={point.audio?.[lang]} />
              <nav className="gd-nav" aria-label={u.route}>
                {next ? (
                  <Link to={`${base}/${next.id}`} className="gd-btn gd-btn--solid">
                    {u.next}: {pick(next.name, lang)} <LuArrowRight aria-hidden />
                  </Link>
                ) : (
                  <Link to={base} className="gd-btn gd-btn--solid">
                    {u.toStart} <LuArrowRight aria-hidden />
                  </Link>
                )}
                {prev && (
                  <Link to={`${base}/${prev.id}`} className="gd-btn">
                    <LuArrowLeft aria-hidden /> {u.prev}
                  </Link>
                )}
              </nav>
              {!next && allSeen && <p className="gd-done">{u.done}</p>}
            </div>
          </>
        ) : (
          <div className="gd-point gd-start">
            <h1 data-focus>{place.name}</h1>
            <p className="gd-place">{pick(place.place, lang)}</p>
            {pointId && <p className="gd-note">{u.pointMissing}</p>}
            <p className="gd-text">{pick(place.welcome, lang)}</p>
            {place.hours && (
              <p className="gd-hours">
                <LuClock aria-hidden />
                <span>
                  <b>{u.hours}</b> {pick(place.hours, lang)}
                </span>
              </p>
            )}
            <div className="gd-nav">
              <Link to={`${base}/${place.points[0].id}`} className="gd-btn gd-btn--solid">
                {u.startWalk} <LuArrowRight aria-hidden />
              </Link>
            </div>
            {allSeen && <p className="gd-done">{u.done}</p>}
          </div>
        )}

        <RouteList place={place} base={base} lang={lang} seen={seen} current={point?.id} />

        {seen.length > 0 && !point && (
          <button
            type="button"
            className="gd-reset"
            onClick={() => {
              clearSeen(place.slug);
              setSeen([]);
            }}
          >
            <LuRotateCcw aria-hidden /> {u.again}
          </button>
        )}
      </main>

      {place.demo && <p className="gd-demo-note">{u.demoNote}</p>}

      <footer className="gd-foot">
        <Link to={PATHS.toolsGuide[lang === "de" ? "en" : lang]} aria-label={u.poweredBy}>
          <img src={TOOLS_LOGO.green} alt="MambyLy Tools" width={584} height={199} loading="lazy" />
          <span>{u.poweredBy}</span>
        </Link>
      </footer>
    </div>
  );
};

export default GuideView;
