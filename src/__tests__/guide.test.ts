import { beforeEach, describe, expect, it } from "vitest";
import { validPlace } from "../public/tools/guide/data";
import { splitText, voiceFor } from "../public/tools/guide/speech";
import { clearSeen, markSeen, readSeen, savedGuideLang, saveGuideLang } from "../public/tools/guide/visited";
import { phoneLang, pick } from "../public/tools/shared/engine";
import type { Place } from "../public/tools/guide/types";
import demo from "../../public/guide-data/hembygdsgard/place.json";

const place = demo as unknown as Place;

describe("the demo place", () => {
  it("is a valid place with seven points in all three languages", () => {
    expect(validPlace(place, "hembygdsgard")).toBe(true);
    expect(place.points).toHaveLength(7);
    for (const p of place.points) {
      for (const l of place.languages) {
        expect(pick(p.name, l).length).toBeGreaterThan(0);
        expect(p.text[l]?.length ?? 0).toBeGreaterThan(40);
      }
    }
  });

  it("is refused when it is broken", () => {
    expect(validPlace({ ...place, slug: "annat" }, "hembygdsgard")).toBe(false);
    expect(validPlace({ ...place, points: [] }, "hembygdsgard")).toBe(false);
    expect(validPlace({ ...place, languages: ["fr" as never] }, "hembygdsgard")).toBe(false);
    expect(validPlace({ ...place, points: [place.points[0], place.points[0]] }, "hembygdsgard")).toBe(false);
    expect(validPlace({ ...place, points: [{ ...place.points[0], id: "Bad Id" }] }, "hembygdsgard")).toBe(false);
    expect(validPlace(undefined, "hembygdsgard")).toBe(false);
  });
});

describe("splitText (what the phone reads, piece by piece)", () => {
  it("keeps every word and no piece is longer than the limit", () => {
    for (const p of place.points) {
      for (const l of place.languages) {
        const text = p.text[l]!;
        const pieces = splitText(text, 120);
        expect(pieces.every((s) => s.length <= 120)).toBe(true);
        expect(pieces.join(" ").replace(/\s+/g, " ")).toBe(text.replace(/\s+/g, " ").trim());
      }
    }
  });

  it("cuts a very long sentence at a comma or a space", () => {
    const long = "ord ".repeat(80).trim() + ".";
    const pieces = splitText(long, 100);
    expect(pieces.length).toBeGreaterThan(2);
    expect(pieces.every((s) => s.length <= 100)).toBe(true);
  });

  it("gives nothing for an empty text", () => {
    expect(splitText("   ")).toEqual([]);
  });
});

describe("voiceFor", () => {
  const voices = [
    { lang: "en-US", localService: true },
    { lang: "sv_SE", localService: false },
    { lang: "sv-SE", localService: true },
    { lang: "de-AT", localService: true },
  ];

  it("takes the language's own voice, a local one first", () => {
    expect(voiceFor(voices, "sv")).toBe(voices[2]);
    expect(voiceFor(voices, "de")).toBe(voices[3]);
    expect(voiceFor(voices, "en")).toBe(voices[0]);
  });

  it("says there is none when the phone has no voice for the language", () => {
    expect(voiceFor(voices.filter((v) => !v.lang.startsWith("de")), "de")).toBeNull();
    expect(voiceFor([], "sv")).toBeNull();
  });
});

describe("what the phone remembers", () => {
  beforeEach(() => localStorage.clear());

  it("keeps the points seen, once each, in the order first seen", () => {
    expect(readSeen("hembygdsgard")).toEqual([]);
    markSeen("hembygdsgard", "smedjan");
    markSeen("hembygdsgard", "brunnen");
    expect(markSeen("hembygdsgard", "smedjan")).toEqual(["smedjan", "brunnen"]);
    expect(readSeen("annan-plats")).toEqual([]);
    clearSeen("hembygdsgard");
    expect(readSeen("hembygdsgard")).toEqual([]);
  });

  it("survives a damaged value", () => {
    localStorage.setItem("mp-guide-seen:x", "{not json");
    expect(readSeen("x")).toEqual([]);
    localStorage.setItem("mp-guide-seen:x", JSON.stringify(["a", 3, null]));
    expect(readSeen("x")).toEqual(["a"]);
  });

  it("remembers the language only if the place has it", () => {
    expect(savedGuideLang(["sv", "en"])).toBeNull();
    saveGuideLang("de");
    expect(savedGuideLang(["sv", "en", "de"])).toBe("de");
    expect(savedGuideLang(["sv", "en"])).toBeNull();
  });
});

describe("the language from the phone", () => {
  const set = (languages: string[]) => Object.defineProperty(navigator, "languages", { value: languages, configurable: true });

  it("takes the phone's first language the place has", () => {
    set(["de-DE", "en-GB"]);
    expect(phoneLang(["sv", "en", "de"])).toBe("de");
    set(["fr-FR", "de-DE"]);
    expect(phoneLang(["sv", "en"])).toBe("en");
  });

  it("gives Swedish to the Nordic neighbours, English to the rest", () => {
    set(["nb-NO"]);
    expect(phoneLang(["sv", "en"])).toBe("sv");
    set(["ja-JP"]);
    expect(phoneLang(["sv", "en"])).toBe("en");
    expect(phoneLang(["sv"])).toBe("sv");
  });
});
