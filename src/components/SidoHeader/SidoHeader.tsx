import { FaShoppingCart } from "react-icons/fa";
import "./sidoHeader.scss";
import React from "react";
import Logo from "../Logo/Logo";
import SidoNavbar from "../SidoNavbar/SidoNavbar";
import { useCart } from "../../Context/CartContext";


const SidoHeader = () => {
  const { count } = useCart();

  return (
    <header className="sido-subheader">
      <div className="sido-subheader-left">
        <Logo size="medium" />
      </div>

      <div className="sido-subheader-center">
        <SidoNavbar />
      </div>

       <div className="sido-subheader-right">
        <div className="sido-subheader-cart">
          <FaShoppingCart />
          <span className="cart-badge">{count}</span>
        </div>
      </div>
    </header>
  );
};

export default SidoHeader;
