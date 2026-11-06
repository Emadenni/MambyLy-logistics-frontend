import React from "react";
import { AbsoluteFill, Img, continueRender, delayRender, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export type Action = { id: string; type: "tap" | "swipe" | "measure"; frame: number; timeMs: number; x: number; y: number; rect: { x: number; y: number; width: number; height: number }; path?: { dx: number; dy: number; frames: number } };
export type Timeline = { viewport: { width: number; height: number }; fps: number; frames: number; actions: Action[] };
export type Script = {
  id: string;
  bar: string;
  bpm: number;
  fps: number;
  beats: number;
  barColors: { beat: number; color: string; ink: string }[];
  camera: { beat: number; on?: string; zoom: number }[];
  captions: { from: number; to: number; text: string; instant?: boolean }[];
  notes: { from: number; to: number; kind: "arrow" | "circle" | "underline" | "scan" | "spot"; on: string; color: string; tail?: [number, number] }[];
  outro: { beat: number; text: string };
};
export type ReelProps = { name: string; script?: Script; timeline?: Timeline };

const GREEN = "#103b35";
const YELLOW = "#f2cc58";
const IVORY = "#f6f4ee";

// Phone on the 1080 × 1920 stage: a 390 × 844 screen drawn at S.
export const S = 1.59;
export const PHONE = { x: (1080 - 390 * S) / 2, y: 512 };
export const STATUS = 54;
export const ADDRESS = 70;
/** Where the camera puts the point it looks at: below the texts, clear of the bottom UI of the apps. */
export const FOCUS = { x: 540, y: 1130 };

export const SPRING = { damping: 22, stiffness: 90, mass: 0.9 };

const fonts = [
  ["MP Poppins", "brand/Poppins-SemiBold.ttf", 600],
  ["MP Poppins", "brand/Poppins-Medium.ttf", 500],
  ["MP Poppins", "brand/Poppins-Bold.ttf", 700],
  ["MP Newsreader", "brand/newsreader.woff2", "200 800"],
] as const;
const fontLoad = delayRender("fonts");
Promise.all(fonts.map(([family, file, weight]) => new FontFace(family, `url(${staticFile(file)})`, { weight: String(weight) }).load().then((f) => document.fonts.add(f)))).then(() => continueRender(fontLoad));

/** A fine, slowly changing grain over the background. */
export const Grain: React.FC<{ frame: number }> = ({ frame }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.1, mixBlendMode: "overlay" }}>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed={Math.floor(frame / 3) % 12} />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

const Background: React.FC<{ frame: number }> = ({ frame }) => (
  <AbsoluteFill style={{ background: `radial-gradient(90% 50% at 78% 12%, rgba(36,123,103,0.55), transparent 70%), radial-gradient(80% 40% at 10% 92%, rgba(36,123,103,0.3), transparent 70%), linear-gradient(170deg, #134a42 0%, ${GREEN} 45%, #0b2a26 100%)` }}>
    <Grain frame={frame} />
  </AbsoluteFill>
);

/** "Ett tryck till\n*Spara kontakt.*" → lines of words, keywords marked. */
function parse(text: string) {
  let em = false;
  return text.split("\n").map((line) =>
    line.split(" ").map((raw) => {
      const opens = raw.startsWith("*");
      const closes = raw.endsWith("*");
      const word = { text: raw.replace(/\*/g, ""), em: em || opens };
      if (opens) em = true;
      if (closes) em = false;
      return word;
    }),
  );
}

/** Word by word: a short rise out of a blur. `instant`: readable from the very first frame. */
export const Words: React.FC<{ text: string; from: number; to?: number; instant?: boolean; stagger?: number; size: number; ink: string; em: string }> = ({ text, from, to, instant, stagger = 3, size, ink, em }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const leave = to === undefined ? 0 : interpolate(frame, [to - 6, to], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  let n = 0;
  return (
    <>
      {parse(text).map((line, l) => (
        <div key={l} style={{ whiteSpace: "nowrap" }}>
          {line.map((w, i) => {
            const start = from + n++ * stagger;
            const p = instant ? 1 : spring({ frame: frame - start + 3, fps, config: stagger < 3 ? { damping: 30, stiffness: 340 } : { damping: 18, stiffness: 130 } });
            return (
              <span key={i} style={{ display: "inline-block", marginRight: "0.26em", color: w.em ? em : ink, opacity: Math.min(1, p * 1.6) * (1 - leave), filter: `blur(${(1 - Math.min(1, p)) * 14 + leave * 8}px)`, transform: `translateY(${(1 - p) * 26 - leave * 16}px)`, fontSize: size }}>
                {w.text}
              </span>
            );
          })}
        </div>
      ))}
    </>
  );
};

/** Hand-drawn: a small fixed wobble (from the seed) so that a line is never geometric. */
const wobble = (i: number, seed: number) => Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453 % 1;

function circlePath(r: Action["rect"], seed: number) {
  const cx = r.x + r.width / 2;
  const cy = r.y + r.height / 2;
  const rx = r.width / 2 + 12;
  const ry = r.height / 2 + 11;
  const pts: string[] = [];
  // A little more than a full turn: the ends overlap as they do with a pen.
  for (let i = 0; i <= 44; i++) {
    const a = -2.5 + (i / 40) * Math.PI * 2;
    const grow = 1 + (i / 44) * 0.05 + wobble(Math.floor(i / 4), seed) * 0.015;
    pts.push(`${(cx + Math.cos(a) * rx * grow).toFixed(1)} ${(cy + Math.sin(a) * ry * grow).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function underlinePath(r: Action["rect"]) {
  const y = r.y + r.height + 3;
  const w = Math.min(r.width, 128);
  return `M${r.x} ${y} C${r.x + w * 0.3} ${y - 4} ${r.x + w * 0.65} ${y + 3} ${r.x + w} ${y - 2}`;
}

/** A curved arrow that comes from below right and stops just short of the element. */
function arrowPaths(r: Action["rect"], tail: [number, number] = [74, 84]) {
  const tx = r.x + r.width * 0.42;
  const ty = r.y + r.height + 15;
  const sx = tx + tail[0];
  const sy = ty + tail[1];
  return {
    line: `M${sx} ${sy} C${sx - 16} ${sy - 36} ${tx - 14} ${ty + 34} ${tx} ${ty}`,
    head: `M${tx - 13} ${ty + 15} L${tx} ${ty} L${tx + 13} ${ty + 16}`,
  };
}

export const Note: React.FC<{ note: Script["notes"][number]; action: Action; start: number; end: number; seed: number }> = ({ note, action, start, end, seed }) => {
  const frame = useCurrentFrame();
  if (frame < start || frame > end) return null;
  const draw = interpolate(frame, [start, start + 11], [0, 1], { extrapolateRight: "clamp" });
  const out = interpolate(frame, [end - 5, end], [1, 0], { extrapolateLeft: "clamp" });
  const stroke = { fill: "none", stroke: note.color, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1, strokeDasharray: 1 };
  if (note.kind === "spot") {
    // The rest of the screen dims: the element stays in the light.
    const r = action.rect;
    const m = 6;
    const k = Math.min((r.height + m * 2) / 2, 26);
    const [a, b, w, h] = [r.x - m, r.y - m, r.width + m * 2, r.height + m * 2];
    const hole = `M${a + k} ${b} h${w - 2 * k} a${k} ${k} 0 0 1 ${k} ${k} v${h - 2 * k} a${k} ${k} 0 0 1 ${-k} ${k} h${-(w - 2 * k)} a${k} ${k} 0 0 1 ${-k} ${-k} v${-(h - 2 * k)} a${k} ${k} 0 0 1 ${k} ${-k} Z`;
    return <path d={`M-60 -120 H460 V960 H-60 Z ${hole}`} fillRule="evenodd" fill="#000" opacity={0.62 * Math.min(draw * 1.4, 1) * out} />;
  }
  if (note.kind === "scan") {
    // A phone's viewfinder over the code: four corners and a line that sweeps it.
    const r = action.rect;
    const m = 8;
    const L = 26;
    const [a, b, c, d] = [r.x - m, r.y - m, r.x + r.width + m, r.y + r.height + m];
    const line = b + (d - b) * (0.5 - 0.5 * Math.cos(((frame - start) / 30) * Math.PI));
    return (
      <g opacity={out * Math.min(1, draw * 2)} fill="none" stroke={note.color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round">
        <path d={`M${a} ${b + L} V${b} H${a + L} M${c - L} ${b} H${c} V${b + L} M${c} ${d - L} V${d} H${c - L} M${a + L} ${d} H${a} V${d - L}`} />
        <path d={`M${a + 6} ${line} H${c - 6}`} strokeWidth={2.6} opacity={0.85} />
      </g>
    );
  }
  if (note.kind === "arrow") {
    const a = arrowPaths(action.rect, note.tail);
    const head = interpolate(frame, [start + 9, start + 13], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
    return (
      <g opacity={out}>
        <path d={a.line} {...stroke} strokeDashoffset={1 - draw} />
        <path d={a.head} {...stroke} strokeDashoffset={1 - head} />
      </g>
    );
  }
  return <path d={note.kind === "circle" ? circlePath(action.rect, seed) : underlinePath(action.rect)} {...stroke} strokeDashoffset={1 - draw} opacity={out} />;
};

/** The finger: arrives before the action, ripples on the touch. Never on a measure: nothing is pressed. */
export const Finger: React.FC<{ actions: Action[]; fps: number }> = ({ actions, fps }) => {
  const frame = useCurrentFrame();
  const touches = actions.filter((a) => a.type !== "measure");
  const next = touches.find((a) => frame <= a.frame + (a.path?.frames ?? 0) + 8);
  if (!next) return null;
  const end = next.frame + (next.path?.frames ?? 0);
  const start = next.frame - 11;
  if (frame < start || frame > end + 8) return null;
  const enter = spring({ frame: frame - start, fps, config: { damping: 16, stiffness: 170 } });
  const leave = interpolate(frame, [end + 2, end + 8], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const press = interpolate(frame, [next.frame - 3, next.frame, end + 1, end + 5], [1, 0.8, 0.8, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const moved = next.path ? interpolate(frame, [next.frame, end], [0, next.path.dx], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }) : 0;
  const x = next.x + moved;
  const y = next.y;
  return (
    <>
      {[0, 5].map((delay) => {
        const t = (frame - next.frame - delay) / 16;
        if (t < 0 || t > 1) return null;
        const e = 1 - (1 - t) ** 3;
        return <circle key={delay} cx={next.x} cy={next.y} r={14 + e * 40} fill="none" stroke="#103b35" strokeWidth={2.4 * (1 - t) + 0.2} opacity={(1 - t) * 0.9} />;
      })}
      <circle cx={x} cy={y} r={16 * press * Math.min(1, enter)} fill="rgba(16,59,53,0.16)" stroke="#103b35" strokeWidth={1.6} opacity={leave} style={{ filter: "drop-shadow(0 3px 7px rgba(0,0,0,0.45))" }} />
    </>
  );
};

export const StatusBar: React.FC<{ ink: string }> = ({ ink }) => (
  <div style={{ height: STATUS, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 30px 9px 38px", color: ink, fontSize: 16, fontWeight: 600 }}>
    <span>9:41</span>
    <svg width="58" height="13" viewBox="0 0 58 13" fill={ink} aria-hidden="true">
      <rect x="0" y="8" width="3" height="5" rx="1" /><rect x="5" y="5.5" width="3" height="7.5" rx="1" /><rect x="10" y="3" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="13" rx="1" />
      <rect x="28" y="0.5" width="25" height="12" rx="3.5" fill="none" stroke={ink} opacity="0.5" /><rect x="30" y="2.5" width="21" height="8" rx="2" /><rect x="54.5" y="4" width="2" height="5" rx="1" opacity="0.5" />
    </svg>
  </div>
);

export const Reel: React.FC<ReelProps> = ({ name, script, timeline }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  if (!script || !timeline) return null;
  const beat = (b: number) => Math.round((b * 60 * fps) / script.bpm);
  const byId = (id: string) => {
    const a = timeline.actions.find((x) => x.id === id);
    if (!a) throw new Error(`copione: no action "${id}"`);
    return a;
  };

  // Camera: every key springs from wherever the picture is now.
  let cam = { x: 0, y: 0, z: 1 };
  for (const key of script.camera) {
    const p = spring({ frame: frame - beat(key.beat), fps, config: SPRING });
    if (p <= 0) continue;
    let goal = { x: 0, y: 0, z: 1 };
    if (key.on) {
      const a = byId(key.on);
      const cx = a.rect.x + a.rect.width / 2;
      const cy = a.rect.y + a.rect.height / 2;
      // The whole width of the phone stays in the picture (with a small margin).
      const room = 1080 - (390 * S + 36) * key.zoom;
      const free = FOCUS.x - (PHONE.x + cx * S) * key.zoom;
      const left = (PHONE.x - 18) * key.zoom;
      const x = room > 0 ? Math.min(room - 14 - left, Math.max(14 - left, free)) : free;
      goal = { x, y: FOCUS.y - (PHONE.y + (STATUS + cy) * S) * key.zoom, z: key.zoom };
    }
    cam = { x: cam.x + (goal.x - cam.x) * p, y: cam.y + (goal.y - cam.y) * p, z: cam.z + (goal.z - cam.z) * p };
  }

  // Entrance on the very first frames; the phone is already there on frame 0.
  const rise = spring({ frame, fps, config: { damping: 16, stiffness: 120 }, from: 0.9, to: 1 });
  const riseY = (1 - rise) * 500;

  const recorded = Math.min(frame, timeline.frames - 1);
  const src = staticFile(`${name}/frames/${String(recorded).padStart(5, "0")}.jpg`);
  const barNow = [...script.barColors].reverse().find((c) => frame >= beat(c.beat)) ?? script.barColors[0];

  // Outro: ivory opens from the middle of the picture on its beat.
  const outroAt = beat(script.outro.beat);
  const open = spring({ frame: frame - outroAt, fps, config: { damping: 24, stiffness: 70 } });
  const logo = spring({ frame: frame - outroAt - 6, fps, config: { damping: 15, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ fontFamily: "'MP Poppins', sans-serif", background: GREEN }}>
      <Background frame={frame} />

      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${cam.x}px, ${cam.y + riseY}px) scale(${cam.z})` }}>
        <div style={{ position: "absolute", left: PHONE.x - 18, top: PHONE.y - 18, width: 390 * S + 36, height: 844 * S + 36, borderRadius: 94, background: "linear-gradient(145deg, #3a403e, #141716 30%, #101312 70%, #2b302e)", boxShadow: "inset 0 0 0 2px #5b625f, 0 30px 60px -15px rgba(0,0,0,0.55), 0 70px 120px -30px rgba(0,0,0,0.65)" }}>
          <i style={{ position: "absolute", left: -5, top: 262, width: 6, height: 76, borderRadius: 3, background: "#2b302e" }} />
          <i style={{ position: "absolute", left: -5, top: 356, width: 6, height: 76, borderRadius: 3, background: "#2b302e" }} />
          <i style={{ position: "absolute", right: -5, top: 300, width: 6, height: 124, borderRadius: 3, background: "#2b302e" }} />
        </div>
        <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, width: 390, height: 844, transformOrigin: "0 0", transform: `scale(${S})`, borderRadius: 48, overflow: "hidden", background: barNow.color }}>
          <StatusBar ink={barNow.ink} />
          <Img src={src} style={{ display: "block", width: 390, height: timeline.viewport.height }} />
          <div style={{ height: ADDRESS, background: barNow.color, display: "flex", justifyContent: "center", paddingTop: 11 }}>
            <div style={{ width: 318, height: 36, borderRadius: 18, background: barNow.ink === IVORY ? "rgba(255,255,255,0.14)" : "rgba(16,59,53,0.09)", color: barNow.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
              <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M2.5 6V4a3 3 0 0 1 6 0v2" fill="none" stroke={barNow.ink} strokeWidth="1.4" /><rect x="1" y="5.5" width="9" height="7" rx="1.6" fill={barNow.ink} /></svg>
              {script.bar}
            </div>
          </div>
          <div style={{ position: "absolute", left: "50%", top: 12, width: 112, height: 31, marginLeft: -56, borderRadius: 16, background: "#050606" }} />
          <svg style={{ position: "absolute", left: 0, top: STATUS, overflow: "visible" }} width={390} height={timeline.viewport.height} viewBox={`0 0 390 ${timeline.viewport.height}`}>
            {script.notes.map((n, i) => (
              <Note key={i} note={n} action={byId(n.on)} start={beat(n.from)} end={beat(n.to)} seed={i + 1} />
            ))}
            <Finger actions={timeline.actions} fps={fps} />
          </svg>
        </div>
      </div>

      {/* The phone slides under the top of the picture when the camera is in: the texts always sit on the background. */}
      <AbsoluteFill style={{ maskImage: "linear-gradient(#000 455px, transparent 500px)", WebkitMaskImage: "linear-gradient(#000 455px, transparent 500px)" }}>
        <Background frame={frame} />
      </AbsoluteFill>

      {/* Reels safe area: clear of the top bar and of the buttons on the right. */}
      {script.captions.map((c, i) =>
        frame >= beat(c.from) && frame < beat(c.to) ? (
          <div key={i} style={{ position: "absolute", left: 76, right: 150, top: 215, fontWeight: 700, lineHeight: 1.14, letterSpacing: "-0.02em" }}>
            <Words text={c.text} from={beat(c.from)} to={beat(c.to)} instant={c.instant} size={c.text.split("\n").length > 2 ? 72 : 84} ink={IVORY} em={YELLOW} />
          </div>
        ) : null,
      )}

      {frame >= outroAt - 1 && (
        <AbsoluteFill style={{ background: IVORY, clipPath: `circle(${open * 125}% at 50% 56%)` }}>
          <div style={{ position: "absolute", left: 90, right: 150, top: 640, display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 64 }}>
            <Img src={staticFile("brand/logo-dark.svg")} style={{ width: 760, opacity: Math.min(1, logo * 1.5), transform: `scale(${0.86 + 0.14 * logo})`, transformOrigin: "0 50%" }} />
            <div style={{ fontWeight: 600, lineHeight: 1.2, letterSpacing: "-0.01em" }}>
              <Words text={script.outro.text.replace(" – ", "\n– ")} from={outroAt + 14} size={84} ink={GREEN} em="#247b67" />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
