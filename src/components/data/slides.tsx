// slides.ts
import qualityIcon from "../../assets/images/carousel/quality.webp";
import timeIcon from "../../assets/images/carousel/time.webp";
import customerIcon from "../../assets/images/carousel/customer.webp";
import futureIcon from "../../assets/images/carousel/future.webp";
import React from "react";

export interface Slide {
  id: number;
  title: string;
  description: JSX.Element;
  icon: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Pålitlighet & Effektivitet",
    description: <>Varje digital lösning vi skapar bygger på <strong>pålitlighet</strong> och <strong>effektivitet</strong> för att optimera ditt arbetsflöde.</>,
    icon: qualityIcon,
  },
  {
    id: 2,
    title: "Tid är avgörande",
    description: <>Vi levererar snabba och exakta lösningar som effektiviserar din verksamhet.</>,
    icon: timeIcon,
  },
  {
    id: 3,
    title: "Relationer & Anpassning",
    description: <>Vi bygger <strong>relationer</strong> och <strong>anpassade digitala lösningar</strong> för ditt företag.</>,
    icon: customerIcon,
  },
  {
    id: 4,
    title: "Innovation & Erfarenhet",
    description: <>Vi utvecklar ständigt nya teknologier för att hålla dig i framkant.</>,
    icon: futureIcon,
  },
  // Aggiungi altre 5 cards con dati fittizi o reali simili...
  {
    id: 5,
    title: "Support 24/7",
    description: <>Vi erbjuder support dygnet runt för att hjälpa dig när du behöver det mest.</>,
    icon: qualityIcon,
  },
  {
    id: 6,
    title: "Anpassade lösningar",
    description: <>Varje projekt är unikt, och vi anpassar lösningarna efter dina behov.</>,
    icon: timeIcon,
  },
  {
    id: 7,
    title: "Skalbarhet",
    description: <>Våra system är byggda för att växa med ditt företag.</>,
    icon: customerIcon,
  },
  {
    id: 8,
    title: "Säkerhet",
    description: <>Säkerhet är en prioritet i alla våra digitala lösningar.</>,
    icon: futureIcon,
  },
  {
    id: 9,
    title: "Effektiv projektledning",
    description: <>Vi levererar alltid i tid med effektiv planering och ledning.</>,
    icon: qualityIcon,
  },
];
