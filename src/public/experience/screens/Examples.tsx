import React from "react";
import { Link, Navigate, useLocation, useParams } from "react-router-dom";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import CardExperience from "../../digital-card/CardExperience";
import StyleCard from "../../digital-card/StyleCard";
import { examplePath, getCard, getExamples } from "../../digital-card/registry";
import type { CardConfig } from "../../digital-card/types";
import { fill, useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { EXAMPLE_BASE, PATHS } from "../routes";
import { ExitBar } from "../concepts/ConceptChrome";
import { NotFound } from "./Privacy";

/** Example cards of earlier versions of the site: moved to their closest style, or to the gallery. */
const RETIRED: Record<string, string | null> = {
  professionell: "alex-lind",
  redaktionell: "kim-dahl",
  expressiv: "jamie-lund",
  exempelbageriet: null,
  "fjardvik-agentur": null,
  "kvist-och-hyvel": null,
  rutglans: null,
  "studio-halvljus": null,
};

/** Designs on a dark surface (light text and controls around the card). */
const DARK = new Set(["velvet", "oxblood", "graphite"]);

/** One example in a gallery: the real card face (no controls) and its style. */
export const ExampleTile: React.FC<{ card: CardConfig; open: string; lang: "sv" | "en"; eager?: boolean }> = ({ card, open, lang }) => (
  <article className="mp-xtile2">
    <div className="mp-xtile2__card">
      <StyleCard card={card} lang={lang} mini />
    </div>
    <h2 className="mp-xtile2__name">
      <Link to={examplePath(card.slug, lang)} className="mp-stretch">
        {card.example?.sector}
      </Link>
    </h2>
    <p className="mp-xtile2__summary">{card.example?.summary}</p>
    <span className="mp-xtile2__more" aria-hidden="true">
      {open} <FiArrowRight />
    </span>
  </article>
);

/** /exempel – the six example cards, labelled by style (fictitious people), each opening fullscreen. */
export const Examples: React.FC = () => {
  const t = useCopy();
  const e = t.examples;
  const examples = getExamples(t.lang).filter((c) => c.design);
  return (
    <Screen
      id="examples"
      head={<ScreenHead lang={t.lang} title={t.meta.examples.title} description={t.meta.examples.description} screen="examples" image="/brand/og-exempel.png" />}
      bar={<TopBar crumbs={[{ label: t.nav.cards, to: PATHS.cards[t.lang] }, { label: t.nav.examples }]} back={{ screen: "cards", label: t.common.back }} service="card" />}
    >
      <div className="mp-col mp-xlist">
        <h1 className="mp-display mp-xlist__title" data-focus>
          {e.title}
        </h1>
        <p className="mp-xlist__lead">{e.lead}</p>
        <p className="mp-xlist__note">
          <span className="mp-pill2">{e.badge}</span> {e.note}
        </p>
      </div>
      <div className="mp-xgrid">
        {examples.map((c) => (
          <ExampleTile key={c.slug} card={c} open={e.open} lang={t.lang} />
        ))}
      </div>
      <div className="mp-col mp-xlist__cta">
        <h2 className="mp-xlist__ctatitle">{e.ctaTitle}</h2>
        <p>{e.ctaText}</p>
        <Link to={PATHS.contact[t.lang]} state={{ service: "card" }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
          {e.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
      </div>
    </Screen>
  );
};

/**
 * /exempel/:slug – one example card fullscreen, on a surface in its own tone: try the actions
 * (the contact file holds the fictitious data, e-mail only explains the demo), then go on.
 */
export const Example: React.FC = () => {
  const t = useCopy();
  const x = t.example;
  const { slug } = useParams();
  const location = useLocation();
  const card = getCard(slug, t.lang);
  const examples = getExamples(t.lang).filter((c) => c.design);

  if (slug && slug in RETIRED) {
    const moved = RETIRED[slug];
    return <Navigate to={moved ? examplePath(moved, t.lang) : PATHS.examples[t.lang]} replace state={location.state} />;
  }
  if (!card || !card.demo || !card.example) return <NotFound />;

  const paths = { sv: `${EXAMPLE_BASE.sv}/${card.slug}`, en: `${EXAMPLE_BASE.en}/${card.slug}` };
  const index = examples.findIndex((c) => c.slug === card.slug);
  const next = examples.length > 1 ? examples[(index + 1) % examples.length] : undefined;
  const dark = !!card.design && DARK.has(card.design);

  return (
    <div className={`mp-concept mp-cardx mp-cardx--${card.design ?? "flip"}${dark ? " mp-cardx--dark" : ""}`}>
      <ScreenHead
        lang={t.lang}
        title={card.meta?.title || `${card.example.sector} | MambyLy Solutions`}
        description={card.meta?.description || card.example.summary}
        paths={paths}
        noindex
      />
      <main id="cx-main-card" className="mp-cardx__main">
        <div className="mp-cardx__card">{card.design ? <StyleCard card={card} lang={t.lang} /> : <CardExperience card={card} />}</div>
        <div className="mp-cardx__text">
          <p className="mp-cardx__pill">
            {x.pill} · {card.example.sector}
          </p>
          <p className="mp-cardx__summary">{card.example.summary}</p>
        </div>
        <div className="mp-cardx__end">
          <Link to={PATHS.contact[t.lang]} state={{ service: "card", example: card.slug }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg mp-cardx__cta">
            {x.cta} <FiArrowUpRight aria-hidden="true" />
          </Link>
          {next && (
            <Link to={examplePath(next.slug, t.lang)} className="mp-underline mp-underline--small mp-cardx__next">
              {fill(x.next, { name: next.example?.sector ?? next.name })} <FiArrowRight aria-hidden="true" />
            </Link>
          )}
        </div>
      </main>
      <ExitBar to="examples" label={x.all} tone={dark ? "dark" : "light"} note={x.pill} />
    </div>
  );
};
