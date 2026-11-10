import React from "react";
import type { ArtName } from "./types";

/**
 * The drawn scenes of the demo's points (no photographs are taken from anywhere): flat shapes in the
 * palette of the line. A real place shows its own photos (point.photo.src) instead.
 */
const SKY = "#dfe8e1";
const FIELD = "#b9ccb9";
const GROUND = "#9db59e";
const INK = "#1d3a35";
const RED = "#a8452f";
const WOOD = "#8a6a45";
const STONE = "#b4b2a8";
const LIGHT = "#f4d58a";

const Scene: Record<ArtName, React.ReactNode> = {
  house: (
    <>
      <rect x="70" y="86" width="180" height="76" fill={RED} />
      <path d="M58 90 160 42l102 48z" fill={INK} />
      <rect x="148" y="118" width="26" height="44" fill="#7d2f1f" />
      <rect x="92" y="104" width="30" height="26" fill={LIGHT} />
      <rect x="198" y="104" width="30" height="26" fill={LIGHT} />
      <path d="M107 104v26M92 117h30M213 104v26M198 117h30" stroke={INK} strokeWidth="2" />
      <rect x="214" y="56" width="14" height="30" fill={STONE} />
    </>
  ),
  forge: (
    <>
      <rect x="76" y="92" width="168" height="70" fill={WOOD} />
      <path d="M64 96 160 54l96 42z" fill={INK} />
      <rect x="196" y="40" width="16" height="48" fill={STONE} />
      <path d="M204 34q-8-12 2-22 2 10 10 12-6 4-12 10z" fill="#9aa8a2" opacity=".7" />
      <rect x="112" y="116" width="52" height="46" fill={INK} />
      <path d="M124 162v-24q12-16 28 0v24z" fill="#e0793a" />
      <rect x="184" y="138" width="40" height="10" fill="#4a5a58" />
      <rect x="198" y="148" width="12" height="14" fill="#4a5a58" />
    </>
  ),
  barn: (
    <>
      <rect x="60" y="88" width="200" height="74" fill={RED} />
      <path d="M48 92 160 40l112 52z" fill={INK} />
      <rect x="128" y="112" width="64" height="50" fill="#7d2f1f" />
      <path d="M128 112 192 162M192 112 128 162" stroke="#f1e3d2" strokeWidth="3" />
      <rect x="146" y="64" width="28" height="18" fill="#7d2f1f" />
      <path d="M76 100h14M76 112h14M230 100h14M230 112h14" stroke="#f1e3d2" strokeWidth="3" />
    </>
  ),
  well: (
    <>
      <ellipse cx="160" cy="162" rx="56" ry="9" fill={GROUND} />
      <rect x="116" y="118" width="88" height="44" fill={STONE} />
      <path d="M116 118h88" stroke={INK} strokeWidth="3" />
      <path d="M128 118v44M148 118v44M170 118v44M190 118v44" stroke="#9b998f" strokeWidth="2" />
      <rect x="116" y="58" width="6" height="62" fill={WOOD} />
      <rect x="198" y="58" width="6" height="62" fill={WOOD} />
      <path d="M104 62 160 34l56 28z" fill={INK} />
      <path d="M160 62v38" stroke={INK} strokeWidth="2" />
      <rect x="152" y="98" width="16" height="14" fill={WOOD} />
    </>
  ),
  mill: (
    <>
      <path d="M118 162 132 78h56l14 84z" fill="#efe6d4" />
      <path d="M126 78 160 52l34 26z" fill={INK} />
      <rect x="148" y="132" width="24" height="30" fill={WOOD} />
      <g stroke={WOOD} strokeWidth="4" strokeLinecap="round">
        <path d="M160 66 100 14M160 66 220 118M160 66 108 118M160 66 212 14" />
      </g>
      <g stroke="#efe6d4" strokeWidth="10" strokeLinecap="butt" opacity=".9">
        <path d="M120 32 104 18M200 98 216 114M122 98 106 114M198 32 214 18" />
      </g>
      <circle cx="160" cy="66" r="5" fill={INK} />
    </>
  ),
  school: (
    <>
      <rect x="76" y="90" width="168" height="72" fill="#d9c26e" />
      <path d="M66 94 160 50l94 44z" fill={INK} />
      <rect x="148" y="116" width="24" height="46" fill={WOOD} />
      <rect x="92" y="108" width="34" height="28" fill={LIGHT} />
      <rect x="194" y="108" width="34" height="28" fill={LIGHT} />
      <path d="M109 108v28M92 122h34M211 108v28M194 122h34" stroke={INK} strokeWidth="2" />
      <rect x="152" y="62" width="16" height="22" fill="#efe6d4" />
      <circle cx="160" cy="73" r="4" fill={INK} />
    </>
  ),
  path: (
    <>
      <path d="M0 162q60-30 120-24t90-52 110-34V200H0z" fill={GROUND} />
      <path d="M142 200q10-36 38-50t38-62" stroke="#e8dcc4" strokeWidth="18" strokeLinecap="round" fill="none" />
      <g fill="#4d7a63">
        <path d="M40 120l16-52 16 52z" />
        <path d="M70 126l14-44 14 44z" />
        <path d="M258 90l12-38 12 38z" />
        <path d="M280 94l10-32 10 32z" />
      </g>
      <rect x="234" y="64" width="6" height="16" fill={WOOD} />
      <path d="M222 66h30l-15-24z" fill={RED} />
    </>
  ),
};

const PointArt: React.FC<{ art: ArtName; label: string }> = ({ art, label }) => (
  <svg className="gd-art" viewBox="0 0 320 200" role="img" aria-label={label}>
    <rect width="320" height="200" fill={SKY} />
    <circle cx="262" cy="42" r="15" fill="#f7efd6" />
    <path d="M0 150q80-24 160-8t160-14v72H0z" fill={FIELD} />
    <rect y="160" width="320" height="40" fill={GROUND} />
    {Scene[art]}
  </svg>
);

export default PointArt;
