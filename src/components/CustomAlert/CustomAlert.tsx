import React from "react";
import ReactDOM from "react-dom";
import "./CustomAlert.scss";
import logo from "../../assets/images/mambylyLogoRestyled.webp";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const CustomAlert: React.FC<Props> = ({ visible, onClose }) => {
  if (!visible) return null;

  return ReactDOM.createPortal(
    <div className="custom-alert-overlay">
      <div className="custom-alert">
        <img src={logo} alt="Logo" className="alert-logo" />
        <h2>Beställning mottagen!</h2>
        <p>
          Tack för din beställning. Du kommer att få en faktura via e-post inom kort.
          <br />
          Vi kontaktar dig efter att vi granskat allt material.
        </p>
        <button className="alert-close" onClick={onClose}>
          Stäng
        </button>
      </div>
    </div>,
    document.body
  );
};

export default CustomAlert;
