import React, { createContext, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { FiArrowLeft, FiCopy, FiExternalLink, FiMail, FiPaperclip, FiRefreshCw, FiSearch, FiTrash2, FiX } from "react-icons/fi";
import { useAuthStore } from "../store/useAuthStore";
import useMessages from "../hooks/useMessages";
import { Message } from "../types/common";
import { Button, ConfirmDialog, EmptyState, ErrorState, Loading, Notice, useAdminTitle } from "./ui";
import { longDate, shortDate, time } from "./format";
import { useCopy } from "./useCopy";

/**
 * Client messages and job applications: one list and one detail view per kind, sharing the data
 * loaded once by useMessages (the API returns the whole collection, without paging). Going from
 * the list to a message and back keeps search, filters (in the URL) and the scroll position.
 */

export type MessageKind = "clients" | "applications";

const KINDS = {
  clients: { idKey: "clientMessageId", title: "Client messages", noun: "message", nouns: "messages", cv: false },
  applications: { idKey: "jobMessageId", title: "Applications", noun: "application", nouns: "applications", cv: true },
} as const;

type Cfg = (typeof KINDS)[MessageKind];

type Ctx = ReturnType<typeof useMessages> & {
  cfg: Cfg;
  scroll: React.MutableRefObject<{ y: number; id: string | null }>;
  flash: string | null;
  setFlash: (s: string | null) => void;
};

const MessagesCtx = createContext<Ctx | null>(null);
const useCtx = () => useContext(MessagesCtx)!;

const idOf = (m: Message, cfg: Cfg) => m[cfg.idKey];

const MessagesSection: React.FC<{ kind: MessageKind }> = ({ kind }) => {
  const cfg = KINDS[kind];
  const store = useMessages(cfg.idKey);
  const scroll = useRef<{ y: number; id: string | null }>({ y: 0, id: null });
  const [flash, setFlash] = useState<string | null>(null);
  return (
    <MessagesCtx.Provider value={{ ...store, cfg, scroll, flash, setFlash }}>
      <Routes>
        <Route index element={<MessageList />} />
        <Route path=":id" element={<MessageDetail />} />
      </Routes>
    </MessagesCtx.Provider>
  );
};

export default MessagesSection;

// ---------------------------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------------------------

const RANGES = [
  { value: "all", label: "Any time" },
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
];

/** A stored value only becomes a link if it is a web address: never javascript: or data:. */
const safeHref = (url?: string | null) => {
  try {
    const parsed = new URL(url ?? "");
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
  } catch {
    return null;
  }
};

const preview = (text: string) => (text || "").replace(/\s+/g, " ").trim();

const MessageList: React.FC = () => {
  const { cfg, messages, loading, error, fetchMessages, deleteMessage, scroll, flash, setFlash } = useCtx();
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  useAdminTitle(cfg.title);

  const q = params.get("q") ?? "";
  const range = params.get("range") ?? "all";
  const subject = params.get("subject") ?? "";
  const cv = params.get("cv") ?? "all";
  const sort = params.get("sort") === "oldest" ? "oldest" : "newest";

  const set = (key: string, value: string, empty = "") => {
    const next = new URLSearchParams(params);
    if (value === empty) next.delete(key);
    else next.set(key, value);
    setParams(next, { replace: true });
  };
  const filtersActive = !!(q || range !== "all" || subject || cv !== "all");
  const clear = () => {
    const next = new URLSearchParams(params);
    ["q", "range", "subject", "cv"].forEach((k) => next.delete(k));
    setParams(next, { replace: true });
  };

  const subjects = useMemo(() => Array.from(new Set(messages.map((m) => (m.subject || "").trim()).filter(Boolean))).sort((a, b) => a.localeCompare(b)), [messages]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const since = range === "all" ? 0 : Date.now() - Number(range) * 86400000;
    const list = messages.filter((m) => {
      if (needle && ![m.name, m.email, m.subject, m.textMessage].some((v) => (v || "").toLowerCase().includes(needle))) return false;
      if (since && time(m.sentAt) < since) return false;
      if (subject && (m.subject || "").trim() !== subject) return false;
      if (cv === "with" && !m.uploadCv) return false;
      if (cv === "without" && m.uploadCv) return false;
      return true;
    });
    return list.sort((a, b) => (sort === "newest" ? time(b.sentAt) - time(a.sentAt) : time(a.sentAt) - time(b.sentAt)));
  }, [messages, q, range, subject, cv, sort]);

  // Selection: only what the current search and filters show can be selected or deleted.
  const [selected, setSelected] = useState<ReadonlySet<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [notDeleted, setNotDeleted] = useState<string[]>([]);
  const bulkBusy = useRef(false);
  const selectedShown = useMemo(() => shown.filter((m) => selected.has(idOf(m, cfg))), [shown, selected, cfg]);
  const allSelected = shown.length > 0 && selectedShown.length === shown.length;
  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (!next.delete(id)) next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(shown.map((m) => idOf(m, cfg))));

  // One at a time through the existing single delete: the API has no bulk endpoint.
  const deleteSelected = async () => {
    if (bulkBusy.current) return;
    bulkBusy.current = true;
    const targets = selectedShown;
    const failed: Message[] = [];
    setNotDeleted([]);
    setFlash(null);
    setProgress({ done: 0, total: targets.length });
    for (const [i, m] of targets.entries()) {
      if (!(await deleteMessage(idOf(m, cfg)))) failed.push(m);
      setProgress({ done: i + 1, total: targets.length });
      if (!useAuthStore.getState().isAuthenticated) break; // session ended: the login screen takes over
    }
    bulkBusy.current = false;
    setProgress(null);
    setConfirmBulk(false);
    setSelected(new Set(failed.map((m) => idOf(m, cfg))));
    setNotDeleted(failed.map((m) => `${m.name || m.email || "(No name)"} · ${shortDate(m.sentAt)}`));
    const deleted = targets.length - failed.length;
    if (deleted) setFlash(`${deleted} ${deleted === 1 ? cfg.noun : cfg.nouns} deleted.`);
  };

  // Back from a message: same scroll position and focus on the message that was open.
  const restored = useRef(false);
  useLayoutEffect(() => {
    if (restored.current || loading || !messages.length) return;
    restored.current = true;
    const { y, id } = scroll.current;
    // the table link and the phone card share the id; only one of them is displayed
    const target = id ? [...document.querySelectorAll<HTMLElement>(`[data-open-id="${CSS.escape(id)}"]`)].find((el) => el.offsetParent !== null) : null;
    target?.focus({ preventScroll: true });
    window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
  }, [loading, messages.length, scroll]);

  const open = (id: string) => {
    scroll.current = { y: window.scrollY, id };
    navigate(encodeURIComponent(id), { state: { from: location.search } });
  };
  const remember = (id: string) => () => {
    scroll.current = { y: window.scrollY, id };
  };

  const first = loading && !messages.length;

  return (
    <section className="ad-section" aria-labelledby="ad-h1">
      <header className="ad-section__head">
        <h1 id="ad-h1" tabIndex={-1}>
          {cfg.title}
        </h1>
        <Button icon={<FiRefreshCw />} onClick={() => fetchMessages()} busy={loading && !first} disabled={first}>
          Refresh
        </Button>
      </header>

      {flash && (
        <Notice tone="success" onClose={() => setFlash(null)}>
          {flash}
        </Notice>
      )}

      {notDeleted.length > 0 && (
        <Notice tone="error" onClose={() => setNotDeleted([])}>
          <p>
            {notDeleted.length} {notDeleted.length === 1 ? cfg.noun : cfg.nouns} could not be deleted and {notDeleted.length === 1 ? "is" : "are"} still selected:
          </p>
          <ul className="ad-bulk__failed">
            {notDeleted.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Notice>
      )}

      {first ? (
        <Loading label={`Loading ${cfg.nouns}…`} />
      ) : error && !messages.length ? (
        <ErrorState title={`The ${cfg.nouns} could not be loaded.`} detail="Check the connection and try again. Nothing has been changed." onRetry={() => fetchMessages()} />
      ) : !messages.length ? (
        <EmptyState title={`No ${cfg.nouns} yet.`} text={`New ${cfg.nouns} sent from the website will appear here.`} />
      ) : (
        <>
          {error && <Notice tone="error">The list could not be refreshed. You are seeing the {cfg.nouns} loaded earlier.</Notice>}

          <div className="ad-filters" role="search" aria-label={`Search ${cfg.nouns}`}>
            <div className="ad-filters__search">
              <label htmlFor="ad-q">Search</label>
              <div className="ad-input-icon">
                <FiSearch aria-hidden="true" />
                <input id="ad-q" type="search" value={q} placeholder="Name, email, subject or text" onChange={(e) => set("q", e.target.value)} autoComplete="off" />
              </div>
            </div>
            <div className="ad-filters__field">
              <label htmlFor="ad-range">Received</label>
              <select id="ad-range" value={range} onChange={(e) => set("range", e.target.value, "all")}>
                {RANGES.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
            {cfg.cv ? (
              <div className="ad-filters__field">
                <label htmlFor="ad-cv">CV</label>
                <select id="ad-cv" value={cv} onChange={(e) => set("cv", e.target.value, "all")}>
                  <option value="all">With or without</option>
                  <option value="with">CV attached</option>
                  <option value="without">No CV</option>
                </select>
              </div>
            ) : (
              <div className="ad-filters__field">
                <label htmlFor="ad-subject">Subject</label>
                <select id="ad-subject" value={subject} onChange={(e) => set("subject", e.target.value)}>
                  <option value="">All subjects</option>
                  {subjects.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="ad-filters__field">
              <label htmlFor="ad-sort">Order</label>
              <select id="ad-sort" value={sort} onChange={(e) => set("sort", e.target.value, "newest")}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </div>

          <div className="ad-resultbar">
            <p role="status" aria-live="polite">
              {filtersActive ? `${shown.length} of ${messages.length} ${cfg.nouns}` : `${messages.length} ${messages.length === 1 ? cfg.noun : cfg.nouns}`}
              <span className="ad-resultbar__scope"> · search and filters only look through the {cfg.nouns} loaded on this page</span>
            </p>
            {filtersActive && (
              <Button size="sm" variant="ghost" icon={<FiX />} onClick={clear}>
                Clear filters
              </Button>
            )}
          </div>

          {!shown.length ? (
            <EmptyState
              title={`No ${cfg.nouns} match.`}
              text="Try other words or clear the filters."
              action={
                <Button icon={<FiX />} onClick={clear}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <>
              <div className="ad-bulk" role="group" aria-label={`Select ${cfg.nouns}`}>
                <label className="ad-bulk__all">
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} ref={(el) => { if (el) el.indeterminate = selectedShown.length > 0 && !allSelected; }} />
                  Select all{filtersActive ? " shown" : ""} ({shown.length})
                </label>
                <span className="ad-bulk__count" role="status" aria-live="polite">
                  {selectedShown.length} selected
                </span>
                <Button size="sm" variant="danger" icon={<FiTrash2 />} disabled={!selectedShown.length} onClick={() => setConfirmBulk(true)}>
                  Delete selected
                </Button>
              </div>

              {/* Desktop and tablet: a real table */}
              <div className="ad-table-wrap">
                <table className="ad-table">
                  <caption className="ad-sr">
                    {cfg.title}, {sort === "newest" ? "newest first" : "oldest first"}. Select a row to read the whole {cfg.noun}.
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" className="ad-table__pick">
                        <span className="ad-sr">Select</span>
                      </th>
                      <th scope="col">From</th>
                      <th scope="col">Subject and message</th>
                      {cfg.cv && <th scope="col">CV</th>}
                      <th scope="col">Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((m) => {
                      const id = idOf(m, cfg);
                      return (
                        <tr key={id} onClick={() => open(id)} className={`ad-table__row${selected.has(id) ? " is-selected" : ""}`}>
                          <td className="ad-table__pick" onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} aria-label={`Select ${cfg.noun} from ${m.name || m.email || "unknown"}`} />
                          </td>
                          <td>
                            <Link to={encodeURIComponent(id)} state={{ from: location.search }} onClick={(e) => { e.stopPropagation(); remember(id)(); }} data-open-id={id} className="ad-table__open">
                              {m.name || "(No name)"}
                            </Link>
                            <span className="ad-table__sub">{m.email}</span>
                          </td>
                          <td className="ad-table__msg">
                            <span className="ad-table__subject">{m.subject || "(No subject)"}</span>
                            <span className="ad-table__preview">{preview(m.textMessage)}</span>
                          </td>
                          {cfg.cv && <td>{m.uploadCv ? <span className="ad-chip"><FiPaperclip aria-hidden="true" /> CV</span> : <span className="ad-muted">None</span>}</td>}
                          <td className="ad-table__date">
                            <time dateTime={m.sentAt}>{shortDate(m.sentAt)}</time>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Phones: cards */}
              <ul className="ad-cards" aria-label={cfg.title}>
                {shown.map((m) => {
                  const id = idOf(m, cfg);
                  return (
                    <li key={id} className="ad-cards__item">
                      <label className="ad-cards__pick">
                        <input type="checkbox" checked={selected.has(id)} onChange={() => toggle(id)} aria-label={`Select ${cfg.noun} from ${m.name || m.email || "unknown"}`} />
                      </label>
                      <Link to={encodeURIComponent(id)} state={{ from: location.search }} onClick={remember(id)} data-open-id={id} className="ad-card">
                        <span className="ad-card__top">
                          <span className="ad-card__name">{m.name || "(No name)"}</span>
                          <time dateTime={m.sentAt}>{shortDate(m.sentAt)}</time>
                        </span>
                        <span className="ad-card__email">{m.email}</span>
                        <span className="ad-card__subject">
                          {m.subject || "(No subject)"}
                          {cfg.cv && m.uploadCv && (
                            <span className="ad-chip">
                              <FiPaperclip aria-hidden="true" /> CV
                            </span>
                          )}
                        </span>
                        <span className="ad-card__preview">{preview(m.textMessage)}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </>
      )}

      <ConfirmDialog
        open={confirmBulk}
        title={`Delete ${selectedShown.length} ${selectedShown.length === 1 ? cfg.noun : cfg.nouns}?`}
        text={
          progress ? (
            <p role="status" aria-live="polite">
              Deleting {progress.done} of {progress.total}…
            </p>
          ) : (
            <p>
              <strong>
                {selectedShown.length} {selectedShown.length === 1 ? cfg.noun : cfg.nouns}
              </strong>{" "}
              will be deleted permanently. This cannot be undone.
            </p>
          )
        }
        confirmLabel={`Delete ${selectedShown.length}`}
        busy={!!progress}
        onConfirm={deleteSelected}
        onCancel={() => setConfirmBulk(false)}
      />
    </section>
  );
};

// ---------------------------------------------------------------------------------------------
// Detail
// ---------------------------------------------------------------------------------------------

const MessageDetail: React.FC = () => {
  const { cfg, messages, loading, error, fetchMessages, deleteMessage, setFlash } = useCtx();
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const from: string | undefined = (location.state as { from?: string } | null)?.from;
  const message = messages.find((m) => idOf(m, cfg) === id);
  const { copy, resultFor } = useCopy();
  const [confirm, setConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const busy = useRef(false);
  useAdminTitle(message ? `${message.subject || "(No subject)"} · ${cfg.title}` : cfg.title);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    document.getElementById("ad-h1")?.focus({ preventScroll: true });
  }, [id, !!message]);

  // Back to the list: through history when we came from it (search, filters and scroll kept).
  const back = () => {
    if (from !== undefined) navigate(-1);
    else navigate("..");
  };

  const backLink = (
    <button type="button" className="ad-back" onClick={back}>
      <FiArrowLeft aria-hidden="true" /> All {cfg.nouns}
    </button>
  );

  if (!message) {
    return (
      <section className="ad-section" aria-labelledby="ad-h1">
        {backLink}
        {loading ? (
          <Loading label={`Loading the ${cfg.noun}…`} />
        ) : error ? (
          <>
            <h1 id="ad-h1" tabIndex={-1} className="ad-sr">
              {cfg.title}
            </h1>
            <ErrorState title={`The ${cfg.noun} could not be loaded.`} detail="Check the connection and try again." onRetry={() => fetchMessages()} />
          </>
        ) : (
          <>
            <h1 id="ad-h1" tabIndex={-1} className="ad-sr">
              {cfg.title}
            </h1>
            <EmptyState title={`This ${cfg.noun} is not available.`} text="It may have been deleted, or the link is not complete." />
          </>
        )}
      </section>
    );
  }

  const doDelete = async () => {
    if (busy.current) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError(null);
    const ok = await deleteMessage(id);
    busy.current = false;
    setDeleting(false);
    if (ok) {
      setConfirm(false);
      setFlash(`The ${cfg.noun} from ${message.name || message.email} was deleted.`);
      navigate({ pathname: "..", search: from ?? "" }, { replace: true });
    } else {
      setDeleteError(`The ${cfg.noun} could not be deleted. Nothing was changed – try again.`);
    }
  };

  const copied = resultFor("email");
  const mailto = `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || ""}`.trim())}`;

  return (
    <section className="ad-section ad-detail" aria-labelledby="ad-h1">
      {backLink}
      <article className="ad-msg">
        <header className="ad-msg__head">
          <p className="ad-eyebrow">{cfg.noun === "message" ? "Client message" : "Job application"}</p>
          <h1 id="ad-h1" tabIndex={-1}>
            {message.subject || "(No subject)"}
          </h1>
        </header>

        <dl className="ad-meta">
          <div>
            <dt>From</dt>
            <dd>{message.name || "(No name)"}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd className="ad-meta__email">
              <span className="ad-select">{message.email}</span>
              <Button size="sm" variant="ghost" icon={<FiCopy />} onClick={() => copy(message.email, "email")}>
                Copy
              </Button>
              <span className={`ad-copied${copied ? " is-on" : ""}${copied === "failed" ? " is-failed" : ""}`} role="status">
                {copied === "copied" ? "Copied" : copied === "failed" ? "Could not copy – select the address instead" : ""}
              </span>
            </dd>
          </div>
          <div>
            <dt>Received</dt>
            <dd>
              <time dateTime={message.sentAt}>{longDate(message.sentAt)}</time>
            </dd>
          </div>
          {cfg.cv && (
            <div>
              <dt>CV</dt>
              <dd>
                {safeHref(message.uploadCv) ? (
                  <a href={safeHref(message.uploadCv)!} target="_blank" rel="noopener noreferrer" className="ad-link">
                    Open CV <FiExternalLink aria-hidden="true" />
                    <span className="ad-sr"> (opens in a new tab)</span>
                  </a>
                ) : (
                  <span className="ad-muted">No CV attached</span>
                )}
              </dd>
            </div>
          )}
        </dl>

        <div className="ad-msg__body">{message.textMessage || <span className="ad-muted">(Empty message)</span>}</div>

        <div className="ad-msg__actions">
          <div>
            <a className="ad-btn ad-btn--primary ad-btn--md" href={mailto}>
              <span aria-hidden="true">
                <FiMail />
              </span>
              Reply in your email app
            </a>
            <p className="ad-field__hint">Opens the email app set up on this device, with the address filled in.</p>
          </div>
          <Button variant="danger" icon={<FiTrash2 />} onClick={() => { setDeleteError(null); setConfirm(true); }}>
            Delete {cfg.noun}
          </Button>
        </div>
      </article>

      <ConfirmDialog
        open={confirm}
        title={`Delete this ${cfg.noun}?`}
        text={
          <p>
            The {cfg.noun} from <strong>{message.name || message.email}</strong>, received {shortDate(message.sentAt)}, will be deleted permanently. This cannot be undone.
          </p>
        }
        confirmLabel={`Delete ${cfg.noun}`}
        busy={deleting}
        error={deleteError}
        onConfirm={doDelete}
        onCancel={() => setConfirm(false)}
      />
    </section>
  );
};
