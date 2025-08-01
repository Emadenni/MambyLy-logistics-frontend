import React from "react";
import SignForm from "../../components/SignForm/SignForm";
import SignHero from "../../components/SignHero/SignHero";
import "./Dashboard.scss";

const SignDash: React.FC = () => {
  return (
    <div className="signdash">
      <div className="signdash__hero">
        <SignHero />
      </div>
      <div className="signdash__form">
        <SignForm />
      </div>
    </div>
  );
};

export default SignDash;
