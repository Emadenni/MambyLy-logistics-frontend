import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Dialog } from "@mui/material";
import { FiDownload, FiLink, FiShare, FiUserPlus, FiX } from "react-icons/fi";
import { TbQrcode } from "react-icons/tb";
import DigitalCard from "./DigitalCard";
import type { CardConfig } from "./types";
import { cardStrings } from "./strings";
import { canNativeShare, copyText, shareLink, type ShareResult } from "./share";
import { downloadVCard, staticVCardPath, vcardFileName } from "./vcard";
import { qrSvg } from "./qr";
import { cardPath } from "./registry";
import FlipIcon from "./FlipIcon";

type Status = { tone: "ok" | "info" | "warn"; text: string } | null;

export type CardMenuItem = { to: string; label: string; icon: React.ReactNode };

/** Card URL in the current environment: local stays local, preview stays preview. */
export const cardUrlFor = (slug: string) => `${window.location.origin}${cardPath(slug)}`;

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

/** iPhone / iPad (iPadOS reports itself as a Mac with touch). */
const isIOS = () =>
  /iP(hone|od|ad)/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

/** Icon-only button: translated accessible name + the same text as tooltip on hover and focus. */
export const IconButton: React.FC<{ label: string; onClick: () => void; children: React.ReactNode; haspopup?: boolean }> = ({
  label,
  onClick,
  children,
  haspopup,
}) => (
  <button type="button" className="dc-iconbtn" aria-label={label} data-tip={label} onClick={onClick} aria-haspopup={haspopup ? "dialog" : undefined}>
    {children}
  </button>
);

const CardExperience: React.FC<{ card: CardConfig; headingLevel?: "h1" | "h2"; menu?: CardMenuItem[]; intro?: boolean }> = ({
  card,
  headingLevel = "h2",
  menu,
  intro = false,
}) => {
  const t = cardStrings[card.lang];
  const url = useMemo(() => cardUrlFor(card.slug), [card.slug]);
  const [flipped, setFlipped] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [manualCopy, setManualCopy] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [savedOnce, setSavedOnce] = useState(false);
  const [nativeShare] = useState(canNativeShare);
  const qrMarkup = useMemo(() => qrSvg(url), [url]);
  const qrSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrMarkup)}`;
  const Heading = headingLevel;
  // Real cards in a production build have a static .vcf next to the page (see vcard.ts).
  const staticVCard = import.meta.env.PROD && !card.demo;

  const showManual = (text: string) => {
    setStatus({ tone: "warn", text });
    setManualCopy(true);
  };

  const onShareResult = (result: ShareResult) => {
    if (result === "shared") setStatus({ tone: "ok", text: t.shared });
    else if (result === "aborted") setStatus({ tone: "info", text: t.shareAborted }); // not an error, no auto-copy
    else if (result === "unavailable") showManual(t.shareUnavailable);
    else showManual(t.shareFailed);
  };

  /** Called directly from the click (no await before navigator.share). */
  const share = () => {
    setStatus(null);
    void shareLink({ title: card.company ? `${card.name} – ${card.company}` : card.name, text: card.kind === "organization" ? t.shareTextOrg(card.name) : t.shareText(card.name), url }).then(onShareResult);
  };

  const copy = () => {
    void copyText(url).then((r) => {
      if (r === "copied") {
        setStatus({ tone: "ok", text: t.copied });
        setManualCopy(false);
      } else {
        showManual(t.copyFailed);
      }
    });
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
    <div className="dc-experience">
      <Heading className="mp-sr">
        {t.cardLabel}: {card.name}
      </Heading>
      <DigitalCard card={card} t={t} flipped={flipped} onFlippedChange={setFlipped} onDemoAction={demoAction} intro={intro} />
      <p className="dc-hint" aria-hidden="true">{t.hint}</p>
      <p className="mp-sr" aria-live="polite">{flipped ? t.showingBack : t.showingFront}</p>

      <div className="dc-actions">
        <a
          className="mp-btn mp-btn--primary dc-save"
          href={staticVCard ? staticVCardPath(card) : "#"}
          // iOS opens a served .vcf in its own contact sheet; `download` would only file it away.
          download={staticVCard && isIOS() ? undefined : vcardFileName(card)}
          type="text/vcard"
          onClick={onSaveContact}
        >
          <FiUserPlus aria-hidden="true" /> {t.save}
        </a>
        {nativeShare ? (
          <IconButton label={t.share} onClick={share}>
            <FiShare aria-hidden="true" />
          </IconButton>
        ) : (
          <IconButton label={t.copy} onClick={copy}>
            <FiLink aria-hidden="true" />
          </IconButton>
        )}
        <IconButton label={flipped ? t.flipToFront : t.flipToBack} onClick={() => setFlipped((v) => !v)}>
          <FlipIcon />
        </IconButton>
        <IconButton label={t.qr} onClick={() => setQrOpen(true)} haspopup>
          <TbQrcode aria-hidden="true" />
        </IconButton>
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
      {manualCopy && (
        <div className="dc-manual">
          <label htmlFor={`dc-url-${card.slug}`}>{t.manualLabel}</label>
          <input id={`dc-url-${card.slug}`} type="text" readOnly value={url} onFocus={(e) => e.currentTarget.select()} />
        </div>
      )}

      {menu && menu.length > 0 && (
        <nav className="dc-menu" aria-label={t.menuLabel}>
          <ul>
            {menu.map((item) => (
              <li key={item.to}>
                <Link to={item.to} className="dc-menu__link">
                  <span className="dc-menu__icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

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
