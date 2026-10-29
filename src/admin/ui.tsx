import React, { useEffect, useId, useState } from "react";
import { Dialog } from "@mui/material";
import { FiAlertTriangle, FiCheckCircle, FiEye, FiEyeOff, FiInfo, FiLoader, FiRefreshCw, FiX } from "react-icons/fi";

/**
 * Shared building blocks of the admin: buttons, fields, notices, empty/error states and the
 * confirmation dialog (MUI Dialog underneath for focus trap, Escape and scroll lock).
 */

export const useAdminTitle = (title: string) => {
  useEffect(() => {
    document.title = `${title} · MambyLy admin`;
  }, [title]);
};

/** Profile picture, or the initials when there is none or it does not load. Decorative: the name
 * is always written next to it. */
export const Avatar: React.FC<{ name: string; src?: string | null; size?: "sm" | "md" }> = ({ name, src, size = "md" }) => {
  const [broken, setBroken] = useState(false);
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
  return (
    <span className={`ad-avatar ad-avatar--${size}`} aria-hidden="true">
      {src && !broken ? <img src={src} alt="" onError={() => setBroken(true)} /> : initials || "?"}
    </span>
  );
};

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "md" | "sm";
  icon?: React.ReactNode;
  busy?: boolean;
};

export const Button: React.FC<ButtonProps> = ({ variant = "secondary", size = "md", icon, busy, children, className = "", disabled, ...rest }) => (
  <button
    type="button"
    className={`ad-btn ad-btn--${variant} ad-btn--${size}${busy ? " is-busy" : ""} ${className}`}
    disabled={disabled || busy}
    aria-busy={busy || undefined}
    {...rest}
  >
    {busy ? <FiLoader className="ad-spin" aria-hidden="true" /> : icon && <span aria-hidden="true">{icon}</span>}
    {children}
  </button>
);

/** Icon-only button: always with a visible tooltip on hover/focus and an accessible name. */
export const IconButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string; icon: React.ReactNode }> = ({ label, icon, className = "", ...rest }) => (
  <button type="button" className={`ad-iconbtn ${className}`} aria-label={label} data-tip={label} {...rest}>
    <span aria-hidden="true">{icon}</span>
  </button>
);

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string | null; hint?: string };

export const Field: React.FC<FieldProps> = ({ label, error, hint, id, className = "", ...rest }) => {
  const auto = useId();
  const fid = id ?? auto;
  const describedBy = [error ? `${fid}-err` : "", hint ? `${fid}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`ad-field ${className}`}>
      <label htmlFor={fid}>{label}</label>
      <input id={fid} aria-invalid={error ? true : undefined} aria-describedby={describedBy} {...rest} />
      {hint && (
        <p id={`${fid}-hint`} className="ad-field__hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${fid}-err`} className="ad-field__error">
          {error}
        </p>
      )}
    </div>
  );
};

/** Password field with a real show/hide toggle (aria-pressed, named, keyboard reachable). */
export const PasswordField: React.FC<FieldProps> = ({ label, error, id, ...rest }) => {
  const auto = useId();
  const fid = id ?? auto;
  const [shown, setShown] = useState(false);
  return (
    <div className="ad-field">
      <label htmlFor={fid}>{label}</label>
      <div className="ad-field__pw">
        <input id={fid} type={shown ? "text" : "password"} aria-invalid={error ? true : undefined} aria-describedby={error ? `${fid}-err` : undefined} {...rest} />
        <button type="button" className="ad-field__eye" aria-pressed={shown} aria-label={shown ? "Hide password" : "Show password"} onClick={() => setShown((v) => !v)}>
          {shown ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
        </button>
      </div>
      {error && (
        <p id={`${fid}-err`} className="ad-field__error">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * Inline status message. Errors use role="alert" and stay until dismissed or replaced, so an
 * important failure is never only a toast that disappears; successes use role="status".
 */
export const Notice: React.FC<{ tone: "error" | "success" | "info"; children: React.ReactNode; onClose?: () => void }> = ({ tone, children, onClose }) => (
  <div className={`ad-notice ad-notice--${tone}`} role={tone === "error" ? "alert" : "status"}>
    <span className="ad-notice__icon" aria-hidden="true">
      {tone === "error" ? <FiAlertTriangle /> : tone === "success" ? <FiCheckCircle /> : <FiInfo />}
    </span>
    <div className="ad-notice__text">{children}</div>
    {onClose && (
      <button type="button" className="ad-notice__close" onClick={onClose} aria-label="Dismiss message">
        <FiX aria-hidden="true" />
      </button>
    )}
  </div>
);

export const Loading: React.FC<{ label?: string }> = ({ label = "Loading…" }) => (
  <div className="ad-state" role="status" aria-live="polite">
    <FiLoader className="ad-spin ad-state__icon" aria-hidden="true" />
    <p>{label}</p>
  </div>
);

export const EmptyState: React.FC<{ title: string; text?: string; action?: React.ReactNode }> = ({ title, text, action }) => (
  <div className="ad-state">
    <FiInfo className="ad-state__icon" aria-hidden="true" />
    <p className="ad-state__title">{title}</p>
    {text && <p>{text}</p>}
    {action}
  </div>
);

/** Loading failed: different from "empty", with a retry when the caller can reload. */
export const ErrorState: React.FC<{ title: string; detail?: string | null; onRetry?: () => void }> = ({ title, detail, onRetry }) => (
  <div className="ad-state ad-state--error" role="alert">
    <FiAlertTriangle className="ad-state__icon" aria-hidden="true" />
    <p className="ad-state__title">{title}</p>
    {detail && <p>{detail}</p>}
    {onRetry && (
      <Button icon={<FiRefreshCw />} onClick={onRetry}>
        Try again
      </Button>
    )}
  </div>
);

/** Panel dialog (forms, confirmations): focus trapped, Escape closes, title is the label. */
export const Panel: React.FC<{ open: boolean; onClose: () => void; title: string; children: React.ReactNode; actions?: React.ReactNode; wide?: boolean }> = ({
  open,
  onClose,
  title,
  children,
  actions,
  wide,
}) => {
  const tid = useId();
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby={tid} PaperProps={{ className: `ad-dialog${wide ? " ad-dialog--wide" : ""}` }}>
      <div className="ad-dialog__head">
        <h2 id={tid}>{title}</h2>
        <IconButton label="Close" icon={<FiX />} onClick={onClose} />
      </div>
      <div className="ad-dialog__body">{children}</div>
      {actions && <div className="ad-dialog__actions">{actions}</div>}
    </Dialog>
  );
};

/** Confirmation of a destructive action: names the item, the danger button says what it does. */
export const ConfirmDialog: React.FC<{
  open: boolean;
  title: string;
  text: React.ReactNode;
  confirmLabel: string;
  busy?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ open, title, text, confirmLabel, busy, error, onConfirm, onCancel }) => (
  <Panel
    open={open}
    onClose={busy ? () => {} : onCancel}
    title={title}
    actions={
      <>
        <Button onClick={onCancel} disabled={busy}>
          Cancel
        </Button>
        <Button variant="danger" onClick={onConfirm} busy={busy}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <div className="ad-dialog__text">{text}</div>
    {error && <Notice tone="error">{error}</Notice>}
  </Panel>
);
