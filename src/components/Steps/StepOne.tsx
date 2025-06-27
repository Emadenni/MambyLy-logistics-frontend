import React, { useState } from "react";
import { useOrderStore } from "../../store/useOrderStore";
import "./Steps.scss";

interface StepOneProps {
  template: {
    name: string;
    logo: string;
    backgroundImage: string;
    description: string;
    intro: string;
    demoLink: string;
    steps: {
      title: string;
      text: string;
    }[];
  };
  onNext: () => void;
}

const StepOne: React.FC<StepOneProps> = ({ template, onNext }) => {
  const { updateOrderField } = useOrderStore();
  const [choice, setChoice] = useState<null | boolean>(null);

  const handleNext = () => {
    if (choice !== null) {
      updateOrderField("content_via_demo", choice ? "true" : "false");
      onNext();
    }
  };

  return (
    <div className="step-one">
      <h3>{template.steps[0].title}</h3>
      <p>{template.steps[0].text}</p>

      <a
        href={template.demoLink}
        className="cta-demo-inside"
        target="_blank"
        rel="noopener noreferrer"
      >
        Öppna demon för att anpassa innehållet →
      </a>

      <div className="radio-demo-choice" style={{ marginTop: "1.5rem" }}>
        <p style={{ fontWeight: "600", marginBottom: "1rem", color: "#444" }}>
          Vi rekommenderar att du använder demon – det är snabbare och mer exakt.
        </p>

        <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>
          Har du redan skickat innehållet?
        </p>

        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          <input
            type="radio"
            name="demoChoice"
            value="yes"
            checked={choice === true}
            onChange={() => setChoice(true)}
          />{" "}
          Ja, jag har redan skickat innehållet via demon
        </label>

        <label style={{ display: "block", marginBottom: "1rem" }}>
          <input
            type="radio"
            name="demoChoice"
            value="no"
            checked={choice === false}
            onChange={() => setChoice(false)}
          />{" "}
          Nej, jag vill skicka innehållet på ett annat sätt
        </label>

        {choice !== null && (
          <p
            style={{
              color: choice ? "green" : "#b36b00",
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            {choice
              ? "Perfekt! Vi anpassar processen baserat på det."
              : "Vi kommer kontakta dig för instruktioner om hur du kan skicka det separat."}
          </p>
        )}
      </div>

      <button
        className="btn-next"
        onClick={handleNext}
        style={{ marginTop: "2rem" }}
        disabled={choice === null}
      >
        Nästa steg →
      </button>

      <div
        className="demo-iframe-wrapper"
        style={{
          marginTop: "1rem",
          border: "1px solid #ccc",
          borderRadius: "8px",
        }}
      >
        <h2>Demo preview</h2>
        <iframe
          src={template.demoLink}
          title={`Demo di ${template.name}`}
          style={{ width: "100%", height: "600px", border: "none" }}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default StepOne;
