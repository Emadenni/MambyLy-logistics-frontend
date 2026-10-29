import React, { useRef, useState } from "react";
import { FiCopy, FiEdit2, FiImage, FiRefreshCw, FiTrash2, FiUserPlus } from "react-icons/fi";
import useRenderAdmin from "../hooks/useRenderAdmin";
import useRegisterAdmin from "../hooks/useRegisterAdmin";
import { updateAdminValidation } from "../utils/updateAdminValidation";
import { AdminData } from "../types/common";
import { useAuthStore } from "../store/useAuthStore";
import { Avatar, Button, ConfirmDialog, EmptyState, ErrorState, Field, Loading, Notice, Panel, PasswordField, useAdminTitle } from "./ui";
import { readableError, shortDate } from "./format";
import { useCopy } from "./useCopy";

/** Admin accounts: list, add, edit (name, email, role), delete. */

type Edit = { firstName: string; lastName: string; email: string; role: string };

const AdminsSection: React.FC = () => {
  const { admins, loading, error, fetchAdmins, deleteAdmin, updateAdmin } = useRenderAdmin();
  const me = useAuthStore((s) => s.adminId);
  useAdminTitle("Admins");
  const { copy, resultFor } = useCopy();

  const [flash, setFlash] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<AdminData | null>(null);
  const [toDelete, setToDelete] = useState<AdminData | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const busy = useRef(false);

  const doDelete = async () => {
    if (!toDelete || busy.current) return;
    busy.current = true;
    setDeleting(true);
    setDeleteError(null);
    const res = await deleteAdmin(toDelete.adminId);
    busy.current = false;
    setDeleting(false);
    if (res.ok) {
      setFlash(`${toDelete.firstName} ${toDelete.lastName} was removed as admin.`);
      setToDelete(null);
      fetchAdmins();
    } else if (res.message) {
      setDeleteError(res.message);
    }
  };

  const first = loading && !admins.length;

  return (
    <section className="ad-section" aria-labelledby="ad-h1">
      <header className="ad-section__head">
        <h1 id="ad-h1" tabIndex={-1}>
          Admins
        </h1>
        <div className="ad-section__actions">
          <Button icon={<FiRefreshCw />} onClick={() => fetchAdmins()} busy={loading && !first} disabled={first}>
            Refresh
          </Button>
          <Button variant="primary" icon={<FiUserPlus />} onClick={() => setAdding(true)}>
            Add admin
          </Button>
        </div>
      </header>
      <p className="ad-lead">People who can sign in to this admin.</p>

      {flash && (
        <Notice tone="success" onClose={() => setFlash(null)}>
          {flash}
        </Notice>
      )}

      {first ? (
        <Loading label="Loading admins…" />
      ) : error && !admins.length ? (
        <ErrorState title="The admins could not be loaded." detail="Check the connection and try again." onRetry={() => fetchAdmins()} />
      ) : !admins.length ? (
        <EmptyState title="No admins found." />
      ) : (
        <>
          {error && <Notice tone="error">The list could not be refreshed. You are seeing the admins loaded earlier.</Notice>}
          <ul className="ad-people">
            {admins.map((a) => {
              const name = `${a.firstName} ${a.lastName}`.trim();
              const copied = resultFor(a.adminId);
              return (
                <li key={a.adminId} className="ad-person">
                  <Avatar name={name} src={a.profileImageUrl} />
                  <div className="ad-person__main">
                    <p className="ad-person__name">
                      {name || "(No name)"}
                      {a.adminId === me && <span className="ad-chip">You</span>}
                    </p>
                    <p className="ad-person__email">
                      <span className="ad-select">{a.email}</span>
                      <span className={`ad-copied${copied ? " is-on" : ""}${copied === "failed" ? " is-failed" : ""}`} role="status">
                        {copied === "copied" ? "Copied" : copied === "failed" ? "Could not copy" : ""}
                      </span>
                    </p>
                    <p className="ad-person__meta">
                      <span>Role: {a.role || "–"}</span>
                      {a.createdAt && a.createdAt !== "Invalid Date" && <span>Added {shortDate(a.createdAt)}</span>}
                    </p>
                  </div>
                  <div className="ad-person__actions">
                    <Button size="sm" variant="ghost" icon={<FiCopy />} onClick={() => copy(a.email, a.adminId)} aria-label={`Copy email of ${name}`}>
                      Copy email
                    </Button>
                    <Button size="sm" icon={<FiEdit2 />} onClick={() => setEditing(a)} aria-label={`Edit ${name}`}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      icon={<FiTrash2 />}
                      onClick={() => {
                        setDeleteError(null);
                        setToDelete(a);
                      }}
                      aria-label={`Delete ${name}`}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}

      {adding && (
        <AddAdminPanel
          onClose={() => setAdding(false)}
          onAdded={(n) => {
            setAdding(false);
            setFlash(`${n} was added as admin.`);
            fetchAdmins();
          }}
        />
      )}

      {editing && (
        <EditAdminPanel
          admin={editing}
          save={updateAdmin}
          onClose={() => setEditing(null)}
          onSaved={(n) => {
            setEditing(null);
            setFlash(`The details of ${n} were saved.`);
            fetchAdmins();
          }}
        />
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Delete this admin?"
        text={
          <p>
            <strong>
              {toDelete?.firstName} {toDelete?.lastName}
            </strong>{" "}
            ({toDelete?.email}) will no longer be able to sign in. This cannot be undone.
            {toDelete?.adminId === me && " This is your own account: you will lose access."}
          </p>
        }
        confirmLabel="Delete admin"
        busy={deleting}
        error={deleteError}
        onConfirm={doDelete}
        onCancel={() => setToDelete(null)}
      />
    </section>
  );
};

export default AdminsSection;

const AddAdminPanel: React.FC<{ onClose: () => void; onAdded: (name: string) => void }> = ({ onClose, onAdded }) => {
  const { newAdmin, error, handleChange, handleFileChange, submitAdmin, fieldErrors } = useRegisterAdmin();
  const [saving, setSaving] = useState(false);
  const [tried, setTried] = useState(false);
  const busy = useRef(false);
  const missingImage = tried && !newAdmin.profileImage;
  const hasFieldErrors = Object.values(fieldErrors).some(Boolean) || missingImage;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy.current) return;
    busy.current = true;
    setTried(true);
    setSaving(true);
    const res = await submitAdmin();
    busy.current = false;
    setSaving(false);
    if (res.success) onAdded(`${newAdmin.firstName} ${newAdmin.lastName}`);
  };

  return (
    <Panel
      open
      onClose={() => !saving && onClose()}
      title="Add admin"
      actions={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="ad-add-form" busy={saving}>
            Add admin
          </Button>
        </>
      }
    >
      <form id="ad-add-form" className="ad-form" onSubmit={submit} noValidate>
        <div className="ad-form__row">
          <Field label="First name" value={newAdmin.firstName} onChange={(e) => handleChange(e, "firstName")} error={readableError(fieldErrors.firstName)} autoComplete="off" />
          <Field label="Last name" value={newAdmin.lastName} onChange={(e) => handleChange(e, "lastName")} error={readableError(fieldErrors.lastName)} autoComplete="off" />
        </div>
        <Field label="Email" type="email" value={newAdmin.email} onChange={(e) => handleChange(e, "email")} error={readableError(fieldErrors.email)} autoComplete="off" />
        <PasswordField label="Password" value={newAdmin.password} onChange={(e) => handleChange(e, "password")} error={readableError(fieldErrors.password)} autoComplete="new-password" />
        <p className="ad-field__hint">At least 6 characters, with a letter, a number and one of @ $ ! % * ? &amp;</p>
        <div className="ad-field">
          <span className="ad-field__label" id="ad-add-img">
            Profile image
          </span>
          <div className="ad-upload">
            {newAdmin.profileImage ? <img src={newAdmin.profileImage} alt="Preview of the profile image" /> : <span className="ad-upload__empty" aria-hidden="true"><FiImage /></span>}
            <label className="ad-btn ad-btn--secondary ad-btn--sm">
              <input type="file" accept="image/*" className="ad-sr" onChange={handleFileChange} aria-describedby="ad-add-img" />
              {newAdmin.profileImage ? "Choose another image" : "Choose image"}
            </label>
          </div>
          {missingImage && <p className="ad-field__error">Choose a profile image.</p>}
        </div>
        {error && !hasFieldErrors && <Notice tone="error">{error} Your input is still here.</Notice>}
        {hasFieldErrors && <Notice tone="error">Check the highlighted fields.</Notice>}
      </form>
    </Panel>
  );
};

const EditAdminPanel: React.FC<{
  admin: AdminData;
  save: (id: string, data: Partial<AdminData>) => Promise<boolean>;
  onClose: () => void;
  onSaved: (name: string) => void;
}> = ({ admin, save, onClose, onSaved }) => {
  const [data, setData] = useState<Edit>({ firstName: admin.firstName, lastName: admin.lastName, email: admin.email, role: admin.role });
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const busy = useRef(false);
  const errFor = (k: keyof Edit) => readableError(errors.find((m) => m.includes(`"${k}"`)));
  const change = (k: keyof Edit) => (e: React.ChangeEvent<HTMLInputElement>) => setData((d) => ({ ...d, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy.current) return;
    // Same rules as before for name and email (the previous screen also passed "role", which
    // that schema rejects, so saving always failed). The body is unchanged; the hook drops the password.
    const v = updateAdminValidation({ firstName: data.firstName, lastName: data.lastName, email: data.email } as AdminData);
    setErrors(v);
    if (v.length) return;
    busy.current = true;
    setSaving(true);
    setSaveError(null);
    const ok = await save(admin.adminId, { ...admin, ...data });
    busy.current = false;
    setSaving(false);
    if (ok) onSaved(`${data.firstName} ${data.lastName}`);
    else setSaveError("The changes could not be saved. Your input is still here – try again.");
  };

  return (
    <Panel
      open
      onClose={() => !saving && onClose()}
      title={`Edit ${admin.firstName} ${admin.lastName}`}
      actions={
        <>
          <Button onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" form="ad-edit-form" busy={saving}>
            Save changes
          </Button>
        </>
      }
    >
      <form id="ad-edit-form" className="ad-form" onSubmit={submit} noValidate>
        <div className="ad-form__row">
          <Field label="First name" value={data.firstName} onChange={change("firstName")} error={errFor("firstName")} autoComplete="off" />
          <Field label="Last name" value={data.lastName} onChange={change("lastName")} error={errFor("lastName")} autoComplete="off" />
        </div>
        <Field label="Email" type="email" value={data.email} onChange={change("email")} error={errFor("email")} autoComplete="off" />
        <Field label="Role" value={data.role} onChange={change("role")} autoComplete="off" />
        {saveError && <Notice tone="error">{saveError}</Notice>}
      </form>
    </Panel>
  );
};
