import type { CardConfig } from "./types";

/** RFC 2426 (vCard 3.0) text escaping. */
const esc = (value: string) =>
  value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");

const encoder = new TextEncoder();

/** Folds a content line at 75 octets (UTF-8), never splitting a multi-byte character. */
function fold(line: string): string {
  const out: string[] = [];
  let current = "";
  let bytes = 0;
  for (const ch of line) {
    const size = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // continuation lines start with a space
    if (bytes + size > limit) {
      out.push(current);
      current = "";
      bytes = 0;
    }
    current += ch;
    bytes += size;
  }
  out.push(current);
  return out.join("\r\n ");
}

/** Splits "Alva Exempel" into N: family;given (best effort, the full name is in FN). */
function nameParts(name: string) {
  const parts = name.trim().split(/\s+/);
  const family = parts.length > 1 ? parts.pop()! : "";
  return `${esc(family)};${esc(parts.join(" "))};;;`;
}

export function buildVCard(card: CardConfig, cardUrl: string): string {
  const org = card.kind === "organization";
  const lines: string[] = ["BEGIN:VCARD", "VERSION:3.0", `N:${org ? ";;;;" : nameParts(card.name)}`, `FN:${esc(card.name)}`];
  if (card.company || org) lines.push(`ORG:${esc(card.company || card.name)}`);
  if (org) lines.push("X-ABShowAs:COMPANY");
  // A company has no job title: its description goes in NOTE instead.
  if (card.role && !org) lines.push(`TITLE:${esc(card.role)}`);
  // Demo cards never carry a phone number (phoneDisplay is only a placeholder).
  if (card.phone && !card.demo) lines.push(`TEL;TYPE=${org ? "WORK" : "CELL"},VOICE:${card.phone.e164}`);
  if (card.email) lines.push(`EMAIL;TYPE=INTERNET${org ? ",WORK" : ""}:${card.email}`);
  if (card.website) lines.push(`URL:${card.website.href}`);
  card.socials.forEach((s, i) => {
    lines.push(`item${i + 1}.URL:${s.href}`, `item${i + 1}.X-ABLabel:${esc(s.label)}`);
  });
  lines.push(`item${card.socials.length + 1}.URL:${cardUrl}`, `item${card.socials.length + 1}.X-ABLabel:${card.lang === "en" ? "Digital card" : "Digitalt visitkort"}`);
  if (org && card.role) lines.push(`NOTE:${esc(card.role)}`);
  if (card.demo) lines.push(`NOTE:${esc("Demo – fiktiva uppgifter. Skapat av MambyLy Solutions.")}`);
  lines.push("END:VCARD");
  return lines.map(fold).join("\r\n") + "\r\n";
}

export const vcardFileName = (card: CardConfig) => `${card.slug}.vcf`;

/**
 * Static copy written at build time next to the card page (build/static-route-meta.ts), served as
 * text/vcard: opening it lets the phone show its own "add contact" screen. Real cards only.
 */
export const staticVCardPath = (card: CardConfig) => `/card/${vcardFileName(card)}`;

/** Triggers a local download of the vCard (no server involved). */
export function downloadVCard(card: CardConfig, cardUrl: string) {
  const blob = new Blob([buildVCard(card, cardUrl)], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = vcardFileName(card);
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
