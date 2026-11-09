/**
 * Optional own domains of MambyLy Stay houses: a host can point a domain of theirs (a CNAME to the
 * site) at their guest page. On such a domain the start address opens the house:
 *   https://info.sjostugan.se/?k=<key>  →  /stay/<slug>?k=<key>
 * The key still comes from the link on the sign; only the house's address is listed here.
 * Empty until a host asks for it (the DNS and the domain in the hosting are set up outside the code).
 */
export const STAY_DOMAINS: Record<string, string> = {
  // "info.sjostugan.se": "sjostugan",
};

/** Before the app starts: on a house's own domain, the start address becomes its guest page. */
export function openStayDomain() {
  if (typeof window === "undefined") return;
  const slug = STAY_DOMAINS[window.location.hostname.toLowerCase()];
  if (slug && window.location.pathname === "/") window.history.replaceState(null, "", `/stay/${slug}${window.location.search}`);
}
