import React, { useState } from "react";
import "./Steps.scss";

interface Extra {
  id: string;
  label: string;
  description: string;
  price: number;
}

interface PageOption {
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

interface StaticPageInfo {
  description: string;
  exampleText: string;
}

interface TemplateDetailsType {
  basePackage: BasePackage;
  extras: Extra[];
  extraPages: PageOption[];
  staticPage: StaticPageInfo;
  messages: Messages;
  sectionsNote: SectionsNote;
  contentSentViaDemo: boolean;
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
  noSectionChanges: boolean;
  selectedPageOptionIds: string[];
  staticPageDescription: string;
  noExtraPageNeeded: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({ template, onNext, onBack, onSave }) => {
  const [contentSentViaDemo] = useState(template.contentSentViaDemo);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);
  const [sectionsNoteText, setSectionsNoteText] = useState("");
  const [noSectionChanges, setNoSectionChanges] = useState(false);
  const [selectedPageOptionIds, setSelectedPageOptionIds] = useState<string[]>([]);
  const [staticPageDescription, setStaticPageDescription] = useState("");
  const [noExtraPageNeeded, setNoExtraPageNeeded] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);

  const backendSelected = selectedExtras.includes("custom-backend");

  // Toggle per extras
  const toggleExtra = (id: string) => {
    if (backendSelected && id !== "custom-backend") return;
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Toggle per pagine extra
  const togglePageOption = (id: string) => {
    setSelectedPageOptionIds((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  };

  // Gestione checkbox "Non voglio cambiare sezioni"
  const handleNoSectionChangesChange = () => {
    setNoSectionChanges((prev) => {
      if (!prev) setSectionsNoteText("");
      return !prev;
    });
  };

  // Gestione checkbox "Non ho bisogno di pagina extra"
  const handleNoExtraPageNeededChange = () => {
    setNoExtraPageNeeded((prev) => {
      if (!prev) {
        setStaticPageDescription("");
        setSelectedPageOptionIds([]);
      }
      return !prev;
    });
  };

  // Calcolo totale prezzo
  const totalPrice =
    template.basePackage.price +
    selectedExtras.reduce((sum, id) => {
      const extra = template.extras.find((e) => e.id === id);
      return sum + (extra ? extra.price : 0);
    }, 0) +
    selectedPageOptionIds.reduce((sum, id) => {
      const pageOption = template.extraPages.find((p) => p.id === id);
      return sum + (pageOption ? pageOption.price : 0);
    }, 0);

  const handleNext = () => {
    if (wizardStep < 3) setWizardStep(wizardStep + 1);
    else {
      onSave({
        contentSentViaDemo,
        selectedExtras,
        sectionsNoteText,
        noSectionChanges,
        selectedPageOptionIds,
        staticPageDescription,
        noExtraPageNeeded,
      });
      onNext();
    }
  };

  const handleBack = () => {
    if (wizardStep === 1) onBack();
    else setWizardStep(wizardStep - 1);
  };

  return (
    <div className="step-two">
      <h3>Detaljer och extrafunktioner</h3>

      <div className={`message ${contentSentViaDemo ? "success" : "warning"}`}>
        {contentSentViaDemo
          ? template.messages.contentSent
          : template.messages.contentNotSent}
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
                className={`checkbox-label ${
                  backendSelected && extra.id !== "custom-backend" ? "disabled" : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedExtras.includes(extra.id)}
                  onChange={() => toggleExtra(extra.id)}
                  disabled={backendSelected && extra.id !== "custom-backend"}
                />
                <strong>{extra.label}</strong> — {extra.description} — Pris:{" "}
                <strong>{extra.price} kr</strong>
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
          <label className="checkbox-label" style={{ marginBottom: "1rem" }}>
            <input
              type="checkbox"
              checked={noSectionChanges}
              onChange={handleNoSectionChangesChange}
            />
            <strong>Jag vill inte ändra några sektioner</strong>
          </label>

          <label htmlFor="sectionsNote">{template.sectionsNote.label}</label>
          <textarea
            id="sectionsNote"
            rows={5}
            maxLength={200}
            style={{ width: "100%" }}
            placeholder={template.sectionsNote.placeholder}
            value={sectionsNoteText}
            onChange={(e) => setSectionsNoteText(e.target.value)}
            disabled={noSectionChanges}
          />
          <p className="note">{template.sectionsNote.note}</p>

          <div className="total-price" style={{ marginTop: "2rem" }}>
            Totalt pris: <strong>{totalPrice} kr</strong>
          </div>
        </>
      )}

      {wizardStep === 3 && (
        <>
          <label className="checkbox-label" style={{ marginBottom: "1rem" }}>
            <input
              type="checkbox"
              checked={noExtraPageNeeded}
              onChange={handleNoExtraPageNeededChange}
            />
            <strong>Jag behöver ingen extra sida</strong>
          </label>

          <h4>Inkluderad statisk sida</h4>
          <p>{template.staticPage.description}</p>
          <label htmlFor="staticPageDescription">Beskrivning</label>
          <textarea
            id="staticPageDescription"
            rows={4}
            maxLength={300}
            style={{ width: "100%" }}
            placeholder={template.staticPage.exampleText}
            value={staticPageDescription}
            onChange={(e) => setStaticPageDescription(e.target.value)}
            disabled={noExtraPageNeeded}
          />

          <h4 style={{ marginTop: "2rem" }}>Extra sidalternativ (tilläggskostnad)</h4>
          <div
            className="extras-section"
            style={{ opacity: noExtraPageNeeded ? 0.5 : 1, pointerEvents: noExtraPageNeeded ? "none" : "auto" }}
          >
            {template.extraPages.map((pageOption) => (
              <label key={pageOption.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={selectedPageOptionIds.includes(pageOption.id)}
                  onChange={() => togglePageOption(pageOption.id)}
                  disabled={noExtraPageNeeded}
                />
                <strong>{pageOption.label}</strong> — {pageOption.description} — Pris:{" "}
                <strong>{pageOption.price} kr</strong>
              </label>
            ))}
          </div>

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
          {wizardStep < 3 ? "Nästa steg →" : "Slutför →"}
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
