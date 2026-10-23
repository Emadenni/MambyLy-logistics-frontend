import React, { useMemo, useRef, useState } from "react";
import { Dialog } from "@mui/material";
import { FiCopy, FiDownload, FiGrid, FiRefreshCw, FiShare2, FiUserPlus, FiX } from "react-icons/fi";
import DigitalCard from "./DigitalCard";
import type { CardConfig } from "./types";
import { cardStrings } from "./strings";
import { canNativeShare, copyText, shareLink, type ShareResult } from "./share";
import { downloadVCard } from "./vcard";
import { qrSvg } from "./qr";

type Status = { tone: "ok" | "info" | "warn"; text: string } | null;

/** Card URL in the current environment: local stays local, preview stays preview. */
export const cardUrlFor = (slug: string) => `${window.location.origin}/card/${slug}`;

const isLocalhost = () => ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);

const CardExperience: React.FC<{ card: CardConfig; headingLevel?: "h1" | "h2" }> = ({ card, headingLevel = "h2" }) => {
  const t = cardStrings[card.lang];
  const url = useMemo(() => cardUrlFor(card.slug), [card.slug]);
  const [flipped, setFlipped] = useState(false);
  const [sent, setSent] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const [manualCopy, setManualCopy] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [nativeShare] = useState(canNativeShare);
  const qrMarkup = useMemo(() => qrSvg(url), [url]);
  const qrSrc = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(qrMarkup)}`;
  const Heading = headingLevel;
  const sentTimer = useRef<number>();

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

  /** Must be called directly from the user's click / pointerup (no await before navigator.share). */
  const share = (): Promise<void> => {
    setStatus(null);
    return shareLink({ title: card.company ? `${card.name} – ${card.company}` : card.name, text: t.shareText(card.name), url }).then(onShareResult);
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

  const onSwipeUp = () => {
    if (sent) return;
    const started = performance.now();
    setSent(true);
    const pending = share(); // called now, inside the gesture; the animation only accompanies it
    const minimum = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 150 : 650;
    void pending.finally(() => {
      window.clearTimeout(sentTimer.current);
      sentTimer.current = window.setTimeout(() => setSent(false), Math.max(0, minimum - (performance.now() - started)));
    });
  };

  const saveContact = () => {
    downloadVCard(card, url);
    setStatus({ tone: "ok", text: t.vcardSaved });
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
      <DigitalCard
        card={card}
        t={t}
        flipped={flipped}
        onFlippedChange={setFlipped}
        onSwipeUp={onSwipeUp}
        onDemoAction={demoAction}
        sent={sent}
      />
      <p className="dc-hint" aria-hidden="true">{t.hint}</p>
      <p className="mp-sr" aria-live="polite">{flipped ? t.showingBack : t.showingFront}</p>

      <div className="dc-actions">
        <button type="button" className="mp-btn mp-btn--outline mp-btn--sm" onClick={() => setFlipped((v) => !v)}>
          <FiRefreshCw aria-hidden="true" /> {flipped ? t.flipToFront : t.flipToBack}
        </button>
        {nativeShare && (
          <button type="button" className="mp-btn mp-btn--primary mp-btn--sm" onClick={() => void share()}>
            <FiShare2 aria-hidden="true" /> {t.share}
          </button>
        )}
        <button type="button" className={`mp-btn mp-btn--sm ${nativeShare ? "mp-btn--outline" : "mp-btn--primary"}`} onClick={copy}>
          <FiCopy aria-hidden="true" /> {t.copy}
        </button>
        <button type="button" className="mp-btn mp-btn--outline mp-btn--sm" onClick={saveContact}>
          <FiUserPlus aria-hidden="true" /> {t.save}
        </button>
        <button type="button" className="mp-btn mp-btn--outline mp-btn--sm" onClick={() => setQrOpen(true)} aria-haspopup="dialog">
          <FiGrid aria-hidden="true" /> {t.qr}
        </button>
      </div>
      {card.demo && <p className="dc-note">{t.demoVCard}</p>}
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
