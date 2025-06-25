import piazzaImg from "../../assets/images/SidoButik/featurePreviewPiazzaGrande.webp";
import piazzaLogo from "../../assets/images/SidoButik/logotemplatePiazaGrande.webp";

export const templateDetails = {
  "piazza-grande": {
    name: "Piazza Grande",
    logo: piazzaLogo,
    backgroundImage: piazzaImg,
    description:
      "En komplett och responsiv mall för restauranger – med menyer, bokningar och mer.",
    intro: `
      Gillar du den här mallen? Perfekt! Du kan återanvända den med dina egna texter och bilder – antingen via demon eller via mejl.
      Anpassa gallerier, byt sektioner eller lägg till en extra sida: vi hjälper dig hela vägen.
      När vi fått innehåll och betalning startar vi – din förhandsversion är klar inom 48 timmar!
    `,
    demoLink: "https://main.d2nczcu0nsnr0f.amplifyapp.com/",
    steps: [
      {
        title: "Demo",
        text: "Prova demon och lägg in dina texter och bilder. Du kan också välja att skicka innehållet separat.",
      },
      { title: "Detaljer", text: "Välj eventuella extrafunktioner eller sektioner." },
      {
        title: "Slutför",
        text: "När du är redo går du vidare till betalningen – snabbt och tryggt direkt via plattformen.",
      },
    ],
    basePackage: {
      description: "Inkluderar sidorna HEM, OM OSS, KONTAKT och MENY.",
      price: 1990,
    },
    extras: [
      {
        id: "bokabord",
        label: "Boka Bord",
        description:
          "Bordsbokningslösning inklusive skapande av sidan och integration med externa system som Calendly, Bookatable, TheFork, OpenTable och andra.",
        price: 900,
      },
      {
        id: "avhaemtning",
        label: "Avhämtning",
        description:
          "Takeaway-lösning inklusive skapande av sidan och integration med externa system som Foodora, Uber Eats, DoorDash och andra.",
        price: 900,
      },
      {
        id: "custom-backend",
        label: "Eget backend-system",
        description:
          "Skräddarsydd backend utan externa beroenden. Hög initial kostnad, men sparar pengar på lång sikt.",
        price: 8000,
      },
      {
        id: "contact-form",
        label: "Separat kontaktformulär",
        description: "Eget formulär för kontakt med mailavisering, pris 500 kr.",
        price: 500,
      },
      {
        id: "reviews-section",
        label: "Recensioner",
        description:
          "En sektion för kundrecensioner som kan visas på startsidan eller en annan sida.",
        price: 800,
      },
    ],
    messages: {
      contentSent:
        "Tack för att du skickat innehållet via demo! Vi kommer kontakta dig för detaljer kring extra innehåll och meny.",
      contentNotSent:
        "Om du inte skickat innehållet via demo, så kommer vi kontakta dig för instruktioner om hur du kan skicka det separat.",
    },
    sectionsNote: {
      label: "Vilka sektioner vill du ändra?",
      placeholder:
        "Exempel: Jag vill ändra 'Om oss', lägga till åtta bilder i galleriet istället för sex, eller flytta öppettiderna högst upp och galleriet längst ner.",
      note: "Skriv här vad du vill ändra eller omorganisera i sektionerna. Vi tar sedan kontakt för detaljer.",
    },
    staticPage: {
      description:
        "Du har rätt att inkludera en statisk sida i mallen, t.ex. en extra gallerisida eller en presentationssida.",
      exampleText:
        "Beskriv kort vad du vill ha på den statiska sidan, t.ex. 'Extra galleri med åtta bilder' eller 'Presentation av teamet'.",
    },
    extraPages: [
      {
        id: "events-page",
        label: "Evenemangssida",
        description:
          "Dynamisk sida för hantering av evenemang, inklusive kalenderfunktion.",
        price: 1500,
      },
      {
        id: "blog-page",
        label: "Bloggsida",
        description: "En sida för blogg med möjligheter till nyhetsinlägg och artiklar.",
        price: 1200,
      },
      {
        id: "faq-page",
        label: "FAQ-sida",
        description: "Frågor och svar-sida för att informera dina kunder.",
        price: 900,
      },
    ],
    generalNotes: {
      label: "Övriga anteckningar eller frågor",
      placeholder:
        "Här kan du skriva eventuella frågor, kommentarer eller särskilda önskemål du vill att vi ska känna till.",
      note: `Observera att vi använder gratislösningar för mailutskick när det är möjligt, men beroende på restaurangens volym kan extra kostnader för tjänsteleverantörer tillkomma.`,
    },

    contentSentViaDemo: false,
  },
};
