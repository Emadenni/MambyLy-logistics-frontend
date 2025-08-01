import React from "react";
import "./SignHero.scss";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import logo240 from "../../assets/logoDash-240.webp";

interface Props {
  onToggleForm: () => void;
  isFormVisible: boolean;
}

const SignHero: React.FC<Props> = ({ onToggleForm, isFormVisible }) => {
  return (
    <div className="sign-hero">
      <img src={logo240} alt="EnkelDash logo" className="sign-hero__logo" />

      <div className="sign-hero__content">
        <h1>Välkommen till EnkelDash</h1>
        <p>Din smarta kontrollpanel. Logga in för att komma åt dina tjänster.</p>
      </div>

      <button className="sign-hero__toggle" onClick={onToggleForm}>
        <ExpandMoreIcon
          className={`sign-hero__icon ${isFormVisible ? "rotated" : ""}`}
        />
      </button>
    </div>
  );
};

export default SignHero;
