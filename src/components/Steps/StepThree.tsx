import React, { useEffect, useState } from "react";
import Summary from "../Summary/Summary";
import "./Steps.scss";
import { useCart } from "../../Context/CartContext";

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

const StepThree: React.FC<StepThreeProps> = ({ onBack, summaryData, template }) => {
  const { basePackage, extras, extraPages } = template;
  const { selectedExtras, selectedPageOptionIds } = summaryData;
  const { setBasePackage, setSelectedExtras, setSelectedPages } = useCart();

  const storedContact = localStorage.getItem("stepThreeContact");
  const parsedContact = storedContact ? JSON.parse(storedContact) : null;

  const [email, setEmail] = useState(parsedContact?.email || "");
  const [companyName, setCompanyName] = useState(parsedContact?.companyName || "");
  const [projectName, setProjectName] = useState(parsedContact?.projectName || "");
  const [hasDomain, setHasDomain] = useState(parsedContact?.hasDomain || false);
  const [domainName, setDomainName] = useState(parsedContact?.domainName || "");

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const selectedExtrasDetails = extras.filter((e) => selectedExtras.includes(e.id));
    const selectedPagesDetails = extraPages.filter((p) => selectedPageOptionIds.includes(p.id));

    setBasePackage(basePackage);
    setSelectedExtras(selectedExtrasDetails);
    setSelectedPages(selectedPagesDetails);
  }, []);

  useEffect(() => {
    const contact = { email, companyName, projectName, hasDomain, domainName };
    localStorage.setItem("stepThreeContact", JSON.stringify(contact));
  }, [email, companyName, projectName, hasDomain, domainName]);

  const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  const isValidDomain = (value: string) => /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value.trim());

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!isValidEmail(email)) errs.email = "Ange en giltig e-postadress.";
    if (companyName.trim().length < 2) errs.companyName = "Företagsnamnet är för kort.";
    if (projectName.trim().length < 2) errs.projectName = "Projektnamnet är för kort.";
    if (hasDomain && !isValidDomain(domainName)) errs.domainName = "Ange ett giltigt domännamn (exempel.se).";
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const selectedExtrasDetails = extras.filter((e) => selectedExtras.includes(e.id));
    const selectedPagesDetails = extraPages.filter((p) => selectedPageOptionIds.includes(p.id));
    const totalPrice =
      basePackage.price +
      selectedExtrasDetails.reduce((sum, e) => sum + e.price, 0) +
      selectedPagesDetails.reduce((sum, p) => sum + p.price, 0);

    const orderSummary = {
      basePackage,
      extras: selectedExtrasDetails,
      extraPages: selectedPagesDetails,
      totalPrice,
      contactInfo: {
        email,
        companyName,
        projectName,
        hasDomain,
        domainName: hasDomain ? domainName : "",
      },
    };

    console.log("Order summary to send:", orderSummary);
    alert("Beställningen är skickad! Kontrollera konsolen.");
    setErrors({});
  };

  return (
    <div className="step-three">
      <Summary />

      <div className="notes-section" style={{ marginTop: "2rem" }}>
        <h4>Noter</h4>
        <ul>
          <li>Vi ansvarar för att implementera och konfigurera hosting, domän och automatisk e-post för ditt projekt.</li>
          <li>Kostnader för externa tjänster täcks av kunden om de överstiger eventuella gratispaket.</li>
          <li>Två månaders support ingår. Extra support kan ordnas efter överenskommelse.</li>
        </ul>
      </div>

      <form className="contact-form" onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <div className="form-group">
          <label htmlFor="email">E-postadress för faktura och kontakt</label>
          <input
            type="email"
            id="email"
            placeholder="exempel@mail.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={errors.email ? "error" : ""}
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="companyName">Företagsnamn</label>
          <input
            type="text"
            id="companyName"
            placeholder="Ditt företagsnamn"
            required
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className={errors.companyName ? "error" : ""}
          />
          {errors.companyName && <p className="error-message">{errors.companyName}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="projectName">Projektnamn</label>
          <p style={{ fontSize: "0.85rem", margin: "0.25rem 0 0.5rem", color: "#555" }}>
            Använd gärna samma namn som du angav när du skickade innehållet i demon.
          </p>
          <input
            type="text"
            id="projectName"
            value={projectName}
            required
            onChange={(e) => setProjectName(e.target.value)}
            className={errors.projectName ? "error" : ""}
          />
          {errors.projectName && <p className="error-message">{errors.projectName}</p>}
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="hasDomain"
            checked={hasDomain}
            onChange={() => setHasDomain(!hasDomain)}
          />
          <label htmlFor="hasDomain">Jag har redan en befintlig domän</label>
        </div>

        {hasDomain && (
          <div className="form-group">
            <label htmlFor="domainName">Ange din domän</label>
            <input
              type="text"
              id="domainName"
              value={domainName}
              placeholder="exempel.se"
              onChange={(e) => setDomainName(e.target.value)}
              required={hasDomain}
              className={errors.domainName ? "error" : ""}
            />
            {errors.domainName && <p className="error-message">{errors.domainName}</p>}
          </div>
        )}

        <div className="wizard-buttons" style={{ marginTop: "2rem" }}>
          <button type="button" className="btn-back-end" onClick={onBack}>
            ← Tillbaka
          </button>
          <button type="submit" className="btn-submit" style={{ marginLeft: "1rem" }}>
            Skicka beställning
          </button>
        </div>

        <p className="order-info" style={{ marginTop: "1rem", fontSize: "0.85rem", color: "#555" }}>
          När du skickar din beställning kommer du inom kort att få en faktura från oss via Cool Company.
          <br />
          Om du inte redan har skickat in innehåll via demo, kommer du att få instruktioner för hur du gör detta.
          <br />
          Första versionen levereras inom 48–72 timmar efter mottagen betalning och material.
        </p>
      </form>
    </div>
  );
};

export default StepThree;