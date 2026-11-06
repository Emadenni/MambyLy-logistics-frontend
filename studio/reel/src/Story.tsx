import React from "react";
import { AbsoluteFill, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Finger, FOCUS, Note, PHONE, S, SPRING, STATUS, StatusBar, ADDRESS, Words, type Action, type Script as ReelScript, type Timeline } from "./Reel";

type Transition = "match" | "whip" | "scale" | "cut";
type Take = { id: string; beats: number; camera?: { beat: number; on?: string; zoom: number; now?: boolean }[]; notes?: ReelScript["notes"] };
type Scene =
  | { type: "hook" | "problem"; from: number; to: number; enter?: Transition }
  | { type: "close"; from: number; to: number; enter?: Transition }
  | { type: "phone"; take: string; from: number; to: number; takeFrom?: number; enter?: Transition; label?: string; drift?: boolean };
type TakeTimeline = Timeline & { bar: { top: { color: string; ink: string }; bottom: { color: string; ink: string } } };
export type StoryScript = {
  id: string;
  bpm: number;
  fps: number;
  beats: number;
  takes: Take[];
  scenes: Scene[];
  captions: { from: number; to: number; text: string; instant?: boolean; stagger?: number; hold?: boolean; size?: number }[];
  close: { text: string };
};
export type StoryProps = { name: string; recording?: string; script?: StoryScript; timelines?: Record<string, TakeTimeline> };

const IVORY = "#f6f4ee";
const INK = "#103b35";
const GREEN = "#247b67"; // the key words: yellow does not read on ivory
const YELLOW = "#f2cc58";
const SERIF = "'MP Newsreader', Georgia, serif";
const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

/** The same grain tile on every frame: fine paper that does not flicker. */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='360' height='360'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' seed='4' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .06 0 0 0 0 .23 0 0 0 0 .21 0 0 0 1 0'/%3E%3C/filter%3E%3Crect width='360' height='360' filter='url(%23g)' opacity='.045'/%3E%3C/svg%3E")`;

/** The site's ivory paper: a soft warm light from above that travels and returns (so the video loops). */
const Depth: React.FC<{ frame: number; total: number }> = ({ frame, total }) => {
  const a = (frame / total) * Math.PI * 2;
  const x = 58 + Math.sin(a) * 20;
  return (
    <AbsoluteFill
      style={{
        background: `${GRAIN}, radial-gradient(90% 42% at ${x}% -6%, rgba(255,246,224,0.95), rgba(251,250,246,0.6) 55%, rgba(251,250,246,0) 80%), ${IVORY}`,
      }}
    />
  );
};

const noise = (i: number, seed: number) => {
  const v = Math.sin(i * 127.1 + seed * 311.7) * 43758.5453;
  return v - Math.floor(v);
};

type PaperProps = { x: number; y: number; width: number; rotate?: number; crumple?: number; scale?: number; turn?: number; tilt?: number; seed?: number; opacity?: number; blur?: number };

/** Anonymous paper: pale bars, no marks. crumple 0 → 1 pulls its outline into a ball lit from the upper left. */
const Paper: React.FC<PaperProps> = ({ x, y, width, rotate = 0, crumple = 0, scale = 1, turn = 0, tilt = 0, seed = 1, opacity = 1, blur = 0 }) => {
  const w = width;
  const h = width * (55 / 85);
  const N = 36;
  const angle = (i: number) => (i / N) * Math.PI * 2 - Math.PI * 0.75;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = (i / N) * 4;
    const side = Math.floor(t);
    const f = t - side;
    const rect = side === 0 ? [-w / 2 + f * w, -h / 2] : side === 1 ? [w / 2, -h / 2 + f * h] : side === 2 ? [w / 2 - f * w, h / 2] : [-w / 2, h / 2 - f * h];
    const r = h * 0.33 * (0.9 + noise(i, seed) * 0.2);
    return [rect[0] + (Math.cos(angle(i)) * r - rect[0]) * crumple, rect[1] + (Math.sin(angle(i)) * r - rect[1]) * crumple];
  });
  const mid = pts.map((p, i) => {
    const k = 0.5 + noise(i + 90, seed) * 0.22;
    return [p[0] * k + (noise(i + 7, seed) - 0.5) * h * 0.05, p[1] * k + (noise(i + 13, seed) - 0.5) * h * 0.05];
  });
  const outline = pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ");
  const inner = Math.max(0, 1 - crumple * 2.4);
  const facet = (a: number[], b: number[], c: number[], key: string, light: number) => (
    <polygon key={key} points={`${a[0]},${a[1]} ${b[0]},${b[1]} ${c[0]},${c[1]}`} fill={light > 0 ? "#ffffff" : "#34362f"} opacity={crumple * Math.min(0.62, Math.abs(light))} />
  );
  return (
    <div style={{ position: "absolute", left: x, top: y, width: 0, height: 0, opacity, transform: `perspective(1800px) rotateX(${tilt}deg) rotateY(${turn}deg) rotate(${rotate}deg) scale(${scale})`, filter: `${blur > 0.2 ? `blur(${blur}px) ` : ""}drop-shadow(0 2px 3px rgba(16,59,53,0.2)) drop-shadow(0 34px 50px rgba(16,59,53,0.22))` }}>
      <svg style={{ position: "absolute", left: -w, top: -h, overflow: "visible" }} width={w * 2} height={h * 2} viewBox={`${-w} ${-h} ${w * 2} ${h * 2}`} aria-hidden="true">
        <defs>
          <linearGradient id={`paper-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#fffdf8" />
            <stop offset="1" stopColor="#e8e3d6" />
          </linearGradient>
        </defs>
        <polygon points={outline} fill={`url(#paper-${seed})`} stroke={`url(#paper-${seed})`} strokeWidth={w * 0.012} strokeLinejoin="round" />
        {crumple > 0.02 &&
          pts.map((p, i) => {
            const q = pts[(i + 1) % N];
            const m = mid[i];
            const n = mid[(i + 1) % N];
            const lit = Math.cos(angle(i) + 2.35);
            const a = lit * 0.34 + (noise(i + 40, seed) - 0.5) * 0.5;
            const b = lit * 0.22 + (noise(i + 55, seed) - 0.5) * 0.46;
            const c = lit * 0.14 + (noise(i + 70, seed) - 0.5) * 0.36;
            return (
              <React.Fragment key={i}>
                {facet(p, q, m, `a${i}`, a)}
                {facet(q, n, m, `b${i}`, b)}
                {facet(m, n, [0, 0], `c${i}`, c)}
              </React.Fragment>
            );
          })}
        <g opacity={inner}>
          <rect x={-w * 0.4} y={-h * 0.32} width={w * 0.11} height={w * 0.11} rx={w * 0.018} fill="#cfccc1" />
          <rect x={-w * 0.4} y={h * 0.02} width={w * 0.42} height={h * 0.065} rx={h * 0.02} fill="#a8a69c" />
          <rect x={-w * 0.4} y={h * 0.14} width={w * 0.26} height={h * 0.04} rx={h * 0.015} fill="#c7c4b9" />
          <rect x={-w * 0.4} y={h * 0.24} width={w * 0.34} height={h * 0.03} rx={h * 0.015} fill="#d3d0c6" />
        </g>
      </svg>
    </div>
  );
};

/** Frame 0's resting pose, and where the video's last frame lands. */
const HOOK_CARD = { x: 540, y: 1130, width: 780, rotate: -4, turn: -13, tilt: 10 };

const Hook: React.FC<{ beat: (b: number) => number }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sway = Math.sin((frame / 60) * Math.PI * 2);
  const crumple = spring({ frame: frame - beat(3), fps, config: { damping: 15, stiffness: 150 } });
  const shake = frame >= beat(3) && frame < beat(4) ? Math.sin(frame * 2.7) * 7 * (1 - crumple) : 0;
  const t = Math.max(0, frame - beat(4.3));
  return <Paper {...HOOK_CARD} y={HOOK_CARD.y + sway * 8 + 2.7 * t * t} x={HOOK_CARD.x + shake} rotate={HOOK_CARD.rotate + sway * 1.3 + crumple * 24 + t * 9} turn={HOOK_CARD.turn * (1 - crumple) + sway * 2} tilt={HOOK_CARD.tilt * (1 - crumple)} crumple={crumple} blur={Math.min(14, t * 0.9)} />;
};

/** Cards falling through the dark, near ones and far ones out of focus: lost, one after the other. */
const FALLING = [
  { x: 270, depth: 0.5, start: -0.9, seed: 2, spin: 1 },
  { x: 800, depth: 0.62, start: -0.4, seed: 5, spin: -1 },
  { x: 500, depth: 0.95, start: 0, seed: 8, spin: 1 },
  { x: 180, depth: 0.72, start: 0.6, seed: 3, spin: -1 },
  { x: 820, depth: 1.28, start: 1.1, seed: 6, spin: 1 },
  { x: 430, depth: 0.55, start: 1.5, seed: 9, spin: -1 },
];

const Problem: React.FC<{ beat: (b: number) => number }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  // The one clean card, in the place and size of the real card that follows: the match cut.
  const width = 350 * S * 1.5;
  const clean = spring({ frame: frame - beat(4.5), fps, config: { damping: 15, stiffness: 150 } });
  const turn = interpolate(frame, [beat(5.5), beat(6) - 1], [0, 90], { ...clamp, easing: (p) => p * p });
  return (
    <>
      {[...FALLING]
        .sort((a, b) => a.depth - b.depth)
        .map((c) => {
          const p = (frame - beat(c.start)) / beat(3);
          if (p < 0 || p > 1) return null;
          return (
            <Paper
              key={c.seed}
              seed={c.seed}
              width={620}
              x={c.x + Math.sin(p * 5 + c.seed) * 40}
              y={-320 + 2600 * p ** 1.4}
              scale={c.depth}
              rotate={c.spin * (-14 + p * 90)}
              turn={c.spin * Math.sin(p * 4 + c.seed) * 48}
              tilt={Math.cos(p * 3 + c.seed) * 42}
              blur={Math.abs(c.depth - 0.95) * 16}
            />
          );
        })}
      {frame >= beat(4.5) && <Paper x={FOCUS.x} y={FOCUS.y} width={width} scale={0.72 + 0.28 * clean} opacity={Math.min(1, clean * 2)} turn={turn} seed={1} />}
    </>
  );
};

/** One take on the phone. Inside its Sequence the current frame is the take's own frame. */
const PhoneShot: React.FC<{ recording: string; take: Take; timeline: TakeTimeline; beat: (b: number) => number; drift: number }> = ({ recording, take, timeline, beat, drift }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const byId = (id: string) => {
    const a = timeline.actions.find((x) => x.id === id);
    if (!a) throw new Error(`copione: take "${take.id}" has no action "${id}"`);
    return a;
  };
  let cam = { x: 0, y: 0, z: 1 };
  for (const key of take.camera ?? []) {
    const p = key.now ? 1 : spring({ frame: frame - beat(key.beat), fps, config: SPRING });
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
  const src = staticFile(`${recording}/${take.id}/frames/${String(Math.max(0, Math.min(frame, timeline.frames - 1))).padStart(5, "0")}.jpg`);
  const { top, bottom } = timeline.bar;
  // The picture breathes, and a phone held in a wide shot leans a little; close up it stays flat and readable.
  const breath = drift * (1 + 0.012 * Math.sin(frame / 42));
  const lean = Math.max(0, (1.45 - cam.z) / 0.45);
  const rotY = Math.sin(frame / 50) * 4.5 * lean;
  const rotX = Math.cos(frame / 64) * 2.2 * lean;
  const sheen = 12 + ((frame % 240) / 240) * 10;
  const width = 390 * S;
  const height = 844 * S;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `540px ${FOCUS.y}px`, transform: `scale(${breath})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, transformOrigin: "0 0", transform: `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})` }}>
        <div style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, transformOrigin: `540px ${PHONE.y + height / 2}px`, transform: `perspective(2800px) rotateX(${rotX}deg) rotateY(${rotY}deg)` }}>
          <div style={{ position: "absolute", left: PHONE.x - 20, top: PHONE.y - 20, width: width + 40, height: height + 40, borderRadius: 96, background: "linear-gradient(135deg, #b4b5b0 0%, #55574f 9%, #2a2b28 30%, #1b1c1a 55%, #3a3b37 82%, #a2a39e 100%)", boxShadow: "0 3px 8px rgba(16,59,53,0.2), 0 40px 70px -16px rgba(16,59,53,0.28), 0 100px 170px -30px rgba(16,59,53,0.3)" }}>
            <div style={{ position: "absolute", inset: 5, borderRadius: 91, background: "#060706", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.09)" }} />
            <i style={{ position: "absolute", left: -5, top: 264, width: 6, height: 76, borderRadius: 3, background: "linear-gradient(#77797a, #3a3b37)" }} />
            <i style={{ position: "absolute", left: -5, top: 358, width: 6, height: 76, borderRadius: 3, background: "linear-gradient(#77797a, #3a3b37)" }} />
            <i style={{ position: "absolute", right: -5, top: 302, width: 6, height: 124, borderRadius: 3, background: "linear-gradient(#77797a, #3a3b37)" }} />
          </div>
          <div style={{ position: "absolute", left: PHONE.x, top: PHONE.y, width: 390, height: 844, transformOrigin: "0 0", transform: `scale(${S})`, borderRadius: 48, overflow: "hidden", background: top.color }}>
            <StatusBar ink={top.ink} />
            <Img src={src} style={{ display: "block", width: 390, height: timeline.viewport.height }} />
            <div style={{ height: ADDRESS, background: bottom.color, display: "flex", justifyContent: "center", paddingTop: 11 }}>
              <div style={{ width: 318, height: 36, borderRadius: 18, background: bottom.ink === IVORY ? "rgba(255,255,255,0.14)" : "rgba(16,59,53,0.09)", color: bottom.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 14, fontWeight: 500 }}>
                <svg width="11" height="13" viewBox="0 0 11 13" aria-hidden="true"><path d="M2.5 6V4a3 3 0 0 1 6 0v2" fill="none" stroke={bottom.ink} strokeWidth="1.4" /><rect x="1" y="5.5" width="9" height="7" rx="1.6" fill={bottom.ink} /></svg>
                mambylysolutions.se
              </div>
            </div>
            <div style={{ position: "absolute", left: "50%", top: 12, width: 112, height: 31, marginLeft: -56, borderRadius: 16, background: "#050606" }} />
            <svg style={{ position: "absolute", left: 0, top: STATUS, overflow: "visible" }} width={390} height={timeline.viewport.height} viewBox={`0 0 390 ${timeline.viewport.height}`}>
              {(take.notes ?? []).map((n, i) => (
                <Note key={i} note={n} action={byId(n.on) as Action} start={beat(n.from)} end={beat(n.to)} seed={i + 1} />
              ))}
              <Finger actions={timeline.actions.filter((a) => a.type !== "scroll") as Action[]} fps={fps} />
            </svg>
            {/* The glass: a soft reflection that slides slowly over the picture. */}
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: `linear-gradient(116deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.025) ${sheen}%, transparent ${sheen + 0.6}%, transparent 76%, rgba(255,255,255,0.045) 100%)` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

const Close: React.FC<{ text: string; length: number }> = ({ text, length }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame: frame + 3, fps, config: { damping: 20, stiffness: 90 } });
  const rule = spring({ frame: frame - 6, fps, config: { damping: 24, stiffness: 80 } });
  // The last half second: everything leaves upward and the paper card of the first frame lands.
  const leave = interpolate(frame, [length - 15, length - 8], [0, 1], { ...clamp, easing: (p) => p * p });
  const land = interpolate(frame, [length - 14, length - 1], [0, 1], clamp);
  const eased = 1 - (1 - land) ** 3;
  return (
    <>
      {leave < 1 && (
        <div style={{ position: "absolute", left: 150, right: 150, top: 690, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", transform: `translateY(${-leave * 900}px)`, filter: `blur(${leave * 16}px)` }}>
          <Img src={staticFile("brand/logo-dark.svg")} style={{ width: 620, opacity: Math.min(1, logo * 1.4), transform: `scale(${0.92 + 0.08 * logo})` }} />
          <div style={{ width: 120 * rule, height: 2, margin: "54px 0 50px", background: YELLOW }} />
          <div style={{ fontFamily: SERIF, fontWeight: 600, lineHeight: 1.14, letterSpacing: "-0.015em" }}>
            <Words text={text} from={9} size={76} ink={INK} em={GREEN} />
          </div>
        </div>
      )}
      {land > 0 && <Paper {...HOOK_CARD} y={HOOK_CARD.y - (1 - eased) * 1500} rotate={HOOK_CARD.rotate + (1 - eased) * 26} />}
    </>
  );
};

export const Story: React.FC<StoryProps> = ({ name, recording, script, timelines }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  if (!script || !timelines) return null;
  const beat = (b: number) => Math.round((b * 60 * fps) / script.bpm);
  const rec = recording ?? name;

  /** The way a scene arrives and the way it leaves depend on the transition between the two. */
  const motion = (scene: Scene, i: number): React.CSSProperties => {
    const from = beat(scene.from);
    const to = beat(scene.to);
    const dir = i % 2 ? -1 : 1;
    const next = script.scenes[i + 1];
    const t = frame - from;
    if (next && frame >= to - 3 && next.enter === "whip") {
      const p = ((frame - (to - 3) + 1) / 3) ** 2;
      return { transform: `translateX(${dir * -1300 * p}px)`, filter: `blur(${p * 34}px)` };
    }
    if (next && frame >= to - 5 && next.enter === "scale") {
      const p = ((frame - (to - 5) + 1) / 5) ** 2;
      return { transform: `scale(${1 + p * 1.1})`, transformOrigin: `540px ${FOCUS.y}px`, filter: `blur(${p * 26}px)` };
    }
    if (scene.enter === "whip" && t < 5) {
      const p = 1 - (1 - (t + 2) / 7) ** 3;
      return { transform: `translateX(${dir * 1300 * (1 - p)}px)`, filter: `blur(${(1 - p) * 34}px)` };
    }
    if (scene.enter === "scale" && t < 8) {
      const p = 1 - (1 - t / 8) ** 3;
      return { transform: `scale(${0.68 + 0.32 * p})`, transformOrigin: `540px ${FOCUS.y}px`, filter: `blur(${(1 - p) * 22}px)` };
    }
    if (scene.enter === "match" && t < 12) {
      const p = 1 - (1 - t / 11) ** 3;
      return { transform: `perspective(1600px) rotateY(${(1 - Math.min(1, p)) * -90}deg)`, transformOrigin: `${FOCUS.x}px ${FOCUS.y}px` };
    }
    return {};
  };

  const label = script.scenes.find((s) => s.type === "phone" && frame >= beat(s.from) && frame < beat(s.to)) as Extract<Scene, { type: "phone" }> | undefined;

  return (
    <AbsoluteFill style={{ fontFamily: "'MP Poppins', sans-serif", background: IVORY }}>
      <Depth frame={frame} total={durationInFrames} />

      {script.scenes.map((scene, i) => {
        const from = beat(scene.from);
        const length = beat(scene.to) - from;
        if (frame < from || frame >= from + length) return null;
        let body: React.ReactNode = null;
        if (scene.type === "hook") {
          body = <Sequence from={from} durationInFrames={length} layout="none"><Hook beat={beat} /></Sequence>;
        } else if (scene.type === "problem") {
          body = <Sequence from={from} durationInFrames={length} layout="none"><Problem beat={beat} /></Sequence>;
        } else if (scene.type === "close") {
          body = <Sequence from={from} durationInFrames={length} layout="none"><Close text={script.close.text} length={length} /></Sequence>;
        } else {
          const take = script.takes.find((x) => x.id === scene.take);
          const timeline = timelines[scene.take];
          if (!take || !timeline) throw new Error(`copione: no take "${scene.take}"`);
          const drift = scene.drift ? 1 + ((frame - from) / length) * 0.05 : 1;
          body = (
            <Sequence from={from - beat(scene.takeFrom ?? 0)} durationInFrames={length + beat(scene.takeFrom ?? 0)} layout="none">
              <PhoneShot recording={rec} take={take} timeline={timeline} beat={beat} drift={drift} />
            </Sequence>
          );
        }
        return (
          <div key={i} style={{ position: "absolute", left: 0, top: 0, width: 1080, height: 1920, ...motion(scene, i) }}>
            {body}
          </div>
        );
      })}

      {/* The picture slides under the top of the frame: the texts always sit on the background. */}
      <AbsoluteFill style={{ maskImage: "linear-gradient(#000 450px, transparent 525px)", WebkitMaskImage: "linear-gradient(#000 450px, transparent 525px)" }}>
        <Depth frame={frame} total={durationInFrames} />
      </AbsoluteFill>

      {/* Reels safe area: clear of the top bar and of the buttons on the right. */}
      {script.captions.map((c, i) =>
        frame >= beat(c.from) && frame < beat(c.to) ? (
          <div key={i} style={{ position: "absolute", left: 76, right: 150, top: 200, fontFamily: SERIF, fontWeight: 600, lineHeight: 1.04, letterSpacing: "-0.025em" }}>
            <Words text={c.text} from={beat(c.from)} to={c.hold ? undefined : beat(c.to)} instant={c.instant} stagger={c.stagger} size={c.size ?? 104} ink={INK} em={GREEN} />
          </div>
        ) : null,
      )}

      {label?.label && (
        <div style={{ position: "absolute", left: 80, top: 452, color: GREEN, fontSize: 24, fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase" }}>{label.label}</div>
      )}
    </AbsoluteFill>
  );
};
