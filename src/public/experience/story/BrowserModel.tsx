import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Lang } from "../routes";
import { media } from "../media";
import { BROWSER, SITE_DEMOS, brandSiteShown, siteDemoAt, siteLayers } from "./storyTimeline";
import { story } from "./progress";
import { brandPageTexture } from "./textures";
import { cardShape, faceGeometry } from "./CardModel";

/** Website pictures as lit screen textures: MambyLy's real demos, loaded once per language. */
const useDemoTextures = (lang: Lang) => {
  const [maps, setMaps] = useState<(THREE.Texture | null)[]>(() => SITE_DEMOS.map(() => null));
  useEffect(() => {
    let live = true;
    const loader = new THREE.TextureLoader();
    const loaded: THREE.Texture[] = [];
    SITE_DEMOS.forEach((id, i) =>
      loader.load(media(`preview-${lang}-${id}-desktop`, 1280), (t) => {
        if (!live) return t.dispose();
        t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = 8;
        loaded.push(t);
        setMaps((old) => old.map((m, j) => (j === i ? t : m)));
      }),
    );
    return () => {
      live = false;
      loaded.forEach((t) => t.dispose());
      setMaps(SITE_DEMOS.map(() => null));
    };
  }, [lang]);
  return maps;
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
 * Layers of a page for the exploded view, as shares of the screen height from the top: the bar of
 * the website, its hero, the content below. Each moves forward by its own amount.
 */
const LAYERS = [
  { from: 0, to: 0.08, z: 1.7, y: 0.3 },
  { from: 0.08, to: 0.66, z: 0.95, y: 0.08 },
  { from: 0.66, to: 1, z: 0.3, y: -0.22 },
];

/** A flat strip of the screen, with the UVs of that strip of the picture. */
const strip = (w: number, h: number, from: number, to: number) => {
  const g = new THREE.PlaneGeometry(w, h * (to - from));
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setY(i, 1 - from - (1 - uv.getY(i)) * (to - from));
  uv.needsUpdate = true;
  return g;
};

/**
 * A desktop browser window: paper-white frame, a quiet bar with three dots, the website as a lit
 * screen (not shaded by the scene, like the phone's). Chapter 2: a MambyLy page fades in over the
 * demo, the same brand as on the card and the phone. Chapter 3: the page comes apart in layers in
 * front of the frame, then the screen shows one real demo after the other. \`anchor\` marks the
 * left edge, where the chapter 2 line arrives.
 */
const BrowserModel: React.FC<{ lang: Lang; anchor?: React.RefObject<THREE.Object3D> }> = ({ lang, anchor }) => {
  const demos = useDemoTextures(lang);
  const brand = useBrandPage(lang);
  const screenA = useRef<THREE.Mesh>(null);
  const screenB = useRef<THREE.MeshBasicMaterial>(null);
  const brandLayer = useRef<THREE.MeshBasicMaterial>(null);
  const layers = useRef<(THREE.Mesh | null)[]>([]);
  const inset = 0.05;
  const screenW = BROWSER.w - inset * 2;
  const screenH = BROWSER.h - BROWSER.bar - inset;
  const screen = useMemo(() => faceGeometry(cardShape(screenW, screenH, 0.03), screenW, screenH), [screenW, screenH]);
  const strips = useMemo(() => LAYERS.map((l) => strip(screenW, screenH, l.from, l.to)), [screenW, screenH]);
  useEffect(
    () => () => {
      screen.dispose();
      strips.forEach((g) => g.dispose());
    },
    [screen, strips],
  );
  const z = BROWSER.d / 2;
  const barY = BROWSER.h / 2 - BROWSER.bar / 2;
  const screenY = -BROWSER.bar / 2 + inset / 2;

  useFrame(() => {
    const p = story.shown;
    if (brandLayer.current) brandLayer.current.opacity = brandSiteShown(p);
    // the demo on screen and the next one fading in over it
    const at = siteDemoAt(p);
    const i = Math.min(SITE_DEMOS.length - 1, Math.floor(at));
    const next = Math.min(SITE_DEMOS.length - 1, i + 1);
    const a = screenA.current?.material as THREE.MeshBasicMaterial | undefined;
    if (a && demos[i] && a.map !== demos[i]) {
      a.map = demos[i];
      a.needsUpdate = true;
    }
    if (screenB.current) {
      const fade = next > i ? at - i : 0;
      if (demos[next] && screenB.current.map !== demos[next]) {
        screenB.current.map = demos[next];
        screenB.current.needsUpdate = true;
      }
      screenB.current.opacity = fade;
    }
    // exploded layers: the flat screen gives way to its strips, which move forward
    const ex = siteLayers(p);
    if (screenA.current) screenA.current.visible = ex < 0.01;
    layers.current.forEach((m, k) => {
      if (!m) return;
      m.visible = ex >= 0.01;
      const l = LAYERS[k];
      const centre = screenY + screenH / 2 - (screenH * (l.from + l.to)) / 2;
      m.position.set(0, centre + l.y * ex, z + 0.001 + l.z * ex);
    });
  });

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
      <mesh ref={screenA} geometry={screen} position={[0, screenY, z + 0.001]}>
        {demos[0] ? <meshBasicMaterial key="site" map={demos[0]} toneMapped={false} /> : <meshBasicMaterial key="blank" color="#fbfaf6" toneMapped={false} />}
      </mesh>
      {demos[0] && (
        <mesh geometry={screen} position={[0, screenY, z + 0.0015]}>
          <meshBasicMaterial ref={screenB} map={demos[0]} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {demos[0] &&
        strips.map((g, k) => (
          <mesh key={k} ref={(m) => (layers.current[k] = m)} geometry={g} visible={false}>
            <meshBasicMaterial map={demos[0]} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        ))}
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
