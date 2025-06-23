import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { templateDetails } from "../data/templateDetails";
import SidoHeader from "../SidoHeader/SidoHeader";
import "./TemplateDetails.scss";

const TemplateDetails = () => {
  const { templateId } = useParams();
  const template = templateDetails[templateId as keyof typeof templateDetails];

  const [currentStep, setCurrentStep] = useState(0);

  if (!template) return <div className="template-not-found">Mall ej hittad</div>;

  return (
    <div className="template-details">
      <SidoHeader />
      <div className="template-hero" style={{ backgroundImage: `url(${template.backgroundImage})` }}>
        <div className="overlay" />
        <img src={template.logo} alt={template.name} className="template-logo" />
        <h1 className="template-title">{template.name}</h1>

        <p className="template-description">{template.description}</p>

        <div className="template-intro">{template.intro}</div>

        <p className="template-intro-contact">
          Följ gärna stegen nedan noggrant. Om du har några frågor är du välkommen att kontakta oss på{" "}
          <a href="mailto:info@mambylysolutions.se">info@mambylysolutions.se</a>, via WhatsApp eller genom vårt kontaktformulär på{" "}
          <a href="https://mambylysolutions.se/kontaktaOss" target="_blank" rel="noopener noreferrer">
            huvudsidan
          </a>
          .
        </p>
      </div>

      <section className="template-steps">
        <div className="steps-nav">
          {template.steps.map((step, i) => (
            <button key={i} className={currentStep === i ? "active" : ""} onClick={() => setCurrentStep(i)}>
              {i + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="steps-slider">
          <div className="steps-track" style={{ transform: `translateX(-${currentStep * 100}%)` }}>
            {template.steps.map((step, i) => (
              <div className="step-card" key={i}>
                <h3>
                  {i + 1}. {step.title}
                </h3>
                <p>{step.text}</p>

                {/* Solo nel primo step: mostra CTA demo e iframe */}
                {i === 0 && (
                  <>
                    <a href={template.demoLink} className="cta-demo-inside" target="_blank" rel="noopener noreferrer">
                      Öppna demon för att anpassa innehållet →
                    </a>

                    <div className="demo-iframe-wrapper" style={{ marginTop: "1rem", border: "1px solid #ccc", borderRadius: "8px" }}>
                      <iframe
                        src={template.demoLink}
                        title={`Demo di ${template.name}`}
                        style={{ width: "100%", height: "600px", border: "none" }}
                        loading="lazy"
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateDetails;
