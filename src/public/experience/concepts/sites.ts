/**
 * The rest of each website demo around its signature screen: the navigation and the sections a
 * real site of that kind would have (about, services, process, reviews, questions, opening hours,
 * footer). Everything is fictitious and said to be: no real company, person, address, phone number
 * or review. E-mail addresses use the reserved .example domain.
 */
import type { ConceptId, Lang } from "../routes";

export type SxItem = { title: string; text?: string; meta?: string };
export type SxSection =
  | { kind: "text"; key: string; kicker: string; title: string; text: string[]; img?: [string, number]; alt?: string; stats?: { n: string; label: string }[] }
  | { kind: "cards"; key: string; kicker: string; title: string; lead?: string; items: SxItem[]; numbered?: boolean }
  | { kind: "groups"; key: string; kicker: string; title: string; lead?: string; groups: { title: string; items: SxItem[] }[] }
  | { kind: "gallery"; key: string; kicker: string; title: string; lead?: string; items: { img: [string, number]; alt: string; caption: string }[] }
  | { kind: "quotes"; key: string; kicker: string; title: string; note: string; items: { quote: string; by: string }[] }
  | { kind: "faq"; key: string; kicker: string; title: string; items: { q: string; a: string }[] }
  | { kind: "info"; key: string; kicker: string; title: string; lead?: string; rows: { label: string; lines: string[] }[] };

export type SiteNavItem = { id: string; label: string };
export type SiteData = {
  /** links of the navigation: ids of elements on the page */
  nav: SiteNavItem[];
  /** the main action, last in the navigation */
  cta: SiteNavItem;
  tagline: string;
  sections: SxSection[];
  footer: { title: string; lines: string[] }[];
};

type Ui = { menu: string; close: string; nav: string; top: string; footNav: string; fictitious: string };

export const SITE_UI: Record<Lang, Ui> = {
  sv: { menu: "Meny", close: "Stäng menyn", nav: "Huvudmeny", top: "Till toppen", footNav: "Sidor", fictitious: "Påhittat företag." },
  en: { menu: "Menu", close: "Close the menu", nav: "Main menu", top: "Back to top", footNav: "Pages", fictitious: "A made-up business." },
};

const sid = (id: ConceptId, key: string) => `cx-${id}-${key}`;
export const sectionId = sid;

const sv: Record<ConceptId, SiteData> = {
  restaurant: {
    nav: [
      { id: sid("restaurant", "dish"), label: "Kvällens rätt" },
      { id: sid("restaurant", "about"), label: "Om oss" },
      { id: sid("restaurant", "menu"), label: "Hela menyn" },
      { id: sid("restaurant", "events"), label: "Kvällar" },
      { id: sid("restaurant", "visit"), label: "Hitta hit" },
    ],
    cta: { id: sid("restaurant", "book"), label: "Boka bord" },
    tagline: "Italienskt kök med citron, olivolja och tid.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "Om oss",
        title: "Ett litet kök med långa kvällar",
        text: [
          "Trattoria Limone är en påhittad restaurang för den här demon. Tänk ett kvarterskrog med öppet kök, levande ljus och pasta som rullas för hand varje eftermiddag.",
          "Menyn följer säsongen och är kort med flit: hellre sex rätter vi är stolta över än tjugo vi stressar fram.",
        ],
        img: ["dish-lemon-ravioli", 900],
        alt: "Ravioli med citron och smör på en ljus tallrik",
        stats: [
          { n: "38", label: "platser i matsalen" },
          { n: "6", label: "rätter på kvällsmenyn" },
          { n: "1", label: "citronträd i fönstret" },
        ],
      },
      {
        kind: "groups",
        key: "menu",
        kicker: "Meny (exempel)",
        title: "Hela menyn",
        lead: "Priserna är påhittade. Fråga gärna om allergier – vi anpassar så gott vi kan.",
        groups: [
          {
            title: "Antipasti",
            items: [
              { title: "Bruschetta al pomodoro", text: "Grillat surdegsbröd, tomat, basilika", meta: "95 kr" },
              { title: "Burrata", text: "Krämig burrata, citronolja, rostad mandel", meta: "145 kr" },
              { title: "Oliver & focaccia", text: "Marinerade oliver, nybakad focaccia", meta: "65 kr" },
            ],
          },
          {
            title: "Primi & secondi",
            items: [
              { title: "Ravioli al limone", text: "Handgjord pasta, ricotta, citronsmör", meta: "215 kr" },
              { title: "Risotto ai funghi", text: "Karnaroliris, svamp, parmesan", meta: "205 kr" },
              { title: "Branzino al limone", text: "Havsabborre, citron, kapris, potatis", meta: "265 kr" },
            ],
          },
          {
            title: "Dolci",
            items: [
              { title: "Tiramisù", text: "Mascarpone, espresso, kakao", meta: "105 kr" },
              { title: "Sorbetto al limone", text: "Citronsorbet med mynta", meta: "75 kr" },
            ],
          },
          {
            title: "Att dricka",
            items: [
              { title: "Husets vita / röda", text: "Glas från Sicilien och Piemonte", meta: "115 kr" },
              { title: "Limonata", text: "Pressad citron, rosmarin, bubbel", meta: "55 kr" },
              { title: "Espresso", text: "Mörkrostad, kort och söt", meta: "35 kr" },
            ],
          },
        ],
      },
      {
        kind: "gallery",
        key: "gallery",
        kicker: "Från köket",
        title: "Det som går ut genom luckan",
        items: [
          { img: ["dish-bruschetta", 480], alt: "Bruschetta med tomat och basilika", caption: "Bruschetta" },
          { img: ["dish-burrata", 480], alt: "Burrata med olivolja", caption: "Burrata" },
          { img: ["dish-mushroom-risotto", 480], alt: "Svamprisotto i djup tallrik", caption: "Risotto ai funghi" },
          { img: ["dish-lemon-seabass", 480], alt: "Havsabborre med citron", caption: "Branzino" },
          { img: ["dish-tiramisu", 480], alt: "Tiramisù i glas", caption: "Tiramisù" },
          { img: ["dish-lemon-ravioli", 480], alt: "Ravioli med citron", caption: "Ravioli al limone" },
        ],
      },
      {
        kind: "cards",
        key: "events",
        kicker: "Kvällar",
        title: "Mer än en middag",
        items: [
          { title: "Pastaskola", text: "Tisdagar: vi lär dig rulla, skära och fylla pasta. Du äter det du gör.", meta: "Tisdagar 17.00" },
          { title: "Vinkväll", text: "Fyra glas, fyra små rätter och historien bakom varje druva.", meta: "Första torsdagen i månaden" },
          { title: "Hela lokalen", text: "Födelsedag eller kickoff? Upp till 38 gäster med egen meny.", meta: "Efter förfrågan" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Gästerna",
        title: "Vad folk säger",
        note: "Påhittade omdömen för demon.",
        items: [
          { quote: "Citronravioli som jag fortfarande tänker på. Och personalen kom ihåg vårt namn.", by: "Gäst, exempel" },
          { quote: "Perfekt för en lång tisdagsmiddag. Lugnt, varmt och utan stress.", by: "Gäst, exempel" },
          { quote: "Pastaskolan var kvällens höjdpunkt – vi gick hem med deg under naglarna.", by: "Gäst, exempel" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Bra att veta",
        items: [
          { q: "Kan ni laga glutenfritt?", a: "De flesta rätter går att anpassa. Skriv det i bokningen så förbereder vi köket." },
          { q: "Tar ni emot barn?", a: "Absolut. Vi har barnstolar och en liten pasta utan krångel." },
          { q: "Kan man komma utan bokning?", a: "Vi håller några bord i baren för den som kommer spontant." },
          { q: "Har ni take away?", a: "Pasta och tiramisù går att hämta – beställ vid disken." },
        ],
      },
      {
        kind: "info",
        key: "visit",
        kicker: "Hitta hit",
        title: "Öppettider och adress",
        lead: "Adressen är påhittad – restaurangen finns inte.",
        rows: [
          { label: "Öppet", lines: ["Tis–tors 17–22", "Fre–lör 17–23", "Sön–mån stängt"] },
          { label: "Adress", lines: ["Citrongatan 12", "123 45 Exempelstad"] },
          { label: "Skriv till oss", lines: ["bord@trattoria-limone.example"] },
        ],
      },
    ],
    footer: [
      { title: "Trattoria Limone", lines: ["Citrongatan 12", "Exempelstad"] },
      { title: "Öppet", lines: ["Tis–tors 17–22", "Fre–lör 17–23"] },
    ],
  },

  photographer: {
    nav: [
      { id: sid("photographer", "work"), label: "Portfolio" },
      { id: sid("photographer", "about"), label: "Om mig" },
      { id: sid("photographer", "services"), label: "Uppdrag" },
      { id: sid("photographer", "process"), label: "Så går det till" },
      { id: sid("photographer", "faq"), label: "Frågor" },
    ],
    cta: { id: sid("photographer", "book"), label: "Boka" },
    tagline: "Porträtt, rum och hantverk i naturligt ljus.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "Om mig",
        title: "Jag väntar på ljuset",
        text: [
          "Påhittad fotograf för den här demon – personen finns inte. Men tänk dig någon som hellre kommer tidigt än sent, och som tar bilden när du slutar posera.",
          "Jag fotograferar människor, rum och hantverk, mest i naturligt ljus. Resultatet är bilder som känns som du – inte som en katalog.",
        ],
        img: ["photo-brand-craft", 627],
        alt: "Händer som hyvlar en träbräda i en snickarverkstad",
        stats: [
          { n: "12", label: "år bakom kameran" },
          { n: "3", label: "sorters uppdrag" },
          { n: "48 h", label: "till första urvalet" },
        ],
      },
      {
        kind: "cards",
        key: "services",
        kicker: "Uppdrag",
        title: "Vad jag fotograferar",
        items: [
          { title: "Porträtt", text: "För dig, din profil eller ditt team. Ute eller i ett rum med fint ljus.", meta: "1–2 timmar" },
          { title: "Rum & arkitektur", text: "Hem, butiker och kontor – fotograferat så att man vill kliva in.", meta: "Halv- eller heldag" },
          { title: "Varumärke & hantverk", text: "Händer, verktyg, material. Bilder som visar hur något blir till.", meta: "Efter upplägg" },
          { title: "Små event", text: "Lanseringar och middagar, diskret och utan blixt i ansiktet.", meta: "Från 2 timmar" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "Så går det till",
        title: "Från första mejl till färdiga bilder",
        numbered: true,
        items: [
          { title: "Vi pratar", text: "Vad bilderna ska användas till och vilken känsla du vill ha." },
          { title: "Planen", text: "Plats, tid på dagen och vad som ska med. Du får allt skriftligt." },
          { title: "Fotograferingen", text: "Lugnt tempo. Jag guidar, du behöver inte kunna posera." },
          { title: "Urval & leverans", text: "Ett första urval inom 48 timmar, färdiga bilder i ett galleri." },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Kundord",
        title: "Efter fotograferingen",
        note: "Påhittade omdömen för demon.",
        items: [
          { quote: "Första gången jag tycker om ett porträtt på mig själv.", by: "Kund, exempel" },
          { quote: "Bilderna på verkstaden ser ut som det känns att stå där.", by: "Kund, exempel" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Vanliga frågor",
        items: [
          { q: "Vad händer om det regnar?", a: "Vi flyttar in eller byter dag – ljuset efter regn är ofta det bästa." },
          { q: "Hur många bilder får jag?", a: "Det beror på uppdraget. Vi bestämmer antalet innan, så du vet vad du får." },
          { q: "Får jag använda bilderna fritt?", a: "Användningen står i avtalet: profil, webb, tryck – vi går igenom det tillsammans." },
        ],
      },
    ],
    footer: [
      { title: "Fotograf", lines: ["Studio i Exempelstad", "hej@fotograf.example"] },
      { title: "Uppdrag", lines: ["Porträtt", "Rum & arkitektur", "Varumärke & hantverk"] },
    ],
  },

  logistics: {
    nav: [
      { id: sid("logistics", "services"), label: "Transporter" },
      { id: sid("logistics", "process"), label: "Så funkar det" },
      { id: sid("logistics", "areas"), label: "Områden" },
      { id: sid("logistics", "about"), label: "Om oss" },
      { id: sid("logistics", "faq"), label: "Frågor" },
    ],
    cta: { id: sid("logistics", "quote"), label: "Offert" },
    tagline: "Lokala leveranser och företagstransporter.",
    sections: [
      {
        kind: "cards",
        key: "services",
        kicker: "Våra transporter",
        title: "Rätt bil för det du skickar",
        items: [
          { title: "Lokala leveranser", text: "Paket och mindre gods inom regionen, samma dag eller nästa.", meta: "Paket" },
          { title: "Företagstransporter", text: "Fasta körningar mellan lager, butik och kund efter överenskommelse.", meta: "Avtal" },
          { title: "Pallgods", text: "Hel- och halvpall med bakgavellyft. Mått och vikt anges i förfrågan.", meta: "Pall" },
          { title: "Flytt & möbler", text: "Två personer, filtar och spännband. Vi bär, du pekar.", meta: "Stort" },
          { title: "Byggmaterial", text: "Leverans direkt till bygget med kranbil vid behov.", meta: "Tungt" },
          { title: "Kyl & frys", text: "Temperaturstyrda bilar för livsmedel och blommor.", meta: "Kyl" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "Så funkar det",
        title: "Tre steg, inga överraskningar",
        numbered: true,
        items: [
          { title: "Berätta vad och vart", text: "Hämtning, leverans och vad som ska med – i formuläret högst upp." },
          { title: "Få en offert", text: "Ett fast pris och en tid. Vi frågar om något är oklart." },
          { title: "Vi kör", text: "Du får en länk när bilen är på väg och en signatur när det är levererat." },
        ],
      },
      {
        kind: "groups",
        key: "areas",
        kicker: "Områden",
        title: "Där vi kör",
        lead: "Exempel på upplägg – ett riktigt åkeri listar sina orter och tider här.",
        groups: [
          { title: "Stad", items: [{ title: "Innerstaden", meta: "Samma dag" }, { title: "Förorterna", meta: "Samma dag" }] },
          { title: "Region", items: [{ title: "Hela länet", meta: "Nästa dag" }, { title: "Grannlänen", meta: "1–2 dagar" }] },
          { title: "Längre", items: [{ title: "Hela landet", meta: "Efter förfrågan" }, { title: "Norden", meta: "Efter förfrågan" }] },
        ],
      },
      {
        kind: "text",
        key: "about",
        kicker: "Om oss",
        title: "Ett åkeri som svarar i telefon",
        text: [
          "Ett påhittat åkeri för den här demon. Tänk dig ett familjeföretag med egna bilar och chaufförer som känner sina kunder.",
          "Vi kör hellre färre körningar i tid än många som blir sena.",
        ],
        stats: [
          { n: "14", label: "egna fordon" },
          { n: "98 %", label: "levererat i tid (exempel)" },
          { n: "06–22", label: "körtider vardagar" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Kunder",
        title: "De som skickar med oss",
        note: "Påhittade omdömen för demon.",
        items: [
          { quote: "Varorna står i butiken innan vi öppnar. Varje morgon.", by: "Butikskund, exempel" },
          { quote: "Bra koll på pallarna och alltid en människa att prata med.", by: "Grossist, exempel" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Vanliga frågor",
        items: [
          { q: "Hur snabbt kan ni hämta?", a: "Inom staden ofta samma dag om du hör av dig före lunch." },
          { q: "Är godset försäkrat?", a: "Ja, enligt branschens villkor. Värdefullt gods kan försäkras extra." },
          { q: "Kör ni på helger?", a: "Efter överenskommelse – skriv det i förfrågan." },
        ],
      },
      {
        kind: "info",
        key: "contact",
        kicker: "Kontakt",
        title: "Hör av dig",
        lead: "Uppgifterna är påhittade – åkeriet finns inte.",
        rows: [
          { label: "Kontor", lines: ["Lastvägen 4", "123 45 Exempelstad"] },
          { label: "Bokning", lines: ["bokning@akeri.example"] },
          { label: "Öppet", lines: ["Vardagar 06–22", "Helger efter avtal"] },
        ],
      },
    ],
    footer: [
      { title: "Transport & logistik", lines: ["Lastvägen 4", "Exempelstad"] },
      { title: "Transporter", lines: ["Lokala leveranser", "Pallgods", "Företagstransporter"] },
    ],
  },

  painter: {
    nav: [
      { id: sid("painter", "compare"), label: "Före & efter" },
      { id: sid("painter", "services"), label: "Tjänster" },
      { id: sid("painter", "work"), label: "Arbeten" },
      { id: sid("painter", "how"), label: "Så arbetar vi" },
      { id: sid("painter", "about"), label: "Om oss" },
    ],
    cta: { id: sid("painter", "quote"), label: "Offert" },
    tagline: "Invändigt, fasad och tapet – med skyddat golv.",
    sections: [
      {
        kind: "cards",
        key: "services",
        kicker: "Tjänster",
        title: "Det vi gör",
        items: [
          { title: "Invändig målning", text: "Väggar, tak och snickerier. Vi spacklar, slipar och lämnar rent.", meta: "Rum för rum" },
          { title: "Fasad", text: "Tvätt, skrapning och två strykningar på trä eller puts.", meta: "Vår till höst" },
          { title: "Tapetsering", text: "Nedtagning, spackling och uppsättning med rak mönsterpassning.", meta: "Alla tapeter" },
          { title: "Snickerier & dörrar", text: "Lister, foder och dörrar som ser nya ut igen.", meta: "Detaljer" },
          { title: "Kulörråd", text: "Vi tar med provburkar och testar på din vägg i ditt ljus.", meta: "Ingår" },
          { title: "Trapphus", text: "För föreningar: planering så att alla kommer in och ut.", meta: "BRF" },
        ],
      },
      {
        kind: "cards",
        key: "work",
        kicker: "Arbeten",
        title: "Några jobb vi är stolta över",
        lead: "Påhittade uppdrag för demon – på en riktig sajt visas riktiga bilder här.",
        items: [
          { title: "Kök, ljusgrå snickerier", text: "Luckor, lister och tak i två nyanser av grått. Klart på fyra dagar.", meta: "Invändigt" },
          { title: "Trapphus, två kulörer", text: "Sex våningar med mörk sockel och ljus vägg, i etapper så alla kom in.", meta: "BRF" },
          { title: "Sommarhus, panel och knutar", text: "Falu rött på panelen, vita knutar och fönster som nya.", meta: "Fasad" },
          { title: "Sovrum med mönstertapet", text: "Gammal tapet ned, väggen spacklad och ny tapet med rak passning.", meta: "Tapet" },
        ],
      },
      {
        kind: "cards",
        key: "how",
        kicker: "Så arbetar vi",
        title: "Från första besöket till sista strykningen",
        numbered: true,
        items: [
          { title: "Vi tittar", text: "Vi kommer hem till dig, ser på rummet och pratar kulör." },
          { title: "Offert", text: "Du får en skriftlig offert med tid och vad som ingår." },
          { title: "Vi målar", text: "Vi skyddar golv och möbler, förbereder ytorna och målar." },
          { title: "Besiktning", text: "Vi går igenom resultatet tillsammans innan vi lämnar." },
        ],
      },
      {
        kind: "text",
        key: "about",
        kicker: "Om oss",
        title: "Målare med täckt golv",
        text: [
          "Ett påhittat måleri för den här demon. Tänk dig tre målare som hellre lägger en timme extra på att skydda än en minut på att städa efter.",
          "Vi arbetar i hem, föreningar och mindre butiker – och vi svarar alltid på mejl samma dag.",
        ],
        img: ["paint-after", 570],
        alt: "Vardagsrum med nymålad terrakottafärgad vägg",
        stats: [
          { n: "3", label: "målare" },
          { n: "15", label: "år i yrket (exempel)" },
          { n: "0", label: "fläckar på golvet" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Kunder",
        title: "Efter sista strykningen",
        note: "Påhittade omdömen för demon.",
        items: [
          { quote: "De täckte allt, målade två rum på tre dagar och dammsög efter sig.", by: "Kund, exempel" },
          { quote: "Kulörrådet gjorde skillnaden. Vi hade aldrig vågat välja den gröna själva.", by: "Kund, exempel" },
          { quote: "Fasaden ser ut som när huset var nytt.", by: "Kund, exempel" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Vanliga frågor",
        items: [
          { q: "Behöver vi flytta ut?", a: "Nej. Vi tar ett rum i taget och flyttar och täcker möblerna åt dig." },
          { q: "Hur lång tid tar ett rum?", a: "Oftast en till två dagar inklusive spackling och torktid." },
          { q: "Gäller ROT-avdrag?", a: "På en riktig sajt förklaras avdraget här – i demon är det bara ett exempel." },
          { q: "Vilken färg använder ni?", a: "Vattenburna färger av god kvalitet. Vi visar alltid vad vi använder." },
        ],
      },
      {
        kind: "info",
        key: "contact",
        kicker: "Kontakt",
        title: "Måleriet",
        lead: "Uppgifterna är påhittade – måleriet finns inte.",
        rows: [
          { label: "Verkstad", lines: ["Penselgränd 7", "123 45 Exempelstad"] },
          { label: "Skriv", lines: ["offert@maleri.example"] },
          { label: "Vi arbetar", lines: ["Vardagar 07–16"] },
        ],
      },
    ],
    footer: [
      { title: "Måleri", lines: ["Penselgränd 7", "Exempelstad"] },
      { title: "Tjänster", lines: ["Invändigt", "Fasad", "Tapetsering"] },
    ],
  },

  architecture: {
    nav: [
      { id: "cx-ed-huset", label: "Projekt" },
      { id: "cx-ed-rummen", label: "Rummen" },
      { id: "cx-ed-material", label: "Material" },
      { id: sid("architecture", "studio"), label: "Studion" },
      { id: sid("architecture", "projects"), label: "Fler projekt" },
    ],
    cta: { id: "cx-ed-visning", label: "Kontakta oss" },
    tagline: "Hus som följer platsen de står på.",
    sections: [
      {
        kind: "text",
        key: "studio",
        kicker: "Studion",
        title: "Vi ritar långsamt",
        text: [
          "Ett påhittat arkitektkontor för den här demon. Tänk dig fem personer i ett gammalt snickeri, med modeller på varje bord.",
          "Vi börjar alltid på platsen: hur ljuset faller, var vinden kommer ifrån, vad som redan växer där. Huset kommer sist.",
        ],
        stats: [
          { n: "5", label: "arkitekter" },
          { n: "40+", label: "byggda hus (exempel)" },
          { n: "1", label: "modell per rum" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "Arbetssätt",
        title: "Från tomt till nyckel",
        numbered: true,
        items: [
          { title: "Platsen", text: "Vi går runt tomten med dig, vid olika tider på dagen." },
          { title: "Skisser & modell", text: "Tre idéer i papper och trä, så att du kan hålla huset i handen." },
          { title: "Ritningar", text: "Bygglov, konstruktion och detaljer, samordnat med alla inblandade." },
          { title: "Bygget", text: "Vi följer bygget och svarar på frågor tills nyckeln lämnas över." },
        ],
      },
      {
        kind: "groups",
        key: "projects",
        kicker: "Fler projekt",
        title: "Ett urval",
        lead: "Påhittade projekt för demon.",
        groups: [
          {
            title: "Bostäder",
            items: [
              { title: "Huset på klippan", text: "Villa vid havet", meta: "Projekt 04" },
              { title: "Skogshuset", text: "Fritidshus i trä", meta: "Projekt 03" },
              { title: "Stadsradhus", text: "Fem radhus kring en gård", meta: "Projekt 02" },
            ],
          },
          {
            title: "Offentligt",
            items: [
              { title: "Biblioteket i parken", text: "Läsesal med takljus", meta: "Tävling" },
              { title: "Badhusets entré", text: "Ombyggnad", meta: "Projekt 01" },
            ],
          },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Innan vi börjar",
        items: [
          { q: "Hur lång tid tar ett hus?", a: "Ofta ett år från första skiss till bygglov, beroende på kommun och projekt." },
          { q: "Hjälper ni med bygglov?", a: "Ja, vi tar fram handlingarna och har kontakten med kommunen." },
          { q: "Arbetar ni med ombyggnader?", a: "Gärna. Ett gammalt hus har ofta redan svaren – vi lyssnar på det." },
        ],
      },
    ],
    footer: [
      { title: "Arkitektkontoret", lines: ["Snickarbacken 2", "Exempelstad"] },
      { title: "Skriv", lines: ["studio@arkitekt.example"] },
    ],
  },

  lighting: {
    nav: [
      { id: "cx-main-lighting", label: "Lampan" },
      { id: sid("lighting", "craft"), label: "Hantverket" },
      { id: "cx-mi-collection", label: "Kollektionen" },
      { id: sid("lighting", "stores"), label: "Butiker" },
      { id: sid("lighting", "faq"), label: "Frågor" },
    ],
    cta: { id: "cx-mi-ask", label: "Fråga oss" },
    tagline: "Lampor i stengods och linne, gjorda för hand.",
    sections: [
      {
        kind: "text",
        key: "craft",
        kicker: "Hantverket",
        title: "Varje fot dreias för hand",
        text: [
          "Linje & Ljus är ett påhittat märke för den här demon. Tänk dig en liten verkstad där foten formas på drejskivan och skärmen sys av samma person.",
          "Ingen lampa blir exakt som den andra. Glasyren rinner lite olika, linnet faller på sitt sätt – det är meningen.",
        ],
        img: ["site-lighting", 900],
        alt: "Bordslampa med stengodsfot och linneskärm",
        stats: [
          { n: "3", label: "storlekar" },
          { n: "4", label: "glasyrer" },
          { n: "2 m", label: "textilsladd" },
        ],
      },
      {
        kind: "cards",
        key: "materials",
        kicker: "Material",
        title: "Det lampan är gjord av",
        items: [
          { title: "Stengods", text: "Bränt två gånger, med matt glasyr som känns som sten.", meta: "Fot" },
          { title: "Linne", text: "Tvättat linne som släpper igenom ett varmt, mjukt ljus.", meta: "Skärm" },
          { title: "Mässing", text: "Detaljer i obehandlad mässing som mörknar fint med åren.", meta: "Detaljer" },
        ],
      },
      {
        kind: "info",
        key: "stores",
        kicker: "Butiker",
        title: "Se lampan i verkligheten",
        lead: "Påhittade butiker för demon.",
        rows: [
          { label: "Verkstaden", lines: ["Lergatan 3, Exempelstad", "Lör 11–15"] },
          { label: "Inredningsbutiker", lines: ["Utvalda butiker i tre städer", "Listan står här på en riktig sajt"] },
          { label: "Skriv", lines: ["hej@linjeochljus.example"] },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Vanliga frågor",
        items: [
          { q: "Vilken glödlampa passar?", a: "En varm LED, cirka 2700 K. Exakt sockel står på produktsidan." },
          { q: "Kan jag byta skärm senare?", a: "Ja, skärmarna säljs även separat i alla tre storlekar." },
          { q: "Hur lång är leveranstiden?", a: "Lampor i lager skickas inom några dagar, andra görs på beställning." },
        ],
      },
    ],
    footer: [
      { title: "Linje & Ljus", lines: ["Lergatan 3", "Exempelstad"] },
      { title: "Kollektionen", lines: ["Bordslampor", "Skärmar", "Glasyrer"] },
    ],
  },

  typographic: {
    nav: [
      { id: "cx-ty-program", label: "Program" },
      { id: sid("typographic", "about"), label: "Om festivalen" },
      { id: sid("typographic", "venues"), label: "Scener" },
      { id: sid("typographic", "practical"), label: "Praktiskt" },
      { id: sid("typographic", "faq"), label: "Frågor" },
    ],
    cta: { id: "cx-ty-plan", label: "Min kväll" },
    tagline: "Tre dagar om tyg, färg och rörelse.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "Om festivalen",
        title: "Höstprogrammet",
        text: [
          "En påhittad festival för den här demon: tre dagar med utställningar, samtal och scen kring textil.",
          "Varje år ett tema. I år: rött – färgen som värmer, varnar och drar blicken till sig.",
        ],
        stats: [
          { n: "3", label: "dagar" },
          { n: "7", label: "programpunkter" },
          { n: "3", label: "scener" },
        ],
      },
      {
        kind: "cards",
        key: "venues",
        kicker: "Scener",
        title: "Tre rum, tre sätt att se",
        items: [
          { title: "Stora salen", text: "Dans och föreställningar, plats för 300 sittande.", meta: "Scen" },
          { title: "Galleriet", text: "Utställningarna, öppet hela dagarna under festivalen.", meta: "Utställning" },
          { title: "Biblioteket", text: "Samtal och läsningar i ett mindre rum.", meta: "Samtal" },
        ],
      },
      {
        kind: "info",
        key: "practical",
        kicker: "Praktiskt",
        title: "Innan du kommer",
        lead: "Platsen och tiderna är påhittade.",
        rows: [
          { label: "Plats", lines: ["Textilhuset", "Vävargatan 9, Exempelstad"] },
          { label: "Öppet", lines: ["Fre 16–22", "Lör 12–22", "Sön 12–18"] },
          { label: "Tillgänglighet", lines: ["Hiss och ramp till alla scener", "Hörslinga i Stora salen"] },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Frågor",
        title: "Vanliga frågor",
        items: [
          { q: "Behöver jag boka?", a: "Spara dina punkter i Min kväll. På en riktig sajt står här hur entrén fungerar." },
          { q: "Passar det barn?", a: "Söndagens föreställning är gjord för alla åldrar." },
          { q: "Kan jag komma och gå?", a: "Ja, galleriet är öppet hela dagarna under festivalen." },
        ],
      },
    ],
    footer: [
      { title: "Höstprogrammet", lines: ["Textilhuset", "Vävargatan 9, Exempelstad"] },
      { title: "Skriv", lines: ["program@textilhuset.example"] },
    ],
  },
};

const en: Record<ConceptId, SiteData> = {
  restaurant: {
    nav: [
      { id: sid("restaurant", "dish"), label: "Tonight's dish" },
      { id: sid("restaurant", "about"), label: "About" },
      { id: sid("restaurant", "menu"), label: "Full menu" },
      { id: sid("restaurant", "events"), label: "Evenings" },
      { id: sid("restaurant", "visit"), label: "Find us" },
    ],
    cta: { id: sid("restaurant", "book"), label: "Book a table" },
    tagline: "Italian cooking with lemon, olive oil and time.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "About us",
        title: "A small kitchen, long evenings",
        text: [
          "Trattoria Limone is a made-up restaurant for this demo. Picture a neighbourhood place with an open kitchen, candlelight and pasta rolled by hand every afternoon.",
          "The menu follows the season and is short on purpose: six dishes we are proud of rather than twenty rushed ones.",
        ],
        img: ["dish-lemon-ravioli", 900],
        alt: "Lemon ravioli with butter on a light plate",
        stats: [
          { n: "38", label: "seats in the dining room" },
          { n: "6", label: "dishes on the evening menu" },
          { n: "1", label: "lemon tree in the window" },
        ],
      },
      {
        kind: "groups",
        key: "menu",
        kicker: "Menu (example)",
        title: "The full menu",
        lead: "Prices are made up. Ask about allergies – we adapt as best we can.",
        groups: [
          {
            title: "Antipasti",
            items: [
              { title: "Bruschetta al pomodoro", text: "Grilled sourdough, tomato, basil", meta: "95 kr" },
              { title: "Burrata", text: "Creamy burrata, lemon oil, toasted almonds", meta: "145 kr" },
              { title: "Olives & focaccia", text: "Marinated olives, fresh focaccia", meta: "65 kr" },
            ],
          },
          {
            title: "Primi & secondi",
            items: [
              { title: "Ravioli al limone", text: "Handmade pasta, ricotta, lemon butter", meta: "215 kr" },
              { title: "Risotto ai funghi", text: "Carnaroli rice, mushrooms, parmesan", meta: "205 kr" },
              { title: "Branzino al limone", text: "Sea bass, lemon, capers, potatoes", meta: "265 kr" },
            ],
          },
          {
            title: "Dolci",
            items: [
              { title: "Tiramisù", text: "Mascarpone, espresso, cocoa", meta: "105 kr" },
              { title: "Sorbetto al limone", text: "Lemon sorbet with mint", meta: "75 kr" },
            ],
          },
          {
            title: "To drink",
            items: [
              { title: "House white / red", text: "By the glass from Sicily and Piedmont", meta: "115 kr" },
              { title: "Limonata", text: "Pressed lemon, rosemary, sparkling", meta: "55 kr" },
              { title: "Espresso", text: "Dark roast, short and sweet", meta: "35 kr" },
            ],
          },
        ],
      },
      {
        kind: "gallery",
        key: "gallery",
        kicker: "From the kitchen",
        title: "What goes out through the hatch",
        items: [
          { img: ["dish-bruschetta", 480], alt: "Bruschetta with tomato and basil", caption: "Bruschetta" },
          { img: ["dish-burrata", 480], alt: "Burrata with olive oil", caption: "Burrata" },
          { img: ["dish-mushroom-risotto", 480], alt: "Mushroom risotto in a deep plate", caption: "Risotto ai funghi" },
          { img: ["dish-lemon-seabass", 480], alt: "Sea bass with lemon", caption: "Branzino" },
          { img: ["dish-tiramisu", 480], alt: "Tiramisù in a glass", caption: "Tiramisù" },
          { img: ["dish-lemon-ravioli", 480], alt: "Lemon ravioli", caption: "Ravioli al limone" },
        ],
      },
      {
        kind: "cards",
        key: "events",
        kicker: "Evenings",
        title: "More than a dinner",
        items: [
          { title: "Pasta school", text: "Tuesdays: learn to roll, cut and fill pasta. You eat what you make.", meta: "Tuesdays 5 pm" },
          { title: "Wine night", text: "Four glasses, four small plates and the story behind each grape.", meta: "First Thursday of the month" },
          { title: "The whole room", text: "Birthday or kick-off? Up to 38 guests with a menu of your own.", meta: "On request" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Guests",
        title: "What people say",
        note: "Made-up reviews for the demo.",
        items: [
          { quote: "Lemon ravioli I still think about. And the staff remembered our name.", by: "Guest, example" },
          { quote: "Perfect for a long Tuesday dinner. Calm, warm and unhurried.", by: "Guest, example" },
          { quote: "Pasta school was the highlight – we went home with dough under our nails.", by: "Guest, example" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Good to know",
        items: [
          { q: "Can you cook gluten-free?", a: "Most dishes can be adapted. Mention it in your booking and the kitchen will prepare." },
          { q: "Are children welcome?", a: "Of course. We have high chairs and a simple pasta for small guests." },
          { q: "Can I come without a booking?", a: "We keep a few seats at the bar for walk-ins." },
          { q: "Do you do takeaway?", a: "Pasta and tiramisù can be picked up – order at the counter." },
        ],
      },
      {
        kind: "info",
        key: "visit",
        kicker: "Find us",
        title: "Opening hours and address",
        lead: "The address is made up – the restaurant does not exist.",
        rows: [
          { label: "Open", lines: ["Tue–Thu 5–10 pm", "Fri–Sat 5–11 pm", "Sun–Mon closed"] },
          { label: "Address", lines: ["12 Lemon Street", "Sample Town"] },
          { label: "Write to us", lines: ["table@trattoria-limone.example"] },
        ],
      },
    ],
    footer: [
      { title: "Trattoria Limone", lines: ["12 Lemon Street", "Sample Town"] },
      { title: "Open", lines: ["Tue–Thu 5–10 pm", "Fri–Sat 5–11 pm"] },
    ],
  },

  photographer: {
    nav: [
      { id: sid("photographer", "work"), label: "Portfolio" },
      { id: sid("photographer", "about"), label: "About" },
      { id: sid("photographer", "services"), label: "Work" },
      { id: sid("photographer", "process"), label: "How it works" },
      { id: sid("photographer", "faq"), label: "Questions" },
    ],
    cta: { id: sid("photographer", "book"), label: "Book" },
    tagline: "Portraits, spaces and craft in natural light.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "About me",
        title: "I wait for the light",
        text: [
          "A made-up photographer for this demo – the person does not exist. Picture someone who would rather arrive early than late, and who takes the picture when you stop posing.",
          "I photograph people, spaces and craft, mostly in natural light. The result looks like you – not like a catalogue.",
        ],
        img: ["photo-brand-craft", 627],
        alt: "Hands planing a wooden board in a joinery workshop",
        stats: [
          { n: "12", label: "years behind the camera" },
          { n: "3", label: "kinds of work" },
          { n: "48 h", label: "to the first selection" },
        ],
      },
      {
        kind: "cards",
        key: "services",
        kicker: "Work",
        title: "What I photograph",
        items: [
          { title: "Portraits", text: "For you, your profile or your team. Outdoors or in a room with good light.", meta: "1–2 hours" },
          { title: "Spaces & architecture", text: "Homes, shops and offices – photographed so you want to step in.", meta: "Half or full day" },
          { title: "Brand & craft", text: "Hands, tools, materials. Pictures that show how something is made.", meta: "By arrangement" },
          { title: "Small events", text: "Launches and dinners, discreetly and without a flash in your face.", meta: "From 2 hours" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "How it works",
        title: "From the first e-mail to finished pictures",
        numbered: true,
        items: [
          { title: "We talk", text: "What the pictures are for and the feeling you want." },
          { title: "The plan", text: "Place, time of day and what to bring. You get it all in writing." },
          { title: "The shoot", text: "An easy pace. I guide you; you don't need to know how to pose." },
          { title: "Selection & delivery", text: "A first selection within 48 hours, finished pictures in a gallery." },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Clients",
        title: "After the shoot",
        note: "Made-up reviews for the demo.",
        items: [
          { quote: "The first time I like a portrait of myself.", by: "Client, example" },
          { quote: "The pictures of the workshop look the way it feels to stand there.", by: "Client, example" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Frequent questions",
        items: [
          { q: "What if it rains?", a: "We move inside or pick another day – the light after rain is often the best." },
          { q: "How many pictures do I get?", a: "It depends on the job. We agree on the number beforehand, so you know what you get." },
          { q: "Can I use the pictures freely?", a: "The use is in the agreement: profile, web, print – we go through it together." },
        ],
      },
    ],
    footer: [
      { title: "Photographer", lines: ["Studio in Sample Town", "hello@photographer.example"] },
      { title: "Work", lines: ["Portraits", "Spaces & architecture", "Brand & craft"] },
    ],
  },

  logistics: {
    nav: [
      { id: sid("logistics", "services"), label: "Services" },
      { id: sid("logistics", "process"), label: "How it works" },
      { id: sid("logistics", "areas"), label: "Areas" },
      { id: sid("logistics", "about"), label: "About" },
      { id: sid("logistics", "faq"), label: "Questions" },
    ],
    cta: { id: sid("logistics", "quote"), label: "Quote" },
    tagline: "Local deliveries and business transport.",
    sections: [
      {
        kind: "cards",
        key: "services",
        kicker: "Our services",
        title: "The right vehicle for what you send",
        items: [
          { title: "Local deliveries", text: "Parcels and smaller goods within the region, same or next day.", meta: "Parcels" },
          { title: "Business transport", text: "Regular runs between warehouse, shop and customer by agreement.", meta: "Contract" },
          { title: "Pallets", text: "Full and half pallets with a tail lift. Size and weight go in the request.", meta: "Pallets" },
          { title: "Removals & furniture", text: "Two people, blankets and straps. We carry, you point.", meta: "Large" },
          { title: "Building materials", text: "Delivered straight to the site, with a crane truck if needed.", meta: "Heavy" },
          { title: "Chilled & frozen", text: "Temperature-controlled vans for food and flowers.", meta: "Chilled" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "How it works",
        title: "Three steps, no surprises",
        numbered: true,
        items: [
          { title: "Tell us what and where", text: "Collection, delivery and what is going – in the form at the top." },
          { title: "Get a quote", text: "A fixed price and a time. We ask if anything is unclear." },
          { title: "We drive", text: "You get a link when the van is on its way and a signature on delivery." },
        ],
      },
      {
        kind: "groups",
        key: "areas",
        kicker: "Areas",
        title: "Where we drive",
        lead: "A sample set-up – a real haulier lists its towns and times here.",
        groups: [
          { title: "City", items: [{ title: "City centre", meta: "Same day" }, { title: "Suburbs", meta: "Same day" }] },
          { title: "Region", items: [{ title: "The whole county", meta: "Next day" }, { title: "Neighbouring counties", meta: "1–2 days" }] },
          { title: "Further", items: [{ title: "Nationwide", meta: "On request" }, { title: "The Nordics", meta: "On request" }] },
        ],
      },
      {
        kind: "text",
        key: "about",
        kicker: "About us",
        title: "A haulier that picks up the phone",
        text: [
          "A made-up haulier for this demo. Picture a family business with its own vans and drivers who know their customers.",
          "We would rather run fewer jobs on time than many that end up late.",
        ],
        stats: [
          { n: "14", label: "vehicles of our own" },
          { n: "98 %", label: "delivered on time (example)" },
          { n: "6–22", label: "driving hours on weekdays" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Customers",
        title: "The people who ship with us",
        note: "Made-up reviews for the demo.",
        items: [
          { quote: "The goods are in the shop before we open. Every morning.", by: "Retail customer, example" },
          { quote: "Good track of the pallets and always a person to talk to.", by: "Wholesaler, example" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Frequent questions",
        items: [
          { q: "How soon can you collect?", a: "Within the city often the same day, if you get in touch before lunch." },
          { q: "Are the goods insured?", a: "Yes, under the standard industry terms. Valuable goods can be insured extra." },
          { q: "Do you drive at weekends?", a: "By agreement – mention it in the request." },
        ],
      },
      {
        kind: "info",
        key: "contact",
        kicker: "Contact",
        title: "Get in touch",
        lead: "The details are made up – the haulier does not exist.",
        rows: [
          { label: "Office", lines: ["4 Cargo Road", "Sample Town"] },
          { label: "Bookings", lines: ["booking@haulier.example"] },
          { label: "Open", lines: ["Weekdays 6 am–10 pm", "Weekends by agreement"] },
        ],
      },
    ],
    footer: [
      { title: "Transport & logistics", lines: ["4 Cargo Road", "Sample Town"] },
      { title: "Services", lines: ["Local deliveries", "Pallets", "Business transport"] },
    ],
  },

  painter: {
    nav: [
      { id: sid("painter", "compare"), label: "Before & after" },
      { id: sid("painter", "services"), label: "Services" },
      { id: sid("painter", "work"), label: "Work" },
      { id: sid("painter", "how"), label: "How we work" },
      { id: sid("painter", "about"), label: "About" },
    ],
    cta: { id: sid("painter", "quote"), label: "Quote" },
    tagline: "Interiors, exteriors and wallpaper – with the floor covered.",
    sections: [
      {
        kind: "cards",
        key: "services",
        kicker: "Services",
        title: "What we do",
        items: [
          { title: "Interior painting", text: "Walls, ceilings and woodwork. We fill, sand and leave it clean.", meta: "Room by room" },
          { title: "Exteriors", text: "Washing, scraping and two coats on timber or render.", meta: "Spring to autumn" },
          { title: "Wallpapering", text: "Stripping, filling and hanging with a straight pattern match.", meta: "Any paper" },
          { title: "Woodwork & doors", text: "Skirtings, architraves and doors that look new again.", meta: "Details" },
          { title: "Colour advice", text: "We bring sample pots and test on your wall in your light.", meta: "Included" },
          { title: "Stairwells", text: "For housing associations: planned so everyone can get in and out.", meta: "Blocks" },
        ],
      },
      {
        kind: "cards",
        key: "work",
        kicker: "Work",
        title: "A few jobs we are proud of",
        lead: "Made-up jobs for the demo – a real site shows real pictures here.",
        items: [
          { title: "Kitchen, pale grey woodwork", text: "Doors, skirtings and ceiling in two shades of grey. Done in four days.", meta: "Interior" },
          { title: "Stairwell, two colours", text: "Six floors with a dark base and a light wall, in stages so everyone could get in.", meta: "Block" },
          { title: "Summer house, panels and corners", text: "Falu red on the panels, white corners and windows like new.", meta: "Exterior" },
          { title: "Bedroom with patterned paper", text: "Old paper off, the wall filled and new paper with a straight match.", meta: "Wallpaper" },
        ],
      },
      {
        kind: "cards",
        key: "how",
        kicker: "How we work",
        title: "From the first visit to the last coat",
        numbered: true,
        items: [
          { title: "We look", text: "We come to your home, look at the room and talk colours." },
          { title: "Quote", text: "You get a written quote with the time and what is included." },
          { title: "We paint", text: "We cover floors and furniture, prepare the surfaces and paint." },
          { title: "Walk-through", text: "We go through the result together before we leave." },
        ],
      },
      {
        kind: "text",
        key: "about",
        kicker: "About us",
        title: "Painters who cover the floor",
        text: [
          "A made-up painting firm for this demo. Picture three painters who would rather spend an extra hour protecting than a minute cleaning up.",
          "We work in homes, housing associations and small shops – and we always answer e-mails the same day.",
        ],
        img: ["paint-after", 570],
        alt: "Living room with a freshly painted terracotta wall",
        stats: [
          { n: "3", label: "painters" },
          { n: "15", label: "years in the trade (example)" },
          { n: "0", label: "stains on the floor" },
        ],
      },
      {
        kind: "quotes",
        key: "quotes",
        kicker: "Clients",
        title: "After the last coat",
        note: "Made-up reviews for the demo.",
        items: [
          { quote: "They covered everything, painted two rooms in three days and vacuumed after themselves.", by: "Client, example" },
          { quote: "The colour advice made the difference. We would never have dared the green on our own.", by: "Client, example" },
          { quote: "The facade looks like it did when the house was new.", by: "Client, example" },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Frequent questions",
        items: [
          { q: "Do we need to move out?", a: "No. We take one room at a time and move and cover the furniture for you." },
          { q: "How long does a room take?", a: "Usually one or two days including filling and drying time." },
          { q: "Is there a tax deduction?", a: "A real site explains the deduction here – in the demo it is only an example." },
          { q: "Which paint do you use?", a: "Good-quality water-based paints. We always show you what we use." },
        ],
      },
      {
        kind: "info",
        key: "contact",
        kicker: "Contact",
        title: "The workshop",
        lead: "The details are made up – the business does not exist.",
        rows: [
          { label: "Workshop", lines: ["7 Brush Lane", "Sample Town"] },
          { label: "Write", lines: ["quote@painter.example"] },
          { label: "We work", lines: ["Weekdays 7 am–4 pm"] },
        ],
      },
    ],
    footer: [
      { title: "Painting & decorating", lines: ["7 Brush Lane", "Sample Town"] },
      { title: "Services", lines: ["Interiors", "Exteriors", "Wallpapering"] },
    ],
  },

  architecture: {
    nav: [
      { id: "cx-ed-huset", label: "Project" },
      { id: "cx-ed-rummen", label: "The rooms" },
      { id: "cx-ed-material", label: "Materials" },
      { id: sid("architecture", "studio"), label: "Studio" },
      { id: sid("architecture", "projects"), label: "More projects" },
    ],
    cta: { id: "cx-ed-visning", label: "Contact us" },
    tagline: "Houses that follow the place they stand on.",
    sections: [
      {
        kind: "text",
        key: "studio",
        kicker: "The studio",
        title: "We draw slowly",
        text: [
          "A made-up architecture studio for this demo. Picture five people in an old joinery, with models on every desk.",
          "We always start on site: how the light falls, where the wind comes from, what already grows there. The house comes last.",
        ],
        stats: [
          { n: "5", label: "architects" },
          { n: "40+", label: "houses built (example)" },
          { n: "1", label: "model per room" },
        ],
      },
      {
        kind: "cards",
        key: "process",
        kicker: "How we work",
        title: "From plot to keys",
        numbered: true,
        items: [
          { title: "The site", text: "We walk the plot with you, at different times of day." },
          { title: "Sketches & model", text: "Three ideas in paper and wood, so you can hold the house in your hand." },
          { title: "Drawings", text: "Permits, structure and details, coordinated with everyone involved." },
          { title: "The build", text: "We follow the build and answer questions until the keys are handed over." },
        ],
      },
      {
        kind: "groups",
        key: "projects",
        kicker: "More projects",
        title: "A selection",
        lead: "Made-up projects for the demo.",
        groups: [
          {
            title: "Homes",
            items: [
              { title: "The house on the cliff", text: "Villa by the sea", meta: "Project 04" },
              { title: "The forest house", text: "Timber summer house", meta: "Project 03" },
              { title: "City terraces", text: "Five terraced houses around a yard", meta: "Project 02" },
            ],
          },
          {
            title: "Public",
            items: [
              { title: "The library in the park", text: "Reading room with roof lights", meta: "Competition" },
              { title: "The bathhouse entrance", text: "Conversion", meta: "Project 01" },
            ],
          },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Before we start",
        items: [
          { q: "How long does a house take?", a: "Often a year from the first sketch to the permit, depending on the council and project." },
          { q: "Do you help with permits?", a: "Yes, we prepare the documents and handle the contact with the council." },
          { q: "Do you work on conversions?", a: "Gladly. An old house often has the answers already – we listen to it." },
        ],
      },
    ],
    footer: [
      { title: "The Architecture Studio", lines: ["2 Joiner's Hill", "Sample Town"] },
      { title: "Write", lines: ["studio@architect.example"] },
    ],
  },

  lighting: {
    nav: [
      { id: "cx-main-lighting", label: "The lamp" },
      { id: sid("lighting", "craft"), label: "The craft" },
      { id: "cx-mi-collection", label: "Collection" },
      { id: sid("lighting", "stores"), label: "Stores" },
      { id: sid("lighting", "faq"), label: "Questions" },
    ],
    cta: { id: "cx-mi-ask", label: "Ask us" },
    tagline: "Stoneware and linen lamps, made by hand.",
    sections: [
      {
        kind: "text",
        key: "craft",
        kicker: "The craft",
        title: "Every base thrown by hand",
        text: [
          "Line & Light is a made-up brand for this demo. Picture a small workshop where the base is thrown on the wheel and the shade sewn by the same person.",
          "No two lamps are exactly alike. The glaze runs a little differently, the linen falls its own way – that is the point.",
        ],
        img: ["site-lighting", 900],
        alt: "Table lamp with a stoneware base and a linen shade",
        stats: [
          { n: "3", label: "sizes" },
          { n: "4", label: "glazes" },
          { n: "2 m", label: "textile cord" },
        ],
      },
      {
        kind: "cards",
        key: "materials",
        kicker: "Materials",
        title: "What the lamp is made of",
        items: [
          { title: "Stoneware", text: "Fired twice, with a matt glaze that feels like stone.", meta: "Base" },
          { title: "Linen", text: "Washed linen that lets through a warm, soft light.", meta: "Shade" },
          { title: "Brass", text: "Untreated brass details that darken nicely over the years.", meta: "Details" },
        ],
      },
      {
        kind: "info",
        key: "stores",
        kicker: "Stores",
        title: "See the lamp in real life",
        lead: "Made-up stores for the demo.",
        rows: [
          { label: "The workshop", lines: ["3 Clay Street, Sample Town", "Sat 11 am–3 pm"] },
          { label: "Interior shops", lines: ["Selected shops in three cities", "A real site lists them here"] },
          { label: "Write", lines: ["hello@lineandlight.example"] },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Frequent questions",
        items: [
          { q: "Which bulb fits?", a: "A warm LED, around 2700 K. The exact socket is on the product page." },
          { q: "Can I change the shade later?", a: "Yes, the shades are also sold separately in all three sizes." },
          { q: "How long is delivery?", a: "Lamps in stock ship within a few days; others are made to order." },
        ],
      },
    ],
    footer: [
      { title: "Line & Light", lines: ["3 Clay Street", "Sample Town"] },
      { title: "Collection", lines: ["Table lamps", "Shades", "Glazes"] },
    ],
  },

  typographic: {
    nav: [
      { id: "cx-ty-program", label: "Programme" },
      { id: sid("typographic", "about"), label: "About" },
      { id: sid("typographic", "venues"), label: "Venues" },
      { id: sid("typographic", "practical"), label: "Practical" },
      { id: sid("typographic", "faq"), label: "Questions" },
    ],
    cta: { id: "cx-ty-plan", label: "My evening" },
    tagline: "Three days about fabric, colour and movement.",
    sections: [
      {
        kind: "text",
        key: "about",
        kicker: "About the festival",
        title: "The Autumn Programme",
        text: [
          "A made-up festival for this demo: three days of exhibitions, talks and performance around textile.",
          "A theme every year. This year: red – the colour that warms, warns and draws the eye.",
        ],
        stats: [
          { n: "3", label: "days" },
          { n: "7", label: "programme items" },
          { n: "3", label: "venues" },
        ],
      },
      {
        kind: "cards",
        key: "venues",
        kicker: "Venues",
        title: "Three rooms, three ways of seeing",
        items: [
          { title: "The Great Hall", text: "Dance and performance, seating for 300.", meta: "Stage" },
          { title: "The Gallery", text: "The exhibitions, open all day during the festival.", meta: "Exhibition" },
          { title: "The Library", text: "Talks and readings in a smaller room.", meta: "Talks" },
        ],
      },
      {
        kind: "info",
        key: "practical",
        kicker: "Practical",
        title: "Before you come",
        lead: "The place and times are made up.",
        rows: [
          { label: "Where", lines: ["The Textile House", "9 Weaver Street, Sample Town"] },
          { label: "Open", lines: ["Fri 4–10 pm", "Sat 12–10 pm", "Sun 12–6 pm"] },
          { label: "Access", lines: ["Lift and ramp to every venue", "Hearing loop in the Great Hall"] },
        ],
      },
      {
        kind: "faq",
        key: "faq",
        kicker: "Questions",
        title: "Frequent questions",
        items: [
          { q: "Do I need to book?", a: "Save your items in My evening. A real site explains how entry works here." },
          { q: "Is it suitable for children?", a: "Sunday's performance is made for all ages." },
          { q: "Can I come and go?", a: "Yes, the gallery is open all day during the festival." },
        ],
      },
    ],
    footer: [
      { title: "The Autumn Programme", lines: ["The Textile House", "9 Weaver Street, Sample Town"] },
      { title: "Write", lines: ["programme@textilehouse.example"] },
    ],
  },
};

export const SITES: Record<Lang, Record<ConceptId, SiteData>> = { sv, en };
