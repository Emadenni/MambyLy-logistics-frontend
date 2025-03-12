import { ReactNode } from "react";
import { Service } from "../../types/common";
import truck_img from "../../assets/images/truckImg.png";
import digital_img from "../../assets/images/digitalImg.jpg";

export const servicesData: Service[] = [
  {
    title: "Transporttjänster",
    shortDescription: " Vi erbjuder transport av olika typer av laster, där kunden tillhandahåller släpet. Vid behov kan vi även tillhandahålla släp på begäran.",
    image: truck_img,
    color: "white",
    background_color : "rgb(18, 47, 18)",
    id: "service1",
    onClick: () => console.log("service1 clicked"),
  },
  {
    title: "Digitala tjänster",
    shortDescription: "Vi tillhandahåller verktygen för att säkerställa en kontrollerad och effektiv transportprocess med breda anpassningsmöjligheter.",
    image: digital_img,
    color: "black",
    background_color : "rgb(177, 219, 182)",
    id: "service2",
    onClick: () => console.log("service2 clicked"),
  },
];
