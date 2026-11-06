import React, { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { easing } from "maath";
import { veil } from "./veilState";

const OVERSIZE = 1.05;
const MAX_TEXTURE = 2048;

const vertexShader = /* glsl */ `
uniform float uP, uTime, uR; uniform vec2 uSize;
varying vec2 vUv; varying vec3 vWorld; varying float vAbove;
const float PI = 3.14159265;
void main(){
  vUv = uv; vec3 p = position;
  p.z += sin(p.x*1.25 + uTime*.35 + p.y*.8)*.045 + sin(p.y*2.0 - uTime*.27 + p.x*.55)*.03;
  float halfH = uSize.y*.5;
  float h = mix(-halfH - .25, halfH + 2.2*uR + .9, uP) + .14*p.x;
  float d = h - p.y; vAbove = -d;
  if (d > 0.0) {
    float th = d / uR;
    if (th < PI) { p.y = h - uR*sin(th); p.z += uR - uR*cos(th); }
    else { p.y = h + (d - PI*uR); p.z += 2.0*uR; }
  }
  vec4 w = modelMatrix * vec4(p,1.0); vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;

// The prototype's silk. One change: the diffuse term is divided by its value on the flat veil
// (FLAT), so the resting silk is exactly the site's cream and the HTML stand-in matches it.
const fragmentShader = /* glsl */ `
uniform sampler2D uMap; uniform float uP; uniform vec3 uCream, uSage, uGreen, uGreen2;
varying vec2 vUv; varying vec3 vWorld; varying float vAbove;
const float FLAT = .62 + .38*0.69673;
void main(){
  vec3 N = normalize(cross(dFdx(vWorld), dFdy(vWorld)));
  vec3 V = normalize(cameraPosition - vWorld);
  if (dot(N,V) < 0.0) N = -N;
  vec3 L = normalize(vec3(.5,.9,1.0));
  float diff = (.62 + .38*max(dot(N,L),0.0)) / FLAT;
  float spec = pow(max(dot(reflect(-L,N),V),0.0), 36.0);
  float sheen = pow(1.0 - max(dot(N,V),0.0), 2.5);
  vec3 col;
  if (gl_FrontFacing) {
    float g = max(smoothstep(.75,.0,length((vUv-vec2(0.,0.))*vec2(1.0,1.3))),
                  smoothstep(.7,.0,length((vUv-vec2(1.,0.))*vec2(1.2,1.5))));
    col = mix(uCream, uSage, g*.55);
    float streak = smoothstep(.006,.0,abs(vUv.y-(.92+.25*sin(vUv.x*2.2+.6)))) * smoothstep(.2,.9,vUv.x);
    col += vec3(1.0)*streak*.35;
    vec4 tx = texture2D(uMap, vUv);
    col = mix(col, tx.rgb, tx.a);
    col = col*diff + vec3(1.0)*spec*.28 + vec3(1.0)*sheen*.12;
    if (uP > 0.001 && vAbove > 0.0) col *= 1.0 - .22*exp(-vAbove*2.2);
  } else {
    col = mix(uGreen, uGreen2, sheen*.9 + spec*.6);
    col *= .75 + .35*max(dot(N,L),0.0);
    col += vec3(.75,.9,.85)*spec*.25;
  }
  gl_FragColor = vec4(col,1.0);
  #include <colorspace_fragment>
}`;

/**
 * The print on the silk: logo and tagline drawn where the HTML ones are on screen, so the switch
 * from the HTML stand-in to the silk shows no jump. The texture covers the whole (oversized) plane.
 */
const drawPrint = async (brand: HTMLElement) => {
  await document.fonts.ready;
  const img = brand.querySelector("img");
  const line = brand.querySelector<HTMLElement>(".mp-veil__tagline");
  if (img && !img.complete) await new Promise((ok) => img.addEventListener("load", ok, { once: true }));
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const W = vw * OVERSIZE;
  const H = vh * OVERSIZE;
  const scale = Math.min(window.devicePixelRatio || 1, 2, MAX_TEXTURE / Math.max(W, H));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.scale(scale, scale);
  ctx.translate((W - vw) / 2, (H - vh) / 2);
  if (img) {
    const r = img.getBoundingClientRect();
    ctx.drawImage(img, r.left, r.top, r.width, r.height);
  }
  if (line) {
    const r = line.getBoundingClientRect();
    const cs = getComputedStyle(line);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = cs.letterSpacing === "normal" ? "0px" : cs.letterSpacing;
    ctx.fillStyle = cs.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(line.textContent ?? "", r.left + r.width / 2, r.top + r.height / 2);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  return texture;
};

const Silk: React.FC<{ brand: React.RefObject<HTMLElement>; onReady: () => void }> = ({ brand, onReady }) => {
  const { width, height } = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const [map, setMap] = useState<THREE.Texture | null>(null);
  const breath = useRef({ amp: 0 });
  const ready = useRef(false);

  const uniforms = useMemo(
    () => ({
      uP: { value: 0 },
      uTime: { value: 0 },
      uR: { value: 1 },
      uSize: { value: new THREE.Vector2(1, 1) },
      uMap: { value: null as THREE.Texture | null },
      uCream: { value: new THREE.Color("#f6f4ee") },
      uSage: { value: new THREE.Color("#7f9c90") },
      uGreen: { value: new THREE.Color("#103b35") },
      uGreen2: { value: new THREE.Color("#2a6a5d") },
    }),
    [],
  );

  const geometry = useMemo(() => new THREE.PlaneGeometry(width * OVERSIZE, height * OVERSIZE, 90, 150), [width, height]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  // The print follows the layout: redrawn whenever the viewport changes size.
  useEffect(() => {
    const el = brand.current;
    if (!el) return;
    let live = true;
    drawPrint(el).then((texture) => {
      if (!live) return texture.dispose();
      setMap((old) => {
        old?.dispose();
        return texture;
      });
    });
    return () => {
      live = false;
    };
  }, [brand, size.width, size.height]);
  useEffect(() => () => map?.dispose(), [map]);

  useFrame((state, dt) => {
    uniforms.uTime.value = state.clock.elapsedTime;
    uniforms.uR.value = height * OVERSIZE * 0.085;
    uniforms.uSize.value.set(width * OVERSIZE, height * OVERSIZE);
    uniforms.uMap.value = map;
    // While nobody touches it the silk breathes a little, as an invitation to lift it.
    easing.damp(breath.current, "amp", veil.idle ? 1 : 0, 0.4, dt);
    const idle = breath.current.amp * 0.009 * (1 - Math.cos(state.clock.elapsedTime * 1.4));
    uniforms.uP.value = veil.p + idle;
    if (map && !ready.current) {
      ready.current = true;
      // one frame on screen first, then the HTML stand-in steps aside
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }
  });

  return (
    <mesh geometry={geometry} visible={!!map}>
      <shaderMaterial vertexShader={vertexShader} fragmentShader={fragmentShader} uniforms={uniforms} side={THREE.DoubleSide} />
    </mesh>
  );
};

/** The WebGL silk of the home veil (see Veil). Unmounted once the veil is up. */
const VeilCanvas: React.FC<{ brand: React.RefObject<HTMLElement>; onReady: () => void }> = ({ brand, onReady }) => (
  <div className="mp-veil__gl" aria-hidden="true">
    <Canvas
      flat
      dpr={[1, window.innerWidth < 760 ? 1.5 : 2]}
      camera={{ fov: 30, position: [0, 0, 10], near: 0.1, far: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <Silk brand={brand} onReady={onReady} />
    </Canvas>
  </div>
);

export default VeilCanvas;
