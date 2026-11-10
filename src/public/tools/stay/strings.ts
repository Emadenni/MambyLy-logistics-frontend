import type { StayLang } from "./types";

/** Texts of the guest page itself (the house's own texts are in its data file). */
export const STAY_UI: Record<StayLang, {
  langName: string;
  language: string;
  welcomeFrom: string;
  arrival: string;
  wifi: string;
  network: string;
  password: string;
  copy: string;
  copied: string;
  checkIn: string;
  checkOut: string;
  allAbout: Record<"stuga" | "city", string>;
  ask: string;
  askLabel: string;
  chatTitle: string;
  chatIntro: string;
  suggested: string;
  send: string;
  close: string;
  typing: string;
  writeHost: string;
  reviewTitle: string;
  reviewText: string;
  reviewButton: string;
  reviewDemo: string;
  textHost: string;
  orCall: string;
  smsBody: string;
  missingTitle: string;
  missingText: string;
  errorText: string;
  loading: string;
  demo: string;
  poweredBy: string;
}> = {
  sv: {
    langName: "Svenska",
    language: "Språk",
    welcomeFrom: "Hälsning från din värd",
    arrival: "Ankomst",
    wifi: "Wi-Fi",
    network: "Nätverk",
    password: "Lösenord",
    copy: "Kopiera",
    copied: "Kopierat",
    checkIn: "Incheckning",
    checkOut: "Utcheckning",
    allAbout: { stuga: "Allt om stugan", city: "Allt om lägenheten" },
    ask: "Fråga vad som helst…",
    askLabel: "Ställ en fråga om boendet",
    chatTitle: "Fråga om boendet",
    chatIntro: "Jag svarar utifrån värdens information om boendet, dygnet runt. Hittar jag inte svaret kan du skriva direkt till värden.",
    suggested: "Vanliga frågor",
    send: "Skicka",
    close: "Stäng",
    typing: "Skriver…",
    writeHost: "Skriv till värden",
    reviewTitle: "Trivdes du?",
    reviewText: "Berätta gärna för andra hur du hade det. Det tar en minut och betyder mycket.",
    reviewButton: "Skriv en recension",
    reviewDemo: "Demo: här öppnas värdens egen recensionssida.",
    textHost: "Skicka sms till {name}",
    orCall: "eller ring",
    smsBody: "Hej {name}! Jag bor i {house} och har en fråga: ",
    missingTitle: "Länken fungerar inte",
    missingText: "Skanna skylten i boendet igen, eller kontakta värden.",
    errorText: "Det gick inte att ladda boendets information. Försök igen om en stund.",
    loading: "Hämtar boendets information…",
    demo: "Demo – påhittat boende",
    poweredBy: "Med MambyLy Stay",
  },
  en: {
    langName: "English",
    language: "Language",
    welcomeFrom: "A note from your host",
    arrival: "Arrival",
    wifi: "Wi-Fi",
    network: "Network",
    password: "Password",
    copy: "Copy",
    copied: "Copied",
    checkIn: "Check-in",
    checkOut: "Check-out",
    allAbout: { stuga: "All about the cottage", city: "All about the flat" },
    ask: "Ask anything…",
    askLabel: "Ask a question about the stay",
    chatTitle: "Ask about the stay",
    chatIntro: "I answer from the host's information about the stay, around the clock. If I can't find the answer you can write to the host directly.",
    suggested: "Common questions",
    send: "Send",
    close: "Close",
    typing: "Typing…",
    writeHost: "Write to the host",
    reviewTitle: "Did you enjoy your stay?",
    reviewText: "Tell others how it was. It takes a minute and means a lot.",
    reviewButton: "Write a review",
    reviewDemo: "Demo: this is where the host's own review page opens.",
    textHost: "Text {name}",
    orCall: "or call",
    smsBody: "Hi {name}! I'm staying at {house} and have a question: ",
    missingTitle: "This link doesn't work",
    missingText: "Scan the sign in the house again, or contact your host.",
    errorText: "The stay's information could not be loaded. Please try again in a moment.",
    loading: "Loading the stay's information…",
    demo: "Demo – a made-up stay",
    poweredBy: "With MambyLy Stay",
  },
  de: {
    langName: "Deutsch",
    language: "Sprache",
    welcomeFrom: "Ein Gruß von Ihrem Gastgeber",
    arrival: "Ankunft",
    wifi: "WLAN",
    network: "Netzwerk",
    password: "Passwort",
    copy: "Kopieren",
    copied: "Kopiert",
    checkIn: "Anreise",
    checkOut: "Abreise",
    allAbout: { stuga: "Alles über das Häuschen", city: "Alles über die Wohnung" },
    ask: "Fragen Sie etwas…",
    askLabel: "Eine Frage zur Unterkunft stellen",
    chatTitle: "Fragen zur Unterkunft",
    chatIntro: "Ich antworte rund um die Uhr anhand der Informationen des Gastgebers. Finde ich keine Antwort, können Sie dem Gastgeber direkt schreiben.",
    suggested: "Häufige Fragen",
    send: "Senden",
    close: "Schließen",
    typing: "Schreibt…",
    writeHost: "Dem Gastgeber schreiben",
    reviewTitle: "Hat es Ihnen gefallen?",
    reviewText: "Erzählen Sie anderen gern, wie es war. Das dauert eine Minute und bedeutet viel.",
    reviewButton: "Bewertung schreiben",
    reviewDemo: "Demo: Hier öffnet sich die Bewertungsseite des Gastgebers.",
    textHost: "SMS an {name}",
    orCall: "oder anrufen",
    smsBody: "Hallo {name}! Ich wohne in {house} und habe eine Frage: ",
    missingTitle: "Dieser Link funktioniert nicht",
    missingText: "Scannen Sie das Schild in der Unterkunft erneut oder kontaktieren Sie Ihren Gastgeber.",
    errorText: "Die Informationen konnten nicht geladen werden. Bitte versuchen Sie es gleich noch einmal.",
    loading: "Informationen werden geladen…",
    demo: "Demo – eine erfundene Unterkunft",
    poweredBy: "Mit MambyLy Stay",
  },
};
