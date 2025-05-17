
import React from "react";
import responsive from "../../assets/images/carousel/responsive.webp"
import seo from "../../assets/images/carousel/seo.webp"
import share from "../../assets/images/carousel/share.webp"
import cart from "../../assets/images/carousel/cart.webp"
import dashboard from "../../assets/images/carousel/dashboard.webp"
import book  from "../../assets/images/carousel/book.webp"
import database from "../../assets/images/carousel/database.webp"
import integration from "../../assets/images/carousel/integration.webp"
import gdpr from "../../assets/images/carousel/gdpr.webp"

export interface Slide {
  id: number;
  title: string;
  description: JSX.Element;
  icon: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    title: "Webbdesign Responsiv",
    description: <>Vi skapar moderna och responsiva webbplatser som fungerar perfekt på alla enheter. Perfekt för företag som vill ha en användarvänlig och professionell online-närvaro.</>,
    icon: responsive,
  },
  {
    id: 2,
    title: "SEO - Sökmotoroptimering",
    description: <>Vi optimerar din webbplats för att förbättra dess synlighet på sökmotorer som Google och öka trafiken till din sida.</>,
    icon: seo,
  },
  {
    id: 3,
    title: "Social Media & Kartintegration",
    description: <>Integrera dina sociala medier och Google Maps på din webbplats för att förbättra kundinteraktion och lokalisering.</>,
    icon: share,
  },
  {
    id: 4,
    title: "Webbutik & E-handel",
description: <>Vi bygger skräddarsydda e-handelslösningar som gör det enkelt och effektivt att sälja online med en smidig kundupplevelse.</>,    icon:cart ,
  },

  {
    id: 5,
    title: "Administrativa dashboards",
    description: <>Vi skapar anpassade administrativa paneler som hjälper dig att hantera ditt företag och fatta datadrivna beslut.</>,
    icon: dashboard,
  },
  {
    id: 6,
    title: "Bokningssystem",
    description: <>Vi skapar användarvänliga bokningssystem för att förenkla kundens bokningar och förbättra användarupplevelsen.</>,
    icon: book,
  },
  {
    id: 7,
    title: "Databashantering",
    description: <>Vi skapar och underhåller databaser som lagrar och hanterar dina affärsdata på ett säkert och strukturerat sätt.</>,
    icon: database,
  },
  {
    id: 8,
    title: "API Integration",
    description: <>Vi utvecklar och integrerar API-lösningar för att förbättra funktionaliteten på din webbplats och förbinda den med andra tjänster.</>,
    icon: integration,
  },
  {
    id: 9,
    title: "GDPR och Tillgänglighet",
    description: <>Vi bygger webbplatser som är både säkra och inkluderande – i enlighet med GDPR och med fokus på tillgänglighet för alla användare.</>,
    icon: gdpr,
  },
];
