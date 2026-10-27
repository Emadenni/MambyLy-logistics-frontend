import React from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import CardShowcase from "../../components/CardShowcase";
import { CardPreview } from "../../digital-card/DigitalCard";
import { examplePath, getCard, getExamples } from "../../digital-card/registry";
import { cardStrings } from "../../digital-card/strings";
import type { CardConfig } from "../../digital-card/types";
import { fill, useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { EXAMPLE_BASE, PATHS } from "../routes";

const Tile: React.FC<{ card: CardConfig; open: string; lang: "sv" | "en" }> = ({ card, open, lang }) => (
  <article className="mp-xtile2">
    <div className="mp-xtile2__card">
      <CardPreview card={card} t={cardStrings[card.lang]} withBack />
    </div>
    <p className="mp-xtile2__sector">{card.example?.sector}</p>
    <h2 className="mp-xtile2__name">
      <Link to={examplePath(card.slug, lang)} className="mp-stretch">
        {card.company || card.name}
      </Link>
    </h2>
    <p className="mp-xtile2__summary">{card.example?.summary}</p>
    <span className="mp-xtile2__more" aria-hidden="true">
      {open} <FiArrowRight />
    </span>
  </article>
);

/** /exempel – the example cards (fictitious companies), each opening its own screen. */
export const Examples: React.FC = () => {
  const t = useCopy();
  const e = t.examples;
  const examples = getExamples(t.lang);
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
          <Tile key={c.slug} card={c} open={e.open} lang={t.lang} />
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

/** /exempel/:slug – one example on a clean screen that can be shown to a client. */
export const Example: React.FC = () => {
  const t = useCopy();
  const x = t.example;
  const { slug } = useParams();
  const card = getCard(slug, t.lang);
  const examples = getExamples(t.lang);
  const paths = slug ? { sv: `${EXAMPLE_BASE.sv}/${slug}`, en: `${EXAMPLE_BASE.en}/${slug}` } : undefined;

  if (!card || !card.demo || !card.example) {
    return (
      <Screen
        id="example"
        head={<ScreenHead lang={t.lang} title={`${x.notFound} | MambyLy Solutions`} description={x.notFoundText} noindex />}
        bar={<TopBar crumbs={[{ label: t.nav.examples }]} back={{ screen: "examples", label: x.all }} service="card" />}
      >
        <div className="mp-col mp-nf">
          <h1 className="mp-display" data-focus>
            {x.notFound}
          </h1>
          <p>{x.notFoundText}</p>
          <Link to={PATHS.examples[t.lang]} className="mp-xbtn mp-xbtn--solid">
            {x.all} <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </Screen>
    );
  }

  const index = examples.findIndex((c) => c.slug === card.slug);
  const next = examples.length > 1 ? examples[(index + 1) % examples.length] : undefined;

  return (
    <Screen
      id="example"
      className="mp-xpage2"
      head={
        <ScreenHead
          lang={t.lang}
          title={card.meta?.title || `${card.company || card.name} | MambyLy Solutions`}
          description={card.meta?.description || card.example.summary}
          paths={paths}
          image={`/cards/${card.slug}/og.png`}
          noindex
        />
      }
      bar={<TopBar crumbs={[{ label: t.nav.examples, to: PATHS.examples[t.lang] }, { label: card.company || card.name }]} back={{ screen: "examples", label: x.all }} service="card" />}
    >
      <div className="mp-col mp-xone">
        <p className="mp-pill2">{x.pill}</p>
        <p className="mp-xone__sector">{card.example.sector}</p>
        <h1 className="mp-display mp-xone__title" data-focus>
          {card.company || card.name}
        </h1>
        <CardShowcase card={card} className="mp-xone__card" />
        <p className="mp-xone__summary">{card.example.summary}</p>
        <Link to={PATHS.contact[t.lang]} state={{ service: "card", example: card.slug }} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
          {x.cta} <FiArrowUpRight aria-hidden="true" />
        </Link>
        {next && (
          <Link to={examplePath(next.slug, t.lang)} className="mp-underline mp-underline--small">
            {fill(x.next, { name: next.company || next.name })} <FiArrowRight aria-hidden="true" />
          </Link>
        )}
        <Link to={PATHS.examples[t.lang]} className="mp-back mp-xone__all">
          <FiArrowLeft aria-hidden="true" /> {x.all}
        </Link>
      </div>
    </Screen>
  );
};
