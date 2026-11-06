import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import { cardStrings } from "../../digital-card/strings";
import type { Lang } from "../routes";
import { PHONE, profileShown, savePressed, scanShown, shareShown } from "./storyTimeline";
import { story } from "./progress";
import { cardShape, faceGeometry } from "./CardModel";
import { SCREEN, cameraTexture, profileTexture, shareTexture } from "./textures";
import { media } from "../media";
import { scrollPage, useScrollingPage } from "./scrollingPage";

const useScreens = (lang: Lang) => {
  const [maps, setMaps] = useState<{ profile: THREE.Texture; camera: THREE.Texture; share: THREE.Texture } | null>(null);
  useEffect(() => {
    let live = true;
    const s = cardStrings[lang];
    Promise.all([profileTexture(lang, { save: s.save, email: s.email, website: s.website }), cameraTexture(lang), shareTexture(lang)]).then(
      ([profile, camera, share]) => {
        if (!live) return [profile, camera, share].forEach((t) => t.dispose());
        story.profile = profile.image as HTMLCanvasElement;
        setMaps((old) => {
          if (old) Object.values(old).forEach((t) => t.dispose());
          return { profile, camera, share };
        });
      },
    );
    return () => {
      live = false;
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
 * A plain modern phone: graphite body, a screen that is lit (not shaded by the scene). Its screen
 * shows a website that scrolls by itself (the same architecture demo as the browser, mobile
 * version); MambyLy's digital profile fades in over it in chapter 2, and again after the scan in
 * chapter 4.
 * `screenRef` exposes the screen for the website reveal of chapter 5.
 */
const PhoneModel: React.FC<{
  lang: Lang;
  screenRef?: React.RefObject<THREE.Mesh>;
  anchors?: { left: React.RefObject<THREE.Object3D>; right: React.RefObject<THREE.Object3D> };
}> = ({ lang, screenRef, anchors }) => {
  const maps = useScreens(lang);
  const site = useScrollingPage(media(`scroll-${lang}-architecture-mobile`, 390), { w: 390, h: 2889 }, SCREEN.w / SCREEN.h);
  const profile = useRef<THREE.MeshBasicMaterial>(null);
  const camera = useRef<THREE.MeshBasicMaterial>(null);
  const scanLine = useRef<THREE.Mesh>(null);
  const press = useRef<THREE.MeshBasicMaterial>(null);
  const sheet = useRef<THREE.Mesh>(null);
  const ownScreen = useRef<THREE.Mesh>(null);
  const screenMesh = screenRef ?? ownScreen;
  const size = useThree((s) => s.size);
  const corner = useMemo(() => new THREE.Vector3(), []);
  const screen = useMemo(() => faceGeometry(cardShape(SCREEN.w, SCREEN.h, SCREEN.r), SCREEN.w, SCREEN.h), []);
  // "Save contact" on the profile (profileTexture: 720 x 120 px at y 1030 of 900 x 1917)
  const button = useMemo(() => faceGeometry(cardShape(0.76, 0.135, 0.0675), 0.76, 0.135), []);
  // the share sheet: the lower 56 % of the screen
  const sheetGeo = useMemo(() => new THREE.PlaneGeometry(SCREEN.w, SCREEN.h * 0.56), []);
  useEffect(
    () => () => {
      screen.dispose();
      button.dispose();
      sheetGeo.dispose();
    },
    [screen, button, sheetGeo],
  );

  useFrame(({ camera: cam, clock }) => {
    const p = story.shown;
    scrollPage(site, clock.elapsedTime, 2.5);
    if (profile.current) profile.current.opacity = profileShown(p);
    const scan = scanShown(p);
    if (camera.current) camera.current.opacity = scan;
    if (scanLine.current) {
      scanLine.current.visible = scan > 0.3;
      scanLine.current.position.y = SCREEN.h * 0.06 + Math.sin(clock.elapsedTime * 3.2) * SCREEN.h * 0.13;
    }
    if (press.current) press.current.opacity = savePressed(p) * 0.55;
    if (sheet.current) {
      const up = shareShown(p);
      sheet.current.visible = up > 0.01;
      sheet.current.position.y = -SCREEN.h / 2 + SCREEN.h * 0.28 - (1 - up) * SCREEN.h * 0.08;
      (sheet.current.material as THREE.MeshBasicMaterial).opacity = up;
    }
    // the screen's rectangle on the page, for the website reveal of chapter 5
    const m = screenMesh.current;
    if (!m) return;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    for (const [sx, sy] of [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1],
    ]) {
      corner.set((sx * SCREEN.w) / 2, (sy * SCREEN.h) / 2, 0).applyMatrix4(m.matrixWorld).project(cam);
      const px = ((corner.x + 1) / 2) * size.width;
      const py = ((1 - corner.y) / 2) * size.height;
      x0 = Math.min(x0, px);
      x1 = Math.max(x1, px);
      y0 = Math.min(y0, py);
      y1 = Math.max(y1, py);
    }
    story.screen.x = x0;
    story.screen.y = y0;
    story.screen.w = x1 - x0;
    story.screen.h = y1 - y0;
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
      <mesh ref={screenMesh} geometry={screen} position-z={z + 0.0008} renderOrder={1}>
        {site ? <meshBasicMaterial key="site" map={site} toneMapped={false} /> : <meshBasicMaterial key="off" color="#fbfaf6" toneMapped={false} />}
      </mesh>
      {maps && (
        <mesh geometry={screen} position-z={z + 0.0016} renderOrder={2}>
          <meshBasicMaterial ref={profile} map={maps.profile} toneMapped={false} transparent opacity={0} depthWrite={false} />
        </mesh>
      )}
      {maps && (
        <>
          <mesh geometry={screen} position-z={z + 0.002} renderOrder={3}>
            <meshBasicMaterial ref={camera} map={maps.camera} toneMapped={false} transparent opacity={0} depthWrite={false} />
          </mesh>
          <mesh ref={scanLine} position-z={z + 0.0026} visible={false} renderOrder={4}>
            <planeGeometry args={[SCREEN.w * 0.6, 0.008]} />
            <meshBasicMaterial color="#f2cc58" toneMapped={false} transparent opacity={0.9} depthWrite={false} />
          </mesh>
          <mesh geometry={button} position={[0, -0.134, z + 0.0022]} renderOrder={5}>
            <meshBasicMaterial ref={press} color="#f2cc58" toneMapped={false} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          {/* rises a little and fades in, inside the screen; screen layers draw in a fixed order
              (sorting by distance would put the profile over them) */}
          <mesh ref={sheet} geometry={sheetGeo} position-z={z + 0.003} visible={false} renderOrder={6}>
            <meshBasicMaterial map={maps.share} toneMapped={false} transparent depthWrite={false} />
          </mesh>
        </>
      )}
      <object3D ref={anchors?.left} position={[-PHONE.w / 2, 0, z]} />
      <object3D ref={anchors?.right} position={[PHONE.w / 2, 0, z]} />
      {/* a faint glass reflection over the screen */}
      <mesh geometry={screen} position-z={z + 0.0034} renderOrder={7}>
        <meshPhysicalMaterial color="#ffffff" transparent opacity={0.06} roughness={0.08} metalness={0} depthWrite={false} />
      </mesh>
    </group>
  );
};

export default PhoneModel;
