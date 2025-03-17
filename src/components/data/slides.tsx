import qualityIcon from "../../assets/images/carousel/quality.png";
import timeIcon from "../../assets/images/carousel/time.png";
import customerIcon from "../../assets/images/carousel/customer.png";
import futureIcon from "../../assets/images/carousel/future.png";


export interface Slide {
  text: JSX.Element;
  icon: string;
}

export const slides: Slide[] = [
  {
    text: <>Varje kilometer vi kör är ett åtagande för excellens: <strong>pålitlighet</strong> och <strong>säkerhet</strong> utan kompromisser.</>,
    icon: qualityIcon, 
  },
  {
    text: <><strong>Tid</strong> är värdefullt: vi arbetar varje dag för att garantera en <strong>felfri punktlighet</strong>.</>,
    icon: timeIcon,
  },
  {
    text: <>Vi transporterar inte bara varor, utan <strong>förtroende</strong>: <strong>skräddarsydda lösningar</strong> för varje behov.</>,
    icon: customerIcon,
  },
  {
    text: <>År av <strong>erfarenhet</strong>, men blicken mot <strong>framtiden</strong>: vi utvecklas ständigt för att ge dig det bästa.</>,
    icon: futureIcon,
  }
];
