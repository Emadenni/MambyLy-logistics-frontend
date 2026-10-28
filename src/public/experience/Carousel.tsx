import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { fill } from "./i18n";
import { useUi } from "./ui";

/**
 * Manual gallery (websites, digital cards): a native horizontal scroll with snap points, arrows and
 * a "01 / 06" index. No autoplay. Swiping is the browser's own scroll, so it never reaches the
 * screen around it; links inside stay ordinary links. The position is remembered for the tab, so
 * coming back from a demo shows the same item.
 */
const Carousel: React.FC<{
  id: string;
  label: string;
  prev: string;
  next: string;
  position: string;
  className?: string;
  children: React.ReactNode[];
}> = ({ id, label, prev, next, position, className = "", children }) => {
  const reduce = useReducedMotion() ?? false;
  const list = useRef<HTMLUListElement>(null);
  const saved = useUi((s) => s.gallery[id] ?? 0);
  const remember = useUi((s) => s.setGallery);
  const [index, setIndex] = useState(saved);
  const n = children.length;

  const itemAt = (i: number) => list.current?.children[i] as HTMLElement | undefined;
  const scrollTo = (i: number, smooth: boolean) => {
    const ul = list.current;
    const li = itemAt(i);
    if (!ul || !li) return;
    ul.scrollTo({ left: li.offsetLeft - ul.offsetLeft - (ul.clientWidth - li.clientWidth) / 2, behavior: smooth && !reduce ? "smooth" : "auto" });
  };

  // Back at the gallery: show the item seen last, without animation.
  useLayoutEffect(() => {
    scrollTo(saved, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const ul = list.current;
    if (!ul) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const centre = ul.scrollLeft + ul.clientWidth / 2;
        let best = 0;
        let dist = Infinity;
        [...ul.children].forEach((el, i) => {
          const li = el as HTMLElement;
          const d = Math.abs(li.offsetLeft - ul.offsetLeft + li.clientWidth / 2 - centre);
          if (d < dist) (dist = d), (best = i);
        });
        setIndex(best);
        remember(id, best);
      });
    };
    ul.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      ul.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [id, remember]);

  return (
    <div className={`mp-car ${className}`}>
      <ul
        ref={list}
        className="mp-car__list"
        aria-label={label}
        onFocus={(e) => {
          // Keyboard: the item that gets the focus comes to the middle.
          const li = (e.target as HTMLElement).closest(".mp-car__item");
          const i = li ? [...(list.current?.children ?? [])].indexOf(li) : -1;
          if (i >= 0 && i !== index) scrollTo(i, true);
        }}
      >
        {children.map((child, i) => (
          <li key={i} className={`mp-car__item${i === index ? " is-current" : ""}`}>
            {child}
          </li>
        ))}
      </ul>
      <div className="mp-car__nav">
        <button type="button" className="mp-car__arrow" onClick={() => scrollTo(Math.max(0, index - 1), true)} disabled={index === 0} aria-label={prev}>
          <FiArrowLeft aria-hidden="true" />
        </button>
        <p className="mp-car__pos">
          <span aria-hidden="true">
            {String(index + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </span>
          <span className="mp-sr" aria-live="polite">
            {fill(position, { i: index + 1, n })}
          </span>
        </p>
        <button type="button" className="mp-car__arrow" onClick={() => scrollTo(Math.min(n - 1, index + 1), true)} disabled={index === n - 1} aria-label={next}>
          <FiArrowRight aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default Carousel;
