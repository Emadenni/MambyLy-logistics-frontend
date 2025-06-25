import { FaReceipt } from "react-icons/fa";
import "./sidoHeader.scss";
import React, { useState } from "react";
import Logo from "../Logo/Logo";
import SidoNavbar from "../SidoNavbar/SidoNavbar";
import { useCart } from "../../Context/CartContext";
import Summary from "../Summary/Summary";

const SidoHeader = () => {
  const { count } = useCart();
  const [showSummary, setShowSummary] = useState(false);

  const toggleSummary = () => setShowSummary((prev) => !prev);

  return (
    <header className="sido-subheader">
      <div className="sido-subheader-left">
        <Logo size="medium" />
      </div>

      <div className="sido-subheader-center">
        <SidoNavbar />
      </div>

      <div className="sido-subheader-right">
        <div
          className="sido-subheader-cart"
          onClick={toggleSummary}
          style={{ cursor: "pointer" }}
          aria-label="Show order summary"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleSummary(); }}
        >
          <FaReceipt />
          <span className="cart-badge">{count}</span>
        </div>
      </div>

      {showSummary && (
        <div className="summary-modal" role="dialog" aria-modal="true" aria-label="Order Summary Modal">
          <button
            className="close-btn"
            onClick={() => setShowSummary(false)}
            aria-label="Close order summary"
          >
            ×
          </button>
          <Summary />
        </div>
      )}
    </header>
  );
};

export default SidoHeader;
