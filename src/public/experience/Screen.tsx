import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight } from "react-icons/fi";
import logoDark from "../assets/logo-dark.svg";
import { useCopy } from "./i18n";
import LangSwitch from "./LangSwitch";
import { PATHS, pathFor, type Lang, type ScreenId, type StaticScreen } from "./routes";
import { hasPrevious, previousIs } from "./visits";
import { useUi } from "./ui";
import type { ServiceKey } from "../digital-card/service";
import AdminLink from "../../components/AdminLink/AdminLink";
import { publicSiteConfig } from "../config";

export const SITE = "https://www.mambylysolutions.se";
export const absolute = (path: string) => `${SITE}${encodeURI(path)}`;

type Crumb = { label: string; to?: string };

/** Link to a parent screen that uses browser Back when it leads to that same screen. */
export const BackLink: React.FC<{ screen: StaticScreen; label: string; className?: string; anyPrevious?: boolean }> = ({
  screen,
  label,
  className = "",
  anyPrevious = false,
}) => {
  const navigate = useNavigate();
  const { lang } = useCopy();
  return (
    <Link
      to={pathFor(screen, lang)}
      className={`mp-back ${className}`}
      onClick={(e) => {
        if ((anyPrevious ? hasPrevious() : previousIs(screen)) && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
          e.preventDefault();
          navigate(-1);
        }
      }}
    >
      <FiArrowLeft aria-hidden="true" /> {label}
    </Link>
  );
};

/** Kontakt: always visible, opens the wizard with the context of the current screen. */
export const ContactLink: React.FC<{ service?: ServiceKey; className?: string }> = ({ service, className = "" }) => {
  const t = useCopy();
  return (
    <Link to={pathFor("contact", t.lang)} state={service ? { service } : undefined} className={`mp-xbtn mp-xbtn--solid mp-bar__contact ${className}`}>
      {t.common.contact} <FiArrowUpRight aria-hidden="true" />
    </Link>
  );
};

export const TopBar: React.FC<{
  crumbs: Crumb[];
  back?: { screen: StaticScreen; label: string; anyPrevious?: boolean };
  service?: ServiceKey;
  logoTo?: string;
  showContact?: boolean;
}> = ({ crumbs, back, service, logoTo, showContact = true }) => {
  const t = useCopy();
  const here = crumbs[crumbs.length - 1]?.label;
  return (
    <header className="mp-bar">
      <div className="mp-bar__row">
        <Link to={logoTo ?? pathFor("explore", t.lang)} className="mp-bar__logo" aria-label={logoTo === "/" || logoTo === "/en" ? t.common.logoHomeLabel : t.common.logoLabel}>
          <img src={logoDark} alt="" width={132} height={38} />
        </Link>
        <nav className="mp-bar__crumbs" aria-label={t.common.breadcrumb}>
          <ol>
            {crumbs.map((c, i) => (
              <li key={c.label}>
                {c.to && i < crumbs.length - 1 ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
              </li>
            ))}
          </ol>
        </nav>
        <div className="mp-bar__end">
          <LangSwitch />
          {showContact && <ContactLink service={service} />}
        </div>
      </div>
      {back && (
        <div className="mp-bar__sub">
          <BackLink screen={back.screen} label={back.label} anyPrevious={back.anyPrevious} />
          <span className="mp-bar__here" aria-hidden="true">
            {here}
          </span>
        </div>
      )}
    </header>
  );
};

/** Compact footer line, the same on every screen. */
export const ScreenFooter: React.FC<{ withAdmin?: boolean }> = ({ withAdmin = false }) => {
  const t = useCopy();
  const requestConsent = useUi((s) => s.requestConsent);
  return (
    <footer className="mp-sfoot">
      <ul>
        <li>
          <Link to={pathFor("privacy", t.lang)}>{t.common.privacy}</Link>
        </li>
        <li>
          <button type="button" onClick={requestConsent}>
            {t.common.cookieSettings}
          </button>
        </li>
        <li>
          <Link to={pathFor("jobs", t.lang)}>{t.common.jobs}</Link>
        </li>
        <li>
          <Link to={t.lang === "en" ? "/en/card" : "/card"}>{t.common.ourCard}</Link>
        </li>
        {publicSiteConfig.showSidoButik && (
          <li>
            <Link to="/sidoButik">Sido Butik</Link>
          </li>
        )}
        <li className="mp-sfoot__copy">© {new Date().getFullYear()} {t.common.rights}</li>
      </ul>
      {withAdmin && <AdminLink />}
    </footer>
  );
};

/** <head> of a screen: title, description, canonical, hreflang alternates and Open Graph. */
export const ScreenHead: React.FC<{
  lang: Lang;
  title: string;
  description: string;
  paths?: Record<Lang, string>;
  screen?: StaticScreen;
  image?: string;
  noindex?: boolean;
}> = ({ lang, title, description, paths, screen, image = "/brand/og-home.png", noindex }) => {
  const alt = paths ?? (screen ? PATHS[screen] : undefined);
  const url = alt ? absolute(alt[lang]) : undefined;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {url && <link rel="canonical" href={url} />}
      {alt && <link rel="alternate" hrefLang="sv" href={absolute(alt.sv)} />}
      {alt && <link rel="alternate" hrefLang="en" href={absolute(alt.en)} />}
      {alt && <link rel="alternate" hrefLang="x-default" href={absolute(alt.sv)} />}
      {noindex && <meta name="robots" content="noindex" />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:image" content={`${SITE}${image}`} />
      <meta property="og:locale" content={lang === "en" ? "en_GB" : "sv_SE"} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

/** A screen of the site: head, bar, content and the compact footer. */
const Screen: React.FC<{
  id: ScreenId;
  tone?: "ivory" | "mist" | "paper" | "deep";
  className?: string;
  bar: React.ReactNode;
  head: React.ReactNode;
  children: React.ReactNode;
  footer?: boolean;
  withAdmin?: boolean;
}> = ({ id, tone = "ivory", className = "", bar, head, children, footer = true, withAdmin }) => (
    <div className={`mp-screen mp-screen--${tone} mp-screen--${id} ${className}`}>
      {head}
      <SkipLink />
      {bar}
      <main id={`mp-main-${id}`} className="mp-screen__main">
        {children}
      </main>
      {footer && <ScreenFooter withAdmin={withAdmin} />}
    </div>
);

const SkipLink: React.FC = () => {
  const t = useCopy();
  return (
    <a
      className="mp-skip"
      href="#main"
      onClick={(e) => {
        e.preventDefault();
        const main = (e.currentTarget.parentElement?.querySelector(".mp-screen__main") as HTMLElement | null) ?? null;
        const target = main?.querySelector<HTMLElement>("[data-focus]") ?? main;
        if (!target) return;
        if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
        target.focus();
      }}
    >
      {t.common.skip}
    </a>
  );
};

export default Screen;
