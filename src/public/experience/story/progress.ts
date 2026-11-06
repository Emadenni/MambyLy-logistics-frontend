/**
 * The one scroll state of the story. The scroll driver (Lenis + ScrollTrigger in StoryPage) writes
 * `p`; captions and 3D objects read it every frame, so scrolling never re-renders React. `shown` is
 * the damped value the 3D scene is showing (for the debug overlay).
 */
export const story = {
  p: 0,
  /** The story is on screen (false while the home veil is down). */
  active: false,
  shown: 0,
  /** The 3D scene is running (until then `shown` means nothing). */
  scene: false,
  mobile: false,
  pointer: { x: 0, y: 0 },
  /** The card on screen, in % of the viewport (written by the scene). */
  focus: { x: 50, y: 50 },
  /** The phone screen on screen, in px (written by the scene), where the website reveal starts. */
  screen: { x: 0, y: 0, w: 0, h: 0 },
  /** The digital profile as drawn on the phone, so the HTML reveal starts with the same picture. */
  profile: null as HTMLCanvasElement | null,
};
