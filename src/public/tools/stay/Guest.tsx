import React, { useEffect, useId, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { LuArrowUp, LuCheck, LuChevronDown, LuCopy, LuKey, LuMessageCircle, LuPhone, LuWifi, LuX } from "react-icons/lu";
import { answer, fill, pick, recordUnanswered } from "./answer";
import { phoneLang } from "./data";
import { Cottage, TownHouse } from "./Drawing";
import { StayIcon } from "./icons";
import { STAY_UI } from "./strings";
import type { House, StayLang } from "./types";
import "@fontsource/familjen-grotesk/latin-400.css";
import "@fontsource/familjen-grotesk/latin-500.css";
import "@fontsource/familjen-grotesk/latin-600.css";
import "@fontsource/familjen-grotesk/latin-700.css";

type Msg = { id: number; from: "guest" | "bot"; text: string; unknown?: boolean };

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/** Copies a value and says so on the button for a moment. */
const CopyButton: React.FC<{ value: string; label: string; done: string; what: string }> = ({ value, label, done, what }) => {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      className={`sg-copy${ok ? " is-done" : ""}`}
      aria-label={`${label}: ${what}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setOk(true);
          window.setTimeout(() => setOk(false), 1800);
        } catch {
          // no clipboard (old browser, permissions): the value stays visible to copy by hand
        }
      }}
    >
      {ok ? <LuCheck aria-hidden /> : <LuCopy aria-hidden />}
      <span aria-live="polite">{ok ? done : label}</span>
    </button>
  );
};

/** The way to the host when the chat has no answer: a text message, and the number in full. */
const HostContact: React.FC<{ house: House; lang: StayLang }> = ({ house, lang }) => {
  const u = STAY_UI[lang];
  const phone = house.host.phone.replace(/[^\d+]/g, "");
  const body = encodeURIComponent(u.smsBody.replace("{name}", house.host.name).replace("{house}", house.name));
  return (
    <div className="sg-hostcta">
      <a className="sg-hostcta__sms" href={`sms:${phone}?body=${body}`}>
        <LuMessageCircle aria-hidden /> {u.textHost.replace("{name}", house.host.name)}
      </a>
      <span className="sg-hostcta__or">
        {u.orCall}{" "}
        <a href={`tel:${phone}`}>
          <LuPhone aria-hidden /> {house.host.phone}
        </a>
      </span>
    </div>
  );
};

/**
 * The chat over the whole screen, like a messaging app: suggested questions, the guest's
 * messages on the right, the replies on the left. Every reply comes from answer() (answer.ts).
 */
const Chat: React.FC<{ house: House; lang: StayLang; onClose: () => void; first?: string }> = ({ house, lang, onClose, first }) => {
  const u = STAY_UI[lang];
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const seq = useRef(0);
  const suggested = house.answers.filter((a) => a.suggest && a.question);

  const ask = async (q: string) => {
    const question = q.trim();
    if (!question || busy) return;
    setText("");
    setMsgs((m) => [...m, { id: ++seq.current, from: "guest", text: question }]);
    setBusy(true);
    const [reply] = await Promise.all([answer(house, question, lang), new Promise((r) => window.setTimeout(r, 520))]);
    if (reply.kind === "unknown") recordUnanswered(house.slug, question);
    setMsgs((m) => [...m, { id: ++seq.current, from: "bot", text: reply.text, unknown: reply.kind === "unknown" }]);
    setBusy(false);
  };

  useEffect(() => {
    input.current?.focus({ preventScroll: true });
    if (first) void ask(first);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.documentElement.classList.add("sg-chat-open");
    return () => {
      window.removeEventListener("keydown", esc);
      document.documentElement.classList.remove("sg-chat-open");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [msgs, busy]);

  return (
    <div className="sg-chat" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <header className="sg-chat__head">
        <span className="sg-chat__avatar" aria-hidden="true">
          {initials(house.host.name)}
        </span>
        <div>
          <h2 id={titleId}>{u.chatTitle}</h2>
          <p>{house.name}</p>
        </div>
        <button type="button" className="sg-chat__close" onClick={onClose} aria-label={u.close}>
          <LuX aria-hidden />
        </button>
      </header>

      <div ref={list} className="sg-chat__list" aria-live="polite">
        <p className="sg-msg sg-msg--bot">{u.chatIntro}</p>
        {msgs.map((m) => (
          <div key={m.id} className={`sg-msg sg-msg--${m.from}${m.unknown ? " is-unknown" : ""}`}>
            <p>{m.text}</p>
            {m.unknown && <HostContact house={house} lang={lang} />}
          </div>
        ))}
        {busy && (
          <p className="sg-msg sg-msg--bot sg-msg--typing">
            <span className="mp-sr">{u.typing}</span>
            <i aria-hidden="true" />
            <i aria-hidden="true" />
            <i aria-hidden="true" />
          </p>
        )}
      </div>

      <div className="sg-chat__foot">
        {suggested.length > 0 && (
          <div className="sg-chat__chips" role="group" aria-label={u.suggested}>
            {suggested.map((a) => (
              <button key={a.id} type="button" onClick={() => ask(pick(a.question, lang))} disabled={busy}>
                {pick(a.question, lang)}
              </button>
            ))}
          </div>
        )}
        <form
          className="sg-chat__form"
          onSubmit={(e) => {
            e.preventDefault();
            void ask(text);
          }}
        >
          <input
            ref={input}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={u.ask}
            aria-label={u.askLabel}
            autoComplete="off"
            enterKeyHint="send"
            maxLength={300}
          />
          <button type="submit" aria-label={u.send} disabled={!text.trim() || busy}>
            <LuArrowUp aria-hidden />
          </button>
        </form>
      </div>
    </div>
  );
};

/**
 * The guest page of a house (mobile first): the house drawn on the dark lake blue with its windows
 * lighting up, the host's welcome, the arrival card (key code, Wi-Fi, times), everything about the
 * house as an accordion, and the bar at the bottom that opens the chat. Language from the phone,
 * with a switch.
 */
const Guest: React.FC<{ house: House }> = ({ house }) => {
  const [lang, setLang] = useState<StayLang>(() => phoneLang(house.languages));
  const [open, setOpen] = useState<string | null>(null);
  const [chat, setChat] = useState(false);
  const u = STAY_UI[lang];
  const tx = (t: Parameters<typeof pick>[0]) => fill(pick(t, lang), house);
  const ids = useId();

  return (
    <div className={`sg sg--${house.template}`} lang={lang}>
      <Helmet htmlAttributes={{ lang }}>
        <title>{`${house.name} – MambyLy Stay`}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="theme-color" content={house.template === "city" ? "#1c2230" : "#12303a"} />
      </Helmet>

      <header className="sg-top">
        <div className="sg-top__bar">
          {house.demo ? <span className="sg-demo">{u.demo}</span> : <span />}
          {house.languages.length > 1 && (
            <div className="sg-langs" role="group" aria-label={u.language}>
              {house.languages.map((l) => (
                <button key={l} type="button" lang={l} aria-pressed={l === lang} aria-label={STAY_UI[l].langName} onClick={() => setLang(l)}>
                  {l.toUpperCase()}
                </button>
              ))}
            </div>
          )}
        </div>
        {house.template === "city" ? <TownHouse /> : <Cottage />}
        <h1 className="sg-top__name">{house.name}</h1>
        <p className="sg-top__place">{tx(house.place)}</p>
        <figure className="sg-host">
          <span className="sg-host__avatar" aria-hidden="true">
            {house.host.photo ? <img src={house.host.photo} alt="" width={48} height={48} /> : initials(house.host.name)}
          </span>
          <figcaption>
            <span className="sg-host__label">
              {u.welcomeFrom} · {house.host.name}
            </span>
            <q>{tx(house.host.welcome)}</q>
          </figcaption>
        </figure>
      </header>

      <main className="sg-main">
        <section className="sg-arrival" aria-labelledby={`${ids}-arr`}>
          <h2 id={`${ids}-arr`} className="mp-sr">
            {u.arrival}
          </h2>
          <div className="sg-arrival__key">
            <span className="sg-arrival__label">
              <LuKey aria-hidden /> {tx(house.arrival.keyLabel)}
            </span>
            <strong className="sg-arrival__code">{house.arrival.keyCode}</strong>
            {house.arrival.keyWhere && <p>{tx(house.arrival.keyWhere)}</p>}
          </div>
          <div className="sg-arrival__wifi">
            <span className="sg-arrival__label">
              <LuWifi aria-hidden /> {u.wifi}
            </span>
            <dl>
              <div>
                <dt>{u.network}</dt>
                <dd>{house.arrival.wifi.name}</dd>
              </div>
              <div>
                <dt>{u.password}</dt>
                <dd className="sg-arrival__pw">{house.arrival.wifi.password}</dd>
              </div>
            </dl>
            <CopyButton value={house.arrival.wifi.password} label={u.copy} done={u.copied} what={u.password} />
          </div>
          <dl className="sg-arrival__times">
            <div>
              <dt>{u.checkIn}</dt>
              <dd>{house.arrival.checkIn}</dd>
            </div>
            <div>
              <dt>{u.checkOut}</dt>
              <dd>{house.arrival.checkOut}</dd>
            </div>
          </dl>
        </section>

        <section className="sg-about" aria-labelledby={`${ids}-all`}>
          <h2 id={`${ids}-all`}>{u.allAbout[house.template]}</h2>
          <ul>
            {house.sections.map((s) => {
              const on = open === s.id;
              return (
                <li key={s.id} className={on ? "is-open" : undefined}>
                  <h3>
                    <button type="button" aria-expanded={on} aria-controls={`${ids}-${s.id}`} onClick={() => setOpen(on ? null : s.id)}>
                      <span className="sg-about__icon">
                        <StayIcon name={s.icon} />
                      </span>
                      <span className="sg-about__title">{tx(s.title)}</span>
                      <LuChevronDown className="sg-about__chev" aria-hidden />
                    </button>
                  </h3>
                  <div id={`${ids}-${s.id}`} className="sg-about__body" hidden={!on}>
                    <p>{tx(s.body)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="sg-contact">
          <h2>{u.writeHost}</h2>
          <HostContact house={house} lang={lang} />
        </section>

        <p className="sg-powered">
          <Link to="/tools/stay">{u.poweredBy}</Link>
        </p>
      </main>

      <div className="sg-askbar">
        <button type="button" onClick={() => setChat(true)} aria-haspopup="dialog">
          <LuMessageCircle aria-hidden />
          <span>{u.ask}</span>
        </button>
      </div>

      {chat && <Chat house={house} lang={lang} onClose={() => setChat(false)} />}
    </div>
  );
};

export default Guest;
