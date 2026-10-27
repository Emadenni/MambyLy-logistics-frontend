import React from "react";
import { Link } from "react-router-dom";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { useUi } from "../ui";
import { useAnchor } from "./Services";

/** /integritet – privacy policy, cookies (what is really used) and terms of use, in both languages. */
export const Privacy: React.FC = () => {
  const t = useCopy();
  const p = t.privacy;
  const requestConsent = useUi((s) => s.requestConsent);
  useAnchor();

  return (
    <Screen
      id="privacy"
      tone="paper"
      head={<ScreenHead lang={t.lang} title={t.meta.privacy.title} description={t.meta.privacy.description} screen="privacy" />}
      bar={<TopBar crumbs={[{ label: t.nav.privacy }]} back={{ screen: "explore", label: t.common.back, anyPrevious: true }} />}
    >
      <article className="mp-col mp-legal">
        <h1 className="mp-display mp-legal__title" data-focus>
          {p.title}
        </h1>
        <p className="mp-legal__meta">{p.updated}</p>
        <p>{p.intro}</p>
        {p.sections.map((s) => (
          <section key={s.title}>
            <h2>{s.title}</h2>
            <p>{s.text}</p>
          </section>
        ))}

        <section id="cookies">
          <h2>{p.cookiesTitle}</h2>
          <p>{p.cookiesIntro}</p>
          <div className="mp-legal__table" role="region" aria-label={p.cookiesTitle} tabIndex={0}>
            <table>
              <thead>
                <tr>
                  <th scope="col">{p.table.name}</th>
                  <th scope="col">{p.table.purpose}</th>
                  <th scope="col">{p.table.when}</th>
                </tr>
              </thead>
              <tbody>
                {p.rows.map((r) => (
                  <tr key={r.name}>
                    <th scope="row">{r.name}</th>
                    <td>{r.purpose}</td>
                    <td>{r.when}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="mp-xbtn mp-xbtn--ghost" onClick={requestConsent}>
            {p.changeChoice}
          </button>
        </section>

        <section id="villkor">
          <h2>{p.termsTitle}</h2>
          {p.terms.map((s) => (
            <p key={s.title}>
              <strong>{s.title}.</strong> {s.text}
            </p>
          ))}
        </section>
        <p className="mp-legal__meta">{p.questions}</p>
      </article>
    </Screen>
  );
};

/** Unknown address inside the public site. */
export const NotFound: React.FC = () => {
  const t = useCopy();
  return (
    <Screen
      id="notFound"
      head={<ScreenHead lang={t.lang} title={t.meta.notFound.title} description={t.meta.notFound.description} noindex />}
      bar={<TopBar crumbs={[{ label: t.notFound.title }]} back={{ screen: "explore", label: t.common.explore }} />}
    >
      <div className="mp-col mp-nf">
        <h1 className="mp-display" data-focus>
          {t.notFound.title}
        </h1>
        <p>{t.notFound.text}</p>
        <Link to={PATHS.explore[t.lang]} className="mp-xbtn mp-xbtn--solid">
          {t.common.toExplore}
        </Link>
      </div>
    </Screen>
  );
};
