import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { templateDetails } from "../data/templateDetails";
import SidoHeader from "../SidoHeader/SidoHeader";
import StepOne from "../Steps/StepOne";
import StepTwo from "../Steps/StepTwo";
import StepThree from "../Steps/StepThree"; 
import InfoBanner from "../../components/InfoBanner/InfoBanner";
import "./TemplateDetails.scss";

type TemplateId = keyof typeof templateDetails;

const TemplateDetails = () => {
  const { templateId } = useParams<{ templateId: TemplateId }>();
  if (!templateId) return <div className="template-not-found">Mall ej hittad</div>;

  const template = templateDetails[templateId];

  const [currentStep, setCurrentStep] = useState(0);
  const [stepTwoData, setStepTwoData] = useState(null); // salva dati StepTwo

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  if (!template) return <div className="template-not-found">Mall ej hittad</div>;

  const handleNext = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));

  const handleSaveStepTwo = (data: any) => {
    setStepTwoData(data);
    console.log("Dati Step 2 salvati:", data);
  };

  const handleStep2Finish = () => {
    setCurrentStep(2); // Vai a Step 3 (Slutföra)
  };

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0:
        return <StepOne template={template} onNext={handleNext} />;
      case 1:
        return (
          <StepTwo
            template={template}
            onNext={handleNext}
            onBack={handleBack}
            onSave={handleSaveStepTwo}
            onStep2Finish={handleStep2Finish} // passo la callback per uscire dallo StepTwo
          />
        );
      case 2:
        return (
          <StepThree
            title={template.steps[2].title}
            text={template.steps[2].text}
            onBack={() => setCurrentStep(1)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="template-details">
      <SidoHeader />
      <InfoBanner />
      <div
        className="template-hero"
        style={{ backgroundImage: `url(${template.backgroundImage})` }}
      >
        <div className="overlay" />
        <img src={template.logo} alt={template.name} className="template-logo" />
        <h1 className="template-title">{template.name}</h1>

        <p className="template-description">{template.description}</p>

        <div className="template-intro">{template.intro}</div>

        <p className="template-intro-contact">
          Följ gärna stegen nedan noggrant. Om du har några frågor är du välkommen
          att kontakta oss på{" "}
          <a href="mailto:info@mambylysolutions.se">info@mambylysolutions.se</a>, via WhatsApp
          eller genom vårt kontaktformulär på{" "}
          <a
            href="https://mambylysolutions.se/kontaktaOss"
            target="_blank"
            rel="noopener noreferrer"
          >
            huvudsidan
          </a>
          .
        </p>
      </div>

      <section className="template-steps">
        <div className="steps-nav">
          {template.steps.map((step, i) => (
            <button
              key={i}
              className={currentStep === i ? "active" : ""}
              onClick={() => setCurrentStep(i)}
            >
              {i + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="steps-slider">
          <div
            className="steps-track"
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {template.steps.map((_, i) => (
              <div key={i} className="step-card">
                {renderStepContent(i)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default TemplateDetails;
