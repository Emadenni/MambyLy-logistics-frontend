import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { Lang } from "../routes";
import { CARD } from "./storyTimeline";
import { backTexture, foilMask, frontTexture } from "./textures";

/** Rounded rectangle outline of a card, centred on the origin. */
export const cardShape = (w: number, h: number, r: number) => {
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
  return s;
};

/** Flat face of the shape with UVs 0..1 across the card (ShapeGeometry gives world units). */
export const faceGeometry = (shape: THREE.Shape, w: number, h: number) => {
  const g = new THREE.ShapeGeometry(shape, 16);
  const pos = g.attributes.position;
  const uv = g.attributes.uv;
  for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / w + 0.5, pos.getY(i) / h + 0.5);
  uv.needsUpdate = true;
  return g;
};

/** A sheet of the card (its thickness and edge), from z = 0 to z = depth. */
export const sheetGeometry = (shape: THREE.Shape, depth: number) => new THREE.ExtrudeGeometry(shape, { depth, bevelEnabled: false, curveSegments: 16 });

/** Thickness of each of the two sheets (front and back). Together about a real card's 0.76 mm. */
export const SHEET = 0.015;
const LIFT = 0.0006; // the printed faces sit just above their sheet

const useTextures = (lang: Lang) => {
  const [maps, setMaps] = useState<{ front: THREE.Texture; foil: THREE.Texture; back: THREE.Texture } | null>(null);
  useEffect(() => {
    let live = true;
    Promise.all([frontTexture(lang), foilMask(), backTexture(lang)]).then(([front, foil, back]) => {
      if (!live) return [front, foil, back].forEach((t) => t.dispose());
      setMaps((old) => {
        if (old) Object.values(old).forEach((t) => t.dispose());
        return { front, foil, back };
      });
    });
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
 * MambyLy's card: a green front sheet with the logo in gold foil, a cream back sheet with the QR
 * code. The two sheets are separate groups so the exploded view of chapter 4 can pull them apart.
 */
const CardModel: React.FC<{
  lang: Lang;
  frontRef?: React.RefObject<THREE.Group>;
  backRef?: React.RefObject<THREE.Group>;
  children?: React.ReactNode;
}> = ({ lang, frontRef, backRef, children }) => {
  const maps = useTextures(lang);
  const ownFront = useRef<THREE.Group>(null);
  const ownBack = useRef<THREE.Group>(null);
  const front = frontRef ?? ownFront;
  const back = backRef ?? ownBack;
  const { face, sheet } = useMemo(() => {
    const shape = cardShape(CARD.w, CARD.h, CARD.r);
    return { face: faceGeometry(shape, CARD.w, CARD.h), sheet: sheetGeometry(shape, SHEET) };
  }, []);
  useEffect(
    () => () => {
      face.dispose();
      sheet.dispose();
    },
    [face, sheet],
  );
  return (
    <group>
      <group ref={front}>
        <mesh geometry={sheet}>
          <meshStandardMaterial color="#0e3530" roughness={0.6} />
        </mesh>
        {/* keyed: a material that gains a map needs a new shader */}
        <mesh geometry={face} position-z={SHEET + LIFT}>
          {maps ? (
            <meshPhysicalMaterial key="print" map={maps.front} roughness={0.52} clearcoat={0.2} clearcoatRoughness={0.4} envMapIntensity={0.3} />
          ) : (
            <meshPhysicalMaterial key="plain" color="#103b35" roughness={0.52} clearcoat={0.2} clearcoatRoughness={0.4} envMapIntensity={0.3} />
          )}
        </mesh>
        {maps && (
          <mesh geometry={face} position-z={SHEET + LIFT * 2}>
            <meshPhysicalMaterial color="#eadcb8" metalness={1} roughness={0.22} envMapIntensity={1.25} alphaMap={maps.foil} transparent depthWrite={false} />
          </mesh>
        )}
      </group>
      <group ref={back}>
        <mesh geometry={sheet} position-z={-SHEET}>
          <meshStandardMaterial color="#e9e6dc" roughness={0.7} />
        </mesh>
        <mesh geometry={face} position-z={-SHEET - LIFT} rotation-y={Math.PI}>
          {maps ? <meshStandardMaterial key="print" map={maps.back} roughness={0.68} /> : <meshStandardMaterial key="plain" color="#f6f4ee" roughness={0.68} />}
        </mesh>
      </group>
      {children}
    </group>
  );
};

export default CardModel;
