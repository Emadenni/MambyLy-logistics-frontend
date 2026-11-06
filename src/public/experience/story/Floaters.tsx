import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { easing } from "maath";
import { GLASS, T, TOKENS, seg } from "./storyTimeline";
import { story } from "./progress";
import { iconTexture } from "./textures";

/** Where the card is in chapter 4 (CARD_FRAMES 0.53–0.64), desktop and phones. */
const CENTER = { desk: [1.0, 0.15], phone: [0, 1.25] } as const;
const LAG = 0.2;

const amountAt = (p: number) => seg(p, T.floaters.in[0], T.floaters.in[1]) * (1 - seg(p, T.floaters.out[0], T.floaters.out[1]));

/**
 * Chapter 4: five sage tokens with the card's contact icons and, on larger screens, three small
 * rounded glass cubes drift around the opened card, then gather back into it.
 */
const Floaters: React.FC = () => {
  const items = useRef<(THREE.Group | null)[]>([]);
  const icons = useMemo(() => TOKENS.map((t) => iconTexture(t.icon)), []);
  const disc = useMemo(() => new THREE.CylinderGeometry(0.34, 0.34, 0.07, 48).rotateX(Math.PI / 2), []);
  const face = useMemo(() => new THREE.CircleGeometry(0.3, 48), []);
  useEffect(
    () => () => {
      icons.forEach((t) => t.dispose());
      disc.dispose();
      face.dispose();
    },
    [icons, disc, face],
  );
  const scales = useMemo(() => [...TOKENS, ...GLASS].map(() => ({ s: 0 })), []);

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime;
    const amount = amountAt(story.shown);
    const [cx, cy] = story.mobile ? CENTER.phone : CENTER.desk;
    const spread = story.mobile ? 0.62 : 1;
    const all = [...TOKENS.map((k) => k.at), ...GLASS];
    all.forEach((at, i) => {
      const g = items.current[i];
      if (!g) return;
      const glass = i >= TOKENS.length;
      const shown = !(glass && story.mobile);
      // from inside the card outwards, then a slow drift of their own
      const out = 0.35 + 0.65 * amount;
      const bob = Math.sin(t * 0.7 + i * 1.3) * 0.08;
      g.position.set(cx + at[0] * spread * out, cy + at[1] * spread * out + bob, at[2] * out);
      // tokens sway but keep their icon to the viewer; the glass may turn freely
      if (glass) g.rotation.set(Math.sin(t * 0.4 + i) * 0.4, t * 0.25 + i, Math.cos(t * 0.3 + i) * 0.2);
      else g.rotation.set(Math.sin(t * 0.5 + i) * 0.22, Math.sin(t * 0.35 + i * 2) * 0.45, Math.cos(t * 0.3 + i) * 0.1);
      easing.damp(scales[i], "s", shown ? amount * (story.mobile ? 0.75 : 1) : 0, LAG, dt);
      g.scale.setScalar(Math.max(0.0001, scales[i].s));
      g.visible = scales[i].s > 0.01;
    });
  });

  return (
    <>
      {TOKENS.map((token, i) => (
        <group key={token.icon} ref={(g) => (items.current[i] = g)} visible={false}>
          <mesh geometry={disc}>
            <meshStandardMaterial color="#7f9c90" roughness={0.55} />
          </mesh>
          <mesh geometry={face} position-z={0.0355}>
            <meshStandardMaterial map={icons[i]} roughness={0.6} />
          </mesh>
          <mesh geometry={face} position-z={-0.0355} rotation-y={Math.PI}>
            <meshStandardMaterial map={icons[i]} roughness={0.6} />
          </mesh>
        </group>
      ))}
      {GLASS.map((_, i) => (
        <group key={`glass-${i}`} ref={(g) => (items.current[TOKENS.length + i] = g)} visible={false}>
          <RoundedBox args={[0.46, 0.46, 0.46]} radius={0.08} smoothness={4}>
            <meshPhysicalMaterial transmission={1} roughness={0.12} thickness={0.4} ior={1.4} color="#ffffff" attenuationColor="#cfdcd4" attenuationDistance={1.2} />
          </RoundedBox>
        </group>
      ))}
    </>
  );
};

export default Floaters;
