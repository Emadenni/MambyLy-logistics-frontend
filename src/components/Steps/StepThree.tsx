import React from "react";
import Summary from "../Summary/Summary";
import "./Steps.scss"

interface StepThreeProps {
  title: string;
  text: string;
  onBack: () => void;
  summaryData: {
    selectedExtras: string[];
    selectedPageOptionIds: string[];
  };
  template: {
    basePackage: {
      description: string;
      price: number;
    };
    extras: {
      id: string;
      label: string;
      price: number;
    }[];
    extraPages: {
      id: string;
      label: string;
      price: number;
    }[];
    steps: { title: string; text: string }[];
  };
}

const StepThree: React.FC<StepThreeProps> = ({ title, text, onBack, summaryData, template }) => {
  const { basePackage, extras, extraPages } = template;
  const { selectedExtras, selectedPageOptionIds } = summaryData;

  const selectedExtrasDetails = extras.filter((e) => selectedExtras.includes(e.id));
  const selectedPagesDetails = extraPages.filter((p) => selectedPageOptionIds.includes(p.id));

  const totalPrice =
    basePackage.price +
    selectedExtrasDetails.reduce((sum, e) => sum + e.price, 0) +
    selectedPagesDetails.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="step-three">
      <Summary
        basePackage={basePackage}
        extras={[...selectedExtrasDetails, ...selectedPagesDetails]}
        totalPrice={totalPrice}
      />

      <div className="wizard-buttons" style={{ marginTop: "3rem" }}>
        <button className="btn-back-end" onClick={onBack}>
          ← Tillbaka
        </button>
      </div>
    </div>
  );
};

export default StepThree;
