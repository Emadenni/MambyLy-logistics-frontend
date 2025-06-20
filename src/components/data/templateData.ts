import piazzaImg from "../../assets/images/SidoButik/piazza-grande-temp-img.webp";
import lumeaImg from "../../assets/images/SidoButik/lumea-temp-img.webp";
import nexoraImg from "../../assets/images/SidoButik/nexora-temp-img.webp";
/* import bistroImg from "@/assets/templates/urban-bistro-preview.jpg";
import greenLeafImg from "@/assets/templates/green-leaf-preview.jpg"; */

import piazzaLogo from "../../assets/images/SidoButik/logotemplatePiazaGrande.webp";
import lumeaLogo from "../../assets/images/SidoButik/logolumea.webp";
import nexoraLogo from "../../assets/images/SidoButik/logoNexora.webp";

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  pages?: string[];
  image: string;
  logo: string;
  badge?: string;
  price: string;
  comingSoon: boolean;
  link?: string;
}

export const templatesData: TemplateItem[] = [
  {
    id: "piazza-grande",
    name: "Piazza Grande",
    description: "En komplett och responsiv mall för restauranger – med menyer, bokningar och mer.",
    pages: ["Hem", "Om oss", "Kontakt", "Meny", "Boka", "Avhämtning"],
    image: piazzaImg,
    logo: piazzaLogo,
    badge: "Nyhet",
    price: "från 1990 kr",
    comingSoon: false,
    link: "/templates/piazza-grande",
  },
  {
    id: "lumea-spa",
    name: "Luméa",
    description: "Elegant och avkopplande design för spa, salonger och wellnesscenter. Fräsch och modern estetik.",
    pages: ["Hem", "Tjänster", "Kontakt", "Boka", "Om Oss"],
    image: lumeaImg,
    logo: lumeaLogo,
    badge: "Snart tillgänglig",
    price: "Snart tillgänglig",
    comingSoon: true,
    link: "/templates/lumea-spa",
  },
  {
    id: "nexora",
    name: "Nexora",
    description: "En elegant mall för onlinebutiker som säljer väskor av hög kvalitet.",
    pages: ["Hem", "Om oss", "Kontakt", "Produkter", "Checkout"],
    image: nexoraImg,
    logo: nexoraLogo,
    badge: "Snart tillgänglig",
    price: "Snart tillgänglig",
    comingSoon: true,
    link: "/templates/nexora",
  },
];
