import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { cardStrings } from "../../digital-card/strings";
import type { Lang } from "../routes";
import { PHONE, T, seg } from "./storyTimeline";
import { story } from "./progress";
import { cardShape, faceGeometry } from "./CardModel";
import { SCREEN, lockTexture, profileTexture } from "./textures";

const useScreens = (lang: Lang) => {
  const [maps, setMaps] = useState<{ lock: THREE.Texture; profile: THREE.Texture } | null>(null);
  useEffect(() => {
    let live = true;
    const draw = () => {
      const s = cardStrings[lang];
      Promise.all([lockTexture(lang), profileTexture(lang, { save: s.save, email: s.email, website: s.website })]).then(([lock, profile]) => {
        if (!live) return [lock, profile].forEach((t) => t.dispose());
        setMaps((old) => {
          if (old) Object.values(old).forEach((t) => t.dispose());
          return { lock, profile };
        });
      });
    };
    draw();
    // the lock screen shows the real time: redrawn at every new minute
    let tick = window.setTimeout(function next() {
      draw();
      tick = window.setTimeout(next, 60_000);
    }, 60_000 - (Date.now() % 60_000) + 50);
    return () => {
      live = false;
      window.clearTimeout(tick);
    };
  }, [lang]);
  useEffect(
    () => () => {
      if (maps) Object.values(maps).forEach((t) => t.dispose());
    },
    [maps],
  );
  return maps;
};

/**
 * A plain modern phone: graphite body, a screen that is lit (not shaded by the scene). The lock
 * screen fades into the digital profile once the phone has touched the card (chapter 3).
 * `screenRef` exposes the screen for the website reveal of chapter 5.
 */
const PhoneModel: React.FC<{ lang: Lang; screenRef?: React.RefObject<THREE.Mesh> }> = ({ lang, screenRef }) => {
  const maps = useScreens(lang);
  const profile = useRef<THREE.MeshBasicMaterial>(null);
  const screen = useMemo(() => faceGeometry(cardShape(SCREEN.w, SCREEN.h, SCREEN.r), SCREEN.w, SCREEN.h), []);
  useEffect(() => () => screen.dispose(), [screen]);

  useFrame(() => {
    if (profile.current) profile.current.opacity = seg(story.shown, T.profileIn[0], T.profileIn[1]);
  });

  const z = PHONE.d / 2;
  return (
    <group>
      <RoundedBox args={[PHONE.w, PHONE.h, PHONE.d]} radius={0.04} smoothness={5}>
        <meshPhysicalMaterial color="#1d2321" roughness={0.38} metalness={0.55} clearcoat={0.6} clearcoatRoughness={0.25} />
      </RoundedBox>
      {/* side buttons */}
      <mesh position={[PHONE.w / 2 + 0.006, 0.42, 0]}>
        <boxGeometry args={[0.012, 0.26, 0.03]} />
        <meshStandardMaterial color="#2a302e" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh ref={screenRef} geometry={screen} position-z={z + 0.0008}>
        {maps ? <meshBasicMaterial key="lock" map={maps.lock} toneMapped={false} /> : <meshBasicMaterial key="off" color="#0a1412" toneMapped={false} />}
      </mesh>
      {maps && (
        <mesh geometry={screen} position-z={z + 0.0016}>
          <meshBasicMaterial ref={profile} map={maps.profile} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {/* a faint glass reflection over the screen */}
      <mesh geometry={screen} position-z={z + 0.0024}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.06} roughness={0.08} metalness={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default PhoneModel;
