import React from "react";
import { useCart } from "../../Context/CartContext";
import "./Summary.scss";

interface SummaryProps {
  basePackage: { description: string; price: number };
  selectedExtras: { id: string; label: string; price: number }[];
  selectedPages: { id: string; label: string; price: number }[];
  sectionsNoteText: string;
  staticPageDescription: string;
  onRemoveExtra: (id: string) => void;
  onRemovePage: (id: string) => void;
}

const Summary: React.FC<SummaryProps> = ({
  basePackage,
  selectedExtras,
  selectedPages,
  sectionsNoteText,
  staticPageDescription,
  onRemoveExtra,
  onRemovePage,
}) => {
  const extrasTotal = selectedExtras.reduce((sum, e) => sum + e.price, 0);
  const pagesTotal = selectedPages.reduce((sum, p) => sum + p.price, 0);
  const totalPrice = basePackage.price + extrasTotal + pagesTotal;

  return (
    <div className="summary">
      <h2>Beställningsöversikt</h2>

      <h3>Bas paket</h3>
      <p>{basePackage.description}</p>
      <p><strong>Pris: {basePackage.price} kr</strong></p>

      <h3>Valda extrafunktioner</h3>
      {selectedExtras.length === 0 && <p>Inga extrafunktioner valda.</p>}
      <ul>
        {selectedExtras.map((extra) => (
          <li key={extra.id}>
            <span>{extra.label} — {extra.price} kr</span>
            <button onClick={() => onRemoveExtra(extra.id)}>Ta bort</button>
          </li>
        ))}
      </ul>

      <h3>Valda extra sidor</h3>
      {selectedPages.length === 0 && <p>Inga extra sidor valda.</p>}
      <ul>
        {selectedPages.map((page) => (
          <li key={page.id}>
            <span>{page.label} — {page.price} kr</span>
            <button onClick={() => onRemovePage(page.id)}>Ta bort</button>
          </li>
        ))}
      </ul>

      <h3>Anteckningar om sektioner</h3>
      {sectionsNoteText ? (
        <p>{sectionsNoteText}</p>
      ) : (
        <p>Inga anteckningar tillagda.</p>
      )}

      <h3>Beskrivning statisk sida</h3>
      {staticPageDescription ? (
        <p>{staticPageDescription}</p>
      ) : (
        <p>Ingen statisk sida beskriven.</p>
      )}

      <div className="total-price">Totalt pris: <strong>{totalPrice} kr</strong></div>
    </div>
  );
};

export default Summary;