import React from "react";
import { templateDetails } from "../data/templateDetails";
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
  return (
    <>
      <h3>{template.steps[0].title}</h3>
      <p>{template.steps[0].text}</p>

      <a href={template.demoLink} className="cta-demo-inside" target="_blank" rel="noopener noreferrer">
        Öppna demon för att anpassa innehållet →
      </a>

      <div
        className="demo-iframe-wrapper"
        style={{ marginTop: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}
      >
        <iframe
          src={template.demoLink}
          title={`Demo di ${template.name}`}
          style={{ width: "100%", height: "600px", border: "none" }}
          loading="lazy"
        />
      </div>
    </>
  );
};

export default StepOne;