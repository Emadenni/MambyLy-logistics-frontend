import { describe, expect, it } from "vitest";
import { answer, normalize } from "../public/tools/stay/answer";
import type { House } from "../public/tools/stay/types";
import stuga from "../../public/stay-data/sjostugan-vid-roxen/demo.json";
import city from "../../public/stay-data/stadsvaningen-linkoping/demo.json";

const cottage = stuga as House;
const flat = city as House;

const idOf = async (house: House, q: string, lang: "sv" | "en" | "de" = "sv") => {
  const r = await answer(house, q, lang);
  return r.kind === "answer" ? r.id : "unknown";
};

describe("MambyLy Stay – answers from the house manual", () => {
  it("ignores case, accents and punctuation", () => {
    expect(normalize("Lösenord till WI-FI?").trim()).toBe("losenord till wi fi");
    expect(normalize("Schlüssel – Größe").trim()).toBe("schlussel grosse");
  });

  it("finds the Wi-Fi in Swedish, English and German", async () => {
    expect(await idOf(cottage, "Vad är lösenordet till wifi?")).toBe("wifi");
    expect(await idOf(cottage, "what's the internet password", "en")).toBe("wifi");
    expect(await idOf(cottage, "Wie ist das WLAN Passwort?", "de")).toBe("wifi");
  });

  it("fills the house's own details into the reply", async () => {
    const r = await answer(cottage, "wifi", "en");
    expect(r.kind === "answer" && r.text).toContain("roxen-ljus-26");
    const key = await answer(cottage, "Var är nyckeln?", "sv");
    expect(key.kind === "answer" && key.text).toContain("4812");
  });

  it("understands synonyms and compound words", async () => {
    expect(await idOf(cottage, "hur värmer man basta")).toBe("sauna");
    expect(await idOf(cottage, "Where is the firewood?", "en")).toBe("fireplace");
    expect(await idOf(cottage, "Dürfen wir mit dem Kajak paddeln?", "de")).toBe("canoe");
    expect(await idOf(flat, "Hur bokar jag tvättstugan?")).toBe("laundry");
    expect(await idOf(flat, "Wo ist die Waschküche?", "de")).toBe("laundry");
    expect(await idOf(flat, "how do I get to the train station", "en")).toBe("transport");
    expect(await idOf(flat, "Vad är portkoden?")).toBe("door");
  });

  it("answers in the guest's language", async () => {
    const r = await answer(cottage, "sopor", "de");
    expect(r.kind === "answer" && r.text).toMatch(/Spüle/);
  });

  it("says it does not know instead of guessing", async () => {
    expect(await idOf(cottage, "Kan jag ta med min häst?")).toBe("unknown");
    const r = await answer(flat, "Is there a piano?", "en");
    expect(r.kind).toBe("unknown");
    expect(r.text).toMatch(/host/);
  });

  it("handles greetings and thanks", async () => {
    expect(await idOf(cottage, "Hej!")).toBe("hello");
    expect(await idOf(flat, "Danke schön", "de")).toBe("thanks");
  });
});
