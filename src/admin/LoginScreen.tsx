import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FiArrowLeft } from "react-icons/fi";
import logoDark from "../public/assets/logo-dark.svg";
import useLogin from "../hooks/useLogin";
import { useAuthStore } from "../store/useAuthStore";
import { Button, Field, Notice, PasswordField } from "./ui";
import "./admin.scss";

/**
 * Admin sign-in. Same request and session handling as before (useLogin); the previous form also
 * had a "Confirm password" field, which only compared the two inputs in the browser and is not
 * part of a sign-in, so it is gone.
 */
const LoginScreen: React.FC = () => {
  const { email, setEmail, password, setPassword, error, successMessage, handleSubmit, isLoading } = useLogin();
  const location = useLocation();
  const signedOut = !!(location.state as { signedOut?: boolean } | null)?.signedOut;
  const [alreadyIn] = useState(() => useAuthStore.getState().isAuthenticated);
  const [expired] = useState(() => sessionStorage.getItem("logoutMessage") || "");
  const [errs, setErrs] = useState<{ email?: string; password?: string }>({});

  useEffect(() => {
    document.title = "Sign in · MambyLy admin";
    if (expired) sessionStorage.removeItem("logoutMessage");
  }, [expired]);

  if (alreadyIn) return <Navigate to="/admin" replace />;

  const busy = isLoading || !!successMessage;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const next: typeof errs = {};
    if (!email.trim()) next.email = "Enter your email address.";
    else if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address, like name@example.com.";
    if (!password) next.password = "Enter your password.";
    setErrs(next);
    if (next.email || next.password) {
      document.getElementById(next.email ? "ad-login-email" : "ad-login-password")?.focus();
      return;
    }
    handleSubmit(e);
  };

  const serverError = !isLoading && !successMessage && error ? (error === "Failed to fetch" ? "Could not reach the server. Check the connection and try again." : error) : "";

  return (
    <div className="ad-login">
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <main className="ad-login__card" aria-labelledby="ad-login-title">
        <img className="ad-login__logo" src={logoDark} alt="MambyLy Solutions" width={176} height={50} />
        <h1 id="ad-login-title">Sign in to the admin</h1>
        <p className="ad-login__lead">For MambyLy Solutions staff.</p>

        {expired && <Notice tone="info">{expired}</Notice>}
        {signedOut && !expired && <Notice tone="info">You have signed out.</Notice>}
        {serverError && <Notice tone="error">{serverError}</Notice>}
        {successMessage && <Notice tone="success">Signed in. Opening the admin…</Notice>}

        <form className="ad-form" onSubmit={submit} noValidate>
          <Field
            id="ad-login-email"
            label="Email"
            type="email"
            name="email"
            autoComplete="username"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrs((x) => ({ ...x, email: undefined }));
            }}
            error={errs.email}
            disabled={!!successMessage}
          />
          <PasswordField
            id="ad-login-password"
            label="Password"
            name="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrs((x) => ({ ...x, password: undefined }));
            }}
            error={errs.password}
            disabled={!!successMessage}
          />
          <Button variant="primary" type="submit" className="ad-login__submit" busy={busy}>
            {isLoading ? "Signing in…" : successMessage ? "Signed in" : "Sign in"}
          </Button>
        </form>

        <Link to="/" className="ad-login__back">
          <FiArrowLeft aria-hidden="true" /> Back to the website
        </Link>
      </main>
    </div>
  );
};

export default LoginScreen;
