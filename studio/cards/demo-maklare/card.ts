import type { CardConfigRaw } from "../../../src/public/digital-card/types";
import logo from "./logo.svg?url";

/**
 * Fictitious card for the videos. It lives in the studio, not in src/public/digital-card/cards/
 * (everything there is published). demo: true keeps every contact action a notice; no real
 * phone number, only example.com addresses.
 */
export const demoMaklare: { raw: CardConfigRaw; assets: { logo?: string } } = {
  assets: { logo },
  raw: {
    slug: "demo-maklare",
    lang: "sv",
    demo: true,
    kind: "organization",
    name: "Demo Mäklare AB",
    tagline: "Vi hjälper er hem",
    logo: "logo.svg",
    theme: {
      // Night blue and gold: clearly apart from the ivory and green of the video background.
      front: "#13203a",
      frontInk: "#f3eee3",
      accent: "#d4ad5a",
      back: "#f3eee3",
      backInk: "#13203a",
      backAccent: "#7d5d1a",
      style: "solid",
      layout: "classic",
    },
    email: "demo@example.com",
    website: "https://example.com",
    details: [
      { label: "Område", value: "Centrala staden" },
      { label: "Öppet", value: "Mån–fre 9–17" },
    ],
    profile: {
      work: {
        kind: "services",
        title: "Tjänster",
        items: [
          { title: "Värdering", text: "Ett tydligt värde på er bostad, med underlag ni kan lita på." },
          { title: "Försäljning", text: "Från första visning till kontrakt, med en plan för varje steg." },
          { title: "Visningar", text: "Välplanerade visningar, på plats och digitalt." },
        ],
      },
      about: "Demo Mäklare AB är ett påhittat exempel. Vi visar hur ett mäklarföretag kan presentera sig på ett digitalt visitkort.",
      availability: "Svarar inom en arbetsdag",
    },
  },
};
