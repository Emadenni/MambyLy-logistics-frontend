import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS, conceptPath } from "../routes";
import { media } from "../media";
import Carousel from "../Carousel";
import { CONCEPT_ORDER } from "../concepts/content";

/**
 * /webbplatser – the question, then one manual gallery of the six demo websites. Each preview is a
 * real screenshot of the finished demo on a phone-sized screen, and each opens the demo fullscreen.
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
      </div>

      <Carousel id="websites" className="mp-gal" label={w.galleryLabel} prev={w.prev} next={w.next} position={w.position}>
        {CONCEPT_ORDER.map((id, i) => {
          const c = w.concepts[id];
          return (
            <article key={id} className={`mp-gal__card mp-gal__card--${id}`}>
              <div className="mp-browser mp-gal__shot">
                <span className="mp-browser__dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </span>
                <img src={media(`preview-${id}-mobile`, 390)} alt={c.alt} width={390} height={844} loading={i < 2 ? "eager" : "lazy"} decoding="async" draggable={false} />
              </div>
              <h2 className="mp-gal__name">
                <Link to={conceptPath(id, t.lang)} className="mp-stretch">
                  {c.label}
                </Link>
              </h2>
              <p className="mp-gal__caption">{c.caption}</p>
              <span className="mp-gal__open" aria-hidden="true">
                {w.open} <FiArrowRight />
              </span>
            </article>
          );
        })}
      </Carousel>
      <p className="mp-col mp-web__note">{w.conceptNote}</p>

      <div className="mp-col mp-web__end">
        <p className="mp-web__tagline">{w.tagline}</p>
        <Link to={PATHS.method[t.lang]} className="mp-underline">
          {w.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </Screen>
  );
};

export default Websites;
