import type { GuideLang } from "./types";

/** Texts of the visitor's page itself (a place's own texts are in its data file). */
export const GUIDE_UI: Record<
  GuideLang,
  {
    langName: string;
    language: string;
    demo: string;
    demoNote: string;
    pointOf: (n: number, total: number) => string;
    listen: string;
    pause: string;
    resume: string;
    stop: string;
    recorded: string;
    noVoice: string;
    noSpeech: string;
    next: string;
    prev: string;
    start: string;
    startWalk: string;
    toStart: string;
    route: string;
    routeSeen: (seen: number, total: number) => string;
    seen: string;
    here: string;
    hours: string;
    drawing: string;
    done: string;
    again: string;
    poweredBy: string;
    loading: string;
    missingTitle: string;
    missingText: string;
    errorText: string;
    pointMissing: string;
  }
> = {
  sv: {
    langName: "Svenska",
    language: "Språk",
    demo: "Exempelplats",
    demoNote: "Det här är en påhittad plats som visar hur MambyLy Guide fungerar.",
    pointOf: (n, total) => `Punkt ${n} av ${total}`,
    listen: "Lyssna",
    pause: "Pausa",
    resume: "Fortsätt",
    stop: "Stopp",
    recorded: "Inspelad röst",
    noVoice: "Din telefon har ingen svensk röst installerad. Läs texten ovan – eller välj ett annat språk.",
    noSpeech: "Den här webbläsaren kan inte läsa upp texter. Texten ovan går att läsa.",
    next: "Nästa punkt",
    prev: "Föregående",
    start: "Börja här",
    startWalk: "Börja rundturen",
    toStart: "Till början",
    route: "Rundturen",
    routeSeen: (seen, total) => `${seen} av ${total} besökta`,
    seen: "Besökt",
    here: "Du är här",
    hours: "Öppettider",
    drawing: "Teckning",
    done: "Du har varit vid alla punkter. Tack för besöket!",
    again: "Börja om",
    poweredBy: "Drivs av MambyLy Solutions",
    loading: "Laddar…",
    missingTitle: "Platsen hittades inte",
    missingText: "Länken verkar vara fel. Skanna skylten igen, eller fråga personalen.",
    errorText: "Något gick fel när sidan skulle öppnas. Försök igen om en stund.",
    pointMissing: "Den här punkten finns inte på rundturen.",
  },
  en: {
    langName: "English",
    language: "Language",
    demo: "Example place",
    demoNote: "This is a made-up place that shows how MambyLy Guide works.",
    pointOf: (n, total) => `Point ${n} of ${total}`,
    listen: "Listen",
    pause: "Pause",
    resume: "Resume",
    stop: "Stop",
    recorded: "Recorded voice",
    noVoice: "Your phone has no English voice installed. Read the text above – or pick another language.",
    noSpeech: "This browser cannot read texts aloud. The text above can be read.",
    next: "Next point",
    prev: "Previous",
    start: "Start here",
    startWalk: "Start the walk",
    toStart: "To the start",
    route: "The walk",
    routeSeen: (seen, total) => `${seen} of ${total} visited`,
    seen: "Visited",
    here: "You are here",
    hours: "Opening hours",
    drawing: "Drawing",
    done: "You have been to every point. Thank you for visiting!",
    again: "Start over",
    poweredBy: "Powered by MambyLy Solutions",
    loading: "Loading…",
    missingTitle: "Place not found",
    missingText: "The link seems to be wrong. Scan the sign again, or ask the staff.",
    errorText: "Something went wrong opening the page. Please try again in a moment.",
    pointMissing: "This point is not on the walk.",
  },
  de: {
    langName: "Deutsch",
    language: "Sprache",
    demo: "Beispielort",
    demoNote: "Dies ist ein erfundener Ort, der zeigt, wie MambyLy Guide funktioniert.",
    pointOf: (n, total) => `Station ${n} von ${total}`,
    listen: "Anhören",
    pause: "Pause",
    resume: "Weiter",
    stop: "Stopp",
    recorded: "Aufgenommene Stimme",
    noVoice: "Auf Ihrem Telefon ist keine deutsche Stimme installiert. Lesen Sie den Text oben – oder wählen Sie eine andere Sprache.",
    noSpeech: "Dieser Browser kann Texte nicht vorlesen. Der Text oben lässt sich lesen.",
    next: "Nächste Station",
    prev: "Zurück",
    start: "Hier beginnen",
    startWalk: "Rundgang beginnen",
    toStart: "Zum Anfang",
    route: "Der Rundgang",
    routeSeen: (seen, total) => `${seen} von ${total} besucht`,
    seen: "Besucht",
    here: "Sie sind hier",
    hours: "Öffnungszeiten",
    drawing: "Zeichnung",
    done: "Sie waren an allen Stationen. Danke für Ihren Besuch!",
    again: "Von vorn beginnen",
    poweredBy: "Von MambyLy Solutions",
    loading: "Lädt…",
    missingTitle: "Ort nicht gefunden",
    missingText: "Der Link scheint falsch zu sein. Scannen Sie das Schild erneut oder fragen Sie das Personal.",
    errorText: "Beim Öffnen der Seite ist etwas schiefgegangen. Bitte versuchen Sie es gleich noch einmal.",
    pointMissing: "Diese Station gehört nicht zum Rundgang.",
  },
};
