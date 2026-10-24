import React, { useCallback, useEffect, useId, useRef } from "react";
import { FiGlobe, FiMail, FiPhone, FiInstagram, FiFacebook, FiLinkedin, FiYoutube, FiLink, FiMessageCircle } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import type { CardConfig } from "./types";
import type { CardStrings } from "./strings";

/**
 * Two-sided 3D business card.
 *  - Decorative tilt: follows a mouse pointer (never needed to use the card).
 *  - Drag / rotate: a press becomes a drag after DRAG_START px; on release the card settles
 *    on the nearest side (one turn per gesture).
 *  - Hand over: a decisive upward swipe calls onSwipeUp synchronously in pointerup, so the
 *    parent can call navigator.share() while the user activation is still valid.
 *  - Tap, Enter or Space flips; arrow keys tilt. Links/buttons on the visible side keep working.
 * Only the card itself captures touch gestures (touch-action: none on the card); the page
 * around it scrolls normally.
 */

type Motion = "settle" | "follow" | "hover";

type Props = {
  card: CardConfig;
  t: CardStrings;
  flipped: boolean;
  onFlippedChange: (flipped: boolean) => void;
  onSwipeUp: () => void;
  /** Demo cards: contact actions only show a notice. */
  onDemoAction: () => void;
  sent: boolean;
};

const DRAG_START = 8;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isBack = (ry: number) => Math.abs(Math.round(ry / 180)) % 2 === 1;

const socialIcon = { whatsapp: FiMessageCircle, instagram: FiInstagram, facebook: FiFacebook, linkedin: FiLinkedin, youtube: FiYoutube, tiktok: FaTiktok, x: FiLink };

const DigitalCard: React.FC<Props> = ({ card, t, flipped, onFlippedChange, onSwipeUp, onDemoAction, sent }) => {
  const keysId = useId();
  const stage = useRef<HTMLDivElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const front = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLDivElement>(null);
  const pose = useRef({ ry: 0, rx: 0, hx: 0, hy: 0 });
  const drag = useRef<{ id: number; x0: number; y0: number; x: number; y: number; t: number; vx: number; vy: number; ry0: number; moving: boolean } | null>(null);
  const swallowClickUntil = useRef(0);
  const frame = useRef(0);

  const render = useCallback((motion: Motion) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const el = body.current;
      if (!el) return;
      const { ry, rx, hx, hy } = pose.current;
      el.dataset.motion = motion;
      el.style.transform = `rotateX(${rx + hy}deg) rotateY(${ry + hx}deg)`;
      el.style.setProperty("--dc-sheen-x", `${30 + Math.sin(((ry + hx) * Math.PI) / 180) * 45}%`);
      el.style.setProperty("--dc-sheen-y", `${20 - (rx + hy) * 2.5}%`);
    });
  }, []);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

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
    render("settle");
    const showBack = isBack(ry);
    if (showBack !== flipped) onFlippedChange(showBack);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || sent) return;
    drag.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, t: e.timeStamp, vx: 0, vy: 0, ry0: Math.round(pose.current.ry / 180) * 180, moving: false };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    const p = pose.current;
    if (!d || d.id !== e.pointerId) {
      if (e.pointerType !== "mouse" || sent || reducedMotion() || !stage.current) return;
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

    const swipeUp = dy < -60 && Math.abs(dy) > Math.abs(dx) * 1.2 && (d.vy < -0.45 || dy < -150);
    if (swipeUp) {
      settle(d.ry0);
      onSwipeUp(); // synchronous: navigator.share() runs inside this pointerup
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

  const style = {
    "--dc-front": card.theme.front,
    "--dc-front-ink": card.theme.frontInk,
    "--dc-accent": card.theme.accent,
    "--dc-back": card.theme.back,
    "--dc-back-ink": card.theme.backInk,
    "--dc-back-accent": card.theme.backAccent,
  } as React.CSSProperties;

  // Contact rows: real links for client cards, notice-only buttons for demo cards.
  const contact = (key: string, Icon: React.ComponentType<{ "aria-hidden"?: boolean }>, label: string, value: string, href?: string, external = false) => {
    let action: React.ReactNode;
    if (card.demo) {
      action = (
        <button type="button" className="dc-contact" onClick={onDemoAction}>
          <span className="mp-sr">{label}: </span>
          {value}
          <span className="mp-sr"> (demo)</span>
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
    <div className={`dc${sent ? " dc--sent" : ""}${card.theme.style === "paper" ? " dc--paper" : ""}`} style={style} lang={card.lang}>
      <div
        ref={stage}
        className="dc__stage"
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
        onBlur={onBlur}
        onDragStart={(e) => e.preventDefault()}
      >
        <span id={keysId} className="mp-sr">{t.keys}</span>
        <div ref={body} className="dc__body" data-motion="settle">
          <div ref={front} className="dc__face dc__face--front" aria-hidden={flipped}>
            <div className="dc__top">
              {card.logoUrl && (
                <img
                  className={`dc__logo${card.logoShape === "wide" ? " dc__logo--wide" : ""}`}
                  src={card.logoUrl}
                  alt={card.showNameOnFront ? "" : card.name}
                  width={card.logoShape === "wide" ? 220 : 96}
                  height={card.logoShape === "wide" ? 62 : 96}
                  draggable={false}
                />
              )}
              {card.demo && <span className="dc__badge">{t.demoBadge}</span>}
            </div>
            <div className="dc__identity">
              {card.company && <p className="dc__company">{card.company}</p>}
              {card.showNameOnFront && <p className="dc__name">{card.name}</p>}
              {card.role && <p className="dc__role">{card.role}</p>}
              {card.tagline && <p className="dc__tagline">{card.tagline}</p>}
            </div>
            {card.photoUrl && <img className="dc__photo" src={card.photoUrl} alt="" width={120} height={120} draggable={false} />}
          </div>

          <div ref={back} className="dc__face dc__face--back" aria-hidden={!flipped}>
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
                  return (
                    <li key={s.type}>
                      {card.demo ? (
                        <button type="button" className="dc__social-link" onClick={onDemoAction} aria-label={`${s.label} (demo)`}>
                          <Icon aria-hidden={true} />
                        </button>
                      ) : (
                        <a className="dc__social-link" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={`${s.label} ${t.opensNewTab}`}>
                          <Icon aria-hidden={true} />
                        </a>
                      )}
                    </li>
                  );
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
            {card.logoBackUrl && <img className="dc__logo dc__logo--back" src={card.logoBackUrl} alt="" width={96} height={96} draggable={false} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
