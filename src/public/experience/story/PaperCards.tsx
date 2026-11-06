import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { CARD, T, seg } from "./storyTimeline";
import { story } from "./progress";
import { cardShape, faceGeometry } from "./CardModel";
import { paperTexture } from "./textures";

/**
 * Chapter 2: ordinary paper cards gather around MambyLy's card, then fall away spinning and fade.
 * Offsets are from the card's centre (x, y, z) with a resting tilt (rx, ry, rz); phones use the
 * first six only.
 */
const CARDS: [number, number, number, number, number, number][] = [
  [-2.35, 1.75, -1.6, 0.25, 0.4, -0.18],
  [2.45, 1.65, -0.9, -0.2, -0.35, 0.22],
  [-2.6, -1.95, -0.8, 0.15, 0.55, 0.1],
  [2.6, -1.35, 0.15, 0.3, -0.5, -0.12],
  [0.15, 2.15, -1.9, -0.35, 0.1, 0.06],
  [-0.35, -2.05, -1.1, 0.4, -0.2, -0.2],
  [-1.55, 0.45, -2.3, 0.1, 0.7, 0.25],
  [1.6, 0.25, -2.1, -0.1, -0.6, -0.08],
  [3.05, 0.55, 0.55, 0.2, -0.75, 0.3],
  [-1.2, 2.25, -0.6, -0.25, 0.35, -0.3],
];
const PHONE_COUNT = 6;
const SIZE = 0.52;
const LAG = 0.16;

const PaperCards: React.FC = () => {
  const refs = useRef<(THREE.Group | null)[]>([]);
  const { face, edge, maps } = useMemo(() => {
    const shape = cardShape(CARD.w, CARD.h, 0.08);
    return {
      face: faceGeometry(shape, CARD.w, CARD.h),
      edge: new THREE.ExtrudeGeometry(shape, { depth: 0.012, bevelEnabled: false, curveSegments: 8 }),
      maps: [0, 1, 2].map(paperTexture),
    };
  }, []);
  useEffect(
    () => () => {
      face.dispose();
      edge.dispose();
      maps.forEach((m) => m.dispose());
    },
    [face, edge, maps],
  );
  const state = useMemo(() => CARDS.map(() => ({ opacity: 0 })), []);

  useFrame((_, dt) => {
    const p = story.p;
    const center = story.mobile ? [0, 1.1] : [1.55, 0];
    CARDS.forEach((c, i) => {
      const g = refs.current[i];
      if (!g) return;
      const shown = !story.mobile || i < PHONE_COUNT;
      const lag = i * 0.004;
      const enter = seg(p, T.paperIn[0] + lag, T.paperIn[1] + lag);
      const fall = seg(p, T.paperFall[0] + lag * 0.7, T.paperFall[1]);
      const [ox, oy, oz, rx, ry, rz] = c;
      const spread = story.mobile ? 0.72 : 1;
      // in from further out and further back, settle around the card, then drop and spin
      const out = 1 - enter;
      const x = center[0] + ox * spread * (1 + out * 1.4);
      const y = center[1] + oy * spread * (1 + out * 1.4) - fall * (7 + i * 0.35);
      const z = oz - out * 3 + fall * 0.6;
      easing.damp3(g.position, [x, y, z], LAG, dt);
      easing.dampE(g.rotation, [rx + fall * (2.6 + i * 0.2), ry + out * 0.8 + fall * 1.4, rz + fall * (1.8 - i * 0.25)], LAG, dt);
      const target = shown ? seg(p, T.paperIn[0] + lag, T.paperIn[0] + lag + 0.05) * (1 - seg(p, T.paperFall[0] + 0.03, T.paperFall[1])) : 0;
      easing.damp(state[i], "opacity", target, 0.2, dt);
      g.children.forEach((m) => (((m as THREE.Mesh).material as THREE.Material).opacity = state[i].opacity));
      g.visible = state[i].opacity > 0.01;
    });
  });

  return (
    <>
      {CARDS.map((_, i) => (
        <group key={i} ref={(g) => (refs.current[i] = g)} scale={SIZE} visible={false}>
          <mesh geometry={edge} position-z={-0.006}>
            <meshStandardMaterial color="#f3f2ed" roughness={0.9} transparent opacity={0} />
          </mesh>
          <mesh geometry={face} position-z={0.0065}>
            <meshStandardMaterial map={maps[i % 3]} roughness={0.85} transparent opacity={0} />
          </mesh>
        </group>
      ))}
    </>
  );
};

export default PaperCards;
