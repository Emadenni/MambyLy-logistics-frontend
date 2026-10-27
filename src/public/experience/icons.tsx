import React from "react";

/** Original line icons of the design package (MambyLy_Claude_Pack/design), drawn as inline SVG. */
type IconProps = { className?: string };

export const LinkMark: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="m20 28-3 3a7 7 0 0 1-10-10l9-9a7 7 0 0 1 10 0" />
    <path d="m28 20 3-3a7 7 0 0 1 10 10l-9 9a7 7 0 0 1-10 0" />
    <path d="m17 31 14-14" />
  </svg>
);

/** Graphic symbol of the gesture only: nothing biometric is read. */
export const Fingerprint: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true" focusable="false">
    <path d="M9 20C9 1 39 1 39 20M5 25C3 5 16 1 24 1M43 25C45 9 35 2 31 2M13 27v-7c0-15 22-15 22 0v9c0 7 3 10 5 12M18 42c5-7 4-17 4-22 0-3 4-3 4 0v10c0 8 3 12 5 15M9 30c0 5-2 9-3 11M14 32c0 6-1 9-3 13M18 29v-9c0-8 12-8 12 0v9c0 8 4 13 7 16" />
  </svg>
);

export const ChevronUp: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="m5 15 7-7 7 7" />
  </svg>
);

/** Wireframe sketch behind the NORDEN preview on the method screen. */
export const Wireframe: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 360 460" fill="none" stroke="currentColor" strokeOpacity=".28" aria-hidden="true" focusable="false">
    <rect x="1" y="1" width="358" height="458" rx="12" fill="#f6f4ee" />
    <path d="M1 35h358" />
    <circle cx="16" cy="18" r="3" />
    <circle cx="28" cy="18" r="3" />
    <circle cx="40" cy="18" r="3" />
    <rect x="25" y="65" width="120" height="14" />
    <rect x="25" y="100" width="175" height="55" />
    <rect x="25" y="175" width="115" height="30" rx="15" />
    <rect x="25" y="235" width="310" height="120" />
    <path d="m25 235 310 120m0-120L25 355" />
    <path d="M25 385h285M25 400h220M25 415h245" />
  </svg>
);
