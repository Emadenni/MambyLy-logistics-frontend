import React from "react";
import Logo from "../../assets/images/mambylyLogoRestyled.webp";
import "./Summary.scss";
import { useCart } from "../../Context/CartContext";

const Summary: React.FC = () => {
  const { basePackage, selectedExtras, selectedPages, setSelectedExtras, setSelectedPages, setCount } = useCart();

  const extras = [...selectedExtras, ...selectedPages];
  const totalPrice = basePackage.price + extras.reduce((sum, e) => sum + e.price, 0);

  const handleReset = () => {
    setSelectedExtras([]);
    setSelectedPages([]);
    setCount(1); // solo pacchetto base
  };

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

      <div className="total-container">
        Total: {totalPrice.toFixed(2)} kr
      </div>

      <button className="btn-reset" onClick={handleReset}>
        Reset extras
      </button>
    </section>
  );
};

export default Summary;
