import type { Format } from "../engine/types";
import { demoMaklare } from "../cards/demo-maklare/card";

/**
 * "Från papper till digitalt": before / after, 12 s, no sound. Built on a 120 BPM grid
 * (one beat = 500 ms) so that music added in the app lands on the cuts: b(3) = 1.5 s.
 * The last frame leads back into the first (the paper card drops in again under the hook).
 */
const b = (beats: number) => beats * 500;
/** Entrances start a little before their beat, so that they are on screen on the beat itself. */
const on = (beats: number) => b(beats) - 80;

/** Reel: clear of the top bar, the caption and the buttons on the right. */
const REEL_SAFE = { top: 130, right: 64, bottom: 220, left: 48 };
/** Story: clear of the progress bar / profile on top and the reply field below. */
const STORY_SAFE = { top: 140, right: 48, bottom: 200, left: 48 };

const format: Format = {
  id: "fran-papper-till-digitalt",
  title: "Från papper till digitalt",
  width: 540,
  height: 960,
  fps: 30,
  duration: b(24),
  safe: REEL_SAFE,
  layers: [
    // 0–1.5 s hook: readable on frame 0, the marker draws in, the paper card sways.
    { id: "hook", kind: "caption", from: 0, to: b(6) - 60, out: 220, text: "Ditt visitkort\nhamnar i\n*papperskorgen.*", reveal: "none", size: "xl" },
    // 1–1.5 s the bin comes up; 1.5–2 s the paper falls in; impact on 2 s; 2.5 s everything leaves.
    { id: "bin", kind: "bin", from: b(2), to: b(6), x: 270, y: 560, enter: { at: b(2), ms: 500 }, impact: b(4), exit: { at: b(5), ms: 380 } },
    { id: "paper", kind: "paper", from: 0, to: b(4), rest: { x: 270, y: 404 }, tilt: -7, fall: { at: b(3), ms: 500, to: { x: 270, y: 628, scale: 0.4, rotate: -100 } } },
    // 3 s the answer and the real card (bounce + light); 4.5 s back, 6 s front again.
    { id: "answer", kind: "caption", from: on(6), to: b(14) - 50, out: 200, text: "Det här gör\n*det inte.*", reveal: "words", stagger: 120, size: "xl" },
    { id: "card", kind: "card", from: on(6), to: b(21) - 60, out: 160, card: demoMaklare, enter: { ms: 500, scale: 0.8 }, sheen: { at: b(7) - 100, ms: 700 }, width: 420, top: 220 },
    // 7–9 s the Tjänster panel.
    { id: "panel", kind: "caption", from: on(14), to: b(18) + 200, out: 200, text: "Visa vad ni\n*erbjuder.*", reveal: "words", size: "l" },
    // 9.5 s Spara kontakt.
    { id: "save", kind: "caption", from: on(19), to: b(21) - 60, out: 160, text: "Sparas med\n*ett tryck.*", reveal: "words", size: "xl" },
    { id: "save-spot", kind: "spotlight", from: on(19), to: b(21) - 60, out: 160, target: ".dc-save", pulse: [b(20)] },
    // 10.5 s logo and the closing line; 11.5 s back to the start.
    { id: "logo", kind: "logo", from: on(21) - 40, to: b(23) + 150, out: 150, top: 190 },
    { id: "cta", kind: "caption", from: on(21) + 120, to: b(23) + 150, out: 150, text: "Testa demon\n– länk i bio", reveal: "words", stagger: 90, size: "l", top: 300 },
    { id: "hook-loop", kind: "caption", from: b(23) + 50, to: b(24) + 100, text: "Ditt visitkort\nhamnar i\n*papperskorgen.*", reveal: "words", stagger: 50, highlight: false, size: "xl" },
    { id: "paper-loop", kind: "paper", from: b(23), to: b(24) + 100, rest: { x: 270, y: 404 }, tilt: -7, drop: { at: b(23), ms: 480 } },
    { id: "arrow", kind: "arrow", from: 99999, to: 99999, top: 0 },
  ],
  actions: [
    { at: b(9), do: "flip" },
    { at: b(12), do: "flip" },
    { at: b(14), do: "open-work" },
    { at: b(18), do: "close-panel" },
  ],
  punches: [b(4), b(7), b(19), b(21)],
  variants: {
    reel: {},
    story: {
      safe: STORY_SAFE,
      layers: {
        // No loop in a story: the closing stays, with room below for the link sticker.
        logo: { to: b(24) + 100, top: 170 },
        cta: { text: "Testa demon", to: b(24) + 100, top: 280, size: "xl" },
        arrow: { from: b(22), to: b(24) + 100, top: 360 },
        "hook-loop": { from: 99999, to: 99999 },
        "paper-loop": { from: 99999, to: 99999 },
      },
    },
    // Alternative for comparison: texts on labels that pop in whole, a punch on more beats.
    "reel-alt": {
      captions: { look: "box", reveal: "pop" },
      punches: [b(3), b(4), b(7), b(9), b(14), b(19), b(21)],
    },
  },
  cover: { variant: "reel", at: b(3) },
};

export default format;
