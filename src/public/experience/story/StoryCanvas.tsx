import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, RoundedBox } from "@react-three/drei";
import { easing } from "maath";
import { CARD, CARD_FRAMES, CARD_GONE, MOBILE, PHONE, PHONE_FRAMES, kf, type Pose } from "./storyTimeline";
import { story } from "./progress";

/** How quickly objects catch up with the scroll (seconds to cover most of the way). */
const LAG = { card: 0.32, phone: 0.24 };

/** Flat rounded rectangle with a little thickness: the card body. */
export const cardGeometry = (w: number, h: number, r: number, depth: number) => {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, { depth, bevelEnabled: true, bevelSize: 0.008, bevelThickness: 0.008, bevelSegments: 3, curveSegments: 12 });
  g.translate(0, 0, -depth / 2);
  return g;
};

const target = (): Pose => ({ x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 });

/** Moves a group towards its keyframed pose, damped, so jumpy scrolling still reads as one motion. */
const usePose = (frames: typeof CARD_FRAMES, lag: number, adjust: (pose: Pose) => void) => {
  const ref = useRef<THREE.Group>(null);
  const pose = useMemo(target, []);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    kf(story.p, frames, pose);
    adjust(pose);
    easing.damp3(g.position, [pose.x, pose.y, pose.z], lag, dt);
    easing.dampE(g.rotation, [pose.rx, pose.ry, pose.rz], lag, dt);
    easing.damp3(g.scale, pose.s, lag, dt);
  });
  return ref;
};

const Card: React.FC = () => {
  const geometry = useMemo(() => cardGeometry(CARD.w, CARD.h, CARD.r, 0.03), []);
  const ref = usePose(CARD_FRAMES, LAG.card, (pose) => {
    if (story.mobile) {
      pose.x = 0;
      pose.y += MOBILE.cardY;
    }
    // The pointer tilts the card a little, never more than a few degrees.
    pose.rx += story.pointer.y * 0.06;
    pose.ry += story.pointer.x * 0.1;
  });
  useFrame(() => {
    if (ref.current) ref.current.visible = story.shown < CARD_GONE;
  });
  return (
    <group ref={ref}>
      <mesh geometry={geometry}>
        <meshPhysicalMaterial color="#103b35" roughness={0.55} clearcoat={0.4} clearcoatRoughness={0.4} />
      </mesh>
    </group>
  );
};

const Phone: React.FC = () => {
  const ref = usePose(PHONE_FRAMES, LAG.phone, (pose) => {
    if (story.mobile) pose.x *= MOBILE.phoneX;
  });
  return (
    <group ref={ref}>
      <RoundedBox args={[PHONE.w, PHONE.h, PHONE.d]} radius={0.04} smoothness={4}>
        <meshPhysicalMaterial color="#1b1f1e" roughness={0.35} metalness={0.2} />
      </RoundedBox>
    </group>
  );
};

/** Narrow screens see less of the world at fov 30: the whole scene shrinks until the card fits. */
const FIT_WIDTH = CARD.w * 1.18;
const Fit: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const width = useThree((s) => s.viewport.width);
  const scale = Math.min(1, width / FIT_WIDTH);
  return <group scale={scale}>{children}</group>;
};

/** Damped progress shared by the scene, so every object reads the same moment. */
const Clock: React.FC = () => {
  useFrame((_, dt) => {
    easing.damp(story, "shown", story.p, LAG.card, dt);
  });
  return null;
};

/** Soft studio light without downloads: a few light panels rendered once into the environment. */
const Studio: React.FC = () => (
  <>
    <ambientLight intensity={0.35} />
    <directionalLight position={[3, 5, 6]} intensity={1.1} />
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={2.2} position={[0, 4, 4]} scale={[8, 3, 1]} />
      <Lightformer form="rect" intensity={1.2} position={[-5, 1, 2]} rotation-y={Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="rect" intensity={0.8} position={[5, -1, 2]} rotation-y={-Math.PI / 2} scale={[6, 2, 1]} />
      <Lightformer form="circle" intensity={0.6} color="#cfdcd4" position={[0, -4, 3]} scale={4} />
    </Environment>
  </>
);

/** The fixed scene behind the story (see StoryPage). */
const StoryCanvas: React.FC = () => (
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
      <Studio />
      <Fit>
        <Card />
        <Phone />
      </Fit>
    </Canvas>
  </div>
);

export default StoryCanvas;
