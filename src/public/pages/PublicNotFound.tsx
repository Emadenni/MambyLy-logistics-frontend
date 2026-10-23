import React from "react";
import { useNavigate } from "react-router-dom";
import PublicShell from "../components/PublicShell";

const PublicNotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/");
  };

  return (
    <PublicShell>
      <section className="mp-section mp-notfound">
        <div className="mp-container">
          <div className="mp-card mp-notfound__card">
            <p className="mp-notfound__code" aria-hidden="true">404</p>
            <h1>Oops! Page not found.</h1>
            <p className="mp-muted">The page you are looking for might have been moved or deleted.</p>
            <button type="button" className="mp-btn mp-btn--primary" onClick={handleGoHome}>
              Go to Home
            </button>
          </div>
        </div>
      </section>
    </PublicShell>
  );
};

export default PublicNotFound;
