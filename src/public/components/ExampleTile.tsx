import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { CardPreview } from "../digital-card/DigitalCard";
import { examplePath } from "../digital-card/registry";
import { cardStrings } from "../digital-card/strings";
import type { CardConfig } from "../digital-card/types";

/** A link to one example: a static picture of the card (front, back on hover) and its label. */
const ExampleTile: React.FC<{ card: CardConfig; detailed?: boolean; headingLevel?: "h2" | "h3" }> = ({ card, detailed = false, headingLevel = "h3" }) => {
  const Heading = headingLevel;
  return (
    <article className={`mp-xtile${detailed ? " mp-xtile--detailed" : ""}`}>
      <div className="mp-xtile__card">
        <CardPreview card={card} t={cardStrings[card.lang]} withBack />
      </div>
      <div className="mp-xtile__meta">
        <p className="mp-xtile__sector">{card.example?.sector}</p>
        <Heading className="mp-xtile__name">
          <Link to={examplePath(card.slug)} className="mp-xtile__link">
            {card.company || card.name}
          </Link>
        </Heading>
        {detailed && <p className="mp-xtile__summary">{card.example?.summary}</p>}
        <span className="mp-xtile__more" aria-hidden="true">
          Öppna exemplet <FiArrowRight />
        </span>
      </div>
    </article>
  );
};

export default ExampleTile;
