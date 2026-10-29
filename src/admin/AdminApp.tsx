import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Drawer, Menu, MenuItem } from "@mui/material";
import { FiBriefcase, FiChevronDown, FiExternalLink, FiImage, FiInbox, FiKey, FiLogOut, FiMenu, FiTruck, FiUsers, FiX } from "react-icons/fi";
import logoDark from "../public/assets/logo-dark.svg";
import { useAuthStore } from "../store/useAuthStore";
import useAdminData from "../hooks/useAdminData";
import useUpdateProfileImage from "../hooks/useUpdateProfileImage";
import useUpdatePassword from "../hooks/useUpdatePassword";
import { Admin } from "../types/common";
import { Avatar, Button, EmptyState, IconButton, Notice, Panel, PasswordField, useAdminTitle } from "./ui";
import MessagesSection from "./MessagesSection";
import PositionsSection from "./PositionsSection";
import AdminsSection from "./AdminsSection";
import "./admin.scss";

/**
 * The admin: sidebar on large screens, top bar with a drawer on phones and tablets, one section
 * per route (/admin/messages, /admin/applications, /admin/positions, /admin/admins). Only the
 * presentation is new; every request goes through the existing hooks.
 */

const NAV = [
  { to: "messages", label: "Client messages", icon: <FiInbox /> },
  { to: "applications", label: "Applications", icon: <FiBriefcase /> },
  { to: "positions", label: "Job positions", icon: <FiTruck /> },
  { to: "admins", label: "Admins", icon: <FiUsers /> },
];

const Nav: React.FC<{ onNavigate?: () => void }> = ({ onNavigate }) => (
  <nav className="ad-nav" aria-label="Admin sections">
    <ul>
      {NAV.map((n) => (
        <li key={n.to}>
          <NavLink to={n.to} onClick={onNavigate} className={({ isActive }) => `ad-nav__link${isActive ? " is-active" : ""}`}>
            <span aria-hidden="true">{n.icon}</span>
            {n.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

type AccountProps = {
  admin: Admin | null;
  avatar: string | null;
  onPassword: () => void;
  onImage: () => void;
  onLogout: () => void;
  imageBusy: boolean;
};

const Account: React.FC<AccountProps & { compact?: boolean }> = ({ admin, avatar, onPassword, onImage, onLogout, imageBusy, compact }) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const name = admin ? `${admin.firstName} ${admin.lastName}`.trim() : "";
  const close = () => setAnchor(null);
  return (
    <>
      <button
        type="button"
        className={`ad-account${compact ? " ad-account--compact" : ""}`}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        aria-label={compact ? `Account menu${name ? ` – ${name}` : ""}` : undefined}
        onClick={(e) => setAnchor(e.currentTarget)}
      >
        <Avatar name={name} src={avatar} size="sm" />
        {!compact && (
          <span className="ad-account__text">
            <span className="ad-account__name">{name || "Your account"}</span>
            {admin && <span className="ad-account__email">{admin.email}</span>}
          </span>
        )}
        <FiChevronDown aria-hidden="true" className="ad-account__chev" />
      </button>
      <Menu
        anchorEl={anchor}
        open={!!anchor}
        onClose={close}
        PaperProps={{ className: "ad-menu" }}
        anchorOrigin={{ vertical: compact ? "bottom" : "top", horizontal: compact ? "right" : "left" }}
        transformOrigin={{ vertical: compact ? "top" : "bottom", horizontal: compact ? "right" : "left" }}
      >
        {admin && (
          <li className="ad-menu__who" aria-hidden="true">
            <strong>{name}</strong>
            <span>{admin.email}</span>
            {admin.role && <span>Role: {admin.role}</span>}
          </li>
        )}
        <MenuItem onClick={() => { close(); onPassword(); }}>
          <FiKey aria-hidden="true" /> Change password
        </MenuItem>
        <MenuItem onClick={() => { close(); onImage(); }} disabled={imageBusy}>
          <FiImage aria-hidden="true" /> {imageBusy ? "Uploading image…" : "Change profile image"}
        </MenuItem>
        <MenuItem component={Link} to="/" onClick={close}>
          <FiExternalLink aria-hidden="true" /> Go to the website
        </MenuItem>
        <MenuItem onClick={() => { close(); onLogout(); }}>
          <FiLogOut aria-hidden="true" /> Sign out
        </MenuItem>
      </Menu>
    </>
  );
};

const PasswordPanel: React.FC<{ adminId: string; onClose: () => void }> = ({ adminId, onClose }) => {
  const { isLoading, error, success, updatePassword } = useUpdatePassword();
  const [pw, setPw] = useState("");
  const [again, setAgain] = useState("");
  const [errs, setErrs] = useState<{ pw?: string; again?: string }>({});
  const busy = useRef(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy.current || success) return;
    const next: typeof errs = {};
    if (!pw) next.pw = "Enter a new password.";
    if (pw && again !== pw) next.again = "The two passwords are not the same.";
    setErrs(next);
    if (next.pw || next.again) return;
    busy.current = true;
    await updatePassword(adminId, pw);
    busy.current = false;
  };

  return (
    <Panel
      open
      onClose={() => !isLoading && onClose()}
      title="Change password"
      actions={
        success ? (
          <Button onClick={onClose}>Close</Button>
        ) : (
          <>
            <Button onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="ad-pw-form" busy={isLoading}>
              Change password
            </Button>
          </>
        )
      }
    >
      {success ? (
        <Notice tone="success">Your password was changed. For security you will be signed out in a few seconds; then sign in with the new password.</Notice>
      ) : (
        <form id="ad-pw-form" className="ad-form" onSubmit={submit} noValidate>
          <PasswordField label="New password" value={pw} onChange={(e) => setPw(e.target.value)} error={errs.pw} autoComplete="new-password" />
          <PasswordField label="Repeat the new password" value={again} onChange={(e) => setAgain(e.target.value)} error={errs.again} autoComplete="new-password" />
          {error && <Notice tone="error">The password was not changed: {error}</Notice>}
        </form>
      )}
    </Panel>
  );
};

const AdminApp: React.FC = () => {
  const adminId = useAuthStore((s) => s.adminId);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { admin } = useAdminData(adminId);
  const { isUploading, error: imageError, imageUrl, uploadImage } = useUpdateProfileImage();
  const [drawer, setDrawer] = useState(false);
  const [password, setPassword] = useState(false);
  const [imageNotice, setImageNotice] = useState<"ok" | "failed" | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!("scrollRestoration" in history)) return;
    const before = history.scrollRestoration;
    history.scrollRestoration = "manual";
    return () => {
      history.scrollRestoration = before;
    };
  }, []);

  // the drawer closes when the route changes (also with Back)
  useEffect(() => setDrawer(false), [location.pathname]);

  const signOut = () => {
    navigate("/login", { replace: true, state: { signedOut: true } });
    logout();
  };

  const pickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !adminId) return;
    setImageNotice(null);
    const ok = await uploadImage(file, adminId);
    setImageNotice(ok ? "ok" : "failed");
  };

  const account: AccountProps = {
    admin,
    avatar: imageUrl || admin?.profileImageUrl || null,
    onPassword: () => setPassword(true),
    onImage: () => fileInput.current?.click(),
    onLogout: signOut,
    imageBusy: isUploading,
  };

  return (
    <div className="ad">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <a className="ad-skip" href="#ad-main">
        Skip to content
      </a>

      <aside className="ad-side">
        <Link to="/admin" className="ad-brand">
          <img src={logoDark} alt="MambyLy Solutions" width={150} height={43} />
          <span>Admin</span>
        </Link>
        <Nav />
        <div className="ad-side__foot">
          <Account {...account} />
        </div>
      </aside>

      <header className="ad-top">
        <IconButton label="Open menu" icon={<FiMenu />} onClick={() => setDrawer(true)} aria-expanded={drawer} aria-controls="ad-drawer" />
        <Link to="/admin" className="ad-brand ad-brand--top">
          <img src={logoDark} alt="MambyLy Solutions" width={112} height={32} />
          <span>Admin</span>
        </Link>
        <Account {...account} compact />
      </header>

      <Drawer open={drawer} onClose={() => setDrawer(false)} PaperProps={{ className: "ad-drawer", id: "ad-drawer" }}>
        <div className="ad-drawer__head">
          <span className="ad-drawer__title">Menu</span>
          <IconButton label="Close menu" icon={<FiX />} onClick={() => setDrawer(false)} />
        </div>
        <Nav onNavigate={() => setDrawer(false)} />
      </Drawer>

      <main id="ad-main" className="ad-main" tabIndex={-1}>
        {isUploading && <Notice tone="info">Uploading the profile image…</Notice>}
        {imageNotice === "ok" && (
          <Notice tone="success" onClose={() => setImageNotice(null)}>
            The profile image was updated.
          </Notice>
        )}
        {imageNotice === "failed" && (
          <Notice tone="error" onClose={() => setImageNotice(null)}>
            {imageError || "The image could not be uploaded."}
          </Notice>
        )}
        <Routes>
          <Route index element={<Navigate to="messages" replace />} />
          <Route path="messages/*" element={<MessagesSection kind="clients" />} />
          <Route path="applications/*" element={<MessagesSection kind="applications" />} />
          <Route path="positions" element={<PositionsSection />} />
          <Route path="admins" element={<AdminsSection />} />
          <Route path="*" element={<AdminNotFound />} />
        </Routes>
      </main>

      <input ref={fileInput} type="file" accept="image/*" hidden onChange={pickImage} />
      {password && adminId && <PasswordPanel adminId={adminId} onClose={() => setPassword(false)} />}
    </div>
  );
};

const AdminNotFound: React.FC = () => {
  useAdminTitle("Page not found");
  return (
    <section className="ad-section" aria-labelledby="ad-h1">
      <h1 id="ad-h1" tabIndex={-1}>
        Page not found
      </h1>
      <EmptyState
        title="This admin page does not exist."
        action={
          <Link className="ad-btn ad-btn--primary ad-btn--md" to="/admin/messages">
            Go to client messages
          </Link>
        }
      />
    </section>
  );
};

export default AdminApp;
