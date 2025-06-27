import React, { useEffect, useState } from "react";
import Logo from "../../assets/images/mambylyLogoRestyled.webp";
import "./Summary.scss";
import { useCart } from "../../Context/CartContext";
import { useOrderStore } from "../../store/useOrderStore"; // AGGIUNTA

const Summary: React.FC = () => {
  const {
    basePackage,
    selectedExtras,
    selectedPages,
    resetCart,
  } = useCart();

  const { updateOrderField } = useOrderStore(); // AGGIUNTA

  const [localExtras, setLocalExtras] = useState([...selectedExtras]);
  const [localPages, setLocalPages] = useState([...selectedPages]);
  const [localBase, setLocalBase] = useState(basePackage);

  useEffect(() => {
    setLocalExtras([...selectedExtras]);
    setLocalPages([...selectedPages]);
    setLocalBase(basePackage);

    const extrasTotal = [...selectedExtras, ...selectedPages].reduce(
      (sum, e) => sum + e.price,
      0
    );
    const total = basePackage?.price + extrasTotal;
    const advanceThreshold = 5000;
    const advance = total > advanceThreshold ? total * 0.3 : total;
    const remaining = total > advanceThreshold ? total * 0.7 : 0;

    localStorage.setItem("total_price", total.toFixed(2));
    localStorage.setItem("advance_payment", advance.toFixed(2));
    localStorage.setItem("remaining_payment", remaining.toFixed(2));

    updateOrderField("total_price", total.toFixed(2));
    updateOrderField("advance_payment", advance.toFixed(2));
    updateOrderField("remaining_payment", remaining.toFixed(2));
  }, [selectedExtras, selectedPages, basePackage]);

  const extras = [...localExtras, ...localPages];
  const baseSelected = localBase?.price > 0;
  const hasExtras = extras.length > 0;

  const totalPrice = baseSelected
    ? localBase.price + extras.reduce((sum, e) => sum + e.price, 0)
    : 0;

  const advanceThreshold = 5000;
  const needsSplitPayment = totalPrice > advanceThreshold;
  const advancePayment = needsSplitPayment ? totalPrice * 0.3 : totalPrice;
  const remainingPayment = needsSplitPayment ? totalPrice * 0.7 : 0;

  const handleFullReset = () => {
    resetCart();
    localStorage.removeItem("stepTwoSelections");
    localStorage.removeItem("stepThreeContact");
    localStorage.removeItem("total_price");
    localStorage.removeItem("advance_payment");
    localStorage.removeItem("remaining_payment");
    setLocalExtras([]);
    setLocalPages([]);
    setLocalBase({ description: "", price: 0 });
  };

  if (!baseSelected && !hasExtras) {
    return (
      <section className="summary" aria-label="Order summary">
        <div className="summary-logo-container">
          <img src={Logo} alt="Company Logo" className="summary-logo" />
        </div>
        <h2>Order Summary</h2>
        <p className="empty-message">Ingen val har gjorts än.</p>
        <button className="btn-reset" disabled>
          Rensa val
        </button>
      </section>
    );
  }

  return (
    <section className="summary" aria-label="Order summary">
      <div className="summary-logo-container">
        <img src={Logo} alt="Company Logo" className="summary-logo" />
      </div>

      <h2>Order Summary</h2>

      <table>
        <thead>
          <tr>
            <th>Item</th>
            <th>Pris (kr)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="description">{localBase.description} (Bas Paket)</td>
            <td className="price">{localBase.price.toFixed(2)}</td>
          </tr>
          {extras.map((extra) => (
            <tr key={extra.id}>
              <td className="description">{extra.label}</td>
              <td className="price">{extra.price.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-container">Total: {totalPrice.toFixed(2)} kr</div>

      <div className="payment-info">
        {needsSplitPayment ? (
          <>
            <p>Betalning delas upp:</p>
            <ul>
              <li>30% förskottsbetalning: {advancePayment.toFixed(2)} kr</li>
              <li>70% återstående vid leverans: {remainingPayment.toFixed(2)} kr</li>
            </ul>
          </>
        ) : (
          <p>Betalning sker i sin helhet vid beställning: {totalPrice.toFixed(2)} kr</p>
        )}
      </div>

      <button className="btn-reset" onClick={handleFullReset}>
        Rensa val
      </button>
    </section>
  );
};

export default Summary;
