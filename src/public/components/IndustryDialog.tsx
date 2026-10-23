import React from "react";
import { Dialog } from "@mui/material";
import { Link } from "react-router-dom";
import { FiArrowUpRight, FiCheck, FiX } from "react-icons/fi";

export type Industry = {
  title: string;
  info: string;
  description: string;
  services: string[];
  image: string;
};

/**
 * Restyled presentation of the industry scenarios (components/data/iconData.tsx) that the
 * previous services page showed through InfoPopup. MUI Dialog provides focus trap,
 * Escape handling and focus return to the button that opened it.
 */
const IndustryDialog: React.FC<{ industry: Industry | null; onClose: () => void }> = ({ industry, onClose }) => (
  <Dialog
    open={!!industry}
    onClose={onClose}
    className="mp-dialog"
    aria-labelledby="mp-industry-title"
    aria-describedby="mp-industry-desc"
    PaperProps={{ className: "mp-dialog__paper" }}
  >
    {industry && (
      <>
        <div className="mp-dialog__media" style={{ backgroundImage: `url(${industry.image})` }} aria-hidden="true" />
        <button type="button" className="mp-dialog__close" onClick={onClose} aria-label="Stäng">
          <FiX aria-hidden="true" />
        </button>
        <div className="mp-dialog__body">
          <p className="mp-eyebrow">{industry.info}</p>
          <h2 id="mp-industry-title">{industry.title}</h2>
          <p id="mp-industry-desc">{industry.description}</p>
          <ul className="mp-ticks">
            {industry.services.map((service) => (
              <li key={service}>
                <FiCheck aria-hidden="true" /> {service}
              </li>
            ))}
          </ul>
          <p className="mp-muted">Berätta mer om dina behov så återkommer vi med ett förslag.</p>
          <Link to="/kontaktaOss" className="mp-btn mp-btn--primary" onClick={onClose}>
            Kontakta oss <FiArrowUpRight aria-hidden="true" />
          </Link>
        </div>
      </>
    )}
  </Dialog>
);

export default IndustryDialog;
