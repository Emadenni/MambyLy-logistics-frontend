import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS, conceptPath } from "../routes";
import { media } from "../media";
import { CONCEPT_ORDER } from "../concepts/content";

/**
 * /webbplatser – the question, then the five design concepts by style. Each preview is a real
 * screenshot of the finished demo (desktop and phone), and each opens the demo fullscreen.
 * The page scrolls: the gallery is meant to be browsed.
 */
const Websites: React.FC = () => {
  const t = useCopy();
  const w = t.websites;

  return (
    <Screen
      id="websites"
      head={<ScreenHead lang={t.lang} title={t.meta.websites.title} description={t.meta.websites.description} screen="websites" />}
      bar={<TopBar crumbs={[{ label: t.nav.websites }]} back={{ screen: "explore", label: t.common.explore }} service="site" />}
    >
      <div className="mp-col mp-web">
        <h1 className="mp-display mp-web__title" data-focus>
          {w.title}
        </h1>
        <p className="mp-web__lead">{w.lead}</p>
        <p className="mp-web__note">
          <span className="mp-pill2">{w.galleryLabel}</span> {w.conceptNote}
        </p>
      </div>

      <ul className="mp-gal" aria-label={w.galleryLabel}>
        {CONCEPT_ORDER.map((id, i) => {
          const c = w.concepts[id];
          return (
            <li key={id} className={`mp-gal__item mp-gal__item--${id}`}>
              <figure className="mp-gal__shots">
                <div className="mp-browser mp-gal__desk">
                  <span className="mp-browser__dots" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <img
                    src={media(`preview-${id}-desktop`, 640)}
                    srcSet={`${media(`preview-${id}-desktop`, 640)} 640w, ${media(`preview-${id}-desktop`, 1280)} 1280w`}
                    sizes="(min-width: 960px) 520px, 88vw"
                    alt={c.alt}
                    width={640}
                    height={400}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                </div>
                <img
                  className="mp-gal__phone"
                  src={media(`preview-${id}-mobile`, 390)}
                  alt=""
                  width={390}
                  height={844}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </figure>
              <div className="mp-gal__text">
                <p className="mp-gal__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mp-gal__name">
                  <Link to={conceptPath(id, t.lang)} className="mp-stretch">
                    {c.label}
                  </Link>
                </h2>
                <p className="mp-gal__caption">{c.caption}</p>
                <span className="mp-gal__open" aria-hidden="true">
                  {w.open} <FiArrowRight />
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mp-col mp-web__end">
        <p className="mp-web__tagline">{w.tagline}</p>
        <Link to={PATHS.method[t.lang]} className="mp-underline">
          {w.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
        <p className="mp-web__foot" aria-hidden="true">
          {w.foot}
        </p>
      </div>
    </Screen>
  );
};

export default Websites;
