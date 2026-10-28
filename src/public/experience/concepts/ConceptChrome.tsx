import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiInfo, FiX } from "react-icons/fi";
import { useCopy } from "../i18n";
import { PATHS, type StaticScreen } from "../routes";
import { previousIs } from "../visits";
import { conceptCopy } from "./content";

/**
 * The only element from outside inside a fullscreen demo (websites and cards): a small close button
 * in the top corner that leads back to the gallery in the same language. It goes back in history
 * when the gallery is the previous entry (so the gallery keeps its position), otherwise it links
 * to the gallery, so direct links and refreshes always have a way out.
 */
export const ExitButton: React.FC<{ to?: StaticScreen; tone?: "light" | "dark" }> = ({ to = "websites", tone = "light" }) => {
  const t = useCopy();
  const c = conceptCopy[t.lang].shared;
  const navigate = useNavigate();
  return (
    <div className={`mp-exit mp-exit--${tone}`}>
      <Link
        to={PATHS[to][t.lang]}
        className="mp-exit__btn"
        aria-label={c.exitLabel}
        onClick={(e) => {
          if (previousIs(to) && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
            e.preventDefault();
            navigate(-1);
          }
        }}
      >
        <FiX aria-hidden="true" />
        <span className="mp-exit__tip" aria-hidden="true">
          {c.exitLabel}
        </span>
      </Link>
    </div>
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

/** Fullscreen wrapper of one demo: its own look, a skip link and the small exit button. */
export const ConceptFrame: React.FC<{ id: string; className?: string; children: React.ReactNode; tone?: "light" | "dark" }> = ({
  id,
  className = "",
  children,
  tone = "light",
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
      <ExitButton tone={tone} />
      {children}
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
