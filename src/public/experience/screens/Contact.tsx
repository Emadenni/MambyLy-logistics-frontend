import React, { useEffect, useId, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { FiArrowRight, FiEdit2, FiMessageCircle, FiMonitor, FiMail, FiUser, FiX } from "react-icons/fi";
import { LuIdCard, LuLayers, LuSparkles } from "react-icons/lu";
import useSubmitMessages from "../../../hooks/useSubmitMessage";
import { getCard } from "../../digital-card/registry";
import { SERVICE_SUBJECTS, subjectFor, type ContactState, type ServiceKey } from "../../digital-card/service";
import { publicContact } from "../../contact";
import { fill, useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { MESSAGE_MAX, NAME_MAX, stepValid, useWizard, validEmail, validMessage, validName, type WizardAnswers } from "../wizardStore";

const EASE = [0.22, 0.75, 0.18, 1] as const;
const SERVICES: ServiceKey[] = ["site", "card", "both", "other"];
const SERVICE_ICONS: Record<ServiceKey, React.ReactNode> = {
  site: <FiMonitor />,
  card: <LuIdCard />,
  both: <LuLayers />,
  other: <LuSparkles />,
};

/** Message as posted: what the visitor wrote, then a few context lines for the reply (in Swedish). */
function composeMessage(a: WizardAnswers, lang: "sv" | "en") {
  const context = [
    a.existing && (a.service === "site" || a.service === "both") ? `Har webbplats i dag: ${a.existing === "yes" ? "ja, ska förnyas" : "nej"}` : "",
    lang === "en" ? "Språk: engelska (skickat från den engelska sidan)" : "",
  ].filter(Boolean);
  return context.length ? `${a.message.trim()}\n\n—\n${context.join("\n")}` : a.message.trim();
}

/**
 * /kontaktaOss – three short questions. Each confirmed answer folds up into a summary at the top
 * (same layout element, animated) and stays editable. Sends through the existing hook
 * (useSubmitMessage → POST {VITE_API_BASE_URL}/clientsMessages with { name, email, subject,
 * textMessage }); the confirmation appears only after a positive response.
 */
const Contact: React.FC = () => {
  const t = useCopy();
  const c = t.contact;
  const location = useLocation();
  const reduce = useReducedMotion() ?? false;
  const w = useWizard();
  const ids = useId();
  const { isSubmitting, handleSubmit } = useSubmitMessages(false);
  const [tried, setTried] = useState<Record<number, boolean>>({});
  const [failed, setFailed] = useState(false);
  const [done, setDone] = useState<{ name: string; email: string } | null>(null);
  const sending = useRef(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // Context from the page the visitor came from (still editable).
  useEffect(() => {
    const state = (location.state ?? {}) as ContactState;
    if (state.service && state.service in SERVICE_SUBJECTS) {
      const model = state.example ? getCard(state.example) : undefined;
      w.set({ service: state.service, example: model?.demo ? model.slug : w.example });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key]);

  // Focus the new question after an explicit Continue / Edit (not on arrival).
  useEffect(() => {
    if (!moved.current) return;
    const id = window.setTimeout(() => questionRef.current?.focus({ preventScroll: false }), reduce ? 0 : 340);
    return () => window.clearTimeout(id);
  }, [w.step, reduce]);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const model = w.example ? getCard(w.example, t.lang) : undefined;
  const showModel = !!model && (w.service === "card" || w.service === "both");

  const goTo = (step: WizardAnswers["step"]) => {
    moved.current = true;
    w.set({ step });
  };

  const confirm = (step: number) => (e: React.FormEvent) => {
    e.preventDefault();
    setTried((p) => ({ ...p, [step]: true }));
    if (!stepValid(w, step)) return;
    // Continue to the first later question that still needs an answer (answers are kept when editing).
    const next = ([1, 2] as const).find((s) => s > step && !stepValid(w, s)) ?? 2;
    goTo(step === 2 ? 2 : next);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried({ 0: true, 1: true, 2: true });
    const firstInvalid = ([0, 1, 2] as const).find((s) => !stepValid(w, s));
    if (firstInvalid !== undefined) {
      if (firstInvalid !== 2) goTo(firstInvalid);
      return;
    }
    if (sending.current || isSubmitting) return;
    sending.current = true;
    setFailed(false);
    const example = w.example ? getCard(w.example) : undefined;
    const result = await handleSubmit({
      name: w.name.trim(),
      email: w.email.trim(),
      subject: subjectFor(w.service!, example?.demo ? example : undefined),
      message: composeMessage(w, t.lang),
      file: null,
      termsAccepted: w.consent,
    });
    sending.current = false;
    if (result.success) {
      setDone({ name: w.name.trim(), email: w.email.trim() });
      w.reset();
      setTried({});
    } else {
      setFailed(true); // answers stay as they are; the visitor can try again
    }
  };

  const shared = reduce ? {} : { transition: { layout: { duration: 0.34, ease: EASE } } };
  const appear = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.34, ease: EASE, delay: 0.08 } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      };

  const err = (step: number, ok: boolean) => tried[step] && !ok;
  const nameErr = err(0, validName(w));
  const serviceErr = err(1, !!w.service);
  const messageErr = err(1, validMessage(w));
  const emailErr = err(2, validEmail(w));
  const consentErr = err(2, w.consent);

  const summaries: { step: 0 | 1; icon: React.ReactNode; label: string; value: string }[] = [];
  if (w.step > 0) summaries.push({ step: 0, icon: <FiUser />, label: c.summaryName, value: w.name.trim() });
  if (w.step > 1 && w.service)
    summaries.push({ step: 1, icon: SERVICE_ICONS[w.service], label: c.summaryService, value: c.services[w.service].label });

  return (
    <Screen
      id="contact"
      tone="paper"
      head={<ScreenHead lang={t.lang} title={t.meta.contact.title} description={t.meta.contact.description} screen="contact" />}
      bar={<TopBar crumbs={[{ label: t.nav.contact }]} back={{ screen: "explore", label: t.common.back, anyPrevious: true }} showContact={false} />}
    >
      <div className="mp-col mp-wizard">
        <h1 className="mp-sr" data-focus>
          {c.title}
        </h1>

        {done ? (
          <div className="mp-wizard__done" role="status">
            <h2 ref={doneRef} tabIndex={-1} className="mp-display mp-wizard__q">
              {fill(c.successTitle, { name: done.name.split(" ")[0] })}
            </h2>
            <p className="mp-wizard__sub">{fill(c.successText, { email: done.email })}</p>
            <Link to={PATHS.explore[t.lang]} className="mp-xbtn mp-xbtn--solid mp-xbtn--lg">
              {c.successBack} <FiArrowRight aria-hidden="true" />
            </Link>
          </div>
        ) : (
          <LayoutGroup>
            <ul className="mp-wizard__sums" aria-label={t.contact.title}>
              <AnimatePresence initial={false}>
                {summaries.map((s) => (
                  <motion.li key={s.step} layoutId={`ans-${s.step}`} className="mp-sum" {...shared}>
                    <span className="mp-sum__icon" aria-hidden="true">
                      {s.icon}
                    </span>
                    <span className="mp-sum__value">
                      <span className="mp-sr">{s.label}: </span>
                      {s.value}
                    </span>
                    <button type="button" className="mp-sum__edit" onClick={() => goTo(s.step)} aria-label={fill(c.editField, { field: s.label })}>
                      {c.edit}
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            <AnimatePresence mode="popLayout" initial={false}>
              {w.step === 0 && (
                <motion.form key="q0" className="mp-wizard__step" onSubmit={confirm(0)} noValidate {...appear}>
                  <p className="mp-wizard__count">{fill(c.stepOf, { i: 1, n: 3 })}</p>
                  <h2 ref={questionRef} tabIndex={-1} className="mp-display mp-wizard__q">
                    {c.q1}
                  </h2>
                  <p className="mp-wizard__sub">{c.q1sub}</p>
                  <label className="mp-label" htmlFor={`${ids}-name`}>
                    {c.nameLabel}
                  </label>
                  <motion.div layoutId="ans-0" className="mp-field" {...shared}>
                    <input
                      id={`${ids}-name`}
                      name="name"
                      type="text"
                      autoComplete="name"
                      maxLength={NAME_MAX}
                      value={w.name}
                      onChange={(e) => w.set({ name: e.target.value })}
                      aria-invalid={nameErr || undefined}
                      aria-describedby={nameErr ? `${ids}-name-err` : undefined}
                    />
                  </motion.div>
                  {nameErr && (
                    <p id={`${ids}-name-err`} className="mp-error">
                      {c.errors.name}
                    </p>
                  )}
                  <button type="submit" className="mp-xbtn mp-xbtn--solid mp-xbtn--block">
                    {c.continue} <FiArrowRight aria-hidden="true" />
                  </button>
                </motion.form>
              )}

              {w.step === 1 && (
                <motion.form key="q1" className="mp-wizard__step" onSubmit={confirm(1)} noValidate {...appear}>
                  <p className="mp-wizard__count">{fill(c.stepOf, { i: 2, n: 3 })}</p>
                  <h2 ref={questionRef} tabIndex={-1} className="mp-display mp-wizard__q">
                    {c.q2}
                  </h2>
                  <p className="mp-wizard__sub">{c.q2sub}</p>
                  <fieldset className="mp-options" aria-describedby={serviceErr ? `${ids}-service-err` : undefined}>
                    <legend className="mp-sr">{c.serviceLegend}</legend>
                    {SERVICES.map((key) => {
                      const on = w.service === key;
                      const Option = on ? motion.label : "label";
                      return (
                        <Option
                          key={key}
                          className={`mp-option${on ? " is-on" : ""}`}
                          {...(on ? { layoutId: "ans-1", ...shared } : {})}
                        >
                          <input type="radio" name={`${ids}-service`} value={key} checked={on} onChange={() => w.set({ service: key })} />
                          <span className="mp-option__icon" aria-hidden="true">
                            {SERVICE_ICONS[key]}
                          </span>
                          <span className="mp-option__text">
                            <strong>{c.services[key].label}</strong>
                            <small>{c.services[key].hint}</small>
                          </span>
                        </Option>
                      );
                    })}
                  </fieldset>
                  {serviceErr && (
                    <p id={`${ids}-service-err`} className="mp-error">
                      {c.errors.service}
                    </p>
                  )}

                  {showModel && model && (
                    <p className="mp-model-chip">
                      <span>{fill(c.model, { name: model.example?.sector ?? model.name })}</span>
                      <button type="button" onClick={() => w.set({ example: undefined })} aria-label={c.removeModel}>
                        <FiX aria-hidden="true" />
                      </button>
                    </p>
                  )}

                  {(w.service === "site" || w.service === "both") && (
                    <fieldset className="mp-chips">
                      <legend>
                        {c.existingLegend} <span className="mp-muted">({c.optional})</span>
                      </legend>
                      {(["yes", "no"] as const).map((v) => (
                        <label key={v} className={`mp-chip${w.existing === v ? " is-on" : ""}`}>
                          <input type="radio" name={`${ids}-existing`} checked={w.existing === v} onChange={() => w.set({ existing: v })} />
                          {c.existing[v]}
                        </label>
                      ))}
                    </fieldset>
                  )}

                  <label className="mp-label" htmlFor={`${ids}-msg`}>
                    {c.messageLabel}
                  </label>
                  <textarea
                    id={`${ids}-msg`}
                    name="message"
                    className="mp-textarea"
                    rows={4}
                    maxLength={MESSAGE_MAX}
                    value={w.message}
                    onChange={(e) => w.set({ message: e.target.value })}
                    aria-invalid={messageErr || undefined}
                    aria-describedby={`${ids}-msg-hint${messageErr ? ` ${ids}-msg-err` : ""}`}
                  />
                  <p id={`${ids}-msg-hint`} className="mp-hint">
                    {c.messageHint} <span className="mp-hint__count">{fill(c.counter, { n: w.message.trim().length, max: MESSAGE_MAX })}</span>
                  </p>
                  {messageErr && (
                    <p id={`${ids}-msg-err`} className="mp-error">
                      {fill(c.errors.message, { max: MESSAGE_MAX })}
                    </p>
                  )}
                  <button type="submit" className="mp-xbtn mp-xbtn--solid mp-xbtn--block">
                    {c.continue} <FiArrowRight aria-hidden="true" />
                  </button>
                </motion.form>
              )}

              {w.step === 2 && (
                <motion.form key="q2" className="mp-wizard__step" onSubmit={submit} noValidate aria-busy={isSubmitting} {...appear}>
                  <p className="mp-wizard__count">{fill(c.stepOf, { i: 3, n: 3 })}</p>
                  <h2 ref={questionRef} tabIndex={-1} className="mp-display mp-wizard__q">
                    {c.q3}
                  </h2>
                  <p className="mp-wizard__sub">{c.q3sub}</p>
                  <div className="mp-recap">
                    <p className="mp-recap__label">{c.summaryMessage}</p>
                    <p className="mp-recap__text">{w.message.trim()}</p>
                    <button type="button" className="mp-sum__edit" onClick={() => goTo(1)} aria-label={fill(c.editField, { field: c.summaryMessage })}>
                      <FiEdit2 aria-hidden="true" /> {c.edit}
                    </button>
                  </div>
                  <label className="mp-label" htmlFor={`${ids}-email`}>
                    {c.emailLabel}
                  </label>
                  <div className="mp-field">
                    <input
                      id={`${ids}-email`}
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={w.email}
                      onChange={(e) => w.set({ email: e.target.value })}
                      aria-invalid={emailErr || undefined}
                      aria-describedby={emailErr ? `${ids}-email-err` : undefined}
                    />
                  </div>
                  {emailErr && (
                    <p id={`${ids}-email-err`} className="mp-error">
                      {c.errors.email}
                    </p>
                  )}
                  <label className="mp-check">
                    <input
                      type="checkbox"
                      checked={w.consent}
                      onChange={(e) => w.set({ consent: e.target.checked })}
                      aria-invalid={consentErr || undefined}
                      aria-describedby={consentErr ? `${ids}-consent-err` : undefined}
                    />
                    <span>
                      {c.consentBefore}
                      <Link to={PATHS.privacy[t.lang]}>{c.consentLink}</Link>
                      {c.consentAfter}
                    </span>
                  </label>
                  {consentErr && (
                    <p id={`${ids}-consent-err`} className="mp-error">
                      {c.errors.consent}
                    </p>
                  )}
                  <button type="submit" className="mp-xbtn mp-xbtn--solid mp-xbtn--block" disabled={isSubmitting} aria-disabled={isSubmitting}>
                    {isSubmitting ? c.sending : c.send} <FiArrowRight aria-hidden="true" />
                  </button>
                  <div role="alert" className="mp-wizard__alert">
                    {failed && <p className="mp-error mp-error--box">{c.sendError}</p>}
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </LayoutGroup>
        )}

        <aside className="mp-wizard__call" aria-label={c.call}>
          <span>{c.call}</span>
          <a href={`mailto:${publicContact.email}`}>
            <FiMail aria-hidden="true" /> {publicContact.email}
          </a>
          <a href={publicContact.whatsappGreetingUrl} target="_blank" rel="noopener noreferrer">
            <FiMessageCircle aria-hidden="true" /> {c.whatsapp}
            <span className="mp-sr"> {t.common.opensNewTab}</span>
          </a>
        </aside>
      </div>
    </Screen>
  );
};

export default Contact;

