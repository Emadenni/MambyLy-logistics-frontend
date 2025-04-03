import { Service } from "../../types/common";
import truck_img from "../../assets/images/truckImg.png";
import digital_img from "../../assets/images/serviceImg.jpg";

export const servicesData: Service[] = [
  {
    title: "Stärk ditt företag med digitala lösningar",
    shortDescription:
      "Från skräddarsydda hemsidor och webbappar till digitala automatiseringar, hjälper vi små och medelstora företag att växa i den digitala eran. Våra användarvänliga dashboards och innovativa tjänster är designade för att öka din effektivitet och förenkla komplexa uppgifter.",
    image: digital_img,
    color: "black",
    background_color: "white",
    id: "service2",
  },
  {
    title: "Transporttjänster",
    shortDescription:
      "Vi erbjuder transport av olika typer av laster, där kunden tillhandahåller släpet. Vid behov kan vi även tillhandahålla släp på begäran.",
    image: truck_img,
    color: "black",
    background_color: "rgb(231, 241, 232)",
    id: "service1",
  },
];
