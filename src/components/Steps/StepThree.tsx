import React from "react";

interface StepThreeProps {
  title: string;
  text: string;
  onBack: () => void;
  // eventualmente onFinish per concludere tutto
}

const StepThree: React.FC<StepThreeProps> = ({ title, text, onBack }) => {
  return (
    <div className="step-three">
      <h3>{title}</h3>
      <p>{text}</p>
      <div style={{ marginTop: "2rem" }}>
        {/* Qui puoi aggiungere qualsiasi testo di prova o info */}
        <p>Här kan du lägga till information eller instruktioner för betalningen.</p>
        <p>Vi skickar fakturan till dig via e-post efter att beställningen är klar.</p>
      </div>
      <div className="wizard-buttons" style={{ marginTop: "3rem" }}>
        <button className="btn-back" onClick={onBack}>
          ← Tillbaka
        </button>
      </div>
    </div>
  );
};

export default StepThree;
