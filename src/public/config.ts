/**
 * Presentational switches for the public site.
 *
 * showSidoButik
 *   false → the public site has no entry point to Sido Butik.
 *   true  → a "Sido Butik" link is shown in the compact footer of every screen.
 *
 * The routes /sidoButik, /sidoButik/mallar and /sidoButik/mallar/:templateId, their components,
 * data, images and cart context are NOT affected by this flag: direct URLs keep working.
 */
export const publicSiteConfig = {
  showSidoButik: false,
} as const;
