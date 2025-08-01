import React, { useState, useEffect } from "react";
import SignForm from "../../components/SignForm/SignForm";
import SignHero from "../../components/SignHero/SignHero";
import "./Dashboard.scss";

const SignDash: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

  // Blocca lo scroll del body solo mentre SignDash è montato
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="signdash">
      <div className="signdash__hero">
        <SignHero onToggleForm={handleToggleForm} isFormVisible={showForm} />
      </div>

      <div className={`signdash__overlay ${showForm ? "visible" : ""}`}>
        <button className="signdash__close" onClick={handleToggleForm}>
          stäng
        </button>
        <SignForm />
      </div>
    </div>
  );
};

export default SignDash;
