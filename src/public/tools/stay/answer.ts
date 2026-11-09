import type { Answer, House, StayLang, Texts } from "./types";

/**
 * The chat's one way of answering: everything the page knows about replies goes through
 * `answer()`. Today it matches the guest's words against the house's prepared answers (Swedish,
 * English, German; accents, case and punctuation ignored; synonyms shared by every house). It is
 * async on purpose: an AI answer drawn from the same manual can replace the inside of this function
 * later without the page changing.
 */
export type Reply = { kind: "answer"; id: string; text: string } | { kind: "unknown"; text: string };

/** Words that mean the same thing, across the three languages; the first one names the group. */
const SYNONYMS: string[][] = [
  ["wifi", "wi fi", "wlan", "internet", "natverk", "network", "netz", "uppkoppling", "router"],
  ["losenord", "password", "passwort", "kod", "code", "kennwort", "pin"],
  ["nyckel", "nycklar", "key", "keys", "schlussel", "nyckelbox", "nyckelskap", "keybox", "lockbox", "schlusselbox", "kodlas"],
  ["incheckning", "checka in", "check in", "checkin", "ankomst", "arrival", "anreise", "ankunft", "anlanda", "arrive"],
  ["utcheckning", "checka ut", "check out", "checkout", "avresa", "departure", "abreise", "lamna", "leave", "auschecken"],
  ["bastu", "sauna", "basta"],
  ["kamin", "eldstad", "brasa", "oppen spis", "fireplace", "stove", "kamin ", "ofen", "feuer", "elda", "fire", "heizen"],
  ["ved", "vedbod", "firewood", "wood", "brennholz", "holz", "tandning", "kindling"],
  ["bada", "bad", "badplats", "swim", "swimming", "schwimmen", "baden", "brygga", "jetty", "steg"],
  ["kanot", "canoe", "kayak", "kajak", "paddla", "paddle", "boot", "boat", "bat", "flytvast", "life jacket", "schwimmweste"],
  ["sopor", "soporna", "avfall", "sortera", "atervinning", "kallsortering", "trash", "garbage", "rubbish", "recycling", "bin", "mull", "abfall", "recycling", "pant"],
  ["parkering", "parkera", "parking", "park", "car", "bil", "auto", "parkplatz", "parken", "laddning", "charger", "laden"],
  ["port", "portkod", "entre", "door", "entrance", "front door", "tur", "haustur", "eingang", "dorr"],
  ["vaning", "trappa", "floor", "stock", "etage", "hiss", "lift", "elevator", "aufzug", "lagenhet", "apartment", "wohnung", "nummer", "number"],
  ["tvattstuga", "tvatt", "tvatta", "laundry", "washing", "wash", "waschkuche", "waschen", "wasche", "torktumlare", "dryer", "trockner", "boka tvatt"],
  ["buss", "sparvagn", "tag", "kollektivtrafik", "bus", "tram", "train", "public transport", "zug", "strassenbahn", "offentlich", "biljett", "ticket", "fahrkarte", "station", "busshallplats", "stop", "haltestelle"],
  ["frukost", "breakfast", "fruhstuck", "kafe", "cafe", "fika", "coffee", "kaffee", "bageri", "bakery", "backerei"],
  ["tyst", "tystnad", "ljud", "oljud", "quiet", "noise", "silence", "ruhe", "laut", "larm", "fest", "party", "grannar", "neighbours", "neighbors", "nachbarn", "regler", "rules", "regeln", "hausordnung", "ordningsregler"],
  ["affar", "butik", "mataffar", "ica", "coop", "shop", "store", "supermarket", "grocery", "groceries", "einkaufen", "supermarkt", "laden", "handla"],
  ["nodfall", "112", "emergency", "notfall", "lakare", "doctor", "arzt", "sjukhus", "hospital", "krankenhaus", "brand", "polis", "police", "1177", "apotek", "pharmacy", "apotheke"],
  ["kok", "koket", "kitchen", "kuche", "spis", "stove top", "herd", "diskmaskin", "dishwasher", "spulmaschine", "kaffebryggare", "coffee maker", "kaffeemaschine"],
  ["sang", "sangar", "bed", "beds", "bett", "betten", "lakan", "sheets", "bettwasche", "handduk", "handdukar", "towel", "towels", "handtuch", "handtucher"],
  ["vard", "vardinna", "vardinnan", "host", "gastgeber", "agare", "owner", "kontakt", "contact", "ringa", "call", "anrufen", "sms"],
];

/** Small talk the page answers itself, for every house. */
const BUILT_IN: Answer[] = [
  {
    id: "hello",
    keywords: ["hej", "hejsan", "hallo", "hello", "hi", "hey", "guten tag", "god morgon", "good morning", "moin"],
    answer: {
      sv: "Hej! Fråga mig om allt som rör boendet – nyckeln, Wi-Fi, utcheckning eller vad som finns i närheten.",
      en: "Hi! Ask me anything about the stay – the key, Wi-Fi, check-out or what is nearby.",
      de: "Hallo! Fragen Sie mich alles zur Unterkunft – Schlüssel, WLAN, Abreise oder was es in der Nähe gibt.",
    },
  },
  {
    id: "thanks",
    keywords: ["tack", "tackar", "thanks", "thank you", "thx", "danke", "vielen dank"],
    answer: {
      sv: "Varsågod! Hör av dig om du undrar något mer. Trevlig vistelse!",
      en: "You're welcome! Ask again whenever you need. Enjoy your stay!",
      de: "Gern geschehen! Fragen Sie jederzeit wieder. Einen schönen Aufenthalt!",
    },
  },
];

const UNKNOWN: Record<StayLang, string> = {
  sv: "Det hittar jag inte i husets information. Skriv till värden, så får du svar direkt från hen.",
  en: "I can't find that in the house information. Write to the host and you'll get an answer from them directly.",
  de: "Das finde ich nicht in den Informationen zum Haus. Schreiben Sie dem Gastgeber, er antwortet Ihnen direkt.",
};

/** Lower case, no accents (å→a, ö→o, ü→u, ß→ss), only letters, digits and single spaces. */
export const normalize = (s: string) =>
  ` ${s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .replace(/æ/g, "ae")
    .replace(/ø/g, "o")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()} `;

const GROUP = new Map<string, string>();
SYNONYMS.forEach((group) => group.forEach((w) => GROUP.set(normalize(w).trim(), normalize(group[0]).trim())));

/** A word or phrase as its group's name, so "Passwort" and "lösenord" are the same keyword. */
const canonical = (w: string) => GROUP.get(w) ?? w;

/** The question in canonical words: every word, and every known phrase found in it. */
const termsOf = (question: string) => {
  const text = normalize(question);
  const words = text.trim().split(" ").filter(Boolean);
  const terms = new Set<string>();
  words.forEach((w) => {
    terms.add(canonical(w));
    // an inflected or compound word still finds its group: "tvättstugan" → "tvattstuga"
    for (const known of GROUP.keys()) if (known.length >= 4 && !known.includes(" ") && w.startsWith(known)) terms.add(GROUP.get(known)!);
  });
  for (const known of GROUP.keys()) if (known.includes(" ") && text.includes(` ${known} `)) terms.add(GROUP.get(known)!);
  return { text, terms };
};

/** How well an answer's keywords fit the question: a whole phrase counts more than a word. */
const score = (a: Answer, q: ReturnType<typeof termsOf>) =>
  a.keywords.reduce((sum, kw) => {
    const k = normalize(kw).trim();
    if (!k) return sum;
    if (k.includes(" ")) return sum + (q.text.includes(` ${k} `) ? 3 : 0);
    if (q.terms.has(canonical(k))) return sum + 2;
    return sum + ([...q.terms].some((t) => k.length >= 4 && t.length >= 4 && (t.startsWith(k) || k.startsWith(t))) ? 1 : 0);
  }, 0);

/** The text of `t` in `lang`, else Swedish, else English, else any. */
export const pick = (t: Texts | undefined, lang: StayLang) => (t ? t[lang] ?? t.sv ?? t.en ?? Object.values(t)[0] ?? "" : "");

/** Fills the house's own details into an answer ({keyCode}, {wifiName}, {hostPhone} …). */
export const fill = (text: string, house: House) =>
  text.replace(/\{(\w+)\}/g, (all, key: string) => {
    const v: Record<string, string> = {
      keyCode: house.arrival.keyCode,
      wifiName: house.arrival.wifi.name,
      wifiPassword: house.arrival.wifi.password,
      checkIn: house.arrival.checkIn,
      checkOut: house.arrival.checkOut,
      hostName: house.host.name,
      hostPhone: house.host.phone,
      name: house.name,
    };
    return v[key] ?? all;
  });

export async function answer(house: House, question: string, lang: StayLang): Promise<Reply> {
  const q = termsOf(question);
  let best: { a: Answer; s: number } | null = null;
  for (const a of [...house.answers, ...BUILT_IN]) {
    const s = score(a, q);
    if (s > (best?.s ?? 0)) best = { a, s };
  }
  if (best && best.s >= 2) return { kind: "answer", id: best.a.id, text: fill(pick(best.a.answer, lang), house) };
  return { kind: "unknown", text: UNKNOWN[lang] };
}

/**
 * Questions the chat could not answer, kept on this phone only (no server yet, nothing personal:
 * the question, the house and the time). The future host panel will receive them from here.
 */
export function recordUnanswered(slug: string, question: string) {
  try {
    const key = `stay:unanswered:${slug}`;
    const list = JSON.parse(localStorage.getItem(key) ?? "[]") as { q: string; at: string }[];
    list.push({ q: question.slice(0, 200), at: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(list.slice(-50)));
  } catch {
    // private mode or storage blocked: nothing to keep
  }
}
