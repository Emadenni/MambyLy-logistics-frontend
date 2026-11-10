import type { Texts } from "../shared/engine";

/**
 * INDICATIVE PRICES – placeholders until the real ones are decided: change them here and the
 * landing page follows. An annual subscription per place; the NFC signs are included up to a number.
 */
export type GuidePlan = {
  id: string;
  name: Texts;
  price: Texts;
  unit: Texts;
  note: Texts;
  featured?: boolean;
};

export const GUIDE_PRICING: GuidePlan[] = [
  {
    id: "small",
    name: { sv: "Liten plats", en: "Small place" },
    price: { sv: "1 490 kr", en: "SEK 1,490" },
    unit: { sv: "/ år", en: "/ year" },
    note: { sv: "Upp till 10 punkter. Skyltarna med NFC och QR ingår.", en: "Up to 10 points. The NFC and QR signs are included." },
  },
  {
    id: "medium",
    name: { sv: "Mellanstor plats", en: "Medium place" },
    price: { sv: "2 490 kr", en: "SEK 2,490" },
    unit: { sv: "/ år", en: "/ year" },
    note: { sv: "Upp till 25 punkter. Skyltarna med NFC och QR ingår.", en: "Up to 25 points. The NFC and QR signs are included." },
    featured: true,
  },
  {
    id: "large",
    name: { sv: "Förening eller kommun", en: "Society or municipality" },
    price: { sv: "Offert", en: "Quote" },
    unit: { sv: "", en: "" },
    note: { sv: "För flera platser eller fler än 25 punkter.", en: "For several places or more than 25 points." },
  },
];

export const GUIDE_PRICING_NOTE: Texts = {
  sv: "Indikativa priser exklusive moms. Fler skyltar än de som ingår kostar extra.",
  en: "Indicative prices excluding VAT. Signs beyond those included cost extra.",
};
