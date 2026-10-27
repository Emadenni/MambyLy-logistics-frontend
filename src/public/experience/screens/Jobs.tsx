import React, { useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiPaperclip } from "react-icons/fi";
import useSubmitMessages from "../../../hooks/useSubmitMessage";
import { useCopy } from "../i18n";
import Screen, { ScreenHead, TopBar } from "../Screen";
import { PATHS } from "../routes";
import { EMAIL_PATTERN } from "../wizardStore";

type Field = "name" | "email" | "message" | "file" | "consent";

/**
 * /jobbaMedOss – open application. Same hook and endpoint as before
 * (useSubmitMessage(true) → POST /jobMessages with uploadCvBase64); same validation rules as
 * src/utils/formValidation.ts, with messages in the page language. The data stays on error.
 */
const Jobs: React.FC = () => {
  const t = useCopy();
  const j = t.jobs;
  const ids = useId();
  const { isSubmitting, handleSubmit } = useSubmitMessages(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [consent, setConsent] = useState(false);
  const [tried, setTried] = useState(false);
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const sending = useRef(false);

  const errors: Partial<Record<Field, string>> = {};
  if (name.trim().length < 2 || name.trim().length > 100) errors.name = j.errors.name;
  if (!EMAIL_PATTERN.test(email.trim())) errors.email = j.errors.email;
  if (message.trim().length < 10 || message.trim().length > 2000) errors.message = j.errors.message;
  if (!file) errors.file = j.errors.file;
  if (!consent) errors.consent = j.errors.consent;
  const show = (f: Field) => (tried ? errors[f] : undefined);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTried(true);
    if (Object.keys(errors).length || sending.current || isSubmitting) return;
    sending.current = true;
    setFailed(false);
    const result = await handleSubmit({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim() || j.subjectDefault,
      message: message.trim(),
      file,
      termsAccepted: consent,
    });
    sending.current = false;
    if (result.success) setSent(true);
    else setFailed(true);
  };

  const describe = (f: Field) => (show(f) ? `${ids}-${f}-err` : undefined);
  const error = (f: Field) =>
    show(f) ? (
      <p id={`${ids}-${f}-err`} className="mp-error">
        {show(f)}
      </p>
    ) : null;

  return (
    <Screen
      id="jobs"
      tone="paper"
      head={<ScreenHead lang={t.lang} title={t.meta.jobs.title} description={t.meta.jobs.description} screen="jobs" />}
      bar={<TopBar crumbs={[{ label: t.nav.jobs }]} back={{ screen: "explore", label: t.common.explore }} />}
    >
      <div className="mp-col mp-jobs2">
        <h1 className="mp-display mp-jobs2__title" data-focus>
          {j.title}
        </h1>
        <p className="mp-jobs2__status">{j.status}</p>
        <p>{j.text}</p>

        {sent ? (
          <p className="mp-success" role="status">
            {j.success}
          </p>
        ) : (
          <form className="mp-form2" onSubmit={onSubmit} noValidate aria-busy={isSubmitting}>
            <h2 className="mp-form2__title">{j.formTitle}</h2>
            <label className="mp-label" htmlFor={`${ids}-name`}>
              {j.name}
            </label>
            <div className="mp-field">
              <input id={`${ids}-name`} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={100} aria-invalid={!!show("name") || undefined} aria-describedby={describe("name")} />
            </div>
            {error("name")}
            <label className="mp-label" htmlFor={`${ids}-email`}>
              {j.email}
            </label>
            <div className="mp-field">
              <input id={`${ids}-email`} type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!show("email") || undefined} aria-describedby={describe("email")} />
            </div>
            {error("email")}
            <label className="mp-label" htmlFor={`${ids}-subject`}>
              {j.subject}
            </label>
            <div className="mp-field">
              <input id={`${ids}-subject`} value={subject} placeholder={j.subjectDefault} onChange={(e) => setSubject(e.target.value)} maxLength={120} />
            </div>
            <label className="mp-label" htmlFor={`${ids}-message`}>
              {j.message}
            </label>
            <textarea id={`${ids}-message`} className="mp-textarea" rows={4} maxLength={2000} value={message} onChange={(e) => setMessage(e.target.value)} aria-invalid={!!show("message") || undefined} aria-describedby={describe("message")} />
            {error("message")}
            <label className="mp-file" htmlFor={`${ids}-file`}>
              <span className="mp-label">{j.file}</span>
              <span className="mp-file__row">
                <span className="mp-xbtn mp-xbtn--ghost">
                  <FiPaperclip aria-hidden="true" /> {j.fileChoose}
                </span>
                <span className="mp-file__name">{file?.name ?? j.fileNone}</span>
              </span>
              <input id={`${ids}-file`} type="file" className="mp-file__input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} aria-invalid={!!show("file") || undefined} aria-describedby={describe("file")} />
            </label>
            {error("file")}
            <label className="mp-check">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={!!show("consent") || undefined} aria-describedby={describe("consent")} />
              <span>
                {t.contact.consentBefore}
                <Link to={PATHS.privacy[t.lang]}>{t.contact.consentLink}</Link>
                {t.contact.consentAfter}
              </span>
            </label>
            {error("consent")}
            <button type="submit" className="mp-xbtn mp-xbtn--solid mp-xbtn--block" disabled={isSubmitting}>
              {isSubmitting ? j.sending : j.send} <FiArrowRight aria-hidden="true" />
            </button>
            <div role="alert">{failed && <p className="mp-error mp-error--box">{j.sendError}</p>}</div>
          </form>
        )}
      </div>
    </Screen>
  );
};

export default Jobs;
