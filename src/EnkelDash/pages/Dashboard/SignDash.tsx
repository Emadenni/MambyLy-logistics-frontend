import React, { useState, useEffect } from "react";
import SignForm from "../../components/SignForm/SignForm";
import SignHero from "../../components/SignHero/SignHero";
import "./Dashboard.scss";

const SignDash: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const handleToggleForm = () => {
    setShowForm((prev) => !prev);
  };

useEffect(() => {
  if (showForm) {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
  } else {
    document.body.style.overflow = "";
    document.body.style.height = "";
  }

  return () => {
    document.body.style.overflow = "";
    document.body.style.height = "";
  };
}, [showForm]);
  return (
    <div className="signdash">
      <div className="signdash__hero">
        <SignHero onToggleForm={handleToggleForm} isFormVisible={showForm} />
      </div>

      <div className={`signdash__overlay ${showForm ? "visible" : ""}`}>
       <SignForm onClose={handleToggleForm} />
      </div>
    </div>
  );
};

export default SignDash;
