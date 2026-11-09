import type { Lang } from "../../experience/routes";

/**
 * Indicative prices of MambyLy Stay, shown on /tools/stay. PLACEHOLDERS: change the numbers and
 * texts here (one place), nothing else needs to change.
 */
export const STAY_PRICING: { id: string; price: Record<Lang, string>; unit: Record<Lang, string>; name: Record<Lang, string>; note: Record<Lang, string>; featured?: boolean }[] = [
  {
    id: "one",
    name: { sv: "Ett boende", en: "One property" },
    price: { sv: "149 kr", en: "SEK 149" },
    unit: { sv: "/ månad", en: "/ month" },
    note: { sv: "Gästsida, chatt på svenska, engelska och tyska, skylt med NFC och QR.", en: "Guest page, chat in Swedish, English and German, sign with NFC and QR." },
  },
  {
    id: "more",
    name: { sv: "Flera boenden", en: "Several properties" },
    price: { sv: "119 kr", en: "SEK 119" },
    unit: { sv: "/ månad per boende", en: "/ month per property" },
    note: { sv: "Från tre boenden: 20 % lägre pris per boende.", en: "From three properties: 20% less per property." },
    featured: true,
  },
  {
    id: "many",
    name: { sv: "Tio eller fler", en: "Ten or more" },
    price: { sv: "Offert", en: "Quote" },
    unit: { sv: "", en: "" },
    note: { sv: "För förvaltare och byar med många stugor.", en: "For managers and holiday villages with many cottages." },
  },
];

export const STAY_PRICING_NOTE: Record<Lang, string> = {
  sv: "Indikativa priser exklusive moms. Skylten ingår när du startar.",
  en: "Indicative prices excluding VAT. The sign is included when you start.",
};
