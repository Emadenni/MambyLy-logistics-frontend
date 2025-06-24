import React, { useState } from "react";
import "./Steps.scss";

interface Extra {
  id: string;
  label: string;
  description: string;
  price: number;
}

interface BasePackage {
  description: string;
  price: number;
}

interface Messages {
  contentSent: string;
  contentNotSent: string;
}

interface SectionsNote {
  label: string;
  placeholder: string;
  note: string;
}

interface TemplateDetailsType {
  basePackage: BasePackage;
  extras: Extra[];
  messages: Messages;
  sectionsNote: SectionsNote;
  contentSentViaDemo: boolean; // solo lettura, impostato da parent/store
}

interface StepTwoProps {
  template: TemplateDetailsType;
  onNext: () => void;
  onBack: () => void;
  onSave: (data: StepTwoState) => void;
}

interface StepTwoState {
  contentSentViaDemo: boolean;
  selectedExtras: string[];
  sectionsNoteText: string;
}

const StepTwo: React.FC<StepTwoProps> = ({ template, onNext, onBack, onSave }) => {
  const [contentSentViaDemo] = useState(template.contentSentViaDemo); // non modificabile qui
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [sectionsNoteText, setSectionsNoteText] = useState("");
  const [wizardStep, setWizardStep] = useState(1);

  const backendSelected = selectedExtras.includes("custom-backend");

  const toggleExtra = (id: string) => {
    if (backendSelected && id !== "custom-backend") return; // blocca se backend selezionato
    setSelectedExtras((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  };

  const totalPrice =
    template.basePackage.price +
    selectedExtras.reduce((sum, id) => {
      const extra = template.extras.find((e) => e.id === id);
      return sum + (extra ? extra.price : 0);
    }, 0);

  const handleNext = () => {
    if (wizardStep === 1) {
      setWizardStep(2);
    } else if (wizardStep === 2) {
      onSave({ contentSentViaDemo, selectedExtras, sectionsNoteText });
      onNext();
    }
  };

  const handleBack = () => {
    if (wizardStep === 1) {
      onBack();
    } else {
      setWizardStep(1);
    }
  };

  return (
    <div className="step-two">
      <h3>Detaljer och extrafunktioner</h3>

      <div className={`message ${contentSentViaDemo ? "success" : "warning"}`}>
        {contentSentViaDemo ? template.messages.contentSent : template.messages.contentNotSent}
      </div>

      {wizardStep === 1 && (
        <>
          <div className="base-package">
            <h4>Bas paket inkluderat</h4>
            <p>{template.basePackage.description}</p>
            <p>
              Pris: <strong>{template.basePackage.price} kr</strong>
            </p>
          </div>

          <div className="extras-section">
            <h4>Välj eventuella extrafunktioner</h4>
            {template.extras.map((extra) => (
              <label
                key={extra.id}
                className={`checkbox-label ${backendSelected && extra.id !== "custom-backend" ? "disabled" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(extra.id)}
                  onChange={() => toggleExtra(extra.id)}
                  disabled={backendSelected && extra.id !== "custom-backend"}
                />
                <strong>{extra.label}</strong> — {extra.description} — Pris: <strong>{extra.price} kr</strong>
              </label>
            ))}
          </div>

          <div className="total-price">
            Totalt pris: <strong>{totalPrice} kr</strong>
          </div>
        </>
      )}

      {wizardStep === 2 && (
        <>
          <label htmlFor="sectionsNote">{template.sectionsNote.label}</label>
          <textarea
            style={{ width: "100%" }} // mettilo se vuoi essere sicuro
            id="sectionsNote"
            rows={5}
            maxLength={200}
            placeholder={template.sectionsNote.placeholder}
            value={sectionsNoteText}
            onChange={(e) => setSectionsNoteText(e.target.value)}
          />
          <p className="note">{template.sectionsNote.note}</p>
          <div className="total-price" style={{ marginTop: "2rem" }}>
            Totalt pris: <strong>{totalPrice} kr</strong>
          </div>
        </>
      )}

      <div className="wizard-buttons">
        <button className="btn-back" onClick={handleBack}>
          ← Tillbaka
        </button>
        <button className="btn-next" onClick={handleNext}>
          {wizardStep === 1 ? "Nästa steg →" : "Slutför →"}
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
