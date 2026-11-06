import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { CARD, T, seg } from "./storyTimeline";
import { story } from "./progress";
import { SHEET } from "./CardModel";

const COUNT = 3;
const PERIOD = 1.6; // seconds for one ring to travel out

/**
 * Chapter 3: three soft rings leave the chip while the phone touches the card. Placed in the card's
 * own space, so they follow the card wherever it is.
 */
const NfcRings: React.FC = () => {
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const geometry = useMemo(() => new THREE.RingGeometry(0.18, 0.2, 64), []);
  useEffect(() => () => geometry.dispose(), [geometry]);

  useFrame((state) => {
    const p = story.shown;
    const amount = seg(p, T.tapRings.in[0], T.tapRings.in[1]) * (1 - seg(p, T.tapRings.out[0], T.tapRings.out[1]));
    const t = state.clock.elapsedTime / PERIOD;
    rings.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t + i / COUNT) % 1;
      ring.visible = amount > 0.01;
      ring.scale.setScalar(0.35 + phase * 2.6);
      (ring.material as THREE.MeshBasicMaterial).opacity = amount * (1 - phase) * Math.min(1, phase * 6) * 0.75;
    });
  });

  return (
    <group position={[CARD.chip[0], CARD.chip[1], SHEET + 0.004]}>
      {Array.from({ length: COUNT }, (_, i) => (
        <mesh key={i} ref={(m) => (rings.current[i] = m)} geometry={geometry} visible={false}>
          <meshBasicMaterial color="#cfdcd4" transparent opacity={0} depthWrite={false} toneMapped={false} />
        </mesh>
      ))}
    </group>
  );
};

export default NfcRings;
