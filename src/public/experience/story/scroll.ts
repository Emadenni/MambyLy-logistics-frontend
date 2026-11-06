import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { story } from "./progress";

gsap.registerPlugin(ScrollTrigger);

/**
 * The story's one source of truth for the scroll: Lenis smooths wheel and trackpad, ScrollTrigger
 * maps the story element to 0..1 and writes it to `story.p`. Loaded on its own after the first paint
 * (StoryPage). With reduced motion the page scrolls natively and only the mapping runs.
 * Returns the cleanup.
 */
export const startScroll = (root: HTMLElement, smooth: boolean) => {
  const lenis = smooth ? new Lenis({ autoRaf: false, lerp: 0.16 }) : null;
  const raf = (time: number) => lenis?.raf(time * 1000);
  if (lenis) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
  }
  const trigger = ScrollTrigger.create({
    trigger: root,
    start: 0,
    end: "bottom bottom",
    onUpdate: (self) => (story.p = self.progress),
  });
  story.p = trigger.progress;
  return () => {
    trigger.kill();
    gsap.ticker.remove(raf);
    gsap.ticker.lagSmoothing(500, 33);
    lenis?.destroy();
  };
};
