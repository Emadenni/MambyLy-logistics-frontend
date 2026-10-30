import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";
import { FiBriefcase, FiCopy, FiDownload, FiLayers, FiMail, FiMaximize, FiShare, FiUser, FiUserPlus, FiX } from "react-icons/fi";
import { TbQrcode } from "react-icons/tb";
import DigitalCard from "./DigitalCard";
import type { CardConfig } from "./types";
import { cardStrings, type CardStrings } from "./strings";
import { canNativeShare, copyText, shareLink, type ShareResult } from "./share";
import { downloadVCard, staticVCardPath, vcardFileName } from "./vcard";
import { qrSvg } from "./qr";
import { cardPath, examplePath } from "./registry";
import FlipIcon from "./FlipIcon";

type Status = { tone: "ok" | "info" | "warn"; text: string } | null;
/** Why the copy-link alternative is showing (never a claim that something was shared). */
type ShareAlt = "unsupported" | "gesture" | "failed" | null;

export type CardMenuItem = { to: string; label: string; icon: React.ReactNode };

/** Card URL in the current environment: local stays local, preview stays preview. */
export const cardUrlFor = (slug: string) => `${window.location.origin}${cardPath(slug)}`;

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

/** iPhone / iPad (iPadOS reports itself as a Mac with touch). */
const isIOS = () =>
  /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Icon-only button: translated accessible name + the same text as tooltip on hover and focus. */
export const IconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode; haspopup?: boolean; pressed?: boolean }> = ({
  label,
  onClick,
  children,
  haspopup,
  pressed,
}) => (
  <button
    type="button"
    className="dc-iconbtn"
    aria-label={label}
    data-tip={label}
    onClick={onClick}
    aria-haspopup={haspopup ? "dialog" : undefined}
    aria-pressed={pressed}
  >
    {children}
  </button>
);

/** Touch screen: where "swipe up" is a gesture people can actually make. */
const coarsePointer = () => typeof window !== "undefined" && !!window.matchMedia?.("(pointer: coarse)").matches;

/**
 * The site's pages as one small row of icons under MambyLy's own card: always visible, no
 * dropdown, each link with its name (accessible name + tooltip on hover and focus).
 */
const SiteNav: React.FC<{ items: CardMenuItem[]; label: string }> = ({ items, label }) => (
  <nav className="dc-sitenav" aria-label={label}>
    <ul>
      {items.map((item) => (
        <li key={item.to}>
          <Link to={item.to} className="dc-sitenav__link" aria-label={item.label} data-tip={item.label}>
            {item.icon}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);

type PanelId = "work" | "profile" | "contact";

/**
 * Demo cards: the fictitious person's own pages as a second quiet row of icons. Each opens a
 * compact panel (MUI Dialog: focus inside, Escape and the close buttons return the focus to the
 * icon). Fictitious texts only: no links, no form, nothing is sent.
 */
const ProfilePanels: React.FC<{ card: CardConfig; profile: NonNullable<CardConfig["profile"]>; t: CardStrings }> = ({ card, profile, t }) => {
  const [panel, setPanel] = useState<PanelId | null>(null);
  const titleId = `dc-panel-title-${card.slug}`;
  const items: { id: PanelId; label: string; icon: React.ReactNode }[] = [
    { id: "work", label: profile.work.title, icon: profile.work.kind === "work" ? <FiLayers aria-hidden="true" /> : <FiBriefcase aria-hidden="true" /> },
    { id: "profile", label: t.profile, icon: <FiUser aria-hidden="true" /> },
    { id: "contact", label: t.contact, icon: <FiMail aria-hidden="true" /> },
  ];
  const close = () => setPanel(null);
  const current = items.find((i) => i.id === panel);

  return (
    <>
      <nav className="dc-sitenav" aria-label={t.profileNav(card.name)}>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button type="button" className="dc-sitenav__link" aria-label={item.label} data-tip={item.label} aria-haspopup="dialog" onClick={() => setPanel(item.id)}>
                {item.icon}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <Dialog
        open={!!panel}
        onClose={close}
        className="mp-dialog"
        aria-labelledby={titleId}
        PaperProps={{ className: `mp-dialog__paper mp-dialog__paper--narrow dc-panel dc-panel--${card.design ?? "brand"}`, lang: card.lang } as object}
      >
        <button type="button" className="mp-dialog__close" onClick={close} aria-label={t.close}>
          <FiX aria-hidden="true" />
        </button>
        <div className="mp-dialog__body dc-panel__body">
          <p className="dc-panel__who">
            {card.name}
            {card.role && <span> · {card.role}</span>}
          </p>
          <h2 id={titleId}>{current?.label}</h2>
          {panel === "work" && (
            <ul className="dc-panel__list">
              {profile.work.items.map((i) => (
                <li key={i.title}>
                  <h3>{i.title}</h3>
                  <p>{i.text}</p>
                </li>
              ))}
            </ul>
          )}
          {panel === "profile" && (
            <>
              <p className="dc-panel__about">{profile.about}</p>
              {card.details && card.details.length > 0 && (
                <dl className="dc-panel__facts">
                  {card.details.map((d) => (
                    <div key={d.label}>
                      <dt>{d.label}</dt>
                      <dd>{d.value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </>
          )}
          {panel === "contact" && (
            <dl className="dc-panel__facts">
              {card.email && (
                <div>
                  <dt>{t.email}</dt>
                  <dd>{card.email}</dd>
                </div>
              )}
              {card.website && (
                <div>
                  <dt>{t.website}</dt>
                  <dd>{card.website.label}</dd>
                </div>
              )}
              <div>
                <dt>{t.availability}</dt>
                <dd>{profile.availability}</dd>
              </div>
            </dl>
          )}
          <p className="dc-panel__note">{t.exampleNote}</p>
          <button type="button" className="dc-panel__back" onClick={close}>
            {t.backToCard}
          </button>
        </div>
      </Dialog>
    </>
  );
};

/**
 * "Only the card": the same card element grows to the largest size that fits the screen, with only
 * a small close button. The card is not remounted, so side, drag state and data stay as they are.
 * The Fullscreen API is asked for from the click itself when the browser has it; if it is missing
 * or refused, the view still covers the browser's area. Leaves with the button, Escape (also the
 * browser's own Escape in fullscreen) and Back; the focus returns to the button that opened it.
 */
function useFullscreen() {
  const root = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLSpanElement>(null);
  const [on, setOn] = useState(false);
  const pushed = useRef(false);

  const leave = useCallback((fromHistory: boolean) => {
    setOn(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    if (pushed.current && !fromHistory) history.back();
    pushed.current = false;
    window.setTimeout(() => opener.current?.querySelector("button")?.focus(), 0);
  }, []);

  const open = () => {
    const el = root.current;
    // From the user's gesture, before any state change: some browsers refuse it otherwise.
    if (el?.requestFullscreen && document.fullscreenEnabled) void el.requestFullscreen({ navigationUI: "hide" }).catch(() => {});
    history.pushState({ ...(history.state ?? {}), dcFullscreen: true }, "");
    pushed.current = true;
    setOn(true);
  };

  useEffect(() => {
    if (!on) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && leave(false);
    const onPop = () => pushed.current && ((pushed.current = false), leave(true));
    // The browser's own exit from fullscreen (its Escape, a gesture) also closes the view.
    const onFs = () => !document.fullscreenElement && pushed.current && leave(false);
    document.addEventListener("keydown", onKey);
    window.addEventListener("popstate", onPop);
    document.addEventListener("fullscreenchange", onFs);
    const overflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    window.setTimeout(() => root.current?.querySelector<HTMLElement>(".dc-full__close")?.focus(), 0);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("fullscreenchange", onFs);
      document.documentElement.style.overflow = overflow;
    };
  }, [on, leave]);

  return { root, opener, on, open, close: () => leave(false) };
}

const CardExperience: React.FC<{ card: CardConfig; headingLevel?: "h1" | "h2"; menu?: CardMenuItem[]; intro?: boolean }> = ({
  card,
  headingLevel = "h2",
  menu,
  intro = false,
}) => {
  const t = cardStrings[card.lang];
  // Demo cards live at /exempel/<slug> and /en/examples/<slug>: the link, QR and vCard point to
  // the page in the language being shown.
  const url = useMemo(
    () => (card.demo ? `${window.location.origin}${examplePath(card.slug, card.lang)}` : cardUrlFor(card.slug)),
    [card.slug, card.demo, card.lang],
  );
  const full = useFullscreen();
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [shareAlt, setShareAlt] = useState<ShareAlt>(null);
  const [copied, setCopied] = useState<"copied" | "failed" | null>(null);
  const [qrOpen, setQrOpen] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const [nativeShare] = useState(canNativeShare);
  const [touch] = useState(coarsePointer);
  const sharing = useRef(false);
  const qrMarkup = useMemo(() => qrSvg(url), [url]);
  const qrSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrMarkup)}`;
  const Heading = headingLevel;
  // Real cards in a production build have a static .vcf next to the page (see vcard.ts).
  const staticVCard = import.meta.env.PROD && !card.demo;

  const openAlt = (why: Exclude<ShareAlt, null>) => {
    setCopied(null);
    setShareAlt(why);
  };

  /**
   * The Share button and the swipe. Called directly from the click / pointerup, so nothing is
   * awaited before navigator.share(). One sheet at a time: a second tap or swipe while the sheet
   * is open does nothing. Closing the sheet without sharing is not an error and shows nothing.
   */
  const share = (from: "button" | "gesture") => {
    if (sharing.current) return;
    if (!nativeShare) return openAlt("unsupported");
    sharing.current = true;
    setStatus(null);
    const title = card.company ? `${card.name} – ${card.company}` : card.name;
    const text = card.kind === "organization" ? t.shareTextOrg(card.name) : t.shareText(card.name);
    void shareLink({ title, text, url }).then((result: ShareResult) => {
      sharing.current = false;
      if (result === "shared") {
        setShareAlt(null);
        setStatus({ tone: "ok", text: t.shared });
      } else if (result === "unavailable") {
        // NotAllowedError: typically the browser did not accept the swipe as a user gesture.
        openAlt(from === "gesture" ? "gesture" : "failed");
      } else if (result === "error") {
        openAlt("failed");
      }
    });
  };

  const copy = () => {
    void copyText(url).then(setCopied);
  };

  // Never claims the contact was saved: only the phone can do that, after the user confirms.
  const onSaveContact = (e: React.MouseEvent) => {
    if (!staticVCard) {
      e.preventDefault();
      downloadVCard(card, url);
    }
    setSavedOnce(true);
    setStatus({ tone: "info", text: card.demo ? t.demoVCard : t.vcardOpened });
  };

  const downloadFallback = () => {
    downloadVCard(card, url);
    setStatus({ tone: "info", text: t.vcardDownloaded });
  };

  const demoAction = () => setStatus({ tone: "info", text: t.demoAction });

  const downloadQr = () => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, 1024, 1024);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const href = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = href;
        a.download = `${card.slug}-qr.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.setTimeout(() => URL.revokeObjectURL(href), 1000);
      }, "image/png");
    };
    img.src = qrSrc;
  };

  return (
    <div ref={full.root} className={`dc-experience dc-experience--${card.design ?? "brand"}${full.on ? " is-full" : ""}`} role={full.on ? "dialog" : undefined} aria-modal={full.on || undefined} aria-label={full.on ? t.fullscreenLabel : undefined}>
      {full.on && (
        <button type="button" className="dc-full__close" onClick={full.close} aria-label={t.fullscreenClose} data-tip={t.fullscreenClose}>
          <FiX aria-hidden="true" />
        </button>
      )}
      <Heading className="mp-sr">
        {t.cardLabel}: {card.name}
      </Heading>
      <DigitalCard
        card={card}
        t={t}
        flipped={flipped}
        onFlippedChange={setFlipped}
        // Only the card in fullscreen has no copy-link panel to fall back on: there the swipe
        // shares only where the device has a share sheet.
        onSwipeUp={!full.on || nativeShare ? () => share("gesture") : undefined}
        onDemoAction={demoAction}
        intro={intro}
      />
      {full.on && (
        <p className="dc-full__rotate" aria-hidden="true">
          {t.rotate}
        </p>
      )}
      {/* Both gestures really work here: a touch screen with a share sheet. */}
      {touch && nativeShare && (
        <p className="dc-hint" aria-hidden="true">
          {t.hint}
        </p>
      )}
      <p className="mp-sr" aria-live="polite">{flipped ? t.showingBack : t.showingFront}</p>

      <div className="dc-actions" role="group" aria-label={t.actionsLabel}>
        <a
          className="dc-save"
          aria-label={t.save}
          data-tip={t.save}
          href={staticVCard ? staticVCardPath(card) : "#"}
          // iOS opens a served .vcf in its own contact sheet; `download` would only file it away.
          download={staticVCard && isIOS() ? undefined : vcardFileName(card)}
          type="text/vcard"
          onClick={onSaveContact}
        >
          <FiUserPlus aria-hidden="true" />
          <span className="dc-save__text">{t.save}</span>
        </a>
        <IconButton label={t.share} onClick={() => share("button")}>
          <FiShare aria-hidden="true" />
        </IconButton>
        <IconButton label={flipped ? t.flipToFront : t.flipToBack} onClick={() => setFlipped((v) => !v)} pressed={flipped}>
          <FlipIcon />
        </IconButton>
        <IconButton label={t.qr} onClick={() => setQrOpen(true)} haspopup>
          <TbQrcode aria-hidden="true" />
        </IconButton>
        <span ref={full.opener} className="dc-full__opener">
          <IconButton label={t.fullscreen} onClick={full.open}>
            <FiMaximize aria-hidden="true" />
          </IconButton>
        </span>
      </div>
      {savedOnce && !card.demo && (
        <p className="dc-note">
          {t.vcardFallback}{" "}
          <button type="button" className="dc-note__link" onClick={downloadFallback}>
            {t.vcardDownload}
          </button>
        </p>
      )}
      {isLocalhost() && <p className="dc-note">{t.localhostNote}</p>}

      <div className="dc-status" role="status" aria-live="polite">
        {status && <p className={`dc-status__msg dc-status__msg--${status.tone}`}>{status.text}</p>}
      </div>
      {shareAlt && (
        <div className="dc-sharealt">
          <p className="dc-sharealt__why" role="status">
            {shareAlt === "unsupported" ? t.shareUnavailable : shareAlt === "gesture" ? t.shareGesture : t.shareFailed}
          </p>
          <label className="mp-sr" htmlFor={`dc-url-${card.slug}`}>
            {t.manualLabel}
          </label>
          <div className="dc-sharealt__row">
            <input id={`dc-url-${card.slug}`} type="text" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
            <button type="button" className="dc-sharealt__copy" onClick={copy}>
              <FiCopy aria-hidden="true" /> {t.copyLink}
            </button>
            <button type="button" className="dc-sharealt__close" onClick={() => setShareAlt(null)} aria-label={t.closeShareAlt}>
              <FiX aria-hidden="true" />
            </button>
          </div>
          <p className="dc-sharealt__result" aria-live="polite">
            {copied === "copied" ? t.copied : copied === "failed" ? t.copyFailed : ""}
          </p>
        </div>
      )}

      {menu && menu.length > 0 && <SiteNav items={menu} label={t.menuLabel} />}
      {card.demo && card.profile && <ProfilePanels card={card} profile={card.profile} t={t} />}

      <Dialog
        open={qrOpen}
        onClose={() => setQrOpen(false)}
        className="mp-dialog"
        aria-labelledby={`dc-qr-title-${card.slug}`}
        PaperProps={{ className: "mp-dialog__paper mp-dialog__paper--narrow" }}
      >
        <button type="button" className="mp-dialog__close" onClick={() => setQrOpen(false)} aria-label={t.close}>
          <FiX aria-hidden="true" />
        </button>
        <div className="mp-dialog__body dc-qr">
          <h2 id={`dc-qr-title-${card.slug}`}>{t.qrTitle}</h2>
          <img className="dc-qr__code" src={qrSrc} alt={t.qrAlt(url)} width={264} height={264} />
          <p className="dc-qr__url">
            <a href={url}>{url.replace(/^https?:\/\//, "")}</a>
          </p>
          {isLocalhost() && <p>{t.localhostNote}</p>}
          <button type="button" className="mp-btn" onClick={downloadQr}>
            <FiDownload aria-hidden="true" /> {t.qrDownload}
          </button>
        </div>
      </Dialog>
    </div>
  );
};

export default CardExperience;
