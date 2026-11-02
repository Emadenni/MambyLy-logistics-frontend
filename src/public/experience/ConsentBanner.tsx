import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useCopy } from "./i18n";
import { pathFor } from "./routes";
import { useUi } from "./ui";
import { withdrawClarity } from "../../hooks/analytics";

/**
 * Cookie choice for the public site. Same storage key and shape as the previous banner
 * (localStorage "cookieConsent" = { essential, analytics, marketing }): Microsoft Clarity and Umami
 * start only when analytics is true (see hooks/analytics.ts). There is no marketing technology on
 * the site, so "marketing" is always stored as false.
 *
 * Unlike the previous banner it does not block the page or lock scrolling, and it waits until the
 * home cover is lifted (nothing optional is loaded before a choice anyway).
 */
const KEY = "cookieConsent";

type Consent = { essential: true; analytics: boolean; marketing: false };

function readConsent(): Consent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    return parsed && typeof parsed === "object" ? { essential: true, analytics: parsed.analytics === true, marketing: false } : null;
  } catch {
    return null;
  }
}

const ConsentBanner: React.FC = () => {
  const t = useCopy();
  const titleId = useId();
  const coverShown = useUi((s) => s.coverShown);
  const requested = useUi((s) => s.consentRequested);
  const [stored, setStored] = useState<Consent | null>(readConsent);
  const [open, setOpen] = useState(() => readConsent() === null);
  const title = useRef<HTMLHeadingElement>(null);

  // Opened again from "Cookieinställningar" (and by useClarity when the stored value is invalid).
  useEffect(() => {
    if (!requested) return;
    setStored(readConsent());
    setOpen(true);
    window.setTimeout(() => title.current?.focus(), 0);
  }, [requested]);

  useEffect(() => {
    const reopen = () => {
      setStored(null);
      setOpen(true);
    };
    window.addEventListener("invalidCookieConsent", reopen);
    return () => window.removeEventListener("invalidCookieConsent", reopen);
  }, []);

  const save = (allowAnalytics: boolean) => {
    const before = stored ?? readConsent();
    const next: Consent = { essential: true, analytics: allowAnalytics, marketing: false };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* without storage the banner simply asks again next time */
    }
    setStored(next);
    setOpen(false);
    window.dispatchEvent(new CustomEvent("cookieConsentSaved"));
    // Withdrawn: drop Clarity's cookies and reload so its script (and Umami) is no longer running.
    if (!allowAnalytics && before?.analytics) {
      withdrawClarity();
      window.location.reload();
    }
  };

  if (!open || (coverShown && !requested)) return null;

  return (
    <section className="mp-consent" role="region" aria-labelledby={titleId}>
      <h2 id={titleId} ref={title} tabIndex={-1} className="mp-consent__title">
        {t.consent.title}
      </h2>
      <p className="mp-consent__text">
        {t.consent.text}{" "}
        <Link to={`${pathFor("privacy", t.lang)}#cookies`} className="mp-consent__more">
          {t.consent.more}
        </Link>
      </p>

      {stored && <p className="mp-consent__state">{stored.analytics ? t.consent.stateOn : t.consent.stateOff}</p>}

      <div className="mp-consent__actions">
        <button type="button" className="mp-xbtn mp-xbtn--choice" onClick={() => save(false)}>
          {t.consent.reject}
        </button>
        <button type="button" className="mp-xbtn mp-xbtn--choice" onClick={() => save(true)}>
          {t.consent.accept}
        </button>
      </div>
    </section>
  );
};

export default ConsentBanner;
