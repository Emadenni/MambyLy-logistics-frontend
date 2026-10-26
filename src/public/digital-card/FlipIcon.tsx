import React from "react";

/**
 * "Turn the card" icon: a card split by its turning axis, one half showing. Deliberately not a
 * circular arrow, which reads as "reload".
 */
const FlipIcon: React.FC = () => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
    <path d="M12 5H5.5A1.5 1.5 0 0 0 4 6.5v11A1.5 1.5 0 0 0 5.5 19H12z" fill="currentColor" fillOpacity=".9" />
    <path d="M14.5 5h4A1.5 1.5 0 0 1 20 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-4" />
    <path d="M12 2.5v19" strokeDasharray="2 2.2" />
  </svg>
);

export default FlipIcon;
