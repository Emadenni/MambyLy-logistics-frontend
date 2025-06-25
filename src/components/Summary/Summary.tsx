import React from "react";
import Logo from "../../assets/images/mambylyLogoRestyled.webp";
import "./Summary.scss"

interface Extra {
  id: string;
  label: string;
  price: number;
}

interface BasePackage {
  description: string;
  price: number;
}

interface SummaryProps {
  basePackage: BasePackage;
  extras: Extra[];
  totalPrice: number;
}

const Summary: React.FC<SummaryProps> = ({ basePackage, extras, totalPrice }) => {
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
    </section>
  );
};

export default Summary;
