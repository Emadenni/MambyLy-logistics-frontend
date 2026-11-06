import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import CardExperience from "../../src/public/digital-card/CardExperience";
import { validateCard } from "../../src/public/digital-card/validate";
import logoDark from "../../src/public/assets/logo-dark.svg";
import type { Action, ArrowLayer, BinLayer, CaptionLayer, CardLayer, Format, Layer, LogoLayer, PaperLayer, SafeArea, SpotlightLayer } from "./types";

/**
 * Renders one video format as a function of time. Everything the studio draws itself (texts,
 * paper card, bin, entry and light of the card, spotlight, logo, zoom) is computed from `t`, so
 * any frame can be rendered on its own. The live card is the site's real CardExperience: actions
 * click its real buttons and its own CSS transitions are stepped by capture.mjs.
 */

const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const progress = (t: number, from: number, ms: number) => clamp((t - from) / ms);
const easeOut = (p: number) => 1 - (1 - p) ** 3;
const easeIn = (p: number) => p * p;
const easeInOut = (p: number) => (p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2);
/** Goes past 1 and settles back: the small bounce of words and of the card. */
const easeOutBack = (p: number, s = 2.2) => 1 + (s + 1) * (p - 1) ** 3 + s * (p - 1) ** 2;

/** 1 while the layer is shown, going to 0 during its exit. */
const exitLeft = (t: number, layer: { to: number; out?: number }) => {
  const out = layer.out ?? 200;
  return 1 - easeIn(progress(t, layer.to - out, out));
};

/** Zoom of the whole picture: 1 → 1.08 in 150 ms on each punch, then back in 350 ms. */
export function punchScale(t: number, punches: number[] = []) {
  let k = 0;
  for (const at of punches) {
    const d = t - at;
    if (d < 0 || d > 500) continue;
    k = Math.max(k, d < 150 ? easeOut(d / 150) : 1 - easeInOut((d - 150) / 350));
  }
  return 1 + 0.08 * k;
}

// Real controls of CardExperience, found by their role in the markup (never by text).
const ACTION_TARGETS: Record<Action["do"], (root: HTMLElement) => HTMLElement | null> = {
  flip: (r) => r.querySelector<HTMLElement>(".dc-actions [aria-pressed]"),
  "open-work": (r) => r.querySelectorAll<HTMLElement>(".dc-sitenav button")[0] ?? null,
  "open-profile": (r) => r.querySelectorAll<HTMLElement>(".dc-sitenav button")[1] ?? null,
  "open-contact": (r) => r.querySelectorAll<HTMLElement>(".dc-sitenav button")[2] ?? null,
  "close-panel": () => document.querySelector<HTMLElement>(".dc-panel .dc-panel__back"),
};

type Word = { text: string; em: boolean };

/** "Det här gör *det inte.*" → words (and line breaks), with the keywords marked. */
function words(text: string): Word[] {
  let em = false;
  const tokens = text.split(/[ \t]+/).flatMap((chunk) => chunk.split(/(\n)/)).filter(Boolean);
  return tokens.map((raw) => {
    if (raw === "\n") return { text: raw, em };
    let w = raw;
    const opens = w.startsWith("*");
    if (opens) w = w.slice(1);
    const closes = w.includes("*");
    w = w.replace(/\*/g, "");
    const word = { text: w, em: em || opens };
    if (opens) em = true;
    if (closes) em = false;
    return word;
  });
}

const Caption: React.FC<{ layer: CaptionLayer; t: number; safe: SafeArea }> = ({ layer, t, safe }) => {
  const list = useMemo(() => words(layer.text), [layer.text]);
  const reveal = layer.reveal ?? "words";
  const stagger = layer.stagger ?? 110;
  const exit = exitLeft(t, layer);
  let n = 0;
  return (
    <p
      className={`st-caption st-caption--${layer.size ?? "l"} st-caption--${layer.look ?? "marker"}`}
      style={{ left: safe.left, right: safe.right, top: safe.top + (layer.top ?? 0), opacity: exit, transform: `translateY(${(1 - exit) * -14}px)` }}
    >
      {list.map((w, i) => {
        if (w.text === "\n") return <br key={i} />;
        const start = layer.from + (reveal === "words" ? n++ * stagger : 0);
        const p = reveal === "none" ? 1 : progress(t, start, 320);
        // The marker draws in once the word has landed.
        const m = layer.highlight === false ? 0 : easeOut(progress(t, start + (reveal === "none" ? 120 : 200), 260));
        const style: React.CSSProperties = {
          opacity: clamp(p / 0.3),
          transform: `scale(${0.8 + 0.2 * easeOutBack(p)})`,
          ...(w.em ? ({ "--st-marker": `${m * 100}%` } as React.CSSProperties) : {}),
        };
        return (
          <React.Fragment key={i}>
            <span className={w.em ? "st-word st-word--em" : "st-word"} style={style}>
              {w.text}
            </span>{" "}
          </React.Fragment>
        );
      })}
    </p>
  );
};

/** Grey, flat and anonymous: a few bars instead of text, no logo, no brand. */
const Paper: React.FC<{ layer: PaperLayer; t: number }> = ({ layer, t }) => {
  // A slow sway while it rests (period 2 s: the same on the first and on the last frame).
  const phase = (t / 2000) * Math.PI * 2;
  let x = layer.rest.x;
  let y = layer.rest.y + Math.cos(phase) * 3;
  let rot = layer.tilt + Math.sin(phase) * 1.4;
  let scale = 1;
  if (layer.drop) {
    const p = progress(t, layer.drop.at, layer.drop.ms);
    y -= (1 - easeOutBack(p, 1.2)) * 640;
    rot += (1 - easeOut(p)) * 28;
  }
  if (layer.fall && t > layer.fall.at) {
    // A small lift, then it speeds up into the bin while it turns and gets smaller.
    const p = progress(t, layer.fall.at, layer.fall.ms);
    const to = layer.fall.to;
    x += (to.x - layer.rest.x) * p;
    y += -90 * p + (to.y - layer.rest.y + 90) * p * p;
    rot += (to.rotate - layer.tilt) * p ** 1.5;
    scale = 1 - (1 - to.scale) * easeIn(p);
  }
  return (
    <div className="st-paper" style={{ left: x, top: y, transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${scale})` }} aria-hidden="true">
      <span className="st-paper__mark" />
      <span className="st-paper__line st-paper__line--name" />
      <span className="st-paper__line st-paper__line--role" />
      <span className="st-paper__rule" />
      <span className="st-paper__line st-paper__line--small" />
      <span className="st-paper__line st-paper__line--small st-paper__line--short" />
    </div>
  );
};

const BIN = { width: 172, height: 182, rim: 20 };

/** Back (dark opening) and front (body, rim) are separate, so the paper falls in between. */
const Bin: React.FC<{ layer: BinLayer; t: number; part: "back" | "front" }> = ({ layer, t, part }) => {
  let dy = (1 - easeOutBack(progress(t, layer.enter.at, layer.enter.ms), 1.4)) * 520;
  if (layer.exit) dy += easeIn(progress(t, layer.exit.at, layer.exit.ms)) * 560;
  let sx = 1;
  let sy = 1;
  if (layer.impact !== undefined && t >= layer.impact) {
    // Squash on impact, then a damped spring back.
    const d = (t - layer.impact) / 1000;
    const k = Math.exp(-9 * d) * Math.cos(22 * d);
    sx = 1 + 0.07 * k;
    sy = 1 - 0.1 * k;
  }
  const style: React.CSSProperties = {
    left: layer.x - BIN.width / 2,
    top: layer.y - BIN.rim,
    width: BIN.width,
    height: BIN.height,
    transform: `translateY(${dy}px) scale(${sx}, ${sy})`,
  };
  const w = BIN.width;
  const r = BIN.rim;
  return (
    <svg className={`st-bin st-bin--${part}`} style={style} viewBox={`0 0 ${w} ${BIN.height}`} aria-hidden="true">
      {part === "back" ? (
        <>
          <ellipse cx={w / 2} cy={r} rx={w / 2 - 6} ry={13} fill="#0a2a25" />
          <path d={`M6 ${r} A${w / 2 - 6} 13 0 0 1 ${w - 6} ${r}`} fill="none" stroke="#247b67" strokeWidth={7} strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d={`M9 ${r} A${w / 2 - 9} 10 0 0 0 ${w - 9} ${r} L${w - 22} ${BIN.height - 12} Q${w - 23} ${BIN.height - 2} ${w - 34} ${BIN.height - 2} L34 ${BIN.height - 2} Q23 ${BIN.height - 2} 22 ${BIN.height - 12} Z`} fill="#103b35" />
          {[0.3, 0.5, 0.7].map((f) => (
            <path key={f} d={`M${w * f} ${r + 26} L${w / 2 + (w * f - w / 2) * 0.82} ${BIN.height - 22}`} stroke="#2a5d52" strokeWidth={6} strokeLinecap="round" />
          ))}
          <path d={`M6 ${r} A${w / 2 - 6} 13 0 0 0 ${w - 6} ${r}`} fill="none" stroke="#247b67" strokeWidth={7} strokeLinecap="round" />
        </>
      )}
    </svg>
  );
};

/** Position of the card's front face inside .st-card (layout coordinates, untouched by transforms). */
function faceBox(root: HTMLElement | null) {
  const face = root?.querySelector<HTMLElement>(".dc__face--front");
  if (!root || !face) return null;
  let x = 0;
  let y = 0;
  for (let el: HTMLElement | null = face; el && el !== root; el = el.offsetParent as HTMLElement | null) {
    x += el.offsetLeft;
    y += el.offsetTop;
  }
  return { x, y, width: face.offsetWidth, height: face.offsetHeight, radius: getComputedStyle(face).borderRadius };
}

const LiveCard: React.FC<{ layer: CardLayer; t: number; safe: SafeArea; stageWidth: number }> = ({ layer, t, safe, stageWidth }) => {
  const card = useMemo(() => validateCard(layer.card.raw, layer.card.assets), [layer.card]);
  if (!card) throw new Error(`studio: invalid card configuration "${layer.card.raw.slug}"`);
  const root = useRef<HTMLDivElement>(null);
  const [face, setFace] = useState<ReturnType<typeof faceBox>>(null);
  const sheenOn = !!layer.sheen && t >= layer.sheen.at && t <= layer.sheen.at + layer.sheen.ms;
  useLayoutEffect(() => {
    if (sheenOn) setFace(faceBox(root.current));
  }, [sheenOn]);

  const enter = layer.enter ?? { ms: 1, scale: 1 };
  const p = progress(t, layer.from, enter.ms);
  const exit = exitLeft(t, layer);
  const width = layer.width ?? 400;
  const style: React.CSSProperties = {
    left: (stageWidth - width) / 2,
    top: safe.top + (layer.top ?? 220),
    width,
    visibility: t >= layer.from && t < layer.to ? "visible" : "hidden",
    opacity: clamp(p / 0.35) * exit,
    transform: `scale(${(enter.scale + (1 - enter.scale) * easeOutBack(p)) * (0.9 + 0.1 * exit)})`,
  };
  const sp = layer.sheen ? easeInOut(progress(t, layer.sheen.at, layer.sheen.ms)) : 0;
  return (
    <div ref={root} className="st-card" style={style}>
      <CardExperience card={card} headingLevel="h2" />
      {sheenOn && face && (
        <span className="st-sheen" aria-hidden="true" style={{ left: face.x, top: face.y, width: face.width, height: face.height, borderRadius: face.radius }}>
          <span style={{ transform: `translateX(${-60 + sp * 220}%) skewX(-20deg)` }} />
        </span>
      )}
    </div>
  );
};

const Spotlight: React.FC<{ layer: SpotlightLayer; t: number; stageRef: React.RefObject<HTMLDivElement> }> = ({ layer, t, stageRef }) => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  useLayoutEffect(() => {
    const el = stageRef.current?.querySelector(layer.target);
    const stage = stageRef.current?.getBoundingClientRect();
    if (!el || !stage) return setRect(null);
    const r = el.getBoundingClientRect();
    setRect(new DOMRect(r.x - stage.x, r.y - stage.y, r.width, r.height));
  }, [layer.target, t, stageRef]);
  if (!rect) return null;
  const p = progress(t, layer.from, 300);
  const pulse = Math.max(0, ...(layer.pulse ?? []).map((at) => (t >= at && t < at + 400 ? Math.sin(((t - at) / 400) * Math.PI) : 0)));
  return (
    <span
      className="st-spot"
      aria-hidden="true"
      style={{
        left: rect.x - 7,
        top: rect.y - 7,
        width: rect.width + 14,
        height: rect.height + 14,
        opacity: clamp(p / 0.3) * exitLeft(t, layer),
        transform: `scale(${(1.4 - 0.4 * easeOutBack(p)) * (1 + 0.08 * pulse)})`,
      }}
    />
  );
};

const Logo: React.FC<{ layer: LogoLayer; t: number; safe: SafeArea }> = ({ layer, t, safe }) => {
  const p = progress(t, layer.from, 360);
  const exit = exitLeft(t, layer);
  return (
    <img
      className="st-logo"
      src={logoDark}
      alt="MambyLy"
      width={300}
      height={85}
      style={{ top: safe.top + layer.top, opacity: clamp(p / 0.3) * exit, transform: `translateX(-50%) scale(${(0.8 + 0.2 * easeOutBack(p)) * (0.9 + 0.1 * exit)})` }}
    />
  );
};

const Arrow: React.FC<{ layer: ArrowLayer; t: number; safe: SafeArea }> = ({ layer, t, safe }) => {
  const p = progress(t, layer.from, 300);
  // Bounces on every beat (500 ms).
  const bob = Math.abs(Math.sin(((t - layer.from) / 500) * Math.PI)) * 10;
  return (
    <svg className="st-arrow" viewBox="0 0 40 40" width={40} height={40} aria-hidden="true" style={{ top: safe.top + layer.top, opacity: clamp(p / 0.3) * exitLeft(t, layer), transform: `translateX(-50%) translateY(${bob}px)` }}>
      <path d="M20 6v26M8 21l12 12 12-12" fill="none" stroke="#103b35" strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export type StudioApi = {
  format: Format;
  variant: string;
  /** Shows the frame at `t` ms and clicks the actions that are due. Going back restarts. */
  seek: (t: number) => void;
  /** Fonts and images decoded. */
  ready: () => Promise<void>;
};

declare global {
  interface Window {
    studio?: StudioApi;
  }
}

const Studio: React.FC<{ format: Format; variant: string; autoplay: boolean; at?: number }> = ({ format, variant, autoplay, at }) => {
  const stage = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(at ?? 0);
  const [take, setTake] = useState(0);
  const last = useRef(-1);
  const done = useRef(new Set<number>());

  const merged = useMemo(() => {
    const v = format.variants[variant] ?? {};
    return {
      safe: v.safe ?? format.safe,
      punches: v.punches ?? format.punches ?? [],
      layers: format.layers.map((l) => {
        const own = { ...l, ...(v.layers?.[l.id] ?? {}) } as Layer;
        if (own.kind !== "caption") return own;
        // A hook stays readable on frame 0 whatever the variant does with the other texts.
        const reveal = own.reveal === "none" ? "none" : (v.captions?.reveal ?? own.reveal);
        return { ...own, ...v.captions, reveal, ...(v.layers?.[l.id] ?? {}) };
      }) as Layer[],
    };
  }, [format, variant]);

  const seek = useCallback(
    (next: number) => {
      if (next < last.current) {
        // Back in time: a fresh card (front side, no panel) and every action again.
        done.current.clear();
        document.documentElement.classList.remove("st-panel-cut");
        document.querySelector<HTMLElement>(".dc-panel .dc-panel__back")?.click();
        flushSync(() => setTake((k) => k + 1));
      }
      last.current = next;
      flushSync(() => setT(next));
      format.actions.forEach((a, i) => {
        if (a.at > next || done.current.has(i)) return;
        done.current.add(i);
        const root = stage.current;
        const el = root && ACTION_TARGETS[a.do](root);
        if (!el) throw new Error(`studio: no control for action "${a.do}" at ${a.at} ms`);
        el.click();
        // The panel empties its content while it fades out: cut it on the beat, the backdrop fades.
        if (a.do === "close-panel") document.documentElement.classList.add("st-panel-cut");
        else if (a.do.startsWith("open-")) document.documentElement.classList.remove("st-panel-cut");
      });
      // Nobody uses a keyboard here: no focus ring left on a control after an action.
      const focused = document.activeElement;
      if (focused instanceof HTMLElement && stage.current?.contains(focused)) focused.blur();
    },
    [format],
  );

  useEffect(() => {
    window.studio = {
      format,
      variant,
      seek,
      ready: async () => {
        await document.fonts.ready;
        await Promise.all([...document.images].map((img) => img.decode().catch(() => undefined)));
      },
    };
  }, [format, variant, seek]);

  // Browser preview: real time, looping. The capture drives seek() itself.
  useEffect(() => {
    if (!autoplay) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      seek((now - start) % format.duration);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, format.duration, seek]);

  useEffect(() => {
    if (at !== undefined) seek(at);
  }, [at, seek]);

  const { safe, layers } = merged;
  const shown = (l: Layer) => t >= l.from && t < l.to;
  const world = (l: Layer) => {
    switch (l.kind) {
      // The card stays mounted for the whole video (hidden outside its time) so that its state
      // and transitions carry from one frame to the next.
      case "card":
        return <LiveCard key={`${l.id}:${take}`} layer={l} t={t} safe={safe} stageWidth={format.width} />;
      case "paper":
        return shown(l) && <Paper key={l.id} layer={l} t={t} />;
      case "bin":
        return shown(l) && <Bin key={`${l.id}:back`} layer={l} t={t} part="back" />;
      case "logo":
        return shown(l) && <Logo key={l.id} layer={l} t={t} safe={safe} />;
      default:
        return null;
    }
  };
  return (
    <div ref={stage} className="mambyly-public st-stage" style={{ width: format.width, height: format.height }} data-format={format.id} data-variant={variant}>
      <div className="st-bg" aria-hidden="true" />
      {/* Everything but the texts zooms with the punches: the texts keep to the safe area. */}
      <div className="st-world" style={{ transform: `scale(${punchScale(t, merged.punches)})` }}>
        {layers.map(world)}
        {layers.map((l) => l.kind === "bin" && shown(l) && <Bin key={`${l.id}:front`} layer={l} t={t} part="front" />)}
      </div>
      {layers.map((l) => {
        if (!shown(l)) return null;
        if (l.kind === "caption") return <Caption key={l.id} layer={l} t={t} safe={safe} />;
        if (l.kind === "spotlight") return <Spotlight key={l.id} layer={l} t={t} stageRef={stage} />;
        if (l.kind === "arrow") return <Arrow key={l.id} layer={l} t={t} safe={safe} />;
        return null;
      })}
    </div>
  );
};

export default Studio;
