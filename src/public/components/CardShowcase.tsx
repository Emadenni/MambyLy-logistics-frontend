import React, { useState } from "react";
import DigitalCard from "../digital-card/DigitalCard";
import FlipIcon from "../digital-card/FlipIcon";
import { IconButton } from "../digital-card/CardExperience";
import { cardStrings } from "../digital-card/strings";
import type { CardConfig } from "../digital-card/types";

/**
 * An example card to look at and turn (home hero, /exempel/:slug). No sharing, no contact file:
 * demo contacts only show a notice, nothing is called or sent.
 */
const CardShowcase: React.FC<{ card: CardConfig; intro?: boolean; className?: string }> = ({ card, intro = true, className = "" }) => {
  const t = cardStrings[card.lang];
  const [flipped, setFlipped] = useState(false);
  const [notice, setNotice] = useState("");

  return (
    <div className={`mp-showcase ${className}`}>
      <DigitalCard card={card} t={t} flipped={flipped} onFlippedChange={setFlipped} onDemoAction={() => setNotice(t.demoAction)} intro={intro} />
      <div className="mp-showcase__bar">
        <IconButton label={flipped ? t.flipToFront : t.flipToBack} onClick={() => setFlipped((v) => !v)}>
          <FlipIcon />
        </IconButton>
        <p className="mp-showcase__hint" aria-hidden="true">{t.hint}</p>
      </div>
      <p className="mp-sr" aria-live="polite">{flipped ? t.showingBack : t.showingFront}</p>
      <div className="dc-status" role="status" aria-live="polite">
        {notice && <p className="dc-status__msg dc-status__msg--info">{notice}</p>}
      </div>
    </div>
  );
};

export default CardShowcase;
