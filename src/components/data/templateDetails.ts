import piazzaImg from "../../assets/images/SidoButik/featurePreviewPiazzaGrande.webp";
import lumeaImg from "../../assets/images/SidoButik/lumea-temp-img.webp";
import nexoraImg from "../../assets/images/SidoButik/nexora-temp-img.webp";
/* import bistroImg from "@/assets/templates/urban-bistro-preview.jpg";
import greenLeafImg from "@/assets/templates/green-leaf-preview.jpg"; */

import piazzaLogo from "../../assets/images/SidoButik/logotemplatePiazaGrande.webp";
import lumeaLogo from "../../assets/images/SidoButik/logolumea.webp";
import nexoraLogo from "../../assets/images/SidoButik/logoNexora.webp";

export const sharedTemplateSteps = [
  {
    title: "Demo",
    text: "Prova demon och lägg in dina texter och bilder. Du kan också välja att skicka innehållet separat.",
  },
  {
    title: "Detaljer",
    text: "Välj eventuella extrafunktioner eller sektioner – t.ex. fler sidor, andra integrationer eller färgändringar.",
  },
  {
    title: "Betala",
    text: "När du är redo går du vidare till betalningen – snabbt och tryggt direkt via plattformen.",
  },
  {
    title: "Vi tar över",
    text: "Vi bygger klart din mall, optimerar och återkopplar med en version redo att lanseras.",
  },
];

export const sharedTemplateIntro = `
  Gillar du den här mallen? Perfekt! Du kan återanvända den med dina egna texter och bilder – antingen via demon eller via mejl.
  Anpassa gallerier, byt sektioner eller lägg till en extra sida: vi hjälper dig hela vägen.
  När vi fått innehåll och betalning startar vi – din förhandsversion är klar inom 48 timmar!
`;

export const templateDetails = {
  "piazza-grande": {
    name: "Piazza Grande",

    logo: piazzaLogo,
    backgroundImage: piazzaImg,

    description: "En komplett och responsiv mall för restauranger – med menyer, bokningar och mer.",

    intro: sharedTemplateIntro,

    demoLink: "http://main.d2nczcu0nsnr0f.amplifyapp.com/",
    steps: sharedTemplateSteps,
  },
};
