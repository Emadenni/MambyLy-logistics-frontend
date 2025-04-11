import qualityIcon from "../../assets/images/carousel/quality.png";
import timeIcon from "../../assets/images/carousel/time.png";
import customerIcon from "../../assets/images/carousel/customer.png";
import futureIcon from "../../assets/images/carousel/future.png";
import React from "react";

export interface Slide {
  text: JSX.Element;
  icon: string;
}

export const slides: Slide[] = [
  {
    text: <>Varje digital lösning vi skapar bygger på <strong>pålitlighet</strong> och <strong>effektivitet</strong> för att optimera ditt arbetsflöde.</>,
    icon: qualityIcon, 
  },
  {
    text: <><strong>Tid</strong> är avgörande: vi levererar snabba och exakta lösningar som effektiviserar din verksamhet.</>,
    icon: timeIcon,
  },
  {
    text: <>Vi skapar inte bara system, vi bygger <strong>relationer</strong>: <strong>anpassade digitala lösningar</strong> för ditt företag.</>,
    icon: customerIcon,
  },
  {
    text: <>Med <strong>innovation</strong> och <strong>erfarenhet</strong>: vi utvecklar ständigt nya teknologier för att hålla dig i framkant.</>,
    icon: futureIcon,
  }
];
