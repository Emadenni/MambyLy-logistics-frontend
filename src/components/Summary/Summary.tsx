import React from "react";
import Logo from "../../assets/images/mambylyLogoRestyled.webp";
import "./Summary.scss";
import { useCart } from "../../Context/CartContext";

const Summary: React.FC = () => {
  const {
    basePackage,
    selectedExtras,
    selectedPages,
    resetCart,
  } = useCart();

  const extras = [...selectedExtras, ...selectedPages];
  const baseSelected = basePackage.price > 0;
  const hasExtras = extras.length > 0;

  const totalPrice = baseSelected
    ? basePackage.price + extras.reduce((sum, e) => sum + e.price, 0)
    : 0;

  const advanceThreshold = 5000;
  const needsSplitPayment = totalPrice > advanceThreshold;
  const advancePayment = needsSplitPayment ? totalPrice * 0.3 : totalPrice;
  const remainingPayment = needsSplitPayment ? totalPrice * 0.7 : 0;

  // Se niente selezionato, mostra messaggio e bottone reset disabilitato
  if (!baseSelected && !hasExtras) {
    return (
      <section className="summary" aria-label="Order summary">
        <div className="summary-logo-container">
          <img src={Logo} alt="Company Logo" className="summary-logo" />
        </div>
        <h2>Order Summary</h2>
        <p className="empty-message">Ingen val har gjorts än.</p>
        <button className="btn-reset" disabled>
          Reset extras
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
            <td className="description">{basePackage.description} (Bas Paket)</td>
            <td className="price">{basePackage.price.toFixed(2)}</td>
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

      <button className="btn-reset" onClick={resetCart}>
        Rensa val
      </button>
    </section>
  );
};

export default Summary;
