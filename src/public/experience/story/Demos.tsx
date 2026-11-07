import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft, FiArrowRight, FiShare2 } from "react-icons/fi";
import { CardPreview } from "../../digital-card/DigitalCard";
import { COMPANY_CARD_SLUG, examplePath, getCard, getExamples } from "../../digital-card/registry";
import { cardStrings } from "../../digital-card/strings";
import type { CardConfig } from "../../digital-card/types";
import { CONCEPT_ORDER } from "../concepts/content";
import { useCopy } from "../i18n";
import { media } from "../media";
import { CARD_PATH, PATHS, conceptPath } from "../routes";
import { SITE } from "../Screen";

/** The carousel drifts by itself (px per second) while it is on screen and nobody touches it. */
const DRIFT = 34;
const RESUME = 5000;

/** A swipe up of at least this many px shares the card; a press that moves less than TAP flips it. */
const SWIPE = 50;
const TAP = 8;

const absolute = (path: string) => `${SITE}${encodeURI(path)}`;

/**
 * One card of the carousel: the real card design, front and back. A tap turns it, a swipe up
 * shares it (as on the real card), the light follows the pointer. The name below opens the page.
 */
const DemoCard: React.FC<{
  card: CardConfig;
  href: string;
  label: string;
  hint: string;
  shareLabel: string;
  copied: string;
  /** a press on a card beside the centre brings it to the centre instead of turning it */
  onSide: (el: HTMLElement) => boolean;
}> = ({ card, href, label, hint, shareLabel, copied, onSide }) => {
  const [flipped, setFlipped] = useState(false);
  const [note, setNote] = useState("");
  const stage = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number; id: number } | null>(null);
  const t = cardStrings[card.lang];

  const share = async () => {
    const url = absolute(href);
    try {
      if (navigator.share) await navigator.share({ title: card.name, url });
      else {
        await navigator.clipboard.writeText(url);
        setNote(copied);
        window.setTimeout(() => setNote(""), 2200);
      }
    } catch {
      // closed by the visitor, or not allowed: nothing to do
    }
  };

  const onPointerDown = (e: React.PointerEvent) => {
    press.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const p = press.current;
    press.current = null;
    if (!p || p.id !== e.pointerId) return;
    const dx = e.clientX - p.x;
    const dy = e.clientY - p.y;
    if (dy < -SWIPE && Math.abs(dx) < SWIPE) void share();
    else if (Math.abs(dx) < TAP && Math.abs(dy) < TAP) {
      if (stage.current && onSide(stage.current)) return;
      setFlipped((f) => !f);
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = stage.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
    el.style.setProperty("--my", (((e.clientY - r.top) / r.height) * 100).toFixed(1) + "%");
  };

  return (
    <li className="mp-demos__card">
      <div
        ref={stage}
        className={`mp-demos__stage${flipped ? " is-flipped" : ""}`}
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${label}: ${flipped ? t.back : t.front}. ${hint}`}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (press.current = null)}
        onPointerMove={onPointerMove}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
      >
        <CardPreview card={card} t={t} withBack />
        <span className="mp-demos__sheen" aria-hidden="true" />
      </div>
      <div className="mp-demos__meta">
        <Link to={href} className="mp-demos__name">
          {label} <FiArrowRight aria-hidden="true" />
        </Link>
        <button type="button" className="mp-demos__share" onClick={share} aria-label={`${shareLabel}: ${label}`}>
          <FiShare2 aria-hidden="true" />
        </button>
      </div>
      <p className="mp-demos__note" role="status">
        {note}
      </p>
    </li>
  );
};

/** Arrows and dots under a sideways list; `at` is the item in the centre. */
const Pager: React.FC<{ count: number; at: number; go: (i: number) => void; prev: string; next: string; label: string }> = ({ count, at, go, prev, next, label }) => (
  <div className="mp-demos__pager">
    <button type="button" className="mp-demos__arrow" onClick={() => go(at - 1)} disabled={at <= 0} aria-label={prev}>
      <FiArrowLeft aria-hidden="true" />
    </button>
    <ol className="mp-demos__dots" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <button type="button" aria-label={`${i + 1} / ${count}`} aria-current={i === at ? "true" : undefined} onClick={() => go(i)} />
        </li>
      ))}
    </ol>
    <button type="button" className="mp-demos__arrow" onClick={() => go(at + 1)} disabled={at >= count - 1} aria-label={next}>
      <FiArrowRight aria-hidden="true" />
    </button>
  </div>
);

/** Scrolls a sideways list so item i is in its centre. */
const centre = (list: HTMLElement | null, i: number, smooth = true) => {
  const item = list?.children[i] as HTMLElement | undefined;
  if (!list || !item) return;
  list.scrollTo({ left: item.offsetLeft - (list.clientWidth - item.offsetWidth) / 2, behavior: smooth ? "smooth" : "auto" });
};

/** Which item of a sideways list is nearest its centre. */
const nearest = (list: HTMLElement) => {
  const box = list.getBoundingClientRect();
  const mid = box.left + box.width / 2;
  let best = 0;
  let dist = Infinity;
  [...list.children].forEach((c, i) => {
    const r = c.getBoundingClientRect();
    const d = Math.abs(r.left + r.width / 2 - mid);
    if (d < dist) {
      dist = d;
      best = i;
    }
  });
  return best;
};

/**
 * After the 3D story: the demos of both services, with the same weight. Example cards in a 3D
 * carousel (turn, light, share), website demos in frames that tilt and scroll by themselves. Every
 * demo opens its real page. Restores the old explore page's two doors and their texts.
 */
const Demos: React.FC<{ still: boolean }> = ({ still }) => {
  const t = useCopy();
  const d = t.story.demos;
  const company = getCard(COMPANY_CARD_SLUG, t.lang);
  const examples = getExamples(t.lang).filter((c) => c.design);
  const track = useRef<HTMLOListElement>(null);
  const sites = useRef<HTMLUListElement>(null);
  const [cardAt, setCardAt] = useState(0);
  const [siteAt, setSiteAt] = useState(0);

  // Cards: a coverflow. Each card turns and steps back with its distance from the centre.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    // start on the card in the middle, so there are cards on both sides
    centre(el, Math.floor(el.children.length / 2), false);
    let arrived = -1;
    let frame = 0;
    const update = () => {
      frame = 0;
      const at = nearest(el);
      setCardAt(at);
      // the card that has just arrived in the centre gets its moment (see .is-arrived)
      if (at !== arrived) {
        arrived = at;
        [...el.children].forEach((c, i) => c.classList.toggle("is-arrived", i === at));
      }
      if (still) return;
      const box = el.getBoundingClientRect();
      const centre = box.left + box.width / 2;
      el.querySelectorAll<HTMLElement>(".mp-demos__card").forEach((item) => {
        const r = item.getBoundingClientRect();
        const dist = (r.left + r.width / 2 - centre) / r.width;
        item.style.setProperty("--d", Math.max(-2, Math.min(2, dist)).toFixed(3));
        item.style.setProperty("--meta-v", Math.abs(dist) > 0.4 ? "hidden" : "visible");
      });
    };
    const ask = () => (frame ||= requestAnimationFrame(update));
    update();
    el.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("resize", ask);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener("scroll", ask);
      window.removeEventListener("resize", ask);
    };
  }, [still]);

  // Cards: a slow, continuous drift back and forth while the carousel is on screen. A touch, a
  // wheel, a mouse over it or keyboard focus pauses it; it goes on a while after. While it drifts
  // the snapping is off (it would pull the cards back), and comes back as soon as someone takes over.
  useEffect(() => {
    const el = track.current;
    if (!el || still) return;
    let visible = false;
    let pausedUntil = 0;
    let mouseOver = false;
    let dir = 1;
    let pos = el.scrollLeft;
    let last = 0;
    let frame = 0;
    const seen = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 });
    seen.observe(el);
    const take = () => {
      pausedUntil = Date.now() + RESUME;
      el.classList.remove("is-drifting");
    };
    const over = (e: PointerEvent) => {
      if (e.pointerType === "mouse") mouseOver = true;
    };
    const out = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouseOver = false;
      take();
    };
    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0;
      last = now;
      const free = visible && !mouseOver && Date.now() > pausedUntil && !document.hidden;
      if (!free) {
        pos = el.scrollLeft;
        return;
      }
      if (!el.classList.contains("is-drifting")) {
        el.classList.add("is-drifting");
        pos = el.scrollLeft;
      }
      const max = el.scrollWidth - el.clientWidth;
      pos += dir * DRIFT * dt;
      if (pos >= max) {
        pos = max;
        dir = -1;
      } else if (pos <= 0) {
        pos = 0;
        dir = 1;
      }
      el.scrollLeft = pos;
    };
    frame = requestAnimationFrame(tick);
    el.addEventListener("pointerdown", take, { passive: true });
    el.addEventListener("touchstart", take, { passive: true });
    el.addEventListener("wheel", take, { passive: true });
    el.addEventListener("focusin", take);
    el.addEventListener("pointerover", over);
    el.addEventListener("pointerleave", out);
    return () => {
      cancelAnimationFrame(frame);
      seen.disconnect();
      el.removeEventListener("pointerdown", take);
      el.removeEventListener("touchstart", take);
      el.removeEventListener("wheel", take);
      el.removeEventListener("focusin", take);
      el.removeEventListener("pointerover", over);
      el.removeEventListener("pointerleave", out);
    };
  }, [still]);

  // Websites: frames lean towards the pointer and with their place on screen; they scroll by
  // themselves while visible.
  useEffect(() => {
    const el = sites.current;
    if (!el) return;
    const onScroll = () => setSiteAt(nearest(el));
    el.addEventListener("scroll", onScroll, { passive: true });
    const frames = [...el.querySelectorAll<HTMLElement>(".mp-demos__site")];
    const seen = new IntersectionObserver((entries) => entries.forEach((e) => e.target.classList.toggle("is-on", e.isIntersecting)), { rootMargin: "10% 0px" });
    frames.forEach((f) => seen.observe(f));
    if (still)
      return () => {
        seen.disconnect();
        el.removeEventListener("scroll", onScroll);
      };
    const pointer = { x: 0, y: 0, on: false };
    let frame = 0;
    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      frames.forEach((f) => {
        const r = f.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) return;
        const pos = (r.top + r.height / 2 - vh / 2) / vh; // -0.5 .. 0.5 on screen
        let rx = pos * 10;
        let ry = 0;
        if (pointer.on) {
          rx += ((pointer.y - (r.top + r.height / 2)) / vh) * -8;
          ry += ((pointer.x - (r.left + r.width / 2)) / window.innerWidth) * 14;
        }
        f.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
        f.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
      });
    };
    const ask = () => (frame ||= requestAnimationFrame(update));
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.on = true;
      ask();
    };
    update();
    window.addEventListener("scroll", ask, { passive: true });
    window.addEventListener("pointermove", move, { passive: true });
    el.addEventListener("scroll", ask, { passive: true });
    return () => {
      seen.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", ask);
      window.removeEventListener("pointermove", move);
      el.removeEventListener("scroll", ask);
      el.removeEventListener("scroll", onScroll);
    };
  }, [still]);

  const cardLabel = (c: CardConfig) => (c.slug === COMPANY_CARD_SLUG ? d.ourCard : c.example?.sector ?? c.name);
  const cardHref = (c: CardConfig) => (c.slug === COMPANY_CARD_SLUG ? CARD_PATH[t.lang] : examplePath(c.slug, t.lang));
  const cards = [...(company ? [company] : []), ...examples];
  const onSide = (stageEl: HTMLElement) => {
    const item = stageEl.closest("li");
    const list = track.current;
    if (!item || !list) return false;
    const i = [...list.children].indexOf(item);
    if (i === nearest(list)) return false;
    centre(list, i);
    return true;
  };

  return (
    <section className={`mp-demos${still ? " is-static" : ""}`} aria-labelledby="demos-title">
      <h2 id="demos-title" className="mp-sr">
        {d.title}
      </h2>

      <div className="mp-demos__block mp-demos__block--cards">
        <header className="mp-demos__head">
          <p className="mp-demos__kicker">{t.nav.cards}</p>
          <h3 className="mp-demos__title">{t.explore.cardsText}</h3>
          <p className="mp-demos__hint">{d.cardHint}</p>
        </header>
        <ol ref={track} className="mp-demos__track" aria-label={t.nav.cards}>
          {cards.map((c) => (
            <DemoCard
              key={c.slug}
              card={c}
              href={cardHref(c)}
              label={cardLabel(c)}
              hint={d.cardHint}
              shareLabel={t.story.demos.share}
              copied={cardStrings[t.lang].copied}
              onSide={onSide}
            />
          ))}
        </ol>
        <Pager
          count={cards.length}
          at={cardAt}
          go={(i) => {
            track.current?.dispatchEvent(new Event("wheel"));
            centre(track.current, i);
          }}
          prev={t.cards.prev}
          next={t.cards.next}
          label={t.nav.cards}
        />
        <p className="mp-demos__more">
          <Link to={PATHS.examples[t.lang]} className="mp-xbtn mp-xbtn--solid">
            {d.allCards} <FiArrowRight aria-hidden="true" />
          </Link>
          <Link to={PATHS.cards[t.lang]} className="mp-demos__link">
            {t.explore.more} <FiArrowRight aria-hidden="true" />
          </Link>
        </p>
      </div>

      <div className="mp-demos__block mp-demos__block--sites">
        <header className="mp-demos__head">
          <p className="mp-demos__kicker">{t.nav.websites}</p>
          <h3 className="mp-demos__title">{t.explore.websitesLead}</h3>
          <p className="mp-demos__hint">{t.explore.websitesText}</p>
        </header>
        <ul ref={sites} className="mp-demos__sites">
          {CONCEPT_ORDER.map((id, i) => {
            const c = t.websites.concepts[id];
            return (
              <li key={id} className="mp-demos__site" style={{ "--i": i } as React.CSSProperties}>
                <Link to={conceptPath(id, t.lang)} className="mp-demos__frame" aria-label={`${c.label} – ${t.websites.open}`}>
                  <span className="mp-demos__bar" aria-hidden="true">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="mp-demos__view">
                    <img src={media(`scroll-${t.lang}-${id}-desktop`, 640)} alt={c.alt} width={640} height={400} loading="lazy" decoding="async" draggable={false} />
                  </span>
                  <span className="mp-demos__open" aria-hidden="true">
                    {t.websites.open} <FiArrowRight />
                  </span>
                </Link>
                <p className="mp-demos__label">
                  <strong>{c.label}</strong> <span>{c.caption}</span>
                </p>
              </li>
            );
          })}
        </ul>
        <div className="mp-demos__pager-sites">
          <Pager count={CONCEPT_ORDER.length} at={siteAt} go={(i) => centre(sites.current, i)} prev={t.websites.prev} next={t.websites.next} label={t.nav.websites} />
        </div>
        <p className="mp-demos__more">
          <Link to={PATHS.websites[t.lang]} className="mp-xbtn mp-xbtn--solid">
            {d.allSites} <FiArrowRight aria-hidden="true" />
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Demos;
