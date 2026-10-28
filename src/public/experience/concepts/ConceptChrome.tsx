import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiArrowUpRight, FiInfo } from "react-icons/fi";
import logoDark from "../../assets/logo-dark.svg";
import logoLight from "../../assets/logo-light.svg";
import LangSwitch from "../LangSwitch";
import { useCopy } from "../i18n";
import { PATHS, type StaticScreen } from "../routes";
import { previousIs } from "../visits";
import { conceptCopy } from "./content";

/**
 * The only MambyLy element inside a fullscreen demo: a discreet bar along the bottom edge with
 * the way back to the gallery, the language and the note that the content is a design concept.
 * It takes the place of the quick navigation of the other screens.
 */
export const ExitBar: React.FC<{ to?: StaticScreen; label?: string; tone?: "light" | "dark"; note?: string }> = ({ to = "websites", label, tone = "light", note }) => {
  const t = useCopy();
  const c = conceptCopy[t.lang].shared;
  const navigate = useNavigate();
  return (
    <nav className={`mp-exit mp-exit--${tone}`} aria-label={c.exitLabel}>
      <Link
        to={PATHS[to][t.lang]}
        className="mp-exit__back"
        onClick={(e) => {
          // Back to the very gallery entry when that is where the visitor came from.
          if (previousIs(to) && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            navigate(-1);
          }
        }}
      >
        <FiArrowLeft aria-hidden="true" />
        <span className="mp-exit__long">{label ?? c.backLong}</span>
        <span className="mp-exit__short">
          {label ?? c.back}
        </span>
      </Link>
      <span className="mp-exit__note">
        <img src={tone === "dark" ? logoLight : logoDark} alt="MambyLy Solutions" width={74} height={21} />
        <span>
          {note ?? (
            <>
              {c.concept} ·<wbr /> {c.fictitious}
            </>
          )}
        </span>
      </span>
      <LangSwitch className="mp-exit__lang" />
    </nav>
  );
};

/**
 * Answer of every demo form: nothing is sent or stored, said plainly (no fake confirmation of a
 * booking, quote or transport).
 */
export const DemoNote: React.FC<{ onAgain?: () => void; text?: string }> = ({ onAgain, text }) => {
  const t = useCopy();
  const c = conceptCopy[t.lang].shared;
  return (
    <div className="cx-demonote" role="status">
      <p>
        <FiInfo aria-hidden="true" /> {text ?? c.demoSent}
      </p>
      {onAgain && (
        <button type="button" onClick={onAgain}>
          {c.again}
        </button>
      )}
    </div>
  );
};

/**
 * The way from a demo to MambyLy's real contact wizard, clearly apart from the demo itself:
 * a neutral band after the demo's own footer, with the website context already chosen.
 */
const WantSite: React.FC = () => {
  const t = useCopy();
  const c = conceptCopy[t.lang].shared;
  return (
    <aside className="cx-want" aria-label={c.wantSite}>
      <p>{c.wantSite}</p>
      <Link to={PATHS.contact[t.lang]} state={{ service: "site" }}>
        {c.wantSiteCta} <FiArrowUpRight aria-hidden="true" />
      </Link>
    </aside>
  );
};

/** Fullscreen wrapper of one demo: its own look, a skip link, the way to MambyLy and the exit bar. */
export const ConceptFrame: React.FC<{ id: string; className?: string; children: React.ReactNode; tone?: "light" | "dark"; exit?: React.ReactNode }> = ({
  id,
  className = "",
  children,
  tone = "light",
  exit,
}) => {
  const t = useCopy();
  return (
    <div className={`mp-concept cx cx--${id} ${className}`}>
      <a
        className="mp-skip"
        href={`#cx-main-${id}`}
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById(`cx-main-${id}`);
          if (!main) return;
          if (!main.hasAttribute("tabindex")) main.setAttribute("tabindex", "-1");
          main.focus();
        }}
      >
        {t.common.skip}
      </a>
      {children}
      <WantSite />
      {exit ?? <ExitBar tone={tone} />}
    </div>
  );
};

/** Smooth scroll to a section of a demo (instant with reduced motion), then focus it. */
export const goTo = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
  el.focus({ preventScroll: true });
};
