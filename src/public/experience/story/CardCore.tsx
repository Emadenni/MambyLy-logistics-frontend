import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { CARD, explode } from "./storyTimeline";
import { story } from "./progress";
import { cardShape } from "./CardModel";

const LOOPS = 3;
const GOLD = "#d8bf86";

/** A closed rounded-rectangle path for one turn of the antenna. */
const loopCurve = (w: number, h: number, r: number) => {
  const pts = cardShape(w, h, r)
    .getSpacedPoints(160)
    .map((p) => new THREE.Vector3(p.x, p.y, 0));
  pts.pop(); // the shape closes on its first point
  return new THREE.CatmullRomCurve3(pts, true, "centripetal");
};

/**
 * The inside of the card (chapter 4, exploded view): a clear core with the NFC antenna (three gold
 * turns) and the chip that gently pulses. Hidden while the card is whole.
 */
const CardCore: React.FC = () => {
  const group = useRef<THREE.Group>(null);
  const chip = useRef<THREE.MeshPhysicalMaterial>(null);
  const plate = useRef<THREE.MeshPhysicalMaterial>(null);
  const { tubes, core } = useMemo(() => {
    const tubes = Array.from({ length: LOOPS }, (_, i) => {
      const inset = 0.22 + i * 0.09;
      return new THREE.TubeGeometry(loopCurve(CARD.w - inset * 2, CARD.h - inset * 2, Math.max(0.05, CARD.r - inset * 0.4)), 220, 0.011, 8, true);
    });
    const core = new THREE.ShapeGeometry(cardShape(CARD.w, CARD.h, CARD.r), 16);
    return { tubes, core };
  }, []);
  useEffect(
    () => () => {
      tubes.forEach((t) => t.dispose());
      core.dispose();
    },
    [tubes, core],
  );

  useFrame((state) => {
    const ex = explode(story.shown);
    if (group.current) group.current.visible = ex > 0.02;
    if (plate.current) plate.current.opacity = 0.32 * Math.min(1, ex * 2);
    if (chip.current) chip.current.emissiveIntensity = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(state.clock.elapsedTime * 2.6));
  });

  return (
    <group ref={group} visible={false}>
      <mesh geometry={core}>
        <meshPhysicalMaterial ref={plate} color="#e8efe9" roughness={0.15} transparent opacity={0} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      {tubes.map((tube, i) => (
        <mesh key={i} geometry={tube}>
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.3} envMapIntensity={1.2} />
        </mesh>
      ))}
      <RoundedBox args={[0.34, 0.26, 0.03]} radius={0.012} smoothness={3} position={[CARD.chip[0], CARD.chip[1], 0]}>
        <meshPhysicalMaterial ref={chip} color={GOLD} metalness={0.9} roughness={0.25} emissive="#f2cc58" emissiveIntensity={0.4} />
      </RoundedBox>
    </group>
  );
};

export default CardCore;
