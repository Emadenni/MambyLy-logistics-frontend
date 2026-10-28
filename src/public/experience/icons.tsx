import React from "react";

/** Original line icons of the design package (MambyLy_Claude_Pack/design), drawn as inline SVG. */
type IconProps = { className?: string };

/**
 * Two interlocking chain links. Each link is a capsule on the diagonal; at one crossing the first
 * link lies on top, at the other the second one does (the gaps are cut with masks).
 */
export const LinkMark: React.FC<IconProps> = ({ className }) => {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true" focusable="false">
      <defs>
        <mask id={`${id}a`} maskUnits="userSpaceOnUse" x="-30" y="-30" width="60" height="60">
          <rect x="-30" y="-30" width="60" height="60" fill="#fff" />
          <circle cx="-6.3" cy="4" r="3.1" fill="#000" />
        </mask>
        <mask id={`${id}b`} maskUnits="userSpaceOnUse" x="-30" y="-30" width="60" height="60">
          <rect x="-30" y="-30" width="60" height="60" fill="#fff" />
          <circle cx="6.3" cy="-4" r="3.1" fill="#000" />
        </mask>
      </defs>
      <g transform="translate(24 24) rotate(-45)">
        <rect x="-19.5" y="-9" width="26" height="13" rx="6.5" mask={`url(#${id}a)`} />
        <rect x="-6.5" y="-4" width="26" height="13" rx="6.5" mask={`url(#${id}b)`} />
      </g>
    </svg>
  );
};

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

