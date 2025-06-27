import React, { useEffect, useState } from "react";
import Summary from "../Summary/Summary";
import "./Steps.scss";
import { useCart } from "../../Context/CartContext";
import { useOrderStore } from "../../store/useOrderStore"; 
import sendOrderConfirmation from "../../services/sendOrderConfirmation";

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
  const { updateOrderField } = useOrderStore();

  const storedContact = localStorage.getItem("stepThreeContact");
  const parsedContact = storedContact ? JSON.parse(storedContact) : null;

  const [email, setEmail] = useState(parsedContact?.email || "");
  const [companyName, setCompanyName] = useState(parsedContact?.companyName || "");
  const [projectName, setProjectName] = useState(parsedContact?.projectName || "");
  const [hasDomain, setHasDomain] = useState(parsedContact?.hasDomain || false);
  const [domainName, setDomainName] = useState(parsedContact?.domainName || "");
  const [finalNotes, setFinalNotes] = useState(parsedContact?.finalNotes || "");

  useEffect(() => {
    const selectedExtrasDetails = extras.filter((e) => selectedExtras.includes(e.id));
    const selectedPagesDetails = extraPages.filter((p) => selectedPageOptionIds.includes(p.id));

    setBasePackage(basePackage);
    setSelectedExtras(selectedExtrasDetails);
    setSelectedPages(selectedPagesDetails);
  }, []);

  useEffect(() => {
    const contact = {
      email,
      companyName,
      projectName,
      hasDomain,
      domainName,
      finalNotes,
    };

    localStorage.setItem("stepThreeContact", JSON.stringify(contact));

    updateOrderField("email", email);
    updateOrderField("company_name", companyName);
    updateOrderField("project_name", projectName);
    updateOrderField("has_domain", hasDomain ? "true" : "false");
    updateOrderField("domain_name", hasDomain ? domainName : "-");
    updateOrderField("final_notes", finalNotes);
  }, [email, companyName, projectName, hasDomain, domainName, finalNotes]);

const handleSubmit = async (e: React.FormEvent) => {
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
      projectName,
      hasDomain,
      domainName: hasDomain ? domainName : "",
      finalNotes,
    },
  };

  console.log("Order summary to send:", orderSummary);

  try {
    const response = await sendOrderConfirmation();
    if (response.success) {
      alert(`Beställningen är skickad! Order-ID: ${response.order_id}`);
    } else {
      console.error("EmailJS error:", response.error);
      alert("Något gick fel när beställningen skickades. Försök igen senare.");
    }
  } catch (err) {
    console.error("Unexpected error:", err);
    alert("Ett oväntat fel uppstod. Försök igen.");
  }
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
            pattern="^[^\s@]+@[^\s@]+\.(com|se|org|net|info|io|co)$"
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

        <div className="form-group">
          <label htmlFor="finalNotes">Anteckningar / meddelande (valfritt)</label>
          <textarea
            id="finalNotes"
            rows={4}
            value={finalNotes}
            placeholder=""
            onChange={(e) => setFinalNotes(e.target.value)}
          />
        </div>

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
          <br />
          <br />
          <strong>
            Vissa funktioner som exempelvis anpassade backend-lösningar eller extra tjänster som CMS kan förlänga
            utvecklingstiden. I sådana fall ger vi dig en mer realistisk tidsuppskattning så snart vi har analyserat din
            beställning.
          </strong>
        </p>
      </form>
    </div>
  );
};

export default StepThree;
