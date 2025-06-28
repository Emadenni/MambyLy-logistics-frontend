import React, { useState, useEffect, useRef } from "react";
import { useCart } from "../../Context/CartContext";
import { useOrderStore } from "../../store/useOrderStore";
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
  onStep2Finish: () => void;
}

export interface StepTwoState {
  contentSentViaDemo: boolean;
  selectedExtras: string[];
  sectionsNoteText: string;
  noSectionChanges: boolean;
  selectedPageOptionIds: string[];
  staticPageDescription: string;
  noExtraPageNeeded: boolean;
}

const StepTwo: React.FC<StepTwoProps> = ({
  template,
  onNext,
  onBack,
  onSave,
  onStep2Finish,
}) => {
  const { stepTwoData, setStepTwoData, wasReset } = useCart();
  const { updateOrderField } = useOrderStore();
  const stepRef = useRef<HTMLDivElement>(null);

  const stored = localStorage.getItem("stepTwoSelections");
  const parsed = stored ? JSON.parse(stored) : null;

  const [contentSentViaDemo] = useState(template.contentSentViaDemo);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(parsed?.selectedExtras || stepTwoData?.selectedExtras || []);
  const [sectionsNoteText, setSectionsNoteText] = useState<string>(parsed?.sectionsNoteText || stepTwoData?.sectionsNoteText || "");
  const [noSectionChanges, setNoSectionChanges] = useState<boolean>(parsed?.noSectionChanges || stepTwoData?.noSectionChanges || false);
  const [selectedPageOptionIds, setSelectedPageOptionIds] = useState<string[]>(parsed?.selectedPageOptionIds || stepTwoData?.selectedPageOptionIds || []);
  const [staticPageDescription, setStaticPageDescription] = useState<string>(parsed?.staticPageDescription || stepTwoData?.staticPageDescription || "");
  const [noExtraPageNeeded, setNoExtraPageNeeded] = useState<boolean>(parsed?.noExtraPageNeeded || stepTwoData?.noExtraPageNeeded || false);
  const [wizardStep, setWizardStep] = useState<number>(1);

  const extrasBlockedByBackend = ["bokabord", "avhaemtning"];
  const backendSelected = selectedExtras.includes("custom-backend");

  useEffect(() => {
    window.scrollTo({ top: 500, behavior: "smooth" });
  }, [wizardStep]);

  useEffect(() => {
    if (wasReset) {
      setSelectedExtras([]);
      setSectionsNoteText("");
      setNoSectionChanges(false);
      setSelectedPageOptionIds([]);
      setStaticPageDescription("");
      setNoExtraPageNeeded(false);
      localStorage.setItem("stepTwoSelections", JSON.stringify({
        contentSentViaDemo,
        selectedExtras: [],
        sectionsNoteText: "",
        noSectionChanges: false,
        selectedPageOptionIds: [],
        staticPageDescription: "",
        noExtraPageNeeded: false,
      }));
    }
  }, [wasReset]);

  useEffect(() => {
    const state: StepTwoState = {
      contentSentViaDemo,
      selectedExtras,
      sectionsNoteText,
      noSectionChanges,
      selectedPageOptionIds,
      staticPageDescription,
      noExtraPageNeeded,
    };

    if (setStepTwoData) setStepTwoData(state);
    onSave(state);
    localStorage.setItem("stepTwoSelections", JSON.stringify(state));

    updateOrderField("selected_extras", selectedExtras);
    updateOrderField("section_changes", noSectionChanges ? "-" : sectionsNoteText);
    updateOrderField("include_free_page", noExtraPageNeeded ? "true" : "false");
    updateOrderField("static_page_description", staticPageDescription);
    updateOrderField("paid_extra_pages", selectedPageOptionIds);
  }, [
    contentSentViaDemo,
    selectedExtras,
    sectionsNoteText,
    noSectionChanges,
    selectedPageOptionIds,
    staticPageDescription,
    noExtraPageNeeded,
  ]);

  const toggleExtra = (id: string) => {
    if (backendSelected && extrasBlockedByBackend.includes(id)) return;
    setSelectedExtras((prev) => {
      let updated: string[] = [];
      if (id === "custom-backend" && prev.includes("custom-backend")) {
        updated = prev.filter((e) => e !== "custom-backend");
      } else if (id === "custom-backend") {
        updated = ["custom-backend", ...prev.filter((e) => !extrasBlockedByBackend.includes(e))];
      } else {
        updated = prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id];
      }
      return updated;
    });
  };

  const togglePageOption = (id: string) => {
    setSelectedPageOptionIds((prev) => {
      const updated = prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id];
      return updated;
    });
  };

  const handleNoSectionChangesChange = () => {
    setNoSectionChanges((prev) => {
      const newValue = !prev;
      if (newValue) setSectionsNoteText("");
      return newValue;
    });
  };

  const handleNoExtraPageNeededChange = () => {
    setNoExtraPageNeeded((prev) => {
      const newValue = !prev;
      if (newValue) {
        setStaticPageDescription("");
        setSelectedPageOptionIds([]);
      }
      return newValue;
    });
  };

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
    if (wizardStep < 3) setWizardStep((prev) => prev + 1);
    else onStep2Finish();
  };

  const handleBack = () => {
    if (wizardStep === 1) onBack();
    else setWizardStep((prev) => prev - 1);
  };

  return (
    <div className="step-two scroll-anchor" id="step-two" ref={stepRef}>
      <h3>Detaljer och extrafunktioner</h3>

      {wizardStep === 1 && (
        <>
          <div className="base-package">
            <h4>Bas paket inkluderat</h4>
            <p>{template.basePackage.description}</p>
            <p>Pris: <strong>{template.basePackage.price} kr</strong></p>
            <p style={{ marginTop: "1rem", fontSize: "0.95rem", color: "darkOrange" }}>
              Allt du behöver för att lyckas direkt: SEO, mobilanpassning, snabba laddtider,
              sociala medier, Google Maps och ett intuitivt gränssnitt – plus 2 månader kostnadsfri support efter lansering.
            </p>
          </div>

          <div className="extras-section">
            <h4>Välj eventuella extrafunktioner</h4>
            {template.extras.map((extra) => {
              const isDisabled = backendSelected && extrasBlockedByBackend.includes(extra.id);
              const isSelected = selectedExtras.includes(extra.id);
              return (
                <div key={extra.id} className={`extra-row ${isDisabled ? "disabled" : ""}`}>
                  <button
                    type="button"
                    className={`btn-add ${isSelected ? "selected" : ""}`}
                    onClick={() => toggleExtra(extra.id)}
                    disabled={isDisabled}
                  >
                    {isSelected ? "✓" : "+"}
                  </button>
                  <span>
                    <strong>{extra.label}</strong> — {extra.description} — Pris: <strong>{extra.price} kr</strong>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="total-price">
            Totalt pris: <strong>{totalPrice} kr</strong>
          </div>

          <p className="evidence">
            * Detta tillval kan förlänga utvecklingstiden beroende på dina behov och den tekniska integrationen som krävs.
          </p>
        </>
      )}

      {wizardStep === 2 && (
        <>
          <label className="checkbox-label" style={{ marginBottom: "1rem" }}>
            <input type="checkbox" checked={noSectionChanges} onChange={handleNoSectionChangesChange} />
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
            <input type="checkbox" checked={noExtraPageNeeded} onChange={handleNoExtraPageNeededChange} />
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
            style={{
              opacity: noExtraPageNeeded ? 0.5 : 1,
              pointerEvents: noExtraPageNeeded ? "none" : "auto",
            }}
          >
            {template.extraPages.map((pageOption) => {
              const isSelected = selectedPageOptionIds.includes(pageOption.id);
              return (
                <div key={pageOption.id} className="extra-row">
                  <button
                    type="button"
                    className={`btn-add ${isSelected ? "selected" : ""}`}
                    onClick={() => togglePageOption(pageOption.id)}
                    disabled={noExtraPageNeeded}
                  >
                    {isSelected ? "✓" : "+"}
                  </button>
                  <span>
                    <strong>{pageOption.label}</strong> — {pageOption.description} — Pris:{" "}
                    <strong>{pageOption.price} kr</strong>
                  </span>
                </div>
              );
            })}
          </div>

          <div className="total-price" style={{ marginTop: "2rem" }}>
            Totalt pris: <strong>{totalPrice} kr</strong>
          </div>
        </>
      )}

      <div className="wizard-buttons">
        <button className="btn-back" onClick={handleBack}>← Tillbaka</button>
        <button className="btn-next" onClick={handleNext}>
          {wizardStep < 3 ? "Nästa steg →" : "Slutför →"}
        </button>
      </div>
    </div>
  );
};

export default StepTwo;
