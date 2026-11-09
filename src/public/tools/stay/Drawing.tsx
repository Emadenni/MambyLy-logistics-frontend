import React from "react";

/**
 * The house at the top of the guest page, drawn in a few lines: windows light up one after the
 * other when the page opens (CSS, .sg-win). A falu-red cottage by the lake, or a stone town house
 * in the city. Decorative only.
 */
const Win: React.FC<{ x: number; y: number; w?: number; h?: number; i: number }> = ({ x, y, w = 16, h = 18, i }) => (
  <g className="sg-win" style={{ "--i": i } as React.CSSProperties}>
    <rect x={x} y={y} width={w} height={h} rx={1.5} />
    <path d={`M${x + w / 2} ${y}v${h}M${x} ${y + h / 2}h${w}`} className="sg-win__bars" />
  </g>
);

export const Cottage: React.FC = () => (
  <svg className="sg-drawing" viewBox="0 0 360 190" aria-hidden="true" focusable="false">
    {/* far shore and pines */}
    <path className="sg-d-shore" d="M0 128 C 60 118, 120 124, 170 120 S 290 116, 360 124 V 140 H 0 Z" />
    {[18, 34, 300, 318, 336].map((x, i) => (
      <path key={x} className="sg-d-pine" d={`M${x} ${126 - (i % 2) * 8} l9 -${30 + (i % 3) * 6} l9 ${30 + (i % 3) * 6} Z`} />
    ))}
    {/* the cottage */}
    <g className="sg-d-house">
      <path className="sg-d-roof" d="M110 74 L180 34 L250 74 Z" />
      <rect className="sg-d-chimney" x="212" y="40" width="12" height="22" />
      <rect className="sg-d-wall" x="118" y="72" width="124" height="58" />
      <rect className="sg-d-trim" x="118" y="72" width="5" height="58" />
      <rect className="sg-d-trim" x="237" y="72" width="5" height="58" />
      <path className="sg-d-trim-line" d="M114 74 L180 37 L246 74" />
      <rect className="sg-d-door" x="172" y="100" width="17" height="30" rx="1" />
      <Win x={134} y={86} i={0} />
      <Win x={150} y={86} i={1} />
      <Win x={208} y={86} i={2} />
      <Win x={172} y={52} w={16} h={14} i={3} />
    </g>
    {/* jetty and the lake */}
    <path className="sg-d-jetty" d="M236 134 h70 v4 h-70 Z M248 138 v10 M270 138 v10 M292 138 v10" />
    <rect className="sg-d-lake" x="0" y="138" width="360" height="52" />
    <g className="sg-d-ripples">
      <path d="M40 152 h46 M120 160 h70 M230 152 h40 M280 168 h56 M60 176 h52" />
    </g>
    {/* the lit windows on the water */}
    <g className="sg-d-reflect">
      <rect x="134" y="142" width="16" height="10" />
      <rect x="150" y="142" width="16" height="10" />
      <rect x="208" y="142" width="16" height="10" />
    </g>
    <circle className="sg-d-moon" cx="300" cy="34" r="10" />
  </svg>
);

export const TownHouse: React.FC = () => (
  <svg className="sg-drawing" viewBox="0 0 360 190" aria-hidden="true" focusable="false">
    {/* neighbours in the dark */}
    <path className="sg-d-block" d="M0 70 h52 v-14 h40 v134 H0 Z" />
    <path className="sg-d-block" d="M268 60 h44 v-18 h48 v148 H268 Z" />
    {/* the town house */}
    <g className="sg-d-house">
      <path className="sg-d-roof" d="M98 44 L130 22 H238 L270 44 Z" />
      <rect className="sg-d-wall" x="98" y="44" width="172" height="146" />
      <rect className="sg-d-trim" x="98" y="44" width="172" height="5" />
      <rect className="sg-d-trim" x="98" y="88" width="172" height="3" />
      <rect className="sg-d-trim" x="98" y="130" width="172" height="3" />
      {[0, 1, 2, 3].map((c) => (
        <React.Fragment key={c}>
          <Win x={112 + c * 40} y={58} w={20} h={24} i={c === 2 ? 0 : c + 4} />
          <Win x={112 + c * 40} y={99} w={20} h={24} i={c === 1 ? 1 : c + 8} />
        </React.Fragment>
      ))}
      <rect className="sg-d-door" x="172" y="146" width="24" height="44" rx="10" />
      <Win x={112} y={142} w={20} h={24} i={2} />
      <Win x={232} y={142} w={20} h={24} i={3} />
    </g>
    {/* street, a lamp and the tram line */}
    <path className="sg-d-wire" d="M0 30 C 120 38, 240 38, 360 30" />
    <path className="sg-d-lamp" d="M80 190 V 128 q0 -8 10 -8" />
    <circle className="sg-d-lamplight" cx="92" cy="122" r="4" />
    <circle className="sg-d-moon" cx="50" cy="26" r="9" />
  </svg>
);
