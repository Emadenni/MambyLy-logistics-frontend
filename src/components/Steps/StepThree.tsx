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

const StepThree: React.FC<StepThreeProps> = ({ title, text, onBack, summaryData, template }) => {
  const { basePackage, extras, extraPages } = template;
  const { selectedExtras, selectedPageOptionIds } = summaryData;

  const { setBasePackage, setSelectedExtras, setSelectedPages } = useCart();

  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [hasDomain, setHasDomain] = useState(false);
  const [domainName, setDomainName] = useState("");

  useEffect(() => {
    const selectedExtrasDetails = extras.filter((e) => selectedExtras.includes(e.id));
    const selectedPagesDetails = extraPages.filter((p) => selectedPageOptionIds.includes(p.id));

    setBasePackage(basePackage);
    setSelectedExtras(selectedExtrasDetails);
    setSelectedPages(selectedPagesDetails);
  }, [
    basePackage,
    extras,
    extraPages,
    selectedExtras,
    selectedPageOptionIds,
    setBasePackage,
    setSelectedExtras,
    setSelectedPages,
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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
        hasDomain,
        domainName: hasDomain ? domainName : "",
      },
    };

    console.log("Order summary to send:", orderSummary);
    alert("Order submitted! Controlla console per il riepilogo.");
  };

  return (
    <div className="step-three">
      <Summary />

      <div className="notes-section" style={{ marginTop: "2rem" }}>
        <h4>Noter</h4>
        <ul>
          <li>
            Vi ansvarar för att implementera och konfigurera hosting, domän och automatisk e-post för ditt projekt.
          </li>
          <li>
            Kostnader för externa tjänster, såsom hosting och e-post med höga volymer, täcks av kunden om dessa
            överstiger eventuella gratispaket.
          </li>
          <li>Vi hjälper gärna till att hitta kostnadseffektiva lösningar för att hålla utgifterna nere.</li>
          <li>Eventuella externa plattformar kan tillkomma enligt överenskommelse.</li>
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
          />
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
          />
        </div>

        <div className="form-group checkbox-group">
          <input type="checkbox" id="hasDomain" checked={hasDomain} onChange={() => setHasDomain(!hasDomain)} />
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
            />
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
          När du skickar din beställning kommer du inom kort att få en faktura från oss, utfärdad av vår skattemässiga
          partner Cool Company.
          <br />
          Om du inte redan har skickat in innehåll via demo, kommer du att få instruktioner för hur du gör detta.
          <br />
          Från det att vi mottagit både innehåll och betalning, strävar vi efter att leverera en första version av sidan
          för granskning inom 48–72 timmar.
          <br />
          Leveranstiden kan dock variera beroende på komplexiteten i dina önskemål.
        </p>
      </form>
    </div>
  );
};

export default StepThree;
