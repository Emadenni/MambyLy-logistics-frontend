/**
 * Presentational switches for the public site (restyle "Mindre krångel. Mer företag.").
 *
 * showSidoButik
 *   false → every public entry point to Sido Butik is hidden:
 *           - "Sido Butik" item in the public header (desktop nav + mobile menu)
 *           - Sido Butik promo block on the home page (banner + "Vad passar dig bäst?" choice
 *             with the link to the templates, /sidoButik/mallar)
 *   true  → all of the above are rendered again.
 *
 * The routes /sidoButik, /sidoButik/mallar and /sidoButik/mallar/:templateId, their components,
 * data, images and cart context are NOT affected by this flag: direct URLs keep working.
 */
export const publicSiteConfig = {
  showSidoButik: false,
} as const;
