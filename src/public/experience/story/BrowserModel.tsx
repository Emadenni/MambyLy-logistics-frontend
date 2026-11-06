import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Lang } from "../routes";
import { media } from "../media";
import { BROWSER, brandSiteShown } from "./storyTimeline";
import { story } from "./progress";
import { brandPageTexture } from "./textures";
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

/** The MambyLy page, drawn once per language. */
const useBrandPage = (lang: Lang) => {
  const [map, setMap] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let live = true;
    brandPageTexture(lang).then((t) => {
      if (!live) return t.dispose();
      setMap((old) => {
        old?.dispose();
        return t;
      });
    });
    return () => {
      live = false;
    };
  }, [lang]);
  useEffect(() => () => map?.dispose(), [map]);
  return map;
};

const DOT = new THREE.CircleGeometry(0.028, 24);

/**
 * A desktop browser window: paper-white frame, a quiet bar with three dots, the website as a lit
 * screen (not shaded by the scene, like the phone's). In chapter 2 a MambyLy page fades in over
 * the demo: the same brand as on the card and the phone. `anchor` marks its left edge.
 */
const BrowserModel: React.FC<{ lang: Lang; anchor?: React.RefObject<THREE.Object3D> }> = ({ lang, anchor }) => {
  const map = useScreenTexture(media(`preview-${lang}-architecture-desktop`, 1280));
  const brand = useBrandPage(lang);
  const brandLayer = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    if (brandLayer.current) brandLayer.current.opacity = brandSiteShown(story.shown);
  });
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
      {brand && (
        <mesh geometry={screen} position={[0, screenY, z + 0.002]}>
          <meshBasicMaterial ref={brandLayer} map={brand} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      <object3D ref={anchor} position={[-BROWSER.w / 2, 0, z]} />
    </group>
  );
};

export default BrowserModel;
