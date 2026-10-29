import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { FiGlobe, FiMail, FiPhone, FiInstagram, FiFacebook, FiLinkedin, FiYoutube, FiLink, FiMessageCircle } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { LuAperture, LuCircuitBoard, LuCompass, LuPenTool, LuSparkles } from "react-icons/lu";
import type { CardConfig } from "./types";
import type { CardStrings } from "./strings";

/**
 * Two-sided 3D business card. One engine for every card: the look comes from the card's
 * configuration (colours, layout, font, logo), never from a separate implementation.
 *  - Decorative tilt: follows a mouse pointer (never needed to use the card).
 *  - Drag / rotate: a horizontal drag turns the card; on release it settles on the nearest side.
 *  - Swipe up (touch and pen, only when onSwipeUp is given): the axis is chosen once, when the
 *    finger has moved DRAG_START px, so one gesture either turns the card or shares it, never
 *    both. A decisive upward swipe calls onSwipeUp synchronously inside pointerup, so the parent
 *    can call navigator.share() while the user activation is still valid. The card then owns
 *    one-finger touches (touch-action: pinch-zoom); without onSwipeUp vertical swipes stay with
 *    the browser (pan-y) and scroll the page.
 *  - Tap, Enter or Space flips; arrow keys tilt. Links/buttons on the visible side keep working.
 *  - intro: a short sideways tilt once per tab session, on a wrapper of its own (never on the
 *    element that carries the drag / flip transform). Stops as soon as the user interacts.
 */

type Motion = "settle" | "follow" | "hover";

type Props = {
  card: CardConfig;
  t: CardStrings;
  flipped: boolean;
  onFlippedChange: (flipped: boolean) => void;
  /** Upward swipe on a touch screen; called inside pointerup (keeps the user activation). */
  onSwipeUp?: () => void;
  /** Demo cards: contact actions only show a notice. */
  onDemoAction: () => void;
  intro?: boolean;
};

const DRAG_START = 8;
/** Swipe up: at least this far, and either fast or long; the vertical axis must clearly dominate. */
const SWIPE_MIN = 56;
const SWIPE_LONG = 110;
const SWIPE_SPEED = -0.4; // px/ms
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isBack = (ry: number) => Math.abs(Math.round(ry / 180)) % 2 === 1;

const socialIcon = { whatsapp: FiMessageCircle, instagram: FiInstagram, facebook: FiFacebook, linkedin: FiLinkedin, youtube: FiYoutube, tiktok: FaTiktok, x: FiLink };

/** Theme → CSS custom properties + modifier classes shared by the live card and the previews. */
export const cardThemeProps = (card: CardConfig) => ({
  className: [
    "dc",
    `dc--layout-${card.theme.layout}`,
    card.theme.style === "paper" ? "dc--paper" : "dc--solid",
    card.theme.font === "serif" ? "dc--serif" : "",
    card.theme.background ? "dc--image" : "",
    // premium demo designs: material, type and composition on the same card engine
    card.design ? `dc--d-${card.design}` : "",
  ]
    .filter(Boolean)
    .join(" "),
  style: {
    "--dc-front": card.theme.front,
    "--dc-front-ink": card.theme.frontInk,
    "--dc-accent": card.theme.accent,
    "--dc-back": card.theme.back,
    "--dc-back-ink": card.theme.backInk,
    "--dc-back-accent": card.theme.backAccent,
    ...(card.theme.background
      ? {
          "--dc-image": `url("/media/mambyly/card-${card.theme.background}-1300.webp")`,
        }
      : {}),
  } as React.CSSProperties,
});

/** One small symbol of the profession per design card (one icon family; the ivory card has its arch). */
const SYMBOLS: Partial<Record<NonNullable<CardConfig["design"]>, React.ReactNode>> = {
  velvet: <LuCompass />,
  white: <LuPenTool />,
  oxblood: <LuAperture />,
  graphite: <LuCircuitBoard />,
  expressive: <LuSparkles />,
};

/** "Alex Lind" → "AL": the monogram of a design card without a logo. */
const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

export const CardFront: React.FC<{ card: CardConfig; t: CardStrings; lazy?: boolean }> = ({ card, t, lazy }) => (
  <>
    {card.design && <span className="dc__deco" aria-hidden="true" />}
    {card.design && SYMBOLS[card.design] && (
      <span className="dc__symbol" aria-hidden="true">
        {SYMBOLS[card.design]}
      </span>
    )}
    <div className="dc__top">
      {card.design && !card.logoUrl && (
        <span className="dc__mono" aria-hidden="true">
          {initials(card.name)}
        </span>
      )}
      {card.logoUrl && (
        <img
          className={`dc__logo${card.logoShape === "wide" ? " dc__logo--wide" : ""}`}
          src={card.logoUrl}
          alt={card.showNameOnFront ? "" : card.name}
          width={card.logoShape === "wide" ? 220 : 96}
          height={card.logoShape === "wide" ? 62 : 96}
          loading={lazy ? "lazy" : undefined}
          draggable={false}
        />
      )}
    </div>
    {card.demo && <span className="dc__badge">{t.demoBadge}</span>}
    <div className="dc__identity">
      {card.company && <p className="dc__company">{card.company}</p>}
      {card.showNameOnFront && <p className="dc__name">{card.name}</p>}
      {card.role && <p className="dc__role">{card.role}</p>}
      {card.tagline &&
        (card.design ? (
          // design cards: the tagline is a short list of words ("Rum · Människor · Tillhörighet")
          <p className="dc__tagline dc__tagline--words">
            {card.tagline.split("·").map((w) => (
              <span key={w}>{w.trim()}</span>
            ))}
          </p>
        ) : (
          <p className="dc__tagline">{card.tagline}</p>
        ))}
    </div>
    {card.photoUrl && <img className="dc__photo" src={card.photoUrl} alt="" width={120} height={120} loading={lazy ? "lazy" : undefined} draggable={false} />}
  </>
);

type ContactIcon = React.ComponentType<{ "aria-hidden"?: boolean }>;

/** live = false: a picture of the back (previews), with no links or buttons. */
export const CardBack: React.FC<{ card: CardConfig; t: CardStrings; live?: boolean; onDemoAction?: () => void; lazy?: boolean }> = ({
  card,
  t,
  live = false,
  onDemoAction,
  lazy,
}) => {
  // Contact rows: real links for client cards, notice-only buttons for demo cards.
  const contact = (key: string, Icon: ContactIcon, label: string, value: string, href?: string, external = false) => {
    let action: React.ReactNode;
    if (!live) {
      action = <span className="dc-contact dc-contact--static">{value}</span>;
    } else if (card.demo) {
      action = (
        <button type="button" className="dc-contact" onClick={onDemoAction}>
          <span className="mp-sr">{label}: </span>
          {value}
          <span className="mp-sr"> ({t.demoBadge})</span>
        </button>
      );
    } else if (href) {
      action = (
        <a className="dc-contact" href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          <span className="mp-sr">{label}: </span>
          {value}
          {external && <span className="mp-sr"> {t.opensNewTab}</span>}
        </a>
      );
    } else {
      action = <span>{value}</span>;
    }
    return (
      <li key={key}>
        <Icon aria-hidden={true} />
        {action}
      </li>
    );
  };

  const phoneValue = card.demo ? card.phoneDisplay : card.phone?.display;

  return (
    <>
      <div className="dc__back-head">
        <p className="dc__back-name">{card.name}</p>
        {(card.company || card.role) && <p className="dc__back-company">{card.company || card.role}</p>}
      </div>
      <ul className="dc__contacts">
        {phoneValue && contact("phone", FiPhone, t.phone, phoneValue, card.phone ? `tel:${card.phone.e164}` : undefined)}
        {card.email && contact("email", FiMail, t.email, card.email, `mailto:${card.email}`)}
        {card.website && contact("web", FiGlobe, t.website, card.website.label, card.website.href, true)}
      </ul>
      {card.socials.length > 0 && (
        <ul className="dc__social">
          {card.socials.map((s) => {
            const Icon = socialIcon[s.type];
            let item: React.ReactNode;
            if (!live) {
              item = (
                <span className="dc__social-link">
                  <Icon aria-hidden={true} />
                </span>
              );
            } else if (card.demo) {
              item = (
                <button type="button" className="dc__social-link" onClick={onDemoAction} aria-label={`${s.label} (${t.demoBadge})`}>
                  <Icon aria-hidden={true} />
                </button>
              );
            } else {
              item = (
                <a className="dc__social-link" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} ${t.opensNewTab}`}>
                  <Icon aria-hidden={true} />
                </a>
              );
            }
            return <li key={s.type}>{item}</li>;
          })}
        </ul>
      )}
      {card.details && card.details.length > 0 && (
        <dl className="dc__details">
          {card.details.map((d) => (
            <div key={d.label}>
              <dt>{d.label}</dt>
              <dd>{d.value}</dd>
            </div>
          ))}
        </dl>
      )}
      {card.logoBackUrl && (
        <img className="dc__logo dc__logo--back" src={card.logoBackUrl} alt="" width={96} height={96} loading={lazy ? "lazy" : undefined} draggable={false} />
      )}
    </>
  );
};

/** Static, non-interactive picture of a card (gallery and home previews). */
export const CardPreview: React.FC<{ card: CardConfig; t: CardStrings; withBack?: boolean }> = ({ card, t, withBack = false }) => {
  const theme = cardThemeProps(card);
  return (
    <div className={`${theme.className} dc--preview`} style={theme.style} lang={card.lang} aria-hidden="true" {...({ inert: "" } as object)}>
      <div className="dc__stage dc__stage--static">
        <div className="dc__body">
          <div className="dc__face dc__face--front">
            <CardFront card={card} t={t} lazy />
          </div>
          {withBack && (
            <div className="dc__face dc__face--back">
              <CardBack card={card} t={t} lazy />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DigitalCard: React.FC<Props> = ({ card, t, flipped, onFlippedChange, onSwipeUp, onDemoAction, intro = false }) => {
  const keysId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const pose = useRef({ ry: 0, rx: 0, hx: 0, hy: 0, ty: 0 });
  const drag = useRef<{
    id: number;
    touch: boolean;
    x0: number;
    y0: number;
    x: number;
    y: number;
    t: number;
    vx: number;
    vy: number;
    ry0: number;
    moving: boolean;
    axis: "x" | "y";
  } | null>(null);
  const swallowClickUntil = useRef(0);
  const frame = useRef(0);
  const [nudging, setNudging] = useState(false);

  const render = useCallback((motion: Motion) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = body.current;
      if (!el) return;
      const { ry, rx, hx, hy, ty } = pose.current;
      el.dataset.motion = motion;
      el.style.transform = `translateY(${ty}px) rotateX(${rx + hy}deg) rotateY(${ry + hx}deg)`;
      el.style.setProperty("--dc-sheen-x", `${30 + Math.sin(((ry + hx) * Math.PI) / 180) * 45}%`);
      el.style.setProperty("--dc-sheen-y", `${20 - (rx + hy) * 2.5}%`);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  // Intro hint: at most once per tab session and card, never with reduced motion.
  useEffect(() => {
    if (!intro || reducedMotion()) return;
    const key = `mp-dc-intro:${card.slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* storage unavailable: the hint simply plays for this visit */
    }
    setNudging(true);
  }, [intro, card.slug]);

  const stopNudge = () => setNudging(false);

  // Keep the 3D pose in step with `flipped` (button, tap, keyboard) and hide the other side.
  useEffect(() => {
    const p = pose.current;
    if (isBack(p.ry) !== flipped) {
      p.ry = Math.round(p.ry / 180) * 180 + 180;
      p.rx = 0;
      render("settle");
    }
    for (const [el, hidden] of [[front.current, flipped], [back.current, !flipped]] as const) {
      if (!el) continue;
      if (hidden) el.setAttribute("inert", "");
      else el.removeAttribute("inert");
    }
  }, [flipped, render]);

  const settle = (ry: number) => {
    const p = pose.current;
    p.ry = ry;
    p.rx = 0;
    p.hx = 0;
    p.hy = 0;
    p.ty = 0;
    render("settle");
    const showBack = isBack(ry);
    if (showBack !== flipped) onFlippedChange(showBack);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    stopNudge();
    // One gesture at a time: a second finger never starts (or restarts) a drag.
    if (e.button !== 0 || drag.current) return;
    drag.current = {
      id: e.pointerId,
      touch: e.pointerType !== "mouse",
      x0: e.clientX,
      y0: e.clientY,
      x: e.clientX,
      y: e.clientY,
      t: e.timeStamp,
      vx: 0,
      vy: 0,
      ry0: Math.round(pose.current.ry / 180) * 180,
      moving: false,
      axis: "x",
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const p = pose.current;
    if (!d || d.id !== e.pointerId) {
      if (e.pointerType !== "mouse" || reducedMotion() || !stage.current) return;
      const r = stage.current.getBoundingClientRect();
      p.hx = ((e.clientX - r.left) / r.width - 0.5) * 12;
      p.hy = -((e.clientY - r.top) / r.height - 0.5) * 10;
      render("hover");
      return;
    }
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.moving) {
      if (Math.hypot(dx, dy) < DRAG_START) return;
      d.moving = true;
      // Chosen once: vertical only on touch / pen, with sharing on offer, and clearly vertical.
      d.axis = onSwipeUp && d.touch && Math.abs(dy) > Math.abs(dx) * 1.2 ? "y" : "x";
      stage.current?.setPointerCapture(e.pointerId);
      p.hx = 0;
      p.hy = 0;
    }
    const dt = Math.max(1, e.timeStamp - d.t);
    d.vx = 0.7 * ((e.clientX - d.x) / dt) + 0.3 * d.vx;
    d.vy = 0.7 * ((e.clientY - d.y) / dt) + 0.3 * d.vy;
    d.x = e.clientX;
    d.y = e.clientY;
    d.t = e.timeStamp;
    if (reducedMotion()) return; // no continuous motion; the result is applied on release
    if (d.axis === "y") {
      // The card lifts a little with the finger (and resists going down); it never turns.
      p.ry = d.ry0;
      p.rx = clamp(-dy * 0.06, -8, 8);
      p.ty = dy < 0 ? Math.max(dy, -160) * 0.3 : Math.min(dy, 80) * 0.12;
      render("follow");
      return;
    }
    p.ry = d.ry0 + dx * 0.55;
    p.rx = clamp(-dy * 0.12, -20, 20);
    render("follow");
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (!d.moving) return; // a tap: handled by onClick
    swallowClickUntil.current = performance.now() + 400;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;

    if (d.axis === "y") {
      const up = dy < -SWIPE_MIN && Math.abs(dy) > Math.abs(dx) * 1.2 && (d.vy < SWIPE_SPEED || dy < -SWIPE_LONG);
      // First, inside this pointerup: navigator.share() needs the user activation of the gesture.
      if (up) onSwipeUp?.();
      settle(d.ry0); // back in place, on the side that was showing
      return;
    }

    let target = d.ry0;
    if (reducedMotion()) {
      if (Math.abs(dx) > 60) target = d.ry0 + 180 * Math.sign(dx);
    } else {
      const projected = pose.current.ry + (Math.abs(dx) > 40 ? clamp(d.vx, -1.5, 1.5) * 120 : 0);
      target = clamp(Math.round(projected / 180) * 180, d.ry0 - 180, d.ry0 + 180);
    }
    settle(target);
  };

  // The browser took the gesture over (vertical scroll): back to the side that was showing.
  const onPointerCancel = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    settle(d.ry0);
  };

  const onPointerLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || drag.current) return;
    pose.current.hx = 0;
    pose.current.hy = 0;
    render("settle");
  };

  const onClickCapture = (e: React.MouseEvent) => {
    if (performance.now() < swallowClickUntil.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onClick = (e: React.MouseEvent) => {
    if ((e.target as Element).closest("a, button")) return;
    onFlippedChange(!flipped);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    stopNudge();
    if (e.target !== e.currentTarget) return;
    const p = pose.current;
    const step = reducedMotion() ? 0 : 6;
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        onFlippedChange(!flipped);
        return;
      case "ArrowLeft": p.hx = clamp(p.hx - step, -18, 18); break;
      case "ArrowRight": p.hx = clamp(p.hx + step, -18, 18); break;
      case "ArrowUp": p.hy = clamp(p.hy + step, -18, 18); break;
      case "ArrowDown": p.hy = clamp(p.hy - step, -18, 18); break;
      case "Escape": p.hx = 0; p.hy = 0; break;
      default: return;
    }
    e.preventDefault();
    render("settle");
  };

  const onBlur = (e: React.FocusEvent) => {
    if (e.target !== e.currentTarget) return;
    pose.current.hx = 0;
    pose.current.hy = 0;
    render("settle");
  };

  const theme = cardThemeProps(card);

  return (
    <div className={theme.className} style={theme.style} lang={card.lang}>
      <div
        ref={stage}
        className={`dc__stage${onSwipeUp ? " dc__stage--swipe" : ""}`}
        tabIndex={0}
        role="group"
        aria-label={`${t.cardLabel}: ${card.name} – ${flipped ? t.back : t.front}`}
        aria-describedby={keysId}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
        onPointerLeave={onPointerLeave}
        onClickCapture={onClickCapture}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onFocus={stopNudge}
        onBlur={onBlur}
        onDragStart={(e) => e.preventDefault()}
      >
        <span id={keysId} className="mp-sr">{t.keys}</span>
        <div className={`dc__tilt${nudging ? " is-nudging" : ""}`} onAnimationEnd={stopNudge}>
          <div ref={body} className="dc__body" data-motion="settle">
            <div ref={front} className="dc__face dc__face--front" aria-hidden={flipped}>
              <CardFront card={card} t={t} />
            </div>
            <div ref={back} className="dc__face dc__face--back" aria-hidden={!flipped}>
              <CardBack card={card} t={t} live onDemoAction={onDemoAction} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
