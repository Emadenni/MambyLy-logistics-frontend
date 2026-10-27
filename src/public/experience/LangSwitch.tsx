import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { copy } from "./copy";
import { saveLang, useLang } from "./i18n";
import { LANGS, translatePath, type Lang } from "./routes";

/**
 * SV / EN: two small round buttons. Switching keeps the screen, its hash and the navigation state
 * (e.g. the service chosen for the contact wizard); answers typed in the wizard live in memory and
 * are untouched. `current` / `onSelect` are used where the language is not in the URL (/card).
 */
const LangSwitch: React.FC<{ className?: string; current?: Lang; onSelect?: (lang: Lang) => void }> = ({ className = "", current, onSelect }) => {
  const urlLang = useLang();
  const lang = current ?? urlLang;
  const location = useLocation();
  const navigate = useNavigate();

  const choose = (next: Lang) => {
    saveLang(next);
    if (onSelect) return onSelect(next);
    if (next === urlLang) return;
    navigate(translatePath(location.pathname, next) + location.search + location.hash, { replace: true, state: location.state });
  };

  return (
    <div className={`mp-lang ${className}`} role="group" aria-label={copy[lang].common.language}>
      {LANGS.map((l) => (
        <button
          key={l}
          type="button"
          className="mp-lang__btn"
          lang={l}
          aria-label={copy[l].langName}
          aria-pressed={l === lang}
          onClick={() => choose(l)}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
};

export default LangSwitch;
