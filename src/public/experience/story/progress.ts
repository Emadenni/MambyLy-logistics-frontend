/**
 * The one scroll state of the story. The scroll driver (Lenis + ScrollTrigger in StoryPage) writes
 * `p`; captions and 3D objects read it every frame, so scrolling never re-renders React. `shown` is
 * the damped value the 3D scene is showing (for the debug overlay).
 */
export const story = {
  p: 0,
  shown: 0,
  mobile: false,
  pointer: { x: 0, y: 0 },
};
