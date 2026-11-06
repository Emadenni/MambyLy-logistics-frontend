import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { easing } from "maath";
import type { Lang } from "../routes";
import {
  BROWSER_FRAMES,
  BROWSER_GONE,
  CARD,
  CARD_FRAMES,
  CARD_GONE,
  EXPLODE_GAP,
  PHONE_FRAMES,
  PHONE_POSES,
  PHONE_SHOWN,
  type PhonePose,
  explode,
  heroDeskScale,
  heroDeskShift,
  kf,
  toPhone,
  type Pose,
} from "./storyTimeline";
import { story } from "./progress";
import CardModel from "./CardModel";
import PhoneModel from "./PhoneModel";
import BrowserModel from "./BrowserModel";
import CardCore from "./CardCore";
import Floaters from "./Floaters";

/** How quickly objects catch up with the scroll (seconds to cover most of the way). */
const LAG = { card: 0.16, phone: 0.13, browser: 0.16 };
/** The objects float up from below when the story first shows (after the veil, or on arrival). */
const INTRO = { s: 1.6, drop: 2.8 };

/**
 * What every object does on top of its keyframes: the phone layout, a slow float of its own, a
 * small tilt towards the pointer, and the rise from below when the story first shows.
 */
const live = (phase: number, phone: PhonePose[]) => {
  let since: number | null = null;
  return (pose: Pose, time: number) => {
    if (story.mobile) toPhone(pose, phone, story.p);
    else {
      const k = heroDeskScale(story.p);
      pose.x = pose.x * k + heroDeskShift(story.p);
      pose.y *= k;
      pose.s *= k;
    }
    pose.rx += story.pointer.y * 0.06;
    pose.ry += story.pointer.x * 0.1;
    pose.y += Math.sin(time * 0.8 + phase) * 0.035;
    pose.rz += Math.sin(time * 0.55 + 1 + phase) * 0.012;
    if (since === null && story.active) since = time + phase * 0.12;
    const rise = since === null ? 0 : Math.min(1, Math.max(0, (time - since) / INTRO.s));
    const left = Math.pow(1 - rise, 3);
    pose.y -= left * INTRO.drop;
    pose.rx += left * 0.5;
  };
};

const target = (): Pose => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 });

/** Moves a group towards its keyframed pose, damped, so jumpy scrolling still reads as one motion. */
const usePose = (frames: typeof CARD_FRAMES, lag: number, adjust: (pose: Pose, time: number) => void) => {
  const ref = useRef<THREE.Group>(null);
  const pose = useMemo(target, []);
  const placed = useRef(false);
  useFrame((state, dt) => {
    const g = ref.current;
    if (!g) return;
    kf(story.p, frames, pose);
    adjust(pose, state.clock.elapsedTime);
    if (!placed.current) {
      // first frame: start where the story is, not at the origin
      placed.current = true;
      g.position.set(pose.x, pose.y, pose.z);
      g.rotation.set(pose.rx, pose.ry, pose.rz);
      g.scale.setScalar(pose.s);
      return;
    }
    easing.damp3(g.position, [pose.x, pose.y, pose.z], lag, dt);
    easing.dampE(g.rotation, [pose.rx, pose.ry, pose.rz], lag, dt);
    easing.damp3(g.scale, pose.s, lag, dt);
  });
  return ref;
};

const Card: React.FC<{ lang: Lang }> = ({ lang }) => {
  const ref = usePose(CARD_FRAMES, LAG.card, useMemo(() => live(2, PHONE_POSES.card), []));
  const front = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const at = useMemo(() => new THREE.Vector3(), []);
  useFrame(({ camera }) => {
    const g = ref.current;
    if (!g) return;
    g.visible = story.shown < CARD_GONE;
    // chapter 4: the sheets move apart along the card's own depth and show its inside
    const ex = explode(story.shown) * EXPLODE_GAP;
    if (front.current) front.current.position.z = ex;
    if (back.current) back.current.position.z = -ex;
    // where the card is on screen, for the green background that opens behind it
    at.setFromMatrixPosition(g.matrixWorld).project(camera);
    story.focus.x = (at.x + 1) * 50;
    story.focus.y = (1 - at.y) * 50;
  });
  return (
    <group ref={ref}>
      <CardModel lang={lang} frontRef={front} backRef={back} anchor={anchors.card}>
        <CardCore />
      </CardModel>
    </group>
  );
};

const Phone: React.FC<{ lang: Lang }> = ({ lang }) => {
  const ref = usePose(PHONE_FRAMES, LAG.phone, useMemo(() => live(1, PHONE_POSES.phone), []));
  useFrame(() => {
    if (ref.current) ref.current.visible = story.shown >= PHONE_SHOWN[0] && story.shown < PHONE_SHOWN[1];
  });
  return (
    <group ref={ref} visible={false}>
      <PhoneModel lang={lang} anchors={{ left: anchors.phoneLeft, right: anchors.phoneRight }} />
    </group>
  );
};

const Browser: React.FC<{ lang: Lang }> = ({ lang }) => {
  const ref = usePose(BROWSER_FRAMES, LAG.browser, useMemo(() => live(0, PHONE_POSES.browser), []));
  useFrame(() => {
    if (ref.current) ref.current.visible = story.shown < BROWSER_GONE;
  });
  return (
    <group ref={ref}>
      <BrowserModel lang={lang} anchor={anchors.site} />
    </group>
  );
};

/** Ends of the chapter 2 lines on the objects; projected to page pixels for the HTML overlay. */
const anchors = {
  card: React.createRef<THREE.Object3D>(),
  phoneLeft: React.createRef<THREE.Object3D>(),
  phoneRight: React.createRef<THREE.Object3D>(),
  site: React.createRef<THREE.Object3D>(),
};
const Links: React.FC = () => {
  const v = useMemo(() => new THREE.Vector3(), []);
  const size = useThree((s) => s.size);
  useFrame(({ camera }) => {
    const put = (ref: React.RefObject<THREE.Object3D>, out: { x: number; y: number }) => {
      if (!ref.current) return;
      ref.current.getWorldPosition(v).project(camera);
      out.x = ((v.x + 1) / 2) * size.width;
      out.y = ((1 - v.y) / 2) * size.height;
    };
    put(anchors.card, story.links.card);
    put(anchors.phoneLeft, story.links.phoneLeft);
    put(anchors.phoneRight, story.links.phoneRight);
    put(anchors.site, story.links.site);
  });
  return null;
};

/**
 * Compiles every material of the scene ahead of time (objects of later chapters are hidden, and a
 * shader compiled on first sight stalls the frame where it appears). Twice: the card and phone
 * graphics arrive a moment later and change their materials.
 */
const Warmup: React.FC = () => {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    let live = true;
    const showAll = () => {
      const hidden: THREE.Object3D[] = [];
      scene.traverse((o) => {
        if (!o.visible) {
          hidden.push(o);
          o.visible = true;
        }
      });
      return () => hidden.forEach((o) => (o.visible = false));
    };
    const run = async () => {
      // the programs are queued at once (the browser compiles them in parallel), then the hidden
      // objects go back before the next frame is drawn
      const restore = showAll();
      const done = gl.compileAsync(scene, camera);
      restore();
      await done;
      if (!live) return;
      // one real frame off screen: the glass (transmission) pass and its shader variants are set up
      // on the first frame that draws it
      const again = showAll();
      const target = new THREE.WebGLRenderTarget(64, 64);
      gl.setRenderTarget(target);
      gl.render(scene, camera);
      gl.setRenderTarget(null);
      target.dispose();
      again();
    };
    const ids = [1200, 3500].map((ms) => window.setTimeout(run, ms));
    return () => {
      live = false;
      ids.forEach((id) => window.clearTimeout(id));
    };
  }, [gl, scene, camera]);
  return null;
};

/** The scene stops drawing while it is not on screen (the home veil is down). */
const Pause: React.FC = () => {
  const setFrameloop = useThree((s) => s.setFrameloop);
  useEffect(() => {
    let mode = "";
    const id = window.setInterval(() => {
      const want = story.active ? "always" : "never";
      if (want !== mode) {
        mode = want;
        setFrameloop(want);
      }
    }, 150);
    return () => window.clearInterval(id);
  }, [setFrameloop]);
  return null;
};

/** Narrow screens see less of the world at fov 30: the whole scene shrinks until the card fits. */
const FIT_WIDTH = CARD.w * 1.18;
const Fit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const width = useThree((s) => s.viewport.width);
  const size = useThree((s) => s.size);
  // short phone screens (browser bars out, landscape-ish): a little smaller still, so the objects
  // stay between the header and the text
  const short = size.width < 760 && size.height < 740 ? Math.max(0.72, size.height / 740) : 1;
  const scale = Math.min(1, width / FIT_WIDTH) * short;
  return <group scale={scale}>{children}</group>;
};

/** Damped progress shared by the scene, so every object reads the same moment. */
const Clock: React.FC = () => {
  useEffect(() => () => void (story.scene = false), []);
  useFrame((_, dt) => {
    story.scene = true;
    easing.damp(story, "shown", story.p, LAG.card, dt);
  });
  return null;
};

/** Soft studio light without downloads: a few light panels rendered once into the environment. */
const Studio: React.FC = () => (
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[3, 5, 6]} intensity={2.3} />
    <directionalLight position={[-5, 1.5, 4]} intensity={0.7} color="#eef3ef" />
    <Environment resolution={256} frames={1}>
      {/* a warm room tone, so metals (the gold foil) never mirror black */}
      <color attach="background" args={["#cfc8b8"]} />
      <Lightformer form="rect" intensity={1.6} color="#fff6e6" position={[0, 1.5, 9]} scale={[10, 4, 1]} />
      <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={0.8} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="circle" intensity={0.6} color="#cfdcd4" position={[0, -4, 3]} scale={4} />
    </Environment>
  </>
);

/** The fixed scene behind the story (see StoryPage). */
const StoryCanvas: React.FC<{ lang: Lang }> = ({ lang }) => (
  <div className="mp-tale__gl" aria-hidden="true">
    <Canvas
      dpr={[1, story.mobile ? 1.5 : 2]}
      camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 60 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
      }}
    >
      <Clock />
      <Links />
      <Warmup />
      <Pause />
      <Studio />
      <Fit>
        <Browser lang={lang} />
        <Card lang={lang} />
        <Phone lang={lang} />
        <Floaters />
      </Fit>
    </Canvas>
  </div>
);

export default StoryCanvas;
