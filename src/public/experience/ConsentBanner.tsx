import React, { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import clarity from "@microsoft/clarity";
import { useCopy } from "./i18n";
import { pathFor } from "./routes";
import { useUi } from "./ui";

/**
 * Cookie choice for the public site. Same storage key and shape as the previous banner
 * (localStorage "cookieConsent" = { essential, analytics, marketing }), so useClarity() keeps
 * working unchanged: Microsoft Clarity starts only when analytics is true. There is no marketing
 * technology on the site, so "marketing" is always stored as false.
 *
 * Unlike the previous banner it does not block the page or lock scrolling, and it waits until the
 * home cover is lifted (nothing optional is loaded before a choice anyway).
 */
const KEY = "cookieConsent";
const clarityId = import.meta.env.VITE_CLARITY_ID;

type Consent = { essential: true; analytics: boolean; marketing: false };

function readConsent(): Consent | null {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    return parsed && typeof parsed === "object" ? { essential: true, analytics: parsed.analytics === true, marketing: false } : null;
  } catch {
    return null;
  }
}

/** First-party cookies set by Clarity; removed when the visitor withdraws consent. */
function removeClarityCookies() {
  const host = window.location.hostname;
  const domains = ["", host, `.${host}`, `.${host.split(".").slice(-2).join(".")}`];
  for (const name of ["_clck", "_clsk"]) {
    for (const d of domains) document.cookie = `${name}=; Max-Age=0; path=/${d ? `; domain=${d}` : ""}`;
  }
}

let clarityStarted = false;

const ConsentBanner: React.FC = () => {
  const t = useCopy();
  const titleId = useId();
  const coverShown = useUi((s) => s.coverShown);
  const requested = useUi((s) => s.consentRequested);
  const [stored, setStored] = useState<Consent | null>(readConsent);
  const [open, setOpen] = useState(() => readConsent() === null);
  const [details, setDetails] = useState(false);
  const [analytics, setAnalytics] = useState(() => readConsent()?.analytics ?? false);
  const title = useRef<HTMLHeadingElement>(null);

  // Opened again from "Cookieinställningar" (and by useClarity when the stored value is invalid).
  useEffect(() => {
    if (!requested) return;
    setAnalytics(readConsent()?.analytics ?? false);
    setDetails(true);
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
    setDetails(false);
    window.dispatchEvent(new CustomEvent("cookieConsentSaved"));
    if (allowAnalytics && clarityId && !clarityStarted) {
      clarityStarted = true;
      clarity.init(clarityId);
    }
    // Withdrawn: drop Clarity's cookies and reload so its script (and Umami) is no longer running.
    if (!allowAnalytics && before?.analytics) {
      removeClarityCookies();
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

      {details && (
        <ul className="mp-consent__options">
          <li>
            <span className="mp-consent__opt">
              <strong>{t.consent.necessary}</strong>
              <small>{t.consent.necessaryText}</small>
            </span>
            <span className="mp-consent__always">{t.consent.always}</span>
          </li>
          <li>
            <label className="mp-consent__opt" htmlFor={`${titleId}-a`}>
              <strong>{t.consent.analytics}</strong>
              <small>{t.consent.analyticsText}</small>
            </label>
            <input
              id={`${titleId}-a`}
              type="checkbox"
              role="switch"
              className="mp-switch"
              checked={analytics}
              onChange={(e) => setAnalytics(e.target.checked)}
            />
          </li>
        </ul>
      )}

      <div className="mp-consent__actions">
        <button type="button" className="mp-xbtn mp-xbtn--choice" onClick={() => save(false)}>
          {t.consent.reject}
        </button>
        {details ? (
          <button type="button" className="mp-xbtn mp-xbtn--choice" onClick={() => save(analytics)}>
            {t.consent.save}
          </button>
        ) : (
          <>
            <button type="button" className="mp-xbtn mp-xbtn--link" onClick={() => setDetails(true)}>
              {t.consent.details}
            </button>
            <button type="button" className="mp-xbtn mp-xbtn--choice" onClick={() => save(true)}>
              {t.consent.accept}
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default ConsentBanner;
