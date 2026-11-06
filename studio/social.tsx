import React, { useLayoutEffect, useMemo, useRef } from "react";
import { createRoot } from "react-dom/client";
import CardExperience from "../src/public/digital-card/CardExperience";
import { getExamples } from "../src/public/digital-card/registry";
import { cardStrings } from "../src/public/digital-card/strings";
import { validateCard } from "../src/public/digital-card/validate";
import type { CardConfig } from "../src/public/digital-card/types";
import { demoMaklare } from "./cards/demo-maklare/card";
import "../src/public/styles/public.scss";
import "./social.scss";

/**
 * One still image per URL, captured by social.mjs (the card is the real CardExperience):
 * ?scene=card&card=<slug>    the card alone
 * ?scene=tilt&card=<slug>    the card in perspective, with a soft shadow
 * ?scene=full&card=<slug>    the whole experience: the phone's screen, shown in an iframe
 * ?scene=phone&bg=<colour>   a phone drawn in CSS around scene=full
 */
const params = new URLSearchParams(window.location.search);
const scene = params.get("scene") ?? "card";
const slug = params.get("card") ?? demoMaklare.raw.slug;

const cardBySlug = (): CardConfig => {
  const card = slug === demoMaklare.raw.slug ? validateCard(demoMaklare.raw, demoMaklare.assets) : getExamples().find((c) => c.slug === slug);
  if (!card) throw new Error(`social: no demo card "${slug}"`);
  return card;
};

/** The card's back has no badge of its own: the front's badge, so that every picture says it is an example. */
const Card: React.FC<{ card: CardConfig }> = ({ card }) => {
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const badge = document.createElement("span");
    badge.className = "dc__badge sc-back-badge";
    badge.textContent = cardStrings[card.lang].demoBadge;
    root.current?.querySelector(".dc__face--back")?.append(badge);
    return () => badge.remove();
  }, [card]);
  return (
    <div ref={root}>
      <CardExperience card={card} headingLevel="h2" />
    </div>
  );
};

const Social: React.FC = () => {
  const card = useMemo(() => (scene === "phone" ? null : cardBySlug()), []);
  if (scene === "phone") {
    return (
      <div className="sc-mock" style={{ background: params.get("bg") ?? undefined }}>
        <div className="sc-phone">
          <i className="sc-phone__key sc-phone__key--power" />
          <i className="sc-phone__key sc-phone__key--up" />
          <i className="sc-phone__key sc-phone__key--down" />
          <div className="sc-phone__screen">
            {/* No Fullscreen API: the view covers the iframe (the card's own fallback), not the whole page. */}
            <iframe title="screen" src={`?scene=full&card=${encodeURIComponent(slug)}`} width={390} height={844} allow="fullscreen 'none'" />
          </div>
          <i className="sc-phone__island" />
        </div>
      </div>
    );
  }
  return (
    <div className={`mambyly-public sc-scene sc-scene--${scene}`}>
      {scene === "tilt" && <div className="sc-tilt__shadow" aria-hidden="true" />}
      <div className="sc-tilt__card">
        <Card card={card!} />
      </div>
    </div>
  );
};

createRoot(document.getElementById("social")!).render(<Social />);
