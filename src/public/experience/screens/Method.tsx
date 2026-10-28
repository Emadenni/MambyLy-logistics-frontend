import React from "react";
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { media } from "../media";

/**
 * /webbplatser/vart-satt – one screen about the way we work, for simple showcase sites and for
 * projects with more features alike: goal → design → delivery next to one real preview (in the
 * language of the page), one sentence on what is possible and one way on: the contact wizard with
 * the website context. Nothing to choose or classify here.
 */
const Method: React.FC = () => {
  const t = useCopy();
  const m = t.method;

  return (
    <Screen
      id="method"
      head={<ScreenHead lang={t.lang} title={t.meta.method.title} description={t.meta.method.description} screen="method" />}
      bar={
        <TopBar
          crumbs={[{ label: t.nav.websites, to: PATHS.websites[t.lang] }, { label: t.nav.method }]}
          back={{ screen: "websites", label: t.common.back }}
          service="site"
        />
      }
    >
      <div className="mp-col mp-method">
        <h1 className="mp-display mp-method__title" data-focus>
          {m.title}
        </h1>
        <p className="mp-method__lead">{m.lead}</p>

        <div className="mp-method__way">
          <figure className="mp-browser mp-method__preview">
            <span className="mp-browser__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <img
              src={media(`preview-${t.lang}-architecture-desktop`, 640)}
              srcSet={`${media(`preview-${t.lang}-architecture-desktop`, 640)} 640w, ${media(`preview-${t.lang}-architecture-desktop`, 1280)} 1280w`}
              sizes="(min-width: 640px) 560px, 92vw"
              alt={m.previewAlt}
              width={640}
              height={400}
              decoding="async"
              draggable={false}
            />
          </figure>
          <ol className="mp-method__steps">
            {m.steps.map((s, i) => (
              <li key={s.title}>
                <span className="mp-method__no" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <strong>{s.title}</strong>
                <span>{s.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mp-method__more">{m.possibilities}</p>
        <p className="mp-method__note">{m.note}</p>

        <div className="mp-method__end">
          <Link to={PATHS.contact[t.lang]} state={{ service: "site" }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
            {m.cta} <FiArrowUpRight aria-hidden="true" />
          </Link>
          <p className="mp-method__ctanote">{m.ctaNote}</p>
        </div>
      </div>
    </Screen>
  );
};

export default Method;
