import { useRef } from "react";
import { animate, useMotionValue } from "framer-motion";

/**
 * Horizontal swipe for one carousel (website gallery, Om oss). The element uses
 * `touch-action: pan-y`, so vertical moves keep scrolling the page; a move only counts once it is
 * clearly sideways. Events stop here: the screen around never sees them, so a swipe in a carousel
 * can never trigger a change of screen. `offset` follows the finger for visual feedback.
 */
export function useSwipe({ onPrev, onNext, canPrev = true, canNext = true }: { onPrev: () => void; onNext: () => void; canPrev?: boolean; canNext?: boolean }) {
  const offset = useMotionValue(0);
  const s = useRef<{ id: number; x0: number; y0: number; x: number; t: number; v: number; dir: "x" | "y" | null } | null>(null);
  const swallowClick = useRef(false);

  const onPointerDown = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swallowClick.current = false;
    s.current = { id: e.pointerId, x0: e.clientX, y0: e.clientY, x: e.clientX, t: e.timeStamp, v: 0, dir: null };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const d = s.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    const dy = e.clientY - d.y0;
    if (!d.dir && Math.hypot(dx, dy) > 8) {
      d.dir = Math.abs(dx) > Math.abs(dy) * 1.2 ? "x" : "y";
      if (d.dir === "x") {
        swallowClick.current = true;
        e.currentTarget.setPointerCapture(e.pointerId);
      }
    }
    if (d.dir !== "x") return;
    e.stopPropagation();
    d.v = (e.clientX - d.x) / Math.max(1, e.timeStamp - d.t);
    d.x = e.clientX;
    d.t = e.timeStamp;
    // Resistance at the ends.
    const blocked = (dx > 0 && !canPrev) || (dx < 0 && !canNext);
    offset.set(blocked ? dx * 0.25 : dx);
  };

  const end = (e: React.PointerEvent<HTMLElement>, cancelled: boolean) => {
    const d = s.current;
    if (!d || d.id !== e.pointerId) return;
    s.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
    if (d.dir !== "x") return;
    e.stopPropagation();
    window.setTimeout(() => (swallowClick.current = false), 0);
    const dx = e.clientX - d.x0;
    const width = e.currentTarget.clientWidth || window.innerWidth;
    const far = Math.abs(dx) > Math.min(90, width * 0.18) || Math.abs(d.v) > 0.45;
    // The offset eases back while the slides move to their new places: one continuous motion.
    animate(offset, 0, { duration: 0.42, ease: [0.22, 0.75, 0.18, 1] });
    if (cancelled || !far) return;
    if (dx < 0 && canNext) onNext();
    else if (dx > 0 && canPrev) onPrev();
  };

  return {
    offset,
    handlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp: (e: React.PointerEvent<HTMLElement>) => end(e, false),
      onPointerCancel: (e: React.PointerEvent<HTMLElement>) => end(e, true),
      // A swipe that ends on a link or button must not also open it.
      onClickCapture: (e: React.MouseEvent) => {
        if (swallowClick.current) {
          swallowClick.current = false;
          e.preventDefault();
          e.stopPropagation();
        }
      },
    },
  };
}
