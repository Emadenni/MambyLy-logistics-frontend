import food from "../../assets/images/popupImgs/food.webp"
import shop from "../../assets/images/popupImgs/shop.webp"
import fitness from "../../assets/images/popupImgs/fitness.webp"
import hotel from "../../assets/images/popupImgs/hotel.webp"
import construction from "../../assets/images/popupImgs/construction.webp"
import freelance from "../../assets/images/popupImgs/freelance.webp"
import warehouse from "../../assets/images/popupImgs/warehouse.webp"
import media from "../../assets/images/popupImgs/media.webp"
import logistics from "../../assets/images/popupImgs/logistics.webp"


export const iconData = [
  {
    id: 1,
    icon: "FaStore",
    title: "Mat & Restaurang",
    info: "Driver du en pizzeria, restaurang eller snabbmatsställe?",
    description: "Här är några smarta digitala lösningar som kan effektivisera din verksamhet:",
    image: food,
    services: [
      "Responsiv hemsida med meny och beställning",
      "Onlinebeställning med betalningslösningar",
      "Digital meny via QR-kod vid bordet",
      "Dashboard för personal- och skiftschema",
      "Automatisering av bokföring och rapportering",
      "Lager- och inköpshantering",
      "SEO och synlighet på Google",
      "Integration med Google-recensioner",
      "Google My Business-optimering"
    ]
  },
  {
    id: 2,
    icon: "FaShoppingBag",
    image: shop,
    title: "Butik",
    info: "Driver du en liten butik?",
    description: "Här är några av de digitala lösningarna vi kan erbjuda för att effektivisera och utveckla din butik:",
    services: [
      "Responsiv webbutik med mobilvänlig design",
      "Dashboard för att hantera produkter och lager",
      "System för personalplanering och schemaläggning",
      "Automatiserade lösningar för försäljning och bokföring",
      "Smidiga betallösningar (Swish, Klarna, Stripe)",
      "SEO-optimering för lokal synlighet på Google",
      "Integrering med Google My Business och recensioner",
      "Möjlighet till kampanjer och kundklubb"
    ]
  },
  {
    id: 3,
    icon: "FaHotel",
    image: hotel,
    title: "Boende & Logi",
    info: "Driver du ett hotell, pensionat eller hyr ut rum?",
    description: "Här är digitala lösningar som hjälper dig att effektivisera bokningar och förbättra gästupplevelsen:",
    services: [
      "Responsiv hemsida med bokningskalender",
      "System för onlinebokning och betalning",
      "Automatiserad hantering av bokningar och avbokningar",
      "Integration med Booking.com och Airbnb",
      "Dashboard för att hantera rum, priser och tillgänglighet",
      "Personalplanering och schemaläggning",
      "Automatisering för kvitton och bokföring",
      "SEO för lokal synlighet och Google My Business"
    ]
  },
  {
    id: 4,
    icon: "FaTruck",
    image: logistics,
    title: "Transport & Logistik",
    info: "Driver du ett transportföretag eller en logistikleverantör?",
    description: "Här är några lösningar som kan effektivisera din verksamhet och förbättra kundupplevelsen:",
    services: [
      "Automatiserat bokningssystem för transporter",
      "Real-tids spårning av leveranser",
      "Lagerhanteringssystem och effektiv lagerstyrning",
      "Automatisering av kundkommunikation och uppdateringar",
      "Dashboard för att hantera frakt, rutter och schemaläggning",
      "Betalningslösningar för transporttjänster",
      "Integration med tredjepartsleverantörer och API:er",
      "SEO för att öka synlighet och förbättra marknadsföringen"
    ]
  },
  {
    id: 5,
    icon: "FaBuilding",
    image: construction,
    title: "Bygg & Professionella Tjänster",
    info: "Är du ett byggföretag eller erbjuder du professionella tjänster?",
    description: "Vi erbjuder följande lösningar för din verksamhet:",
    services: [
      "Anpassade webbsidor för byggprojekt och entreprenader",
      "Projektledningssystem för att koordinera dina team",
      "Digital marknadsföring och SEO för byggföretag",
      "Skapande av portföljer och referensprojekt för att stärka ditt varumärke",
      "Automatisering av fakturering och bokföring för byggföretag",
      "Integration av byggrelaterade verktyg och API:er för smidig hantering",
      "Förbättrad kundkommunikation och projektuppdateringar i realtid"
    ]
  },
  {
    id: 6,
    icon: "FaDumbbell",
    image: fitness,
    title: "Träning & Hälsocenter",
    info: "Har du ett gym, wellnesscenter eller hälsocenter?",
    description: "Så här kan vi hjälpa till att växa din verksamhet:",
    services: [
      "Bokningssystem för träningspass och klasser",
      "Hemsida för att visa tjänster, priser och schema",
      "SEO för att synas på nätet och locka nya kunder",
      "Sociala medier marknadsföring för att öka engagemanget",
      "Automatisering av betalningslösningar och medlemskap",
      "Feedbacksystem och kundrecensioner för att stärka ditt rykte",
      "Integrerad kommunikation och marknadsföring via nyhetsbrev och appar"
    ]
  },  
  {
    id: 7,
    icon: "FaLaptopCode",
    image: freelance,
    title: "Frilansplattform",
    info: "Är du en yrkesverksam inom teknik, kreativt arbete eller någon annan bransch som behöver en onlineplattform?",
    description: "Följande tjänster passar för att förbättra din online-närvaro:",
    services: [
      "Portfoliowebbplats för att visa ditt arbete",
      "SEO för att hitta nya kunder",
      "Enkel betalningslösning för dina tjänster",
      "Marknadsföring på sociala medier",
      "Integration med plattformar för frilansare som Upwork, Fiverr eller Freelancer",
      "Automatiserad hantering av projekt och kunder via plattformar",
      "Skapande av personligt varumärke och synlighet på onlineplattformar"
    ]
  },
  
  {
    id: 8,
    icon: "FaWarehouse",
    image: warehouse ,
    title: "Lager & B2B Lösningar",
    info: "Är du ett lager, leverantör eller B2B-företag som söker effektiva lösningar för att optimera din verksamhet?",
    description: "Vi erbjuder skräddarsydda tjänster för att förbättra och automatisera dina logistik- och affärsprocesser.",
    services: [
      "Lagerhanteringssystem som effektiviserar lagerstyrning och optimerar lagerutrymmet",
      "B2B e-handel och betalningslösningar, skräddarsydda för att hantera bulkbeställningar och stora transaktioner",
      "Automatiserade orderhanteringssystem som minskar manuella arbetsuppgifter och risker för fel",
      "Logistiklösningar för snabbare leveranser och realtidsuppdatering av orderstatus",
      "Integrationer med andra system för att skapa ett sömlöst flöde mellan lager, försäljning och kundservice",
      "Analyser och rapporter för att övervaka lagerstatus, försäljning och logistikprestanda"
    ]
  },
  {
    id: 9,
    icon: "FaBullhorn",
    image:media,
    title: "Webbyrå",
    info: "Är du en kommunikationsbyrå eller webbyrå?",
    description: "Vi hjälper din byrå att ta nästa steg med avancerade lösningar som stärker din online-närvaro och effektiviserar dina arbetsflöden.",
    services: [
      "Anpassade och responsiva webbsidor för dina kunder med integrerade funktioner för att förbättra användarupplevelsen",
      "Digital marknadsföring och SEO-strategier för att öka synligheten och engagemanget online",
      "Content creation för sociala medier, inklusive foton, videor och blogginlägg för att stärka varumärkets röst",
      "Kampanjhantering och analysverktyg för att optimera marknadsföringskampanjer och följa upp resultat",
      "E-mailmarknadsföring med automatiserade flöden och segmentering för att nå rätt målgrupp",
      "Utveckling av webbaserade verktyg för att effektivisera interna processer och samarbeten"
    ]
  }
  ];
  