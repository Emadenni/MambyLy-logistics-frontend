import React, { useEffect, useMemo, useState } from "react";
import * as THREE from "three";
import { RoundedBox } from "@react-three/drei";
import type { Lang } from "../routes";
import { media } from "../media";
import { BROWSER } from "./storyTimeline";
import { cardShape, faceGeometry } from "./CardModel";

/** A website picture as a lit screen texture (the browser shows real MambyLy demos). */
const useScreenTexture = (src: string) => {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    new THREE.TextureLoader().load(src, (t) => {
      if (!live) return t.dispose();
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      setMap((old) => {
        old?.dispose();
        return t;
      });
    });
    return () => {
      live = false;
    };
  }, [src]);
  useEffect(() => () => map?.dispose(), [map]);
  return map;
};

const DOT = new THREE.CircleGeometry(0.028, 24);

/**
 * A desktop browser window: paper-white frame, a quiet bar with three dots, the website as a lit
 * screen (not shaded by the scene, like the phone's).
 */
const BrowserModel: React.FC<{ lang: Lang }> = ({ lang }) => {
  const map = useScreenTexture(media(`preview-${lang}-architecture-desktop`, 1280));
  const inset = 0.05;
  const screenW = BROWSER.w - inset * 2;
  const screenH = BROWSER.h - BROWSER.bar - inset;
  const screen = useMemo(() => faceGeometry(cardShape(screenW, screenH, 0.03), screenW, screenH), [screenW, screenH]);
  useEffect(() => () => screen.dispose(), [screen]);
  const z = BROWSER.d / 2;
  const barY = BROWSER.h / 2 - BROWSER.bar / 2;
  const screenY = -BROWSER.bar / 2 + inset / 2;

  return (
    <group>
      <RoundedBox args={[BROWSER.w, BROWSER.h, BROWSER.d]} radius={BROWSER.r * 0.4} smoothness={4}>
        <meshPhysicalMaterial color="#f3f2ee" roughness={0.42} clearcoat={0.3} clearcoatRoughness={0.4} />
      </RoundedBox>
      {[0, 1, 2].map((i) => (
        <mesh key={i} geometry={DOT} position={[-BROWSER.w / 2 + 0.14 + i * 0.09, barY, z + 0.001]}>
          <meshBasicMaterial color="#c9c8c1" toneMapped={false} />
        </mesh>
      ))}
      <mesh geometry={screen} position={[0, screenY, z + 0.001]}>
        {map ? <meshBasicMaterial key="site" map={map} toneMapped={false} /> : <meshBasicMaterial key="blank" color="#fbfaf6" toneMapped={false} />}
      </mesh>
    </group>
  );
};

export default BrowserModel;
